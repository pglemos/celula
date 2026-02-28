'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    ArrowLeft,
    Calendar,
    MessageSquare,
    Plus,
    Save,
    BookOpen
} from "lucide-react";
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";

interface Leader {
    id: string;
    name: string;
    cell: string;
    present: boolean;
}

const initialLeaders: Leader[] = [
    { id: '1', name: 'João Silva', cell: 'Célula Boas Novas', present: true },
    { id: '2', name: 'Maria Santos', cell: 'Célula Ebenezer', present: true },
    { id: '3', name: 'Pedro Lima', cell: 'Célula Ágape', present: false },
    { id: '4', name: 'Ana Oliveira', cell: 'Célula Vida', present: true },
    { id: '5', name: 'Marcos Souza', cell: 'Célula Luz', present: false },
];

export default function SupervisionMeetingPage() {
    const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const toggleAttendance = (id: string) => {
        setLeaders(leaders.map(leader =>
            leader.id === id ? { ...leader, present: !leader.present } : leader
        ));
    };

    const presentCount = leaders.filter(l => l.present).length;
    const attendancePercentage = Math.round((presentCount / leaders.length) * 100);

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/supervisao">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Reunião de Supervisão
                        </h1>
                        <p className="text-sm text-muted-foreground">Registro de pauta, orientações e presença dos líderes.</p>
                    </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md gap-2">
                    <Save size={16} /> Salvar Reunião
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <BookOpen size={18} className="text-violet-600" /> Pauta da Reunião
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Título / Tema</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Alinhamento Estratégico e Crescimento"
                                        className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-violet-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Pontos da Pauta</label>
                                    <textarea
                                        placeholder="1. Revisão das metas do mês&#10;2. Feedback das visitas&#10;3. Planejamento de treinamentos"
                                        className="w-full h-40 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-violet-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare size={18} className="text-violet-600" /> Observações Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                placeholder="Registre decisões tomadas, desafios compartilhados e próximos passos..."
                                className="w-full h-32 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-violet-500 transition-all resize-none"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-5 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Calendar size={14} className="text-violet-600" /> Dados da Reunião
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Data</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-violet-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Supervisão / Rede</label>
                                <Badge className="w-full py-2 bg-violet-50 text-violet-700 hover:bg-violet-100 border-none justify-center text-sm font-bold">
                                    Rede Esperança
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="pb-2 bg-gray-50/50">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Users size={16} className="text-violet-600" /> Lista de Presença
                                </CardTitle>
                                <span className={attendancePercentage > 70 ? 'text-emerald-600' : 'text-amber-600'}>
                                    {attendancePercentage}%
                                </span>
                            </div>
                            <Progress value={attendancePercentage} className="h-1 mt-2" />
                        </CardHeader>
                        <CardContent className="pt-4 px-0">
                            <div className="divide-y divide-gray-50">
                                {leaders.map((leader) => (
                                    <div
                                        key={leader.id}
                                        onClick={() => toggleAttendance(leader.id)}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${leader.present ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {leader.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${leader.present ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{leader.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">{leader.cell}</p>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${leader.present ? 'bg-emerald-500 border-emerald-500 shadow-sm' : 'border-gray-200'}`}>
                                            {leader.present && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
