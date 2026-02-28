"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Clock, Lock, CheckCircle, ChevronRight, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const SERIES = [
    {
        id: 1,
        title: "Liderança de Célula: O Coração da Visão",
        instructor: "Pr. Marcos Paulo",
        lessons: 12,
        duration: "4h 30min",
        progress: 100,
        thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80"
    },
    {
        id: 2,
        title: "Consolidação e Discipulado Eficaz",
        instructor: "Pra. Ana Luiza",
        lessons: 8,
        duration: "3h 15min",
        progress: 45,
        thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
    },
    {
        id: 3,
        title: "Gestão Administrativa da Igreja",
        instructor: "Ricardo Silva",
        lessons: 10,
        duration: "5h 00min",
        progress: 0,
        thumbnail: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80"
    },
];

export default function ClassPage() {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-[22px] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 italic">célula.in <span className="text-indigo-600">CLASS</span></h1>
                        <p className="text-sm text-slate-500 font-medium">Sua plataforma de formação Ministerial.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Seu Progresso</p>
                        <p className="text-sm font-bold text-indigo-600">62% Concluído</p>
                    </div>
                    <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-indigo-500 rotate-45" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 ml-2">Séries e Treinamentos</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {SERIES.map((s, i) => (
                        <Card key={s.id} className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white flex flex-col sm:flex-row group hover:shadow-md transition-all">
                            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                                <img src={s.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={s.title} />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                                        <Play className="h-4 w-4 fill-current" />
                                    </div>
                                </div>
                                {s.progress === 100 && (
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg">
                                        Concluído
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="ghost" className="bg-slate-50 text-slate-400 text-[9px] font-bold p-0 px-2 h-5">
                                            {s.lessons} aulas
                                        </Badge>
                                        <Badge variant="ghost" className="bg-slate-50 text-slate-400 text-[9px] font-bold p-0 px-2 h-5">
                                            {s.duration}
                                        </Badge>
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
                                        {s.title}
                                    </h4>
                                    <p className="text-xs text-slate-400 font-medium">{s.instructor}</p>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-400 uppercase">Progresso</span>
                                        <span className="text-indigo-600">{s.progress}%</span>
                                    </div>
                                    <Progress value={s.progress} className="h-1.5 bg-slate-50" />
                                    <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs h-8 p-0 mt-2">
                                        {s.progress === 100 ? "Rever Aulas" : s.progress === 0 ? "Começar Agora" : "Continuar Assistindo"}
                                        <ChevronRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
