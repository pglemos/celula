import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, Book, Sparkles, HelpCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: lesson, error } = await supabase
        .from("cell_lessons")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !lesson) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/licoes">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase">
                            Semana de {new Date(lesson.week_date).toLocaleDateString()}
                        </Badge>
                        {lesson.ai_generated && (
                            <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 text-[10px] flex gap-1 animate-pulse">
                                <Sparkles className="h-3 w-3" /> Gerado por IA
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <Card className="lg:col-span-2 glass-card border-border/50 shadow-sm overflow-hidden">
                    <CardContent className="p-8 prose prose-slate max-w-none dark:prose-invert">
                        <div className="flex items-center gap-2 text-primary font-bold mb-6 pb-4 border-b border-border/50">
                            <Book className="h-5 w-5" />
                            <span>{lesson.scripture_reference || "Estudo Bíblico"}</span>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed">
                            <ReactMarkdown>
                                {lesson.content}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar: Questions & Challenge */}
                <div className="space-y-6">
                    {lesson.discussion_questions && lesson.discussion_questions.length > 0 && (
                        <Card className="glass-card border-border/50 border-l-4 border-l-blue-500/50 overflow-hidden">
                            <CardContent className="p-6">
                                <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-600">
                                    <HelpCircle className="h-4 w-4" /> Perguntas para Discussão
                                </h3>
                                <ul className="space-y-4">
                                    {(lesson.discussion_questions as string[]).map((q, i) => (
                                        <li key={i} className="text-sm leading-snug p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                                            <span className="font-bold text-blue-500 mr-2">{i + 1}.</span> {q}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="glass-card border-border/50 border-l-4 border-l-emerald-500/50 overflow-hidden bg-emerald-500/[0.02]">
                        <CardContent className="p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-2 text-emerald-600">
                                <Target className="h-4 w-4" /> Aplicação Prática
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Como podemos colocar em prática o que aprendemos hoje? Defina um desafio para a semana com a sua célula.
                            </p>
                            <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none" size="sm">
                                Marcar como Lida
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
