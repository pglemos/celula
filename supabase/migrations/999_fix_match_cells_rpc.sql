-- Fix match_ideal_cells to return name and neighborhood
CREATE OR REPLACE FUNCTION match_ideal_cells(p_convert_id UUID)
RETURNS TABLE (cell_id UUID, cell_name TEXT, neighborhood TEXT, match_score FLOAT, reason TEXT) AS $$
DECLARE
    v_neighborhood TEXT;
    v_age INT;
    v_gender TEXT;
    v_tenant_id UUID;
BEGIN
    SELECT nc.neighborhood, EXTRACT(YEAR FROM age(nc.birth_date)), nc.gender, nc.tenant_id 
    INTO v_neighborhood, v_age, v_gender, v_tenant_id
    FROM new_converts nc WHERE nc.id = p_convert_id;

    RETURN QUERY
    SELECT 
        c.id as cell_id,
        c.name as cell_name,
        c.neighborhood as neighborhood,
        (
            CASE WHEN c.neighborhood = v_neighborhood THEN 0.5 ELSE 0 END +
            CASE WHEN (v_age BETWEEN 13 AND 18 AND 'Jovens' = ANY(t.cell_categories)) THEN 0.3 ELSE 0 END +
            0.2 -- Base score
        )::FLOAT as match_score,
        'Baseado em localização e perfil'::TEXT as reason
    FROM cells c
    JOIN tenants t ON c.tenant_id = t.id
    WHERE c.tenant_id = v_tenant_id
    ORDER BY match_score DESC
    LIMIT 3;
END;
$$ LANGUAGE plpgsql;
