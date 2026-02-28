-- ============================================
-- Migration 006: Member Management Enhancements
-- Family Relationships and Merge Support
-- ============================================

-- ============================================
-- PEOPLE RELATIONSHIPS (Vínculos Familiares)
-- ============================================
CREATE TABLE people_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  related_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  relationship_type VARCHAR(30) NOT NULL CHECK (relationship_type IN (
    'spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (person_id, related_person_id, relationship_type)
);

CREATE INDEX idx_relationships_person ON people_relationships(person_id);
CREATE INDEX idx_relationships_related ON people_relationships(related_person_id);

-- RLS
ALTER TABLE people_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_people_relationships" ON people_relationships FOR ALL USING (true);

-- ============================================
-- ADD LGPD CONSENT TIMESTAMP IF MISSING
-- ============================================
-- (Already exists in people table from 001_initial_schema.sql as lgpd_consent_date)

-- ============================================
-- HELPER FUNCTION FOR MERGING (Optional, but useful for DB level consistency)
-- ============================================
-- For now, we'll handle the merge logic in Server Actions to maintain flexibility with Clerk/Auth logic.
