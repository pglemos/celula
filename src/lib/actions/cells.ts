"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getCells(search?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("cells")
        .select(`
      *,
      leader:people!cells_leader_id_fkey (id, full_name),
      co_leader:people!cells_co_leader_id_fkey (id, full_name),
      supervision:supervisions (id, name),
      cell_members (id)
    `)
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active")
        .order("name");

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,category.ilike.%${search}%,address_neighborhood.ilike.%${search}%`
        );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((cell) => ({
        ...cell,
        members_count: cell.cell_members?.length || 0,
    }));
}

export async function getCellById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("cells")
        .select(`
      *,
      leader:people!cells_leader_id_fkey (id, full_name, phone),
      co_leader:people!cells_co_leader_id_fkey (id, full_name, phone),
      supervision:supervisions (id, name),
      cell_members (
        id,
        role,
        joined_at,
        person:people (id, full_name, phone, membership_status, photo_url)
      )
    `)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error) throw error;
    return data;
}

export async function createCell(formData: FormData) {
    const supabase = await createClient();

    const cell = {
        tenant_id: TENANT_ID,
        name: formData.get("name") as string,
        category: (formData.get("category") as string) || null,
        leader_id: formData.get("leader_id") as string,
        co_leader_id: (formData.get("co_leader_id") as string) || null,
        supervision_id: (formData.get("supervision_id") as string) || null,
        meeting_day: (formData.get("meeting_day") as string) || null,
        meeting_time: (formData.get("meeting_time") as string) || null,
        address_neighborhood: (formData.get("address_neighborhood") as string) || null,
        address_city: (formData.get("address_city") as string) || "Belo Horizonte",
        address_state: (formData.get("address_state") as string) || "MG",
    };

    const { data, error } = await supabase
        .from("cells")
        .insert(cell)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/celulas");
    return data;
}

export async function getCellMeetings(cellId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("cell_meetings")
        .select(`
      *,
      submitted_by_person:people!cell_meetings_submitted_by_fkey (full_name),
      meeting_attendance (
        id,
        present,
        is_visitor,
        person:people (id, full_name)
      )
    `)
        .eq("cell_id", cellId)
        .order("meeting_date", { ascending: false })
        .limit(20);

    if (error) throw error;
    return data || [];
}

export async function submitMeeting(formData: FormData) {
    const supabase = await createClient();

    const cellId = formData.get("cell_id") as string;
    const submittedBy = formData.get("submitted_by") as string;

    // Create meeting
    const { data: meeting, error: meetingError } = await supabase
        .from("cell_meetings")
        .insert({
            cell_id: cellId,
            tenant_id: TENANT_ID,
            meeting_date: formData.get("meeting_date") as string,
            gods_presence: parseInt(formData.get("gods_presence") as string) || null,
            decisions_for_christ: parseInt(formData.get("decisions_for_christ") as string) || 0,
            theme: (formData.get("theme") as string) || null,
            observations: (formData.get("observations") as string) || null,
            submitted_by: submittedBy,
        })
        .select()
        .single();

    if (meetingError) throw meetingError;

    // Parse attendance
    const attendanceJson = formData.get("attendance") as string;
    if (attendanceJson && meeting) {
        const attendance = JSON.parse(attendanceJson) as Array<{
            person_id: string;
            present: boolean;
            is_visitor?: boolean;
        }>;

        const attendanceRecords = attendance.map((a) => ({
            meeting_id: meeting.id,
            person_id: a.person_id,
            present: a.present,
            is_visitor: a.is_visitor || false,
        }));

        if (attendanceRecords.length > 0) {
            const { error: attendanceError } = await supabase
                .from("meeting_attendance")
                .insert(attendanceRecords);

            if (attendanceError) throw attendanceError;
        }
    }

    revalidatePath(`/celulas/${cellId}`);
    revalidatePath("/");
    return meeting;
}

export async function addCellMember(cellId: string, personId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("cell_members")
        .insert({ cell_id: cellId, person_id: personId, role: "participant" });

    if (error) throw error;
    revalidatePath(`/celulas/${cellId}`);
}

export async function removeCellMember(cellId: string, personId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("cell_members")
        .delete()
        .eq("cell_id", cellId)
        .eq("person_id", personId);

    if (error) throw error;
    revalidatePath(`/celulas/${cellId}`);
}

export async function getCellsCount() {
    const supabase = await createClient();
    const { count, error } = await supabase
        .from("cells")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active");

    if (error) throw error;
    return count || 0;
}
