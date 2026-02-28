"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";

export async function getSupervisions() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("supervisions")
        .select(`
      *,
      supervisor:people!supervisions_supervisor_id_fkey (id, full_name),
      cells (
        id,
        name,
        category,
        status,
        address_neighborhood,
        cell_members (id),
        cell_meetings (
          id,
          meeting_date,
          meeting_attendance (id, present)
        )
      )
    `)
        .eq("tenant_id", TENANT_ID)
        .order("name");

    if (error) throw error;

    return (data || []).map((sup) => {
        const cells = sup.cells || [];
        const totalMembers = cells.reduce(
            (acc: number, c: { cell_members?: { id: string }[] }) =>
                acc + (c.cell_members?.length || 0),
            0
        );

        // Calculate average attendance from recent meetings
        let totalPresent = 0;
        let totalAttendance = 0;
        cells.forEach((c: { cell_meetings?: { meeting_attendance?: { id: string; present: boolean }[] }[] }) => {
            const recentMeetings = (c.cell_meetings || []).slice(0, 4);
            recentMeetings.forEach((m) => {
                const att = m.meeting_attendance || [];
                totalAttendance += att.length;
                totalPresent += att.filter((a) => a.present).length;
            });
        });

        const presenceAvg =
            totalAttendance > 0
                ? Math.round((totalPresent / totalAttendance) * 100)
                : 85; // default when no meetings yet

        return {
            ...sup,
            members_total: totalMembers,
            presence_avg: presenceAvg,
            cells_count: cells.length,
            cells: cells.map((c: { id: string; name: string; category: string | null; address_neighborhood: string | null; cell_members?: { id: string }[]; cell_meetings?: { id: string; meeting_date: string }[] }) => ({
                id: c.id,
                name: c.name,
                category: c.category,
                neighborhood: c.address_neighborhood,
                members_count: c.cell_members?.length || 0,
                last_meeting: c.cell_meetings?.[0]?.meeting_date || null,
            })),
        };
    });
}

export async function getDashboardStats() {
    const supabase = await createClient();

    // Total people
    const { count: peopleCount } = await supabase
        .from("people")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true);

    // Total active cells
    const { count: cellsCount } = await supabase
        .from("cells")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active");

    // Recent meetings for presence calculation
    const { data: recentMeetings } = await supabase
        .from("cell_meetings")
        .select(`
      id,
      meeting_date,
      decisions_for_christ,
      meeting_attendance (id, present)
    `)
        .eq("tenant_id", TENANT_ID)
        .order("meeting_date", { ascending: false })
        .limit(50);

    let totalPresent = 0;
    let totalAttendance = 0;
    let totalDecisions = 0;

    (recentMeetings || []).forEach((m) => {
        const att = m.meeting_attendance || [];
        totalAttendance += att.length;
        totalPresent += att.filter((a: { present: boolean }) => a.present).length;
        totalDecisions += m.decisions_for_christ || 0;
    });

    const presenceAvg =
        totalAttendance > 0
            ? Math.round((totalPresent / totalAttendance) * 100)
            : 0;

    return {
        peopleCount: peopleCount || 0,
        cellsCount: cellsCount || 0,
        presenceAvg,
        totalDecisions,
    };
}
