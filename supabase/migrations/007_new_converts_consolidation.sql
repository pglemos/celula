-- 007_new_converts_consolidation.sql
-- Expansão do sistema de Novos Convertidos e Consolidação (RF-04)

-- 1. Adicionar colunas extras na tabela new_converts para IA Matching e Monitoramento
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100);
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS assigned_cell_id UUID REFERENCES cells(id);
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS evasion_risk_score FLOAT DEFAULT 0.0;
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS integration_date DATE;
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS context TEXT; -- RF-04.01: Contexto da decisão

-- 2. Tabela de Log de Eventos de Consolidação (Workflow RF-04.03)
CREATE TABLE IF NOT EXISTS consolidation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  new_convert_id UUID NOT NULL REFERENCES new_converts(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'decision', 'contact_attempt', 'contact_success', 'cell_visit', 'integrated', 'lost'
  description TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES people(id),
  metadata JSONB DEFAULT '{}'
);

-- 3. Função para Alertas de 48h (RF-04.04)
-- Esta função identifica novos convertidos que não tiveram contato em 48h
CREATE OR REPLACE FUNCTION check_consolidation_overdue()
RETURNS TABLE (new_convert_id UUID, consolidator_id UUID, tenant_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT nc.id, nc.consolidator_id, nc.tenant_id
  FROM new_converts nc
  WHERE nc.status = 'new'
    AND nc.decision_date <= (CURRENT_DATE - INTERVAL '2 days')
    AND nc.consolidator_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. View de Funil de Consolidação (RF-04.06)
CREATE OR REPLACE VIEW v_consolidation_funnel AS
SELECT 
  tenant_id,
  COUNT(*) FILTER (WHERE status = 'new') as total_decisions,
  COUNT(*) FILTER (WHERE status = 'contacted') as total_contacted,
  COUNT(*) FILTER (WHERE status = 'in_cell') as total_in_cell,
  COUNT(*) FILTER (WHERE status = 'baptized' OR status = 'integrated') as total_integrated
FROM new_converts
GROUP BY tenant_id;

-- 5. Função de Cálculo de IA Matching (Heurística RF-04.02)
-- Retorna células sugeridas com base em bairro e perfil
CREATE OR REPLACE FUNCTION match_ideal_cells(p_convert_id UUID)
RETURNS TABLE (cell_id UUID, match_score FLOAT, reason TEXT) AS $$
DECLARE
    v_neighborhood TEXT;
    v_age INT;
    v_gender TEXT;
    v_tenant_id UUID;
BEGIN
    SELECT neighborhood, EXTRACT(YEAR FROM age(birth_date)), gender, tenant_id 
    INTO v_neighborhood, v_age, v_gender, v_tenant_id
    FROM new_converts WHERE id = p_convert_id;

    RETURN QUERY
    SELECT 
        c.id as cell_id,
        (
            CASE WHEN c.neighborhood = v_neighborhood THEN 0.5 ELSE 0 END +
            CASE WHEN (v_age BETWEEN 13 AND 18 AND 'Jovens' = ANY(tenants.cell_categories)) THEN 0.3 ELSE 0 END +
            -- Lógica simplificada de perfil, pode ser expandida
            0.2 -- Base score
        )::FLOAT as match_score,
        'Baseado em localização e perfil'::TEXT as reason
    FROM cells c
    JOIN tenants ON c.tenant_id = tenants.id
    WHERE c.tenant_id = v_tenant_id
    ORDER BY match_score DESC
    LIMIT 3;
END;
$$ LANGUAGE plpgsql;

-- RLS e Permissões
ALTER TABLE consolidation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_consolidation_events ON consolidation_events FOR ALL USING (true);

-- Índices
CREATE INDEX idx_nc_status ON new_converts(status);
CREATE INDEX idx_nc_tenant ON new_converts(tenant_id);
CREATE INDEX idx_ce_nc_id ON consolidation_events(new_convert_id);
