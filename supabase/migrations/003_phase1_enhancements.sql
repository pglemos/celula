-- ============================================
-- Migration 003: Phase 1 Enhancements
-- People Timeline, Transfers, Supervision Visits/Meetings, Cell Lessons
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PEOPLE TIMELINE (Cronologia de envolvimento)
-- ============================================
CREATE TABLE people_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
    'cell_joined', 'cell_left', 'course_enrolled', 'course_completed',
    'event_attended', 'contribution', 'baptism', 'conversion',
    'transfer', 'badge_earned', 'level_up'
  )),
  event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timeline_person ON people_timeline(person_id, event_date DESC);
CREATE INDEX idx_timeline_tenant ON people_timeline(tenant_id);

-- ============================================
-- PEOPLE TRANSFERS (Desligamento/Transferência)
-- ============================================
CREATE TABLE people_transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('transfer_out', 'transfer_in', 'dismissal', 'death')),
  destination_church VARCHAR(255),
  origin_church VARCHAR(255),
  reason TEXT,
  letter_content TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  approved_by UUID REFERENCES people(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transfers_person ON people_transfers(person_id);

-- ============================================
-- SUPERVISION VISITS (Visitas de supervisão)
-- ============================================
CREATE TABLE supervision_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visitor_id UUID NOT NULL REFERENCES people(id),
  -- Checklist items stored as JSONB for flexibility
  checklist JSONB DEFAULT '{
    "ambiente_acolhedor": false,
    "louvor_adequado": false,
    "palavra_edificante": false,
    "participacao_membros": false,
    "visitantes_presentes": false,
    "oferta_recolhida": false,
    "lider_preparado": false,
    "horario_cumprido": false
  }',
  notes TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_supervision_visits ON supervision_visits(supervision_id, visit_date DESC);

-- ============================================
-- SUPERVISION MEETINGS (Reuniões de supervisão)
-- ============================================
CREATE TABLE supervision_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  agenda TEXT,
  minutes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE supervision_meeting_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES supervision_meetings(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(meeting_id, person_id)
);

-- ============================================
-- CELL LESSONS (Lições de Célula)
-- ============================================
CREATE TABLE cell_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  scripture_reference VARCHAR(255),
  discussion_questions JSONB DEFAULT '[]',
  ai_generated BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES people(id),
  week_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX idx_lessons_tenant ON cell_lessons(tenant_id, week_date DESC);

-- ============================================
-- LEADER TRAINING CHECKLIST
-- ============================================
CREATE TABLE leader_training (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  competencies JSONB DEFAULT '{
    "lideranca_louvor": false,
    "lideranca_palavra": false,
    "acolhimento_visitantes": false,
    "preparo_estudo": false,
    "organizacao_reuniao": false,
    "cuidado_pastoral": false,
    "evangelismo": false,
    "multiplicacao": false,
    "relatorio_semanal": false,
    "relacionamento_supervisor": false
  }',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'paused')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(person_id, cell_id)
);

-- ============================================
-- CELL MULTIPLICATION PLANS
-- ============================================
CREATE TABLE multiplication_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  target_date DATE NOT NULL,
  new_cell_name VARCHAR(200),
  new_leader_id UUID REFERENCES people(id),
  new_host_id UUID REFERENCES people(id),
  status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'approved', 'executed', 'cancelled')),
  member_distribution JSONB DEFAULT '{"original": [], "new": []}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- ============================================
-- VISITOR FOLLOW-UP
-- ============================================
CREATE TABLE visitor_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'returning', 'integrated', 'lost')),
  assigned_to UUID REFERENCES people(id),
  contact_attempts INT DEFAULT 0,
  last_contact_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX idx_followups_cell ON visitor_followups(cell_id);
CREATE INDEX idx_followups_status ON visitor_followups(tenant_id, status);

-- ============================================
-- ALERTS SYSTEM
-- ============================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'danger', 'success')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_label VARCHAR(100),
  action_href VARCHAR(255),
  target_user_id UUID REFERENCES people(id),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_tenant ON alerts(tenant_id, read, created_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE people_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE people_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervision_meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiplication_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_people_timeline" ON people_timeline FOR ALL USING (true);
CREATE POLICY "all_people_transfers" ON people_transfers FOR ALL USING (true);
CREATE POLICY "all_supervision_visits" ON supervision_visits FOR ALL USING (true);
CREATE POLICY "all_supervision_meetings" ON supervision_meetings FOR ALL USING (true);
CREATE POLICY "all_supervision_meeting_att" ON supervision_meeting_attendance FOR ALL USING (true);
CREATE POLICY "all_cell_lessons" ON cell_lessons FOR ALL USING (true);
CREATE POLICY "all_leader_training" ON leader_training FOR ALL USING (true);
CREATE POLICY "all_multiplication_plans" ON multiplication_plans FOR ALL USING (true);
CREATE POLICY "all_visitor_followups" ON visitor_followups FOR ALL USING (true);
CREATE POLICY "all_alerts" ON alerts FOR ALL USING (true);
