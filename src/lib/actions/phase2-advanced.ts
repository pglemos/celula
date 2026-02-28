"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ============================================
// CONSOLIDATION FUNNEL STATS
// ============================================
export async function getConsolidationFunnel() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("new_converts")
        .select("status, decision_date, contacted_at")
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;

    const funnel = {
        total: data?.length || 0,
        new: 0,
        contacted: 0,
        in_cell: 0,
        baptized: 0,
        lost: 0,
        avg_contact_hours: 0,
        overdue_48h: 0,
    };

    let contactTimes: number[] = [];

    (data || []).forEach(c => {
        funnel[c.status as keyof typeof funnel] = (funnel[c.status as keyof typeof funnel] as number || 0) + 1;

        if (c.status === "new") {
            const hoursSince = (Date.now() - new Date(c.decision_date).getTime()) / (1000 * 60 * 60);
            if (hoursSince > 48) funnel.overdue_48h++;
        }

        if (c.contacted_at && c.decision_date) {
            const hours = (new Date(c.contacted_at).getTime() - new Date(c.decision_date).getTime()) / (1000 * 60 * 60);
            contactTimes.push(hours);
        }
    });

    funnel.avg_contact_hours = contactTimes.length > 0
        ? Math.round(contactTimes.reduce((a, b) => a + b, 0) / contactTimes.length)
        : 0;

    return funnel;
}

