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
            consolidator:people!new_converts_consolidator_id_fkey(id, full_name),
            decision_meeting:cell_meetings(id, meeting_date, cells(name))
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
        in_cell: 0,
        baptized: 0,
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

    const { data: newConvert, error } = await supabase
        .from("new_converts")
        .insert({
            tenant_id: TENANT_ID,
            full_name: data.fullName,
            phone: data.phone || null,
            decision_date: data.decisionDate,
            decision_type: data.decisionType,
            neighborhood: data.neighborhood || null,
            birth_date: data.birthDate || null,
            gender: data.gender || null,
            context: data.context || null,
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

    const { data, error } = await supabase
        .from("v_consolidation_funnel")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error) throw error;
    return data;
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
    const lastActivity = new Date(nc.last_activity_at);
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

    // Auto-update step dates based on status progress
    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === "contacted") updates.first_contact_date = new Date().toISOString();
    if (newStatus === "in_cell") updates.cell_visit_date = new Date().toISOString();

    const { error } = await supabase
        .from("new_converts")
        .update(updates)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/consolidacao");
}

export async function updateConsolidator(convertId: string, consolidatorId: string | null) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("new_converts")
        .update({ consolidator_id: consolidatorId === "none" ? null : consolidatorId })
        .eq("id", convertId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/consolidacao");
}

export async function createNewConvert(formData: FormData) {
    const supabase = await createClient();

    const data = {
        tenant_id: TENANT_ID,
        full_name: formData.get("full_name") as string,
        phone: (formData.get("phone") as string) || null,
        decision_date: (formData.get("decision_date") as string) || new Date().toISOString(),
        decision_type: (formData.get("decision_type") as string) || "visitor",
        consolidator_id: (formData.get("consolidator_id") as string) === "none" ? null : (formData.get("consolidator_id") as string),
        notes: (formData.get("notes") as string) || null,
        status: "new"
    };

    const { data: nc, error } = await supabase
        .from("new_converts")
        .insert(data)
        .select()
        .single();

    if (error) throw error;

    revalidatePath("/consolidacao");
    return nc;
}
