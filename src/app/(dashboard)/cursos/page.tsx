import { GraduationCap, Users, Plus, CalendarClock, BookOpen, Filter } from "lucide-react";
import { getCourses } from "@/lib/actions/courses";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CursosPage() {
    const courses = await getCourses();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Cursos e Trilhas</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gestão da escola de líderes, trilha de membresia e capacitações
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden sm:flex gap-2 rounded-[24px] h-14 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Filter className="w-5 h-5" /> Filtrar
                    </Button>
                    <Button asChild className="rounded-[24px] h-14 px-10 text-base tracking-wide font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md gap-2">
                        <Link href="/cursos/novo">
                            <Plus className="w-5 h-5" /> Novo Curso
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.length === 0 ? (
                    <Card className="col-span-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px]">
                        <CardContent className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                            <GraduationCap className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-xl font-medium text-slate-600">Nenhum curso cadastrado</p>
                            <p className="text-sm text-slate-400 mt-1">Crie sua primeira turma!</p>
                        </CardContent>
                    </Card>
                ) : (
                    courses.map((course) => {
                        const startDate = course.start_date ? new Date(course.start_date) : null;

                        return (
                            <Card key={course.id} className={`border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${course.status === 'completed' ? 'opacity-60' : ''}`}>
                                <CardHeader className="px-8 pt-8 pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-xl font-semibold text-slate-800 line-clamp-2">{course.name}</CardTitle>
                                        <Badge
                                            variant={course.status === 'open' ? 'default' : 'secondary'}
                                            className={`rounded-full px-3 py-1 text-xs font-bold border-none ${course.status === 'open' ? 'bg-emerald-500 text-white' :
                                                    course.status === 'in_progress' ? 'bg-blue-500 text-white' :
                                                        course.status === 'completed' ? 'bg-slate-200 text-slate-500' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {course.status === 'open' ? 'Inscrições Abertas' :
                                                course.status === 'in_progress' ? 'Em Andamento' :
                                                    course.status === 'completed' ? 'Concluído' : 'Rascunho'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 px-8">
                                    <div className="space-y-2.5 text-sm text-slate-500">
                                        {course.instructor && (
                                            <div className="flex items-center gap-3">
                                                <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
                                                <span className="line-clamp-1">Prof: {course.instructor.full_name}</span>
                                            </div>
                                        )}
                                        {startDate && (
                                            <div className="flex items-center gap-3">
                                                <CalendarClock className="h-4 w-4 shrink-0 text-slate-400" />
                                                <span>Início: {startDate.toLocaleDateString("pt-BR")}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{course.classes_count} de {course.total_classes} aulas</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{course.enrolled_count} alunos ativos</span>
                                        </div>
                                    </div>

                                    {course.description && (
                                        <p className="text-sm line-clamp-2 pt-4 border-t border-slate-100 text-slate-500">
                                            {course.description}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="px-8 pb-8 pt-4">
                                    <Button asChild variant="ghost" className="w-full rounded-[24px] h-12 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all">
                                        <Link href={`/cursos/${course.id}`}>
                                            Gerenciar Turma
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
