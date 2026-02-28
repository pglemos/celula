"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Zap, Star, Users, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

const DINAMICAS = [
    {
        id: 1,
        title: "Termômetro da Oração",
        category: "Espiritual",
        duration: "15 min",
        participants: "Ilimitado",
        description: "Uma dinâmica para avaliar como está a vida de oração de cada membro do grupo.",
        content: "Cada participante recebe um desenho de termômetro e deve marcar a 'temperatura' da sua vida de oração..."
    },
    {
        id: 2,
        title: "A Teia da Comunhão",
        category: "Quebra-gelo",
        duration: "20 min",
        participants: "8-20 pessoas",
        description: "Demonstra a importância da conexão entre os irmãos e como um afeta o outro.",
        content: "Com um rolo de lã, os participantes jogam uns para os outros formando uma teia enquanto dizem uma qualidade..."
    },
    {
        id: 3,
        title: "Bombardeio de Amor",
        category: "Edificação",
        duration: "10 min",
        participants: "Mínimo 4",
        description: "Fortalecendo a autoestima e os laços de fraternidade através de palavras afirmativas.",
        content: "Um membro fica no centro e os outros dizem algo positivo que admiram nele em 1 minuto..."
    },
];

export default function DinamicasPage() {
    const [search, setSearch] = useState("");

    const filtered = DINAMICAS.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dinâmicas</h1>
                    <p className="text-sm text-slate-500 mt-1">Ideias criativas para suas reuniões de célula.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar dinâmicas..."
                        className="pl-10 rounded-2xl border-slate-200 bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 pb-2">
                <Badge className="rounded-xl px-4 py-1.5 bg-indigo-500 text-white border-none cursor-pointer">Todas</Badge>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">Quebra-gelo</Badge>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">Edificação</Badge>
                <Badge variant="outline" className="rounded-xl px-4 py-1.5 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">Espiritual</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((d, i) => (
                    <Card key={d.id} className="rounded-[32px] border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                        <div className="h-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 border-none">
                                    {d.category}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-colors">
                                    <Star className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                {d.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500 line-clamp-2">
                                {d.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" /> {d.duration}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-3.5 w-3.5" /> {d.participants}
                                </div>
                            </div>
                            <Button className="w-full rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-none shadow-none font-bold py-6 group-hover:shadow-lg transition-all">
                                Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
