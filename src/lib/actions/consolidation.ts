"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getNewConverts(statusFilter?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("new_converts")
        .select(`
            *,
            person:people!new_converts_person_id_fkey(id, full_name, phone, address_neighborhood),
            consolidator:people!new_converts_consolidator_id_fkey(id, full_name)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("decision_date", { ascending: false });

    if (statusFilter) {
        query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function getConvertById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("new_converts")
        .select(`
            *,
            person:people!new_converts_person_id_fkey(id, full_name, phone, address_neighborhood, birth_date, gender),
            consolidator:people!new_converts_consolidator_id_fkey(id, full_name),
            consolidation_events(*)
        `)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error) throw error;
    return data;
}

export async function getConsolidationStats() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("new_converts")
        .select("status")
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;

    const stats = {
        new: 0,
        contacted: 0,
        connected: 0,
        integrated: 0,
        lost: 0
    };

    (data || []).forEach(row => {
        if (row.status in stats) {
            stats[row.status as keyof typeof stats]++;
        }
    });

    return stats;
}

export async function registerDecision(data: {
    fullName: string;
    phone?: string;
    decisionDate: string;
    decisionType: string;
    neighborhood?: string;
    birthDate?: string;
    gender?: string;
    context?: string;
}) {
    const supabase = await createClient();

    // In this schema, new_converts might need a person_id. 
    // If person doesn't exist, we might need to create them first or the table allows null/placeholder.
    // Based on the schema view: person_id UUID NOT NULL REFERENCES people(id)
    // So we MUST create the person first.

    const { data: person, error: personError } = await supabase
        .from("people")
        .insert({
            tenant_id: TENANT_ID,
            full_name: data.fullName,
            phone: data.phone,
            address_neighborhood: data.neighborhood,
            birth_date: data.birthDate,
            gender: data.gender,
            membership_status: "visitor"
        })
        .select()
        .single();

    if (personError) throw personError;

    const { data: newConvert, error } = await supabase
        .from("new_converts")
        .insert({
            tenant_id: TENANT_ID,
            person_id: person.id,
            decision_date: data.decisionDate,
            decision_context: data.decisionType,
            status: "new"
        })
        .select()
        .single();

    if (error) throw error;

    // Log the event
    await supabase.from("consolidation_events").insert({
        tenant_id: TENANT_ID,
        new_convert_id: newConvert.id,
        event_type: "decision",
        description: `Decisão registrada: ${data.decisionType}`,
        metadata: { context: data.context }
    });

    revalidatePath("/converts");
    return newConvert;
}

export async function getIAMatchedCells(convertId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("match_ideal_cells", {
        p_convert_id: convertId
    });

    if (error) throw error;
    return data || [];
}

export async function logConsolidationEvent(convertId: string, type: string, description: string, metadata: any = {}) {
    const supabase = await createClient();

    const { error } = await supabase.from("consolidation_events").insert({
        tenant_id: TENANT_ID,
        new_convert_id: convertId,
        event_type: type,
        description,
        metadata
    });

    if (error) throw error;

    // Update main status if needed
    if (type === "contact_success") {
        await updateConvertStatus(convertId, "contacted");
    }

    revalidatePath("/converts");
}

export async function getOverdueConsolidations() {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("check_consolidation_overdue");

    if (error) throw error;
    return data || [];
}

export async function getFunnelData() {
    const supabase = await createClient();

    const { data: converts, error } = await supabase
        .from("new_converts")
        .select("status")
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;

    const stats = {
        new: 0,
        contacted: 0,
        connected: 0,
        integrated: 0,
        lost: 0
    };

    (converts || []).forEach((c: any) => {
        if (c.status in stats) stats[c.status as keyof typeof stats]++;
    });

    return {
        tenant_id: TENANT_ID,
        total_converts: converts?.length || 0,
        total_decisions: converts?.length || 0,
        total_contacted: stats.contacted + stats.connected + stats.integrated,
        total_in_cell: stats.connected + stats.integrated,
        total_integrated: stats.integrated,
        ...stats
    };
}

export async function predictEvasionRisk(convertId: string) {
    const supabase = await createClient();

    // Fetch convert data and recent events
    const { data: nc, error: ncError } = await supabase
        .from("new_converts")
        .select("*, consolidation_events(*)")
        .eq("id", convertId)
        .single();

    if (ncError) throw ncError;

    let riskScore = 0;
    const now = new Date();
    const lastActivity = nc.last_activity_at ? new Date(nc.last_activity_at) : new Date(nc.created_at);
    const daysSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 3600 * 24);

    // Heuristics for evasion risk (RF-04.05)
    if (daysSinceLastActivity > 7) riskScore += 0.3;
    if (daysSinceLastActivity > 14) riskScore += 0.5;
    if (nc.status === 'new' && daysSinceLastActivity > 2) riskScore += 0.2; // 48h alert influence

    const events = nc.consolidation_events || [];
    const contactAttempts = events.filter((e: any) => e.event_type === 'contact_attempt').length;
    const contactSuccess = events.filter((e: any) => e.event_type === 'contact_success').length;

    if (contactAttempts > 3 && contactSuccess === 0) riskScore += 0.4;

    // Normalize and update
    riskScore = Math.min(riskScore, 1.0);

    const { error: updateError } = await supabase
        .from("new_converts")
        .update({ evasion_risk_score: riskScore })
        .eq("id", convertId);

    if (updateError) throw updateError;
    return riskScore;
}

export async function updateConvertStatus(id: string, newStatus: string) {
    const supabase = await createClient();

    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === "contacted") updates.first_contact_at = new Date().toISOString();

    const { error } = await supabase
        .from("new_converts")
        .update(updates)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/converts");
}

export async function updateConsolidator(convertId: string, consolidatorId: string | null) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("new_converts")
        .update({ consolidator_id: consolidatorId === "none" ? null : consolidatorId })
        .eq("id", convertId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/converts");
}

export async function createNewConvert(formData: FormData) {
    const supabase = await createClient();

    // Since schema requires person_id, we need a person first
    const { data: person, error: personError } = await supabase
        .from("people")
        .insert({
            tenant_id: TENANT_ID,
            full_name: formData.get("full_name") as string,
            phone: (formData.get("phone") as string) || null,
            membership_status: "visitor"
        })
        .select()
        .single();

    if (personError) throw personError;

    const data = {
        tenant_id: TENANT_ID,
        person_id: person.id,
        decision_date: (formData.get("decision_date") as string) || new Date().toISOString().split('T')[0],
        decision_context: (formData.get("decision_type") as string) || "visitor",
        consolidator_id: (formData.get("consolidator_id") as string) === "none" ? null : (formData.get("consolidator_id") as string),
        status: "new"
    };

    const { data: nc, error } = await supabase
        .from("new_converts")
        .insert(data)
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/converts");
    return nc;
}
