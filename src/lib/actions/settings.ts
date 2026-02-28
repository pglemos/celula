"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getTenantSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", TENANT_ID)
        .single();

    if (error) throw error;
    return data;
}

export async function updateTenantSettings(formData: FormData) {
    const supabase = await createClient();

    const updates: Record<string, unknown> = {};
    const fields = [
        "name",
        "slug",
        "custom_domain",
        "primary_color",
        "secondary_color",
        "cell_term",
        "timezone",
        "lgpd_dpo_email",
        "cell_categories"
    ];

    for (const field of fields) {
        const value = formData.get(field);
        if (value !== null) updates[field] = value || null;
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from("tenants")
        .update(updates)
        .eq("id", TENANT_ID)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/configuracoes");
    revalidatePath("/");
    return data;
}

export async function getVisitorFollowups() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("visitor_followups")
        .select(`
            *,
            person:people (id, full_name, phone, photo_url),
            meeting:cell_meetings (id, meeting_date, theme, cell:cells (name))
        `)
        .eq("status", "pending")
        .order("next_contact_date");

    if (error) throw error;
    return data;
}

export async function updateFollowupStatus(id: string, status: string, notes?: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("visitor_followups")
        .update({ status, notes, last_contact_at: new Date().toISOString() })
        .eq("id", id);

    if (error) throw error;
    revalidatePath("/visitantes");
}
