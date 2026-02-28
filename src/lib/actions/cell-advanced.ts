"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ============================================
// CELL LESSONS
// ============================================
export async function getCellLessons() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("cell_lessons")
        .select(`
            *,
            author:people!cell_lessons_author_id_fkey(id, full_name)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("week_date", { ascending: false })
        .limit(50);

    if (error) throw error;
    return data || [];
}

export async function createCellLesson(formData: FormData) {
    const supabase = await createClient();

    const questionsRaw = formData.get("discussion_questions") as string;
    let questions: string[] = [];
    if (questionsRaw) {
        questions = questionsRaw.split("\n").map(q => q.trim()).filter(Boolean);
    }

    const lesson = {
        tenant_id: TENANT_ID,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        scripture_reference: (formData.get("scripture_reference") as string) || null,
        discussion_questions: questions,
        week_date: (formData.get("week_date") as string) || null,
        author_id: (formData.get("author_id") as string) || null,
        ai_generated: formData.get("ai_generated") === "true",
    };

    const { data, error } = await supabase
        .from("cell_lessons")
        .insert(lesson)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/celulas");
    return data;
}

// ============================================
// LEADER TRAINING
// ============================================
export async function getLeaderTraining(cellId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leader_training")
        .select(`
            *,
            person:people!leader_training_person_id_fkey(id, full_name, phone)
        `)
        .eq("cell_id", cellId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    return data || [];
}

export async function updateTrainingCompetency(
    trainingId: string,
    competencyKey: string,
    completed: boolean
) {
    const supabase = await createClient();

    // Get current training
    const { data: training, error: fetchError } = await supabase
        .from("leader_training")
        .select("competencies")
        .eq("id", trainingId)
        .single();

    if (fetchError) throw fetchError;

    const competencies = training?.competencies as Record<string, boolean> || {};
    competencies[competencyKey] = completed;

    // Check if all competencies are complete
    const allComplete = Object.values(competencies).every(v => v === true);

    const { error } = await supabase
        .from("leader_training")
        .update({
            competencies,
            status: allComplete ? "completed" : "in_progress",
            completion_date: allComplete ? new Date().toISOString().split("T")[0] : null,
        })
        .eq("id", trainingId);

    if (error) throw error;
}

export async function createLeaderTraining(cellId: string, personId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leader_training")
        .insert({
            cell_id: cellId,
            person_id: personId,
            tenant_id: TENANT_ID,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================
// MULTIPLICATION PLANS
// ============================================
export async function getMultiplicationPlan(cellId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("multiplication_plans")
        .select(`
            *,
            new_leader:people!multiplication_plans_new_leader_id_fkey(id, full_name),
            new_host:people!multiplication_plans_new_host_id_fkey(id, full_name)
        `)
        .eq("cell_id", cellId)
        .eq("tenant_id", TENANT_ID)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function createMultiplicationPlan(formData: FormData) {
    const supabase = await createClient();

    const plan = {
        cell_id: formData.get("cell_id") as string,
        tenant_id: TENANT_ID,
        target_date: formData.get("target_date") as string,
        new_cell_name: (formData.get("new_cell_name") as string) || null,
        new_leader_id: (formData.get("new_leader_id") as string) || null,
        new_host_id: (formData.get("new_host_id") as string) || null,
        notes: (formData.get("notes") as string) || null,
    };

    const { data, error } = await supabase
        .from("multiplication_plans")
        .insert(plan)
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/celulas/${plan.cell_id}`);
    return data;
}

export async function updateMultiplicationDistribution(planId: string, distribution: { original: string[]; new: string[] }) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("multiplication_plans")
        .update({ member_distribution: distribution, updated_at: new Date().toISOString() })
        .eq("id", planId);

    if (error) throw error;
}

// ============================================
// VISITOR FOLLOW-UPS
// ============================================
export async function getVisitorFollowups(cellId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("visitor_followups")
        .select(`
            *,
            person:people!visitor_followups_person_id_fkey(id, full_name, phone),
            assigned:people!visitor_followups_assigned_to_fkey(id, full_name)
        `)
        .eq("cell_id", cellId)
        .eq("tenant_id", TENANT_ID)
        .order("first_visit_date", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createVisitorFollowup(cellId: string, personId: string, assignedTo?: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("visitor_followups")
        .insert({
            cell_id: cellId,
            person_id: personId,
            tenant_id: TENANT_ID,
            assigned_to: assignedTo || null,
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/celulas/${cellId}`);
    return data;
}

export async function updateFollowupStatus(followupId: string, status: string) {
    const supabase = await createClient();
    const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };
    if (status === "contacted") {
        updates.last_contact_date = new Date().toISOString().split("T")[0];
        updates.contact_attempts = 1; // Will need increment logic in reality
    }

    const { error } = await supabase
        .from("visitor_followups")
        .update(updates)
        .eq("id", followupId);

    if (error) throw error;
}

// ============================================
// CELL HEALTH CALCULATION
// ============================================
export async function calculateCellHealth(cellId: string): Promise<"green" | "yellow" | "red"> {
    const supabase = await createClient();

    // Get last 4 meetings
    const { data: meetings } = await supabase
        .from("cell_meetings")
        .select("id, meeting_date, meeting_attendance(id, present)")
        .eq("cell_id", cellId)
        .order("meeting_date", { ascending: false })
        .limit(4);

    if (!meetings || meetings.length === 0) return "red";

    // Check recency
    const lastMeeting = new Date(meetings[0].meeting_date);
    const daysSinceLast = Math.floor((Date.now() - lastMeeting.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLast > 21) return "red";

    // Calculate avg presence
    let totalPresent = 0;
    let totalAttendance = 0;
    meetings.forEach((m: any) => {
        const att = m.meeting_attendance || [];
        totalAttendance += att.length;
        totalPresent += att.filter((a: any) => a.present).length;
    });

    const avgPresence = totalAttendance > 0 ? (totalPresent / totalAttendance) * 100 : 0;

    if (daysSinceLast > 14 || avgPresence < 60) return "red";
    if (daysSinceLast > 10 || avgPresence < 75) return "yellow";
    return "green";
}
