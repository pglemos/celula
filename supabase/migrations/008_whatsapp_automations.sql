-- ============================================
-- Migration 008: WhatsApp Integration & Hierarchical Automations
-- WhatsApp sessions, automation rules, and logs
-- ============================================

-- WhatsApp Sessions (Connection management)
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    session_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'pairing', 'error')),
    api_key TEXT, -- Masked/Encrypted in production
    webhook_url TEXT,
    qr_code TEXT,
    last_connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, person_id)
);

-- Automation Rules (Indicators and Triggers)
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL, -- 'missing_report' (cell), 'low_attendance' (cell), 'new_convert' (church/network)
    indicator_threshold DECIMAL(10, 2), -- e.g., 70.00 for 70% attendance
    target_audience VARCHAR(50) NOT NULL, -- 'cell_leaders', 'supervisors', 'direct_reports', 'specific_person'
    message_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automation Logs (Tracking sent messages)
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES automation_rules(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES people(id) ON DELETE SET NULL,
    receiver_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'delivered', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_sessions_tenant" ON whatsapp_sessions FOR ALL USING (true);
CREATE POLICY "automation_rules_tenant" ON automation_rules FOR ALL USING (true);
CREATE POLICY "automation_logs_tenant" ON automation_logs FOR ALL USING (true);

-- Indices
CREATE INDEX IF NOT EXISTS idx_wa_sessions_tenant ON whatsapp_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_auto_rules_tenant ON automation_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_auto_logs_rule ON automation_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_auto_logs_receiver ON automation_logs(receiver_id);
