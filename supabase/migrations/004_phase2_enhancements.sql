-- ============================================
-- Migration 004: Phase 2 Enhancements
-- Events QR, Courses Modules, Certificates, Consolidation Workflow
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONSOLIDATION WORKFLOW ENHANCEMENTS
-- ============================================
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS suggested_cell_id UUID REFERENCES cells(id);
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS contact_method VARCHAR(20);
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS decision_type VARCHAR(30) DEFAULT 'first_decision'
    CHECK (decision_type IN ('first_decision', 're_dedication', 'reconciliation', 'baptism_request'));
ALTER TABLE new_converts ADD COLUMN IF NOT EXISTS age_group VARCHAR(20)
    CHECK (age_group IN ('child', 'teen', 'young_adult', 'adult', 'senior'));

-- ============================================
-- EVENT ENHANCEMENTS
-- ============================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS slug VARCHAR(200);
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS landing_page_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_capacity INT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '[]';
ALTER TABLE events ADD COLUMN IF NOT EXISTS checkin_enabled BOOLEAN DEFAULT TRUE;

CREATE TABLE event_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    checkin_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checkin_method VARCHAR(10) NOT NULL DEFAULT 'qr' CHECK (checkin_method IN ('qr', 'manual', 'self')),
    UNIQUE(registration_id)
);

CREATE INDEX idx_checkins_event ON event_checkins(event_id);

-- Event Tickets/Payments (for paid events)
CREATE TABLE event_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) DEFAULT 'pix',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'confirmed', 'refunded', 'cancelled')),
    payment_date TIMESTAMPTZ,
    reference VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- COURSE MODULES & MATERIALS
-- ============================================
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pdf', 'video', 'audio', 'link', 'text')),
    url TEXT,
    content TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE course_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    passing_score INT NOT NULL DEFAULT 70,
    time_limit_minutes INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES course_quizzes(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '{}',
    score INT NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DIGITAL CERTIFICATES
-- ============================================
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_code VARCHAR(20) NOT NULL UNIQUE,
    template JSONB DEFAULT '{}',
    UNIQUE(course_id, person_id)
);

-- Add prerequisites to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS prerequisite_course_id UUID REFERENCES courses(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_template JSONB DEFAULT '{}';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_open BOOLEAN DEFAULT TRUE;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS max_students INT;

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE event_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_event_checkins" ON event_checkins FOR ALL USING (true);
CREATE POLICY "all_event_payments" ON event_payments FOR ALL USING (true);
CREATE POLICY "all_course_modules" ON course_modules FOR ALL USING (true);
CREATE POLICY "all_course_materials" ON course_materials FOR ALL USING (true);
CREATE POLICY "all_course_quizzes" ON course_quizzes FOR ALL USING (true);
CREATE POLICY "all_quiz_attempts" ON quiz_attempts FOR ALL USING (true);
CREATE POLICY "all_certificates" ON certificates FOR ALL USING (true);
