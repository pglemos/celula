"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getAutomationRules() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("automation_rules")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function saveAutomationRule(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Não autenticado");

    const { data: person } = await supabase
        .from("people")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    const rule = {
        tenant_id: TENANT_ID,
        creator_id: person?.id,
        name: formData.get("name") as string,
        trigger_type: formData.get("trigger_type") as string,
        indicator_threshold: parseFloat(formData.get("indicator_threshold") as string) || null,
        target_audience: formData.get("target_audience") as string,
        message_template: formData.get("message_template") as string,
        is_active: formData.get("is_active") === "on",
        updated_at: new Date().toISOString()
    };

    const id = formData.get("id") as string;

    let error;
    if (id) {
        ({ error } = await supabase
            .from("automation_rules")
            .update(rule)
            .eq("id", id)
            .eq("tenant_id", TENANT_ID));
    } else {
        ({ error } = await supabase
            .from("automation_rules")
            .insert(rule));
    }

    if (error) throw error;
    revalidatePath("/configuracoes");
}

export async function deleteAutomationRule(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("automation_rules")
        .delete()
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/configuracoes");
}
