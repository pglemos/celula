-- ----------------------------------------------------------------------------
-- MIGRATION 002: Events, Courses, and Finances Schema
-- ----------------------------------------------------------------------------

-- ENABLE UUID OSSP if not enabled (Should be from 001, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 
-- 1. EVENTS MODULE
--
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, person_id)
);

-- 
-- 2. COURSES / LEADERSHIP TRACK MODULE
--
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES people(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  total_classes INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE course_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  class_date TIMESTAMP WITH TIME ZONE NOT NULL,
  theme VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(course_id, person_id)
);

CREATE TABLE course_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES course_classes(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES course_enrollments(id) ON DELETE CASCADE,
  present BOOLEAN DEFAULT FALSE,
  UNIQUE(class_id, enrollment_id)
);

-- 
-- 3. FINANCIAL MODULE
--
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE SET NULL, -- Null if anonymous
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('tithe', 'offering', 'donation', 'other')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'other')),
  description TEXT,
  created_by UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- RLS POLICIES FOR NEW TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Tenants isolation policies (Abstract simplified, actual depends on auth setup)
-- Reusing the same public access pattern as 001 for dev speed
CREATE POLICY "Enable all for tenants on events" ON events FOR ALL USING (true);
CREATE POLICY "Enable all for tenants on event_registrations" ON event_registrations FOR ALL USING (true);
CREATE POLICY "Enable all for tenants on courses" ON courses FOR ALL USING (true);
CREATE POLICY "Enable all for class" ON course_classes FOR ALL USING (true);
CREATE POLICY "Enable all for tenants on course_enrollments" ON course_enrollments FOR ALL USING (true);
CREATE POLICY "Enable all for course_attendance" ON course_attendance FOR ALL USING (true);
CREATE POLICY "Enable all for tenants on contributions" ON contributions FOR ALL USING (true);
