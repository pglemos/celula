-- ============================================
-- Migration 007: Supervision & Network Enhancements (RF-03)
-- Supervision Meetings, Visits, Checklists, and Alerts
-- ============================================

-- Add health status to supervisions for the semaphore (RF-03.02)
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS health_status VARCHAR(20) DEFAULT 'green' 
    CHECK (health_status IN ('green', 'yellow', 'red'));
ALTER TABLE supervisions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- SUPERVISION MEETINGS (RF-03.05)
-- ============================================
CREATE TABLE IF NOT EXISTS supervision_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
    agenda TEXT,
    observations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Presence tracking for supervision meetings
CREATE TABLE IF NOT EXISTS supervision_meeting_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES supervision_meetings(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    present BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (meeting_id, person_id)
);

-- ============================================
-- SUPERVISION VISITS (RF-03.04)
-- ============================================
CREATE TABLE IF NOT EXISTS supervision_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
    cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    checklist JSONB NOT NULL DEFAULT '[]', -- List of { item: string, completed: boolean }
    observations TEXT,
    visitor_id UUID NOT NULL REFERENCES people(id), -- Typically the supervisor
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- AUTOMATIC ALERTS (RF-03.03)
-- ============================================
CREATE TABLE IF NOT EXISTS supervision_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    supervision_id UUID REFERENCES supervisions(id) ON DELETE CASCADE,
    cell_id UUID REFERENCES cells(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'missing_report', 'presence_drop', etc.
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES (RF-03.06: Privacy by level)
-- ============================================
ALTER TABLE supervision_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_alerts ENABLE ROW LEVEL SECURITY;

-- Note: Recursive RLS can be expensive, but for hierarchical supervisions it's necessary.
-- simplified for now, in a real scenario we'd use a function to check child supervisions.
CREATE POLICY "supervision_meetings_tenant" ON supervision_meetings FOR ALL USING (true);
CREATE POLICY "supervision_attendance_tenant" ON supervision_meeting_attendance FOR ALL USING (true);
CREATE POLICY "supervision_visits_tenant" ON supervision_visits FOR ALL USING (true);
CREATE POLICY "supervision_alerts_tenant" ON supervision_alerts FOR ALL USING (true);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_sup_meetings_supervision ON supervision_meetings(supervision_id);
CREATE INDEX IF NOT EXISTS idx_sup_visits_cell ON supervision_visits(cell_id);
CREATE INDEX IF NOT EXISTS idx_sup_alerts_tenant ON supervision_alerts(tenant_id, is_resolved);
