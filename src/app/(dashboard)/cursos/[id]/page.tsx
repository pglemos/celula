import { ArrowLeft, Users, GraduationCap, CheckCircle2, UserPlus, BookOpen, Clock, Award, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/50 mb-8">
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm" asChild>
                    <Link href="/cursos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{course.name}</h1>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Turma #{id.substring(0, 4)}</p>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 font-bold text-[10px]">ATIVO</Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-xl font-bold">Visão Geral</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <div className="space-y-4">
                                {course.instructor && (
                                    <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                                        <div className="bg-white p-2 rounded-xl shadow-sm">
                                            <GraduationCap className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Instrutor</p>
                                            <p className="text-sm font-bold text-slate-800 leading-none">{course.instructor.full_name}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        <Clock className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Carga Horária</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">{course.total_classes * 2} Horas Totais</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                                    <div className="bg-white p-2 rounded-xl shadow-sm">
                                        <Award className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Certificação</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">Válido no Audit</p>
                                    </div>
                                </div>
                            </div>

                            {course.description && (
                                <div className="pt-6 border-t border-slate-100">
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        "{course.description}"
                                    </p>
                                </div>
                            )}

                            <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold h-12 rounded-2xl border-none">
                                Editar Turma
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Stats Shortcut */}
                    <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100 overflow-hidden relative group">
                        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                            <BookOpen className="h-32 w-32" />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-2">Frequência Média</p>
                        <h4 className="text-3xl font-black">84%</h4>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs font-medium opacity-80">Meta: 90%</span>
                            <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[84%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold">Conteúdo Programático</CardTitle>
                                <CardDescription>Progresso das lições para esta turma</CardDescription>
                            </div>
                            <Badge className="bg-indigo-500/10 text-indigo-500 border-none px-4 py-1 rounded-full font-bold">
                                {classesList.length} / 7 Aulas
                            </Badge>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                                    const classInfo = classesList.find((c: any) => c.theme?.includes(num.toString()));
                                    const isCompleted = !!classInfo;

                                    return (
                                        <div key={num} className={`group flex items-center justify-between p-4 rounded-2xl transition-all ${isCompleted ? 'bg-emerald-50 content-[""] border-emerald-100' : 'bg-slate-50 border-slate-100'} border`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                                                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : num}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        Lição {num}: {classInfo?.theme || "A definir"}
                                                    </h4>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
                                                        {isCompleted ? `Realizada em ${new Date(classInfo.class_date).toLocaleDateString("pt-BR")}` : "Pendente"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between px-8 pt-8 pb-2">
                            <div>
                                <CardTitle className="text-xl font-bold">Alunos ({activeEnrollments.length})</CardTitle>
                                <CardDescription>Gerenciamento de matrículas e presença</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 gap-2 font-bold" asChild>
                                <Link href={`/cursos/${id}/matricula`}>
                                    <UserPlus className="h-4 w-4" /> Matricular
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="divide-y divide-slate-100 mt-4">
                                {activeEnrollments.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm text-slate-500 font-medium">Nenhum aluno matriculado ainda.</p>
                                    </div>
                                ) : (
                                    activeEnrollments.map((enr: any) => {
                                        const latestClass = classesList.length > 0 ? classesList[classesList.length - 1] : null;
                                        const hasAttended = latestClass?.course_attendance?.find((a: any) => a.enrollment_id === enr.id && a.present);

                                        return (
                                            <div key={enr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-slate-50">
                                                        <AvatarFallback>{enr.people.full_name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900 leading-none">{enr.people.full_name}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{enr.people.phone || 'Sem telefone'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {hasAttended ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1.5 rounded-full font-bold text-[10px] flex gap-1.5 items-center">
                                                            <CheckCircle2 className="h-3 w-3" /> PRESENTE
                                                        </Badge>
                                                    ) : (
                                                        <form action={handleQuickAttendance}>
                                                            <input type="hidden" name="enrollment_id" value={enr.id} />
                                                            <input type="hidden" name="class_id" value={latestClass?.id || ""} />
                                                            <Button type="submit" size="sm" variant="outline" className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-wider border-slate-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all">
                                                                Lançar Presença
                                                            </Button>
                                                        </form>
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
        </div>
    );
}
