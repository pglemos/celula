"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * RF-03.01: Organograma hierárquico ilimitado (drag-and-drop)
 * Updates the parent supervision of a supervision node.
 */
export async function updateSupervisionHierarchy(id: string, newParentId: string | null) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('supervisions')
        .update({
            parent_id: newParentId,
            updated_at: new Date().toISOString()
        })
        .eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/(dashboard)/supervisao');
    return data;
}

/**
 * RF-03.04: Registro de visitas de supervisão com checklist
 */
export async function createSupervisionVisit(visit: {
    supervision_id: string;
    cell_id: string;
    visitor_id: string;
    visit_date: string;
    checklist: any[];
    observations?: string;
}) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('supervision_visits')
        .insert([visit]);

    if (error) throw new Error(error.message);

    revalidatePath('/(dashboard)/supervisao');
    return data;
}

/**
 * RF-03.05: Registro de reuniões de supervisão com pauta e presença
 */
export async function createSupervisionMeeting(meeting: {
    supervision_id: string;
    tenant_id: string;
    meeting_date: string;
    agenda: string;
    observations: string;
    attendance: { person_id: string; present: boolean }[];
}) {
    const supabase = await createClient();

    try {
        // 1. Create meeting
        const { data: meetingData, error: meetingError } = await supabase
            .from('supervision_meetings')
            .insert([{
                supervision_id: meeting.supervision_id,
                tenant_id: meeting.tenant_id,
                meeting_date: meeting.meeting_date,
                agenda: meeting.agenda,
                observations: meeting.observations
            }])
            .select()
            .single();

        if (meetingError) throw new Error(`Erro ao criar reunião: ${meetingError.message}`);

        // 2. Add attendance
        if (meeting.attendance && meeting.attendance.length > 0) {
            const attendanceRecords = meeting.attendance.map(a => ({
                meeting_id: meetingData.id,
                person_id: a.person_id,
                present: a.present
            }));

            const { error: attendanceError } = await supabase
                .from('supervision_meeting_attendance')
                .insert(attendanceRecords);

            if (attendanceError) {
                // Rollback meeting creation if attendance fails (simulated)
                await supabase.from('supervision_meetings').delete().eq('id', meetingData.id);
                throw new Error(`Erro ao registrar presença: ${attendanceError.message}`);
            }
        }

        revalidatePath('/(dashboard)/supervisao');
        return { success: true, data: meetingData };
    } catch (error: any) {
        console.error('Supervision Meeting Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * RF-03.03: Alertas automáticos
 * Logic to detect leaders who didn't fill reports or cells with attendance drop.
 */
export async function generateSupervisionAlerts(tenantId: string) {
    const supabase = await createClient();

    // 1. Get cells and their last meeting
    const { data: cells, error } = await supabase
        .from('cells')
        .select('id, name, supervision_id, leader_id')
        .eq('tenant_id', tenantId);

    if (error) return;

    const alerts = [];
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (const cell of cells) {
        // Check if report was filled last week
        const { data: lastMeeting } = await supabase
            .from('cell_meetings')
            .select('meeting_date')
            .eq('cell_id', cell.id)
            .gte('meeting_date', lastWeek.toISOString())
            .single();

        if (!lastMeeting) {
            alerts.push({
                tenant_id: tenantId,
                cell_id: cell.id,
                supervision_id: cell.supervision_id,
                type: 'missing_report',
                severity: 'high',
                message: `Relatório não preenchido para a célula ${cell.name} na última semana.`
            });
        }

        // Check for attendance drop (compare last 2 meetings)
        const { data: meetings } = await supabase
            .from('cell_meetings')
            .select('id, meeting_date')
            .eq('cell_id', cell.id)
            .order('meeting_date', { ascending: false })
            .limit(2);

        if (meetings && meetings.length === 2) {
            const { count: currentAttendance } = await supabase
                .from('meeting_attendance')
                .select('*', { count: 'exact', head: true })
                .eq('meeting_id', meetings[0].id)
                .eq('present', true);

            const { count: previousAttendance } = await supabase
                .from('meeting_attendance')
                .select('*', { count: 'exact', head: true })
                .eq('meeting_id', meetings[1].id)
                .eq('present', true);

            if (currentAttendance !== null && previousAttendance !== null && currentAttendance < previousAttendance * 0.7) {
                alerts.push({
                    tenant_id: tenantId,
                    cell_id: cell.id,
                    supervision_id: cell.supervision_id,
                    type: 'presence_drop',
                    severity: 'medium',
                    message: `Queda brusca de presença detectada na célula ${cell.name}.`
                });
            }
        }
    }

    if (alerts.length > 0) {
        await supabase.from('supervision_alerts').insert(alerts);
    }
}

/**
 * RF-03.02: Dashboard de supervisão com semáforo
 */
export async function getSupervisionStatus(supervisionId: string) {
    const supabase = await createClient();

    const { data: alerts } = await supabase
        .from('supervision_alerts')
        .select('severity')
        .eq('supervision_id', supervisionId)
        .eq('is_resolved', false);

    if (!alerts || alerts.length === 0) return 'green';

    const hasCritical = alerts.some(a => a.severity === 'critical' || a.severity === 'high');
    if (hasCritical) return 'red';

    return 'yellow';
}

export async function getSupervisionVisits(supervisionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('supervision_visits')
        .select(`
            *,
            cells (id, name),
            visitor:people (id, full_name)
        `)
        .eq('supervision_id', supervisionId)
        .order('visit_date', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getSupervisionMeetings(supervisionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('supervision_meetings')
        .select(`
            *,
            attendance:supervision_meeting_attendance (
                id,
                present,
                person:people (id, full_name)
            )
        `)
        .eq('supervision_id', supervisionId)
        .order('meeting_date', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getSupervisionDashboard(supervisionId: string) {
    const supabase = await createClient();

    // 1. Get cells under this supervision
    const { data: cells } = await supabase
        .from('cells')
        .select(`
            id, 
            name,
            cell_members(count),
            cell_meetings(id, meeting_date, meeting_attendance(present))
        `)
        .eq('supervision_id', supervisionId);

    if (!cells) return {
        totalCells: 0,
        totalMembers: 0,
        activeRate: 0,
        avgPresence: 0,
        cellStats: [] as any[]
    };

    const cellStats = cells.map(cell => {
        const members = (cell.cell_members as any)?.[0]?.count || 0;
        const recentMeetings = (cell.cell_meetings as any[])?.sort((a, b) =>
            new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime()
        ).slice(0, 4) || [];

        let totalPresent = 0;
        let totalPossible = 0;

        recentMeetings.forEach(m => {
            if (Array.isArray(m.meeting_attendance)) {
                m.meeting_attendance.forEach((a: any) => {
                    totalPossible++;
                    if (a.present) totalPresent++;
                });
            }
        });

        const cellAvgPresence = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;
        const lastMeetingDate = recentMeetings[0]?.meeting_date || null;

        return {
            id: cell.id,
            name: cell.name,
            members,
            avgPresence: cellAvgPresence,
            lastMeetingDate
        };
    });

    const totalCells = cells.length;
    const totalMembers = cellStats.reduce((acc, c) => acc + c.members, 0);
    const avgPresence = cellStats.length > 0
        ? Math.round(cellStats.reduce((acc, c) => acc + c.avgPresence, 0) / cellStats.length)
        : 0;

    // Active rate based on cells with meetings in last 15 days
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    const activeCells = cellStats.filter(c => c.lastMeetingDate && new Date(c.lastMeetingDate) >= fifteenDaysAgo).length;
    const activeRate = totalCells > 0 ? Math.round((activeCells / totalCells) * 100) : 0;

    return {
        totalCells,
        totalMembers,
        activeRate,
        avgPresence,
        cellStats
    };
}
