"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export function LessonList({ lessons }: { lessons: any[] }) {
    if (lessons.length === 0) {
        return (
            <div className="py-20 text-center bg-secondary/20 rounded-2xl border-2 border-dashed border-border/50">
                <Book className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Nenhuma lição encontrada</h3>
                <p className="text-muted-foreground">Clique em "Gerar com IA" para criar o primeiro roteiro.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
                <Link href={`/licoes/${lesson.id}`} key={lesson.id}>
                    <Card className="glass-card hover:border-primary/50 transition-all group overflow-hidden h-full">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                    Semana {new Date(lesson.week_date).toLocaleDateString()}
                                </Badge>
                                {lesson.ai_generated && (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none text-[10px] flex gap-1">
                                        <Sparkles className="h-3 w-3" /> IA
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="text-lg line-clamp-2 leading-snug">{lesson.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
                                <Book className="h-3 w-3" /> {lesson.scripture_reference || "Referência não informada"}
                            </p>
                            <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:gap-2 transition-all">
                                <span>Ler lição completa</span>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