// ============================================
// CELL SUGGESTION (by neighborhood & age)
// ============================================
export async function suggestCellForConvert(convertId: string) {
    const supabase = await createClient();

    // Get convert info
    const { data: convert } = await supabase
        .from("new_converts")
        .select("full_name, age_group, person_id")
        .eq("id", convertId)
        .single();

    if (!convert) return [];

    // Get person details if linked
    let neighborhood: string | null = null;
    if (convert.person_id) {
        const { data: person } = await supabase
            .from("people")
            .select("address_neighborhood")
            .eq("id", convert.person_id)
            .single();
        neighborhood = person?.address_neighborhood || null;
    }

    // Get active cells with members
    const { data: cells } = await supabase
        .from("cells")
        .select(`
            id, name, category, address_neighborhood, max_participants,
            cell_members (id)
        `)
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active")
        .order("name");

    if (!cells) return [];

    // Score cells by fit
    return cells
        .map(cell => {
            let score = 0;
            const membersCount = cell.cell_members?.length || 0;
            const maxP = cell.max_participants || 15;

            // Neighborhood match
            if (neighborhood && cell.address_neighborhood?.toLowerCase() === neighborhood.toLowerCase()) {
                score += 30;
            }
            // Category match with age group
            if (convert.age_group) {
                const catLower = (cell.category || "").toLowerCase();
                if (convert.age_group === "teen" && catLower.includes("jovem")) score += 20;
                if (convert.age_group === "young_adult" && catLower.includes("jovem")) score += 15;
                if (convert.age_group === "adult" && catLower.includes("adult")) score += 15;
            }
            // Availability (not full)
            if (membersCount < maxP) score += 10;
            // Prefer smaller cells for better integration
            if (membersCount <= 8) score += 5;

            return {
                id: cell.id,
                name: cell.name,
                category: cell.category,
                neighborhood: cell.address_neighborhood,
                membersCount,
                score,
            };
        })
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

// ============================================
// EVENT CHECK-IN (QR CODE)
// ============================================
export async function checkinByQR(registrationId: string, eventId: string) {
    const supabase = await createClient();

    // Verify registration exists
    const { data: reg } = await supabase
        .from("event_registrations")
        .select("id, status, person_id")
        .eq("id", registrationId)
        .eq("event_id", eventId)
        .single();

    if (!reg) return { error: "Inscrição não encontrada" };
    if (reg.status === "cancelled") return { error: "Inscrição cancelada" };

    // Check for duplicate checkin
    const { data: existing } = await supabase
        .from("event_checkins")
        .select("id")
        .eq("registration_id", registrationId)
        .maybeSingle();

    if (existing) return { error: "Check-in já realizado" };

    // Create checkin
    const { data, error } = await supabase
        .from("event_checkins")
        .insert({
            registration_id: registrationId,
            event_id: eventId,
            tenant_id: TENANT_ID,
            checkin_method: "qr",
        })
        .select()
        .single();

    if (error) throw error;

    // Update registration status
    await supabase
        .from("event_registrations")
        .update({ status: "confirmed" })
        .eq("id", registrationId);

    revalidatePath(`/eventos/${eventId}`);
    return { success: true, data };
}

export async function getEventCheckins(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_checkins")
        .select(`
            *,
            registration:event_registrations!event_checkins_registration_id_fkey(
                id, person_id,
                person:people!event_registrations_person_id_fkey(id, full_name, phone)
            )
        `)
        .eq("event_id", eventId)
        .order("checkin_time", { ascending: false });

    if (error) throw error;
    return data || [];
}

// ============================================
// EVENT FINANCIAL SUMMARY
// ============================================
export async function getEventFinancialSummary(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_payments")
        .select("amount, payment_status, payment_method")
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;

    const summary = {
        totalRevenue: 0,
        confirmed: 0,
        pending: 0,
        refunded: 0,
        byMethod: {} as Record<string, number>,
    };

    (data || []).forEach(p => {
        if (p.payment_status === "confirmed") {
            summary.totalRevenue += Number(p.amount);
            summary.confirmed++;
        } else if (p.payment_status === "pending") {
            summary.pending++;
        } else if (p.payment_status === "refunded") {
            summary.refunded++;
        }
        const method = p.payment_method || "outro";
        summary.byMethod[method] = (summary.byMethod[method] || 0) + 1;
    });

    return summary;
}

// ============================================
// COURSE MODULES
// ============================================
export async function getCourseModules(courseId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("course_modules")
        .select(`
            *,
            course_materials (id, title, type, url, order_index),
            course_quizzes (id, title, passing_score)
        `)
        .eq("course_id", courseId)
        .eq("tenant_id", TENANT_ID)
        .order("order_index");

    if (error) throw error;
    return data || [];
}

export async function createCourseModule(courseId: string, title: string, description?: string) {
    const supabase = await createClient();

    // Get next order index
    const { data: existing } = await supabase
        .from("course_modules")
        .select("order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: false })
        .limit(1);

    const nextOrder = (existing?.[0]?.order_index || 0) + 1;

    const { data, error } = await supabase
        .from("course_modules")
        .insert({
            course_id: courseId,
            tenant_id: TENANT_ID,
            title,
            description: description || null,
            order_index: nextOrder,
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/cursos/${courseId}`);
    return data;
}

// ============================================
// CERTIFICATES
// ============================================
export async function issueCertificate(courseId: string, personId: string) {
    const supabase = await createClient();

    // Generate unique codes
    const certNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;
    const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { data, error } = await supabase
        .from("certificates")
        .insert({
            course_id: courseId,
            person_id: personId,
            tenant_id: TENANT_ID,
            certificate_number: certNumber,
            verification_code: verificationCode,
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/cursos/${courseId}`);
    return data;
}

export async function verifyCertificate(code: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("certificates")
        .select(`
            *,
            course:courses!certificates_course_id_fkey(id, name),
            person:people!certificates_person_id_fkey(id, full_name)
        `)
        .eq("verification_code", code)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function getCourseCertificates(courseId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("certificates")
        .select(`
            *,
            person:people!certificates_person_id_fkey(id, full_name)
        `)
        .eq("course_id", courseId)
        .order("issued_at", { ascending: false });

    if (error) throw error;
    return data || [];
}

// ============================================
// STUDENT PROGRESS
// ============================================
export async function getStudentProgress(courseId: string, personId: string) {
    const supabase = await createClient();

    // Get total classes
    const { data: classes } = await supabase
        .from("course_classes")
        .select("id")
        .eq("course_id", courseId);

    // Get attendance
    const { data: attendance } = await supabase
        .from("course_attendance")
        .select("class_id, present")
        .eq("person_id", personId);

    const totalClasses = classes?.length || 0;
    const attendedClasses = attendance?.filter(a => a.present).length || 0;

    // Get quiz results
    const { data: quizAttempts } = await supabase
        .from("quiz_attempts")
        .select("quiz_id, score, passed")
        .eq("person_id", personId);

    return {
        totalClasses,
        attendedClasses,
        attendanceRate: totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0,
        quizAttempts: quizAttempts || [],
        avgQuizScore: quizAttempts && quizAttempts.length > 0
            ? Math.round(quizAttempts.reduce((a, b) => a + b.score, 0) / quizAttempts.length)
            : 0,
        allQuizzesPassed: quizAttempts ? quizAttempts.every(a => a.passed) : false,
    };
}
