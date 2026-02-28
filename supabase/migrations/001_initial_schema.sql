-- Central 3.0 — Initial Database Schema
-- PostgreSQL 16 with Row Level Security

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- TENANTS (Igrejas)
-- ============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  custom_domain VARCHAR(255),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#7d30cf',
  secondary_color VARCHAR(7) DEFAULT '#3b82f6',
  cell_term VARCHAR(50) NOT NULL DEFAULT 'Célula',
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_cells INT NOT NULL DEFAULT 10,
  lgpd_dpo_email VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FAMILIES
-- ============================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PEOPLE (Pessoas)
-- ============================================
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  auth_user_id UUID, -- Clerk user ID
  full_name VARCHAR(200) NOT NULL,
  preferred_name VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'other')),
  marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  photo_url TEXT,
  cpf VARCHAR(14), -- encrypted
  rg VARCHAR(20),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_complement VARCHAR(100),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_zip VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  membership_status VARCHAR(30) NOT NULL DEFAULT 'visitor'
    CHECK (membership_status IN ('member', 'baptized_non_member', 'non_baptized', 'visitor')),
  membership_date DATE,
  baptism_date DATE,
  conversion_date DATE,
  family_id UUID REFERENCES families(id) ON DELETE SET NULL,
  lgpd_consent BOOLEAN NOT NULL DEFAULT FALSE,
  lgpd_consent_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_people_tenant ON people(tenant_id);
CREATE INDEX idx_people_name ON people(tenant_id, full_name);
CREATE INDEX idx_people_membership ON people(tenant_id, membership_status);
CREATE INDEX idx_people_email ON people(tenant_id, email);

-- ============================================
-- SUPERVISIONS (Supervisões/Redes)
-- ============================================
CREATE TABLE supervisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  level INT NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES supervisions(id) ON DELETE SET NULL,
  supervisor_id UUID NOT NULL REFERENCES people(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CELLS (Células/PGs)
-- ============================================
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  leader_id UUID NOT NULL REFERENCES people(id),
  co_leader_id UUID REFERENCES people(id),
  host_id UUID REFERENCES people(id),
  trainee_id UUID REFERENCES people(id),
  supervision_id UUID REFERENCES supervisions(id) ON DELETE SET NULL,
  meeting_day VARCHAR(10) CHECK (meeting_day IN ('mon','tue','wed','thu','fri','sat','sun')),
  meeting_time TIME,
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_neighborhood VARCHAR(100),
  address_city VARCHAR(100),
  address_state VARCHAR(2),
  address_zip VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  max_participants INT DEFAULT 15,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'multiplied')),
  multiplied_from_id UUID REFERENCES cells(id) ON DELETE SET NULL,
  multiplication_target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cells_tenant ON cells(tenant_id);
CREATE INDEX idx_cells_supervision ON cells(tenant_id, supervision_id);
CREATE INDEX idx_cells_leader ON cells(leader_id);

-- ============================================
-- CELL MEMBERS
-- ============================================
CREATE TABLE cell_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'trainee', 'future_host')),
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  left_at DATE,
  UNIQUE (cell_id, person_id)
);

-- ============================================
-- CELL MEETINGS (Reuniões)
-- ============================================
CREATE TABLE cell_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cell_id UUID NOT NULL REFERENCES cells(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  gods_presence INT CHECK (gods_presence BETWEEN 1 AND 5),
  had_supervision_visit BOOLEAN DEFAULT FALSE,
  decisions_for_christ INT DEFAULT 0,
  offering_amount DECIMAL(10, 2),
  theme VARCHAR(255),
  observations TEXT,
  submitted_by UUID NOT NULL REFERENCES people(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meetings_cell ON cell_meetings(cell_id, meeting_date DESC);

-- ============================================
-- MEETING ATTENDANCE
-- ============================================
CREATE TABLE meeting_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES cell_meetings(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT TRUE,
  is_visitor BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (meeting_id, person_id)
);

-- ============================================
-- NEW CONVERTS
-- ============================================
CREATE TABLE new_converts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  conversion_date DATE NOT NULL DEFAULT CURRENT_DATE,
  conversion_context VARCHAR(100),
  assigned_cell_id UUID REFERENCES cells(id) ON DELETE SET NULL,
  consolidator_id UUID REFERENCES people(id),
  status VARCHAR(20) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'connected', 'integrated', 'lost')),
  first_contact_at TIMESTAMPTZ,
  follow_ups JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE cells ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_converts ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_members ENABLE ROW LEVEL SECURITY;

-- Policies: tenant isolation (simplified - in production, use auth.jwt() -> tenant_id)
CREATE POLICY tenant_people ON people FOR ALL USING (true);
CREATE POLICY tenant_cells ON cells FOR ALL USING (true);
CREATE POLICY tenant_meetings ON cell_meetings FOR ALL USING (true);
CREATE POLICY tenant_attendance ON meeting_attendance FOR ALL USING (true);
CREATE POLICY tenant_supervisions ON supervisions FOR ALL USING (true);
CREATE POLICY tenant_converts ON new_converts FOR ALL USING (true);
CREATE POLICY tenant_families ON families FOR ALL USING (true);
CREATE POLICY tenant_cell_members ON cell_members FOR ALL USING (true);
