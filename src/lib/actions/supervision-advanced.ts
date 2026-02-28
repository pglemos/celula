"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ============================================
// SUPERVISION VISITS
// ============================================
export async function getSupervisionVisits(supervisionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("supervision_visits")
        .select(`
            *,
            cell:cells!supervision_visits_cell_id_fkey(id, name),
            visitor:people!supervision_visits_visitor_id_fkey(id, full_name)
        `)
        .eq("supervision_id", supervisionId)
        .eq("tenant_id", TENANT_ID)
        .order("visit_date", { ascending: false })
        .limit(20);

    if (error) throw error;
    return data || [];
}

export async function createSupervisionVisit(formData: FormData) {
    const supabase = await createClient();

    const checklistRaw = formData.get("checklist") as string;
    let checklist = {};
    try {
        checklist = JSON.parse(checklistRaw);
    } catch {
        checklist = {};
    }

    const visit = {
        supervision_id: formData.get("supervision_id") as string,
        cell_id: formData.get("cell_id") as string,
        tenant_id: TENANT_ID,
        visitor_id: formData.get("visitor_id") as string,
        visit_date: (formData.get("visit_date") as string) || new Date().toISOString().split("T")[0],
        checklist,
        notes: (formData.get("notes") as string) || null,
        rating: parseInt(formData.get("rating") as string) || null,
    };

    const { data, error } = await supabase
        .from("supervision_visits")
        .insert(visit)
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/supervisao/${visit.supervision_id}`);
    return data;
}

// ============================================
// SUPERVISION MEETINGS
// ============================================
export async function getSupervisionMeetings(supervisionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("supervision_meetings")
        .select(`
            *,
            supervision_meeting_attendance (
                id,
                present,
                person:people!supervision_meeting_attendance_person_id_fkey(id, full_name)
            )
        `)
        .eq("supervision_id", supervisionId)
        .eq("tenant_id", TENANT_ID)
        .order("meeting_date", { ascending: false })
        .limit(20);

    if (error) throw error;
    return data || [];
}

export async function createSupervisionMeeting(formData: FormData) {
    const supabase = await createClient();

    const meeting = {
        supervision_id: formData.get("supervision_id") as string,
        tenant_id: TENANT_ID,
        meeting_date: (formData.get("meeting_date") as string) || new Date().toISOString().split("T")[0],
        agenda: (formData.get("agenda") as string) || null,
        minutes: (formData.get("minutes") as string) || null,
    };

    const { data, error } = await supabase
        .from("supervision_meetings")
        .insert(meeting)
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/supervisao/${meeting.supervision_id}`);
    return data;
}

// ============================================
// SUPERVISION DASHBOARD STATS
// ============================================
export async function getSupervisionDashboard(supervisionId: string) {
    const supabase = await createClient();

    // Get cells for this supervision
    const { data: cells } = await supabase
        .from("cells")
        .select(`
            id, name, status,
            cell_members (id, person_id),
            cell_meetings (
                id, meeting_date,
                meeting_attendance (id, present, is_visitor)
            )
        `)
        .eq("supervision_id", supervisionId)
        .eq("tenant_id", TENANT_ID);

    if (!cells) return {
        totalCells: 0,
        totalMembers: 0,
        activeRate: 0,
        avgPresence: 0,
        totalDecisions: 0,
        cellStats: [],
    };

    let totalMembers = 0;
    let totalPresent = 0;
    let totalAttendance = 0;
    let activeCells = 0;

    const cellStats = cells.map(cell => {
        const members = cell.cell_members?.length || 0;
        totalMembers += members;

        const meetings = cell.cell_meetings || [];
        const lastMeeting = meetings.length > 0 ? meetings[0] : null;

        let cellPresent = 0;
        let cellTotal = 0;
        meetings.forEach((m: any) => {
            const att = m.meeting_attendance || [];
            cellTotal += att.length;
            cellPresent += att.filter((a: any) => a.present).length;
        });

        totalPresent += cellPresent;
        totalAttendance += cellTotal;

        if (lastMeeting) {
            const daysSince = Math.floor(
                (Date.now() - new Date(lastMeeting.meeting_date).getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSince <= 14) activeCells++;
        }

        return {
            id: cell.id,
            name: cell.name,
            members,
            avgPresence: cellTotal > 0 ? Math.round((cellPresent / cellTotal) * 100) : 0,
            lastMeetingDate: lastMeeting?.meeting_date || null,
            status: cell.status,
        };
    });

    return {
        totalCells: cells.length,
        totalMembers,
        activeRate: cells.length > 0 ? Math.round((activeCells / cells.length) * 100) : 0,
        avgPresence: totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0,
        totalDecisions: 0, // Can be extended
        cellStats: cellStats.sort((a, b) => b.avgPresence - a.avgPresence),
    };
}

// ============================================
// ALERTS
// ============================================
export async function getAlerts(limit = 10) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("read", false)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

export async function markAlertRead(alertId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("alerts")
        .update({ read: true })
        .eq("id", alertId);

    if (error) throw error;
}

export async function createAlert(
    type: "info" | "warning" | "danger" | "success",
    title: string,
    message: string,
    targetUserId?: string,
    actionLabel?: string,
    actionHref?: string
) {
    const supabase = await createClient();
    const { error } = await supabase.from("alerts").insert({
        tenant_id: TENANT_ID,
        type,
        title,
        message,
        target_user_id: targetUserId || null,
        action_label: actionLabel || null,
        action_href: actionHref || null,
    });

    if (error) throw error;
}
