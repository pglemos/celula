import { ArrowLeft, Users, GraduationCap, CheckCircle2, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { notFound } from "next/navigation";
import { markCourseAttendance } from "@/lib/actions/courses";
import { revalidatePath } from "next/cache";

export default async function CursoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch course details, enrollments, and classes
    const { data: course, error } = await supabase
        .from("courses")
        .select(`
            *,
            instructor:people!courses_instructor_id_fkey(id, full_name),
            course_enrollments (
                id,
                status,
                people (id, full_name, phone)
            ),
            course_classes (
                id,
                class_date,
                theme,
                course_attendance (id, enrollment_id, present)
            )
        `)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error || !course) {
        notFound();
    }

    const startDate = course.start_date ? new Date(course.start_date) : null;
    const enrollments = course.course_enrollments || [];
    const activeEnrollments = enrollments.filter((e: any) => e.status !== 'dropped');
    const classesList = course.course_classes || [];

    // Simple Server Action for marking attendance for the first class as a demo/MVP functionality
    // In a full implementation, there would be a specific page for each class
    async function handleQuickAttendance(formData: FormData) {
        "use server";
        const enrollmentId = formData.get("enrollment_id") as string;
        // Find or create a class if none exists
        const supabase = await createClient();
        let classId = formData.get("class_id") as string;

        if (!classId) {
            const { data } = await supabase
                .from("course_classes")
                .insert({
                    course_id: id,
                    class_date: new Date().toISOString(),
                    theme: "Aula 1"
                })
                .select()
                .single();
            if (data) classId = data.id;
        }

        if (classId) {
            await markCourseAttendance(classId, enrollmentId, true);
            revalidatePath(`/cursos/${id}`);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/cursos">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gerenciamento da turma, alunos e presenças
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {course.instructor && (
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                                    <span>Prof: {course.instructor.full_name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 shrink-0 text-primary" />
                                <span>{activeEnrollments.length} alunos inscritos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">{classesList.length} / {course.total_classes} aulas registradas</span>
                            </div>
                        </div>

                        {course.description && (
                            <p className="text-sm pt-4 border-t border-border/30">
                                {course.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg">Alunos ({activeEnrollments.length})</CardTitle>
                            <CardDescription>Lista de alunos matriculados na turma</CardDescription>
                        </div>
                        {/* Placeholder for adding student */}
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/cursos/${id}/matricula`}>
                                <UserPlus className="h-4 w-4" /> Add Aluno
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-border/30 border-t border-border/30 mt-4">
                            {activeEnrollments.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nenhum aluno matriculado ainda.
                                </div>
                            ) : (
                                activeEnrollments.map((enr: any) => {
                                    // Check if attended latest class
                                    const latestClass = classesList.length > 0 ? classesList[classesList.length - 1] : null;
                                    const hasAttended = latestClass?.course_attendance?.find((a: any) => a.enrollment_id === enr.id && a.present);

                                    return (
                                        <div key={enr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{enr.people.full_name}</span>
                                                    {enr.status === 'completed' && <Badge className="bg-emerald-500/10 text-emerald-500 border-none">Concluído</Badge>}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                                                    {enr.people.phone && <span>{enr.people.phone}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!hasAttended && (
                                                    <form action={handleQuickAttendance}>
                                                        <input type="hidden" name="enrollment_id" value={enr.id} />
                                                        <input type="hidden" name="class_id" value={latestClass?.id || ""} />
                                                        <Button type="submit" size="sm" variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500">
                                                            <CheckCircle2 className="h-4 w-4 mr-2" /> Presença Hoje
                                                        </Button>
                                                    </form>
                                                )}
                                                {hasAttended && (
                                                    <p className="text-sm font-medium text-emerald-500 flex items-center">
                                                        <CheckCircle2 className="h-4 w-4 mr-1" /> Presente
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
