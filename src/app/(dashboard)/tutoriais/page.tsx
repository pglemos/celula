"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Search, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TUTORIALS = [
    { id: 1, title: "Como lançar relatórios de célula", category: "Lançamentos", duration: "3:45", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" },
    { id: 2, title: "Gerenciando eventos e inscrições", category: "Eventos", duration: "5:20", thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80" },
    { id: 3, title: "Módulo Financeiro: Entenda como funciona", category: "Gestão", duration: "4:15", thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" },
    { id: 4, title: "Personalizando seu perfil e igreja", category: "Configurações", duration: "2:30", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
];

export default function TutoriaisPage() {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Tutoriais</h1>
                    <p className="text-sm text-slate-500 mt-1">Aprenda a usar todas as ferramentas do sistema.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar ajuda..." className="pl-10 rounded-2xl border-slate-200 bg-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TUTORIALS.map((t, i) => (
                    <Card key={t.id} className="rounded-[32px] border-none shadow-sm overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                        <div className="relative aspect-video bg-slate-100">
                            <img src={t.thumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" alt={t.title} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-indigo-600 scale-90 group-hover:scale-110 transition-transform">
                                    <Play className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] font-bold">
                                {t.duration}
                            </div>
                        </div>
                        <CardHeader className="p-5">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase w-fit rounded-lg px-2 py-0.5 mb-2">
                                {t.category}
                            </Badge>
                            <CardTitle className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {t.title}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            <Card className="rounded-[32px] border-none shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Ainda com dúvidas?</h3>
                        <p className="text-indigo-100 text-sm max-w-md">Entre em contato com nosso suporte especializado via WhatsApp. Estamos prontos para ajudar sua igreja!</p>
                    </div>
                    <Button className="rounded-2xl bg-white text-indigo-600 hover:bg-white/90 font-bold px-8 h-14 text-base shrink-0 shadow-lg">
                        Falar com Suporte
                    </Button>
                </div>
            </Card>
        </div>
    );
}
