"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getPeople(search?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("people")
        .select(`
      *,
      cell_members (
        cell_id,
        role,
        cells (id, name)
      )
    `)
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("full_name");

    if (search) {
        query = query.or(
            `full_name.ilike.%${search}%,email.ilike.%${search}%,address_neighborhood.ilike.%${search}%,phone.ilike.%${search}%`
        );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function getPersonById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("people")
        .select(`
      *,
      cell_members (
        cell_id,
        role,
        joined_at,
        cells (id, name, category)
      ),
      meeting_attendance (
        id,
        present,
        meeting_id,
        cell_meetings (
          id,
          meeting_date,
          theme,
          cells (name)
        )
      )
    `)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error) throw error;
    return data;
}

export async function createPerson(formData: FormData) {
    const supabase = await createClient();

    const person = {
        tenant_id: TENANT_ID,
        full_name: formData.get("full_name") as string,
        preferred_name: (formData.get("preferred_name") as string) || null,
        birth_date: (formData.get("birth_date") as string) || null,
        gender: (formData.get("gender") as string) || null,
        marital_status: (formData.get("marital_status") as string) || null,
        phone: (formData.get("phone") as string) || null,
        whatsapp: (formData.get("whatsapp") as string) || null,
        email: (formData.get("email") as string) || null,
        address_street: (formData.get("address_street") as string) || null,
        address_number: (formData.get("address_number") as string) || null,
        address_complement: (formData.get("address_complement") as string) || null,
        address_neighborhood: (formData.get("address_neighborhood") as string) || null,
        address_city: (formData.get("address_city") as string) || "Belo Horizonte",
        address_state: (formData.get("address_state") as string) || "MG",
        address_zip: (formData.get("address_zip") as string) || null,
        latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
        longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
        membership_status: (formData.get("membership_status") as string) || "visitor",
        lgpd_consent: formData.get("lgpd_consent") === "true",
        lgpd_consent_date: formData.get("lgpd_consent") === "true" ? new Date().toISOString() : null,
        notes: (formData.get("notes") as string) || null,
    };

    const { data, error } = await supabase
        .from("people")
        .insert(person)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/membros");
    return data;
}

export async function updatePerson(id: string, formData: FormData) {
    const supabase = await createClient();

    const updates: Record<string, unknown> = {};
    const fields = [
        "full_name", "preferred_name", "birth_date", "gender", "marital_status",
        "phone", "whatsapp", "email", "address_street", "address_number",
        "address_complement", "address_neighborhood", "address_city", "address_state",
        "address_zip", "membership_status", "notes", "latitude", "longitude",
    ];

    for (const field of fields) {
        const value = formData.get(field);
        if (value !== null) updates[field] = value || null;
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from("people")
        .update(updates)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/membros");
    revalidatePath(`/membros/${id}`);
    return data;
}

export async function deletePerson(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("people")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/membros");
}

export async function getPeopleCount() {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("people")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true);

    if (error) throw error;
    return count || 0;
}
