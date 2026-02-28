-- ============================================
-- Migration 005: Phase 3 Enhancements
-- Financial Reporting, Campaigns, Gamification
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FINANCIAL ACCOUNTS
-- ============================================
CREATE TABLE financial_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bank', 'cash', 'digital')),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    initial_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    current_balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FINANCIAL CATEGORIES (for DRE)
-- ============================================
CREATE TABLE financial_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    dre_group VARCHAR(50) NOT NULL CHECK (dre_group IN (
        'dizimos', 'ofertas', 'campanhas', 'eventos', 'cursos', 'outros_receitas',
        'pessoal', 'administrativo', 'manutencao', 'missoes', 'social', 'outros_despesas'
    )),
    parent_id UUID REFERENCES financial_categories(id),
    order_index INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Link contributions to accounts and categories
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES financial_accounts(id);
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES financial_categories(id);
ALTER TABLE contributions ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'dinheiro'
    CHECK (payment_method IN ('dinheiro', 'pix', 'cartao_debito', 'cartao_credito', 'transferencia', 'boleto'));

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    cover_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaign_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contribution_id UUID NOT NULL REFERENCES contributions(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    UNIQUE(campaign_id, contribution_id)
);

-- ============================================
-- RECURRING CONTRIBUTIONS
-- ============================================
CREATE TABLE recurring_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    frequency VARCHAR(10) NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
    day_of_month INT CHECK (day_of_month BETWEEN 1 AND 31),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- GAMIFICATION
-- ============================================
CREATE TABLE gamification_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE UNIQUE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    xp_total INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    current_streak INT NOT NULL DEFAULT 0,
    longest_streak INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50) NOT NULL DEFAULT 'star',
    color VARCHAR(7) NOT NULL DEFAULT '#FFD700',
    criteria JSONB DEFAULT '{}',
    xp_reward INT NOT NULL DEFAULT 50,
    category VARCHAR(30) CHECK (category IN ('attendance', 'engagement', 'leadership', 'evangelism', 'special')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE earned_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(person_id, badge_id)
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) CHECK (source_type IN ('cell_attendance', 'event_attendance', 'course_completion', 'badge', 'offering', 'manual')),
    source_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_xp_person ON xp_transactions(person_id, created_at DESC);
CREATE INDEX idx_gamification_xp ON gamification_profiles(tenant_id, xp_total DESC);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE earned_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_financial_accounts" ON financial_accounts FOR ALL USING (true);
CREATE POLICY "all_financial_categories" ON financial_categories FOR ALL USING (true);
CREATE POLICY "all_campaigns" ON campaigns FOR ALL USING (true);
CREATE POLICY "all_campaign_contributions" ON campaign_contributions FOR ALL USING (true);
CREATE POLICY "all_recurring_contributions" ON recurring_contributions FOR ALL USING (true);
CREATE POLICY "all_gamification_profiles" ON gamification_profiles FOR ALL USING (true);
CREATE POLICY "all_badges" ON badges FOR ALL USING (true);
CREATE POLICY "all_earned_badges" ON earned_badges FOR ALL USING (true);
CREATE POLICY "all_xp_transactions" ON xp_transactions FOR ALL USING (true);
