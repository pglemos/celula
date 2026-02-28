import { GraduationCap, Users, Plus, CalendarClock, BookOpen } from "lucide-react";
import { getCourses } from "@/lib/actions/courses";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CursosPage() {
    const courses = await getCourses();

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Cursos e Trilhas</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão da escola de líderes, trilha de membresia e capacitações
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/cursos/novo">
                        <Plus className="h-4 w-4" /> Novo Curso
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.length === 0 ? (
                    <Card className="bento-card col-span-full">
                        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
                            <p>Nenhum curso cadastrado ainda.</p>
                        </CardContent>
                    </Card>
                ) : (
                    courses.map((course) => {
                        const startDate = course.start_date ? new Date(course.start_date) : null;

                        return (
                            <Card key={course.id} className={`bento-card flex flex-col ${course.status === 'completed' ? 'opacity-70' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-xl line-clamp-2">{course.name}</CardTitle>
                                        <Badge variant={course.status === 'open' ? 'default' : 'secondary'}>
                                            {course.status === 'open' ? 'Inscrições Abertas' :
                                                course.status === 'in_progress' ? 'Em Andamento' :
                                                    course.status === 'completed' ? 'Concluído' : 'Rascunho'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        {course.instructor && (
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 shrink-0" />
                                                <span className="line-clamp-1">Prof: {course.instructor.full_name}</span>
                                            </div>
                                        )}
                                        {startDate && (
                                            <div className="flex items-center gap-2">
                                                <CalendarClock className="h-4 w-4 shrink-0" />
                                                <span>Início: {startDate.toLocaleDateString("pt-BR")}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 shrink-0" />
                                            <span>{course.classes_count} de {course.total_classes} aulas</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 shrink-0" />
                                            <span>{course.enrolled_count} alunos ativos</span>
                                        </div>
                                    </div>

                                    {course.description && (
                                        <p className="text-sm line-clamp-2 pt-4 border-t border-border/30">
                                            {course.description}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-border/30">
                                    <Button variant="secondary" className="w-full" asChild>
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
