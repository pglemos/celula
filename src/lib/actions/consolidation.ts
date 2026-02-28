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

export async function createNewConvert(formData: FormData) {
    const supabase = await createClient();

    const convert = {
        tenant_id: TENANT_ID,
        full_name: formData.get("full_name") as string,
        phone: (formData.get("phone") as string) || null,
        decision_date: formData.get("decision_date") as string,
        decision_type: formData.get("decision_type") as string || "accept",
        consolidator_id: (formData.get("consolidator_id") as string) || null,
        status: "new",
        notes: (formData.get("notes") as string) || null,
    };

    const { data, error } = await supabase
        .from("new_converts")
        .insert(convert)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/consolidacao");
    return data;
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
        .update({ consolidator_id: consolidatorId })
        .eq("id", convertId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/consolidacao");
}
