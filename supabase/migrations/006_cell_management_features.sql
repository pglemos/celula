-- RF-02: Gestão de Células/PGs - Novas Funcionalidades

-- 1. Categorias configuráveis por Igreja (Tenant)
ALTER TABLE tenants ADD COLUMN cell_categories TEXT[] DEFAULT '{"Adultos", "Jovens", "Casais", "Kids"}';

-- 2. Tabela de Lições de Célula (Suporte a IA)
CREATE TABLE cell_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  verse_text TEXT,
  ice_breaker TEXT,
  questions JSONB DEFAULT '[]',
  prayer_requests TEXT,
  suggested_at DATE DEFAULT CURRENT_DATE,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Checklist de Competências para Líderes em Treinamento (Trainees)
CREATE TABLE trainee_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  competency_key VARCHAR(100) NOT NULL, -- Ex: 'leads_icebreaker', 'preaches_word', 'visited_members'
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(person_id, competency_key)
);

-- 4. Melhorias em Cells para Planejamento de Multiplicação e Geolocalização
ALTER TABLE cells ADD COLUMN geofence_radius_meters INT DEFAULT 100; -- Raio para check-in
ALTER TABLE cells ADD COLUMN multiplication_plan JSONB DEFAULT '{}'; -- Distribuição de pessoas
ALTER TABLE cells ADD COLUMN last_multiplication_at DATE;

-- 5. Check-in por Geolocalização na Presença
ALTER TABLE meeting_attendance ADD COLUMN checkin_at TIMESTAMPTZ;
ALTER TABLE meeting_attendance ADD COLUMN checkin_lat DECIMAL(10, 8);
ALTER TABLE meeting_attendance ADD COLUMN checkin_lng DECIMAL(11, 8);
ALTER TABLE meeting_attendance ADD COLUMN checkin_distance_meters INT;

-- 6. Follow-up de Visitantes Automático
CREATE TABLE visitor_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  meeting_id UUID NOT NULL REFERENCES cell_meetings(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'integrated', 'lost')),
  contact_count INT DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  next_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE cell_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainee_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_lessons ON cell_lessons FOR ALL USING (true);
CREATE POLICY tenant_competencies ON trainee_competencies FOR ALL USING (true);
CREATE POLICY tenant_followups ON visitor_followups FOR ALL USING (true);

-- Índices para performance
CREATE INDEX idx_cell_lessons_tenant ON cell_lessons(tenant_id);
CREATE INDEX idx_trainee_comp_person ON trainee_competencies(person_id);
CREATE INDEX idx_visitor_followup_person ON visitor_followups(person_id);
