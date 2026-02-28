"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getContributions(startDate?: string, endDate?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("contributions")
        .select(`
            *,
            person:people!person_id(id, full_name)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

    if (startDate) query = query.gte("date", startDate);
    if (endDate) query = query.lte("date", endDate);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(item => ({
        ...item,
        amount: Number(item.amount) || 0,
        person: item.person || null
    }));
}

export async function getFinancialStats() {
    const supabase = await createClient();

    // In a real app we'd do aggregation in SQL/RPC
    // For MVP fetching all or recent months is fine
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];

    const { data: currentMonthData, error } = await supabase
        .from("contributions")
        .select("amount, type")
        .eq("tenant_id", TENANT_ID)
        .gte("date", firstDayOfMonth);

    if (error) throw error;

    const stats = {
        total: 0,
        tithes: 0,
        offerings: 0,
        other: 0
    };

    (currentMonthData || []).forEach(row => {
        const amt = Number(row.amount);
        if (isNaN(amt)) return;

        stats.total += amt;
        if (row.type === 'tithe') stats.tithes += amt;
        else if (row.type === 'offering') stats.offerings += amt;
        else stats.other += amt;
    });

    return stats;
}

export async function createContribution(formData: FormData) {
    const supabase = await createClient();

    const amountStr = formData.get("amount") as string;
    // Basic formatting assuming input like "150.50"
    const amount = parseFloat(amountStr.replace(',', '.'));

    const contribution = {
        tenant_id: TENANT_ID,
        amount: amount,
        type: formData.get("type") as string,
        date: formData.get("date") as string,
        payment_method: formData.get("payment_method") as string,
        description: (formData.get("description") as string) || null,
        person_id: formData.get("person_id") === 'anonymous' ? null : (formData.get("person_id") as string),
    };

    const { data, error } = await supabase
        .from("contributions")
        .insert(contribution)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/contribuicoes");
    return data;
}
