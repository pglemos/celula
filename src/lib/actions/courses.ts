"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select(`
            *,
            instructor:people!courses_instructor_id_fkey(id, full_name),
            course_enrollments (id, status),
            course_classes (id, class_date)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("start_date", { ascending: true });

    if (error) throw error;

    return (data || []).map(course => ({
        ...course,
        enrolled_count: course.course_enrollments?.filter((r: any) => r.status === 'enrolled').length || 0,
        completed_count: course.course_enrollments?.filter((r: any) => r.status === 'completed').length || 0,
        classes_count: course.course_classes?.length || 0
    }));
}

export async function createCourse(formData: FormData) {
    const supabase = await createClient();

    const course = {
        tenant_id: TENANT_ID,
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || null,
        instructor_id: (formData.get("instructor_id") as string) || null,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        total_classes: parseInt(formData.get("total_classes") as string) || 1,
        status: formData.get("status") as string || 'open',
    };

    const { data, error } = await supabase
        .from("courses")
        .insert(course)
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/cursos");
    return data;
}

export async function enrollInCourse(courseId: string, personId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("course_enrollments")
        .insert({
            tenant_id: TENANT_ID,
            course_id: courseId,
            person_id: personId,
            status: 'enrolled'
        });

    if (error) throw error;
    revalidatePath(`/cursos/${courseId}`);
    revalidatePath("/cursos");
}

export async function markCourseAttendance(classId: string, enrollmentId: string, present: boolean) {
    const supabase = await createClient();

    // Check if already exists
    const { data: existing } = await supabase
        .from("course_attendance")
        .select("id")
        .eq("class_id", classId)
        .eq("enrollment_id", enrollmentId)
        .single();

    let error;
    if (existing) {
        const { error: updateError } = await supabase
            .from("course_attendance")
            .update({ present })
            .eq("id", existing.id);
        error = updateError;
    } else {
        const { error: insertError } = await supabase
            .from("course_attendance")
            .insert({
                tenant_id: TENANT_ID,
                class_id: classId,
                enrollment_id: enrollmentId,
                present
            });
        error = insertError;
    }

    if (error) throw error;
}
