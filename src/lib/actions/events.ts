"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .select(`
            *,
            event_registrations (id, status)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("start_date", { ascending: true });

    if (error) throw error;

    return (data || []).map(event => ({
        ...event,
        registered_count: event.event_registrations?.filter((r: any) => r.status !== 'cancelled').length || 0,
        attended_count: event.event_registrations?.filter((r: any) => r.status === 'attended').length || 0,
    }));
}

export async function createEvent(formData: FormData) {
    const supabase = await createClient();

    const event = {
        tenant_id: TENANT_ID,
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || null,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        location: (formData.get("location") as string) || null,
        capacity: formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null,
        is_active: true,
    };

    const { data, error } = await supabase
        .from("events")
        .insert(event)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/eventos");
    return data;
}

export async function registerForEvent(eventId: string, personId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("event_registrations")
        .insert({
            tenant_id: TENANT_ID,
            event_id: eventId,
            person_id: personId,
            status: 'registered'
        });

    if (error) throw error;
    revalidatePath(`/eventos/${eventId}`);
    revalidatePath("/eventos");
}

export async function updateRegistrationStatus(registrationId: string, status: 'registered' | 'attended' | 'cancelled') {
    const supabase = await createClient();
    const { error } = await supabase
        .from("event_registrations")
        .update({ status })
        .eq("id", registrationId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    // Assuming we would revalidate the specific event page
}
