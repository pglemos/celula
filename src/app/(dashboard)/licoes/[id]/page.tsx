import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Calendar, Book, Sparkles, HelpCircle, Target, Download, Heart, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/licoes">
                        <Button variant="ghost" size="icon" className="rounded-full bg-slate-100"><ArrowLeft className="h-5 w-5" /></Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] uppercase font-bold tracking-widest px-3">
                                Semana de {new Date(lesson.week_date).toLocaleDateString("pt-BR")}
                            </Badge>
                            {lesson.ai_generated && (
                                <Badge className="bg-indigo-500 text-white border-none text-[10px] flex gap-1 font-bold">
                                    <Sparkles className="h-3 w-3" /> Gerado por IA
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{lesson.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-white shadow-sm hover:text-rose-500 group">
                        <Heart className="h-5 w-5 group-hover:fill-rose-500" />
                    </Button>
                    <Button className="bg-slate-900 text-white font-bold rounded-2xl h-12 px-6 gap-2 border-none">
                        <Download className="h-5 w-5" /> PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-card border-border/50 shadow-sm overflow-hidden">
                        <CardContent className="p-8 prose prose-slate max-w-none dark:prose-invert">
                            <div className="flex items-center gap-2 text-indigo-600 font-black mb-6 pb-4 border-b border-border/30">
                                <Book className="h-5 w-5" />
                                <span className="uppercase tracking-widest text-xs">{lesson.scripture_reference || "Estudo Bíblico"}</span>
                            </div>
                            <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-slate-600">
                                <ReactMarkdown>
                                    {lesson.content}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-500" /> Comentários e Dicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <div className="flex gap-4 items-start">
                                <Avatar className="h-10 w-10 border-2 border-slate-50">
                                    <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                                    <AvatarFallback>JL</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="relative">
                                        <Input
                                            placeholder="Adicionar um comentário para outros líderes..."
                                            className="pr-12 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-indigo-500"
                                        />
                                        <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-indigo-500">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 items-start p-4 bg-slate-50/50 rounded-[24px]">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://i.pravatar.cc/150?img=22" />
                                        <AvatarFallback>MA</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Marcos Aurélio • 1h</p>
                                        <p className="text-sm text-slate-500 mt-1">Essa dinâmica de quebra-gelo funcionou muito bem com os jovens! Recomendo.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

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
