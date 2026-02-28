'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    ArrowLeft,
    Calendar,
    MessageSquare,
    Plus,
    Save,
    Info
} from "lucide-react";
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";

// Sample checklist items
const defaultChecklist = [
    { id: 1, label: 'Líder presente na reunião', completed: false },
    { id: 2, label: 'Planejamento de multiplicação está em dia', completed: false },
    { id: 3, label: 'Relatórios preenchidos corretamente', completed: false },
    { id: 4, label: 'Ofertório sendo realizado e registrado', completed: false },
    { id: 5, label: 'Acolhimento de novos visitantes adequado', completed: false },
    { id: 6, label: 'Treinamento de timoteo/auxiliar em andamento', completed: false },
];

export default function SupervisionVisitPage() {
    const [checklist, setChecklist] = useState(defaultChecklist);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const toggleItem = (id: number) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const completedCount = checklist.filter(i => i.completed).length;
    const progress = Math.round((completedCount / checklist.length) * 100);

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/supervisao">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Registrar Visita de Supervisão
                        </h1>
                        <p className="text-sm text-muted-foreground">Acompanhamento de campo e checklist da célula.</p>
                    </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md gap-2">
                    <Save size={16} /> Salvar Visita
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Info Column */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Info size={14} className="text-emerald-600" /> Detalhes Gerais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Célula Visitada</label>
                                <select className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                                    <option>Célula Boas Novas</option>
                                    <option>Célula Ebenezer</option>
                                    <option>Célula Ágape</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Data da Visita</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 p-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Supervisor Responsável</label>
                                <p className="text-sm font-medium bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-700 font-bold">M</span>
                                    Pr. Marcos (Você)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-bold text-emerald-900">Saúde da Visita</p>
                                <span className="text-xs font-bold text-emerald-600">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-emerald-200" />
                            <p className="text-[11px] text-emerald-700 mt-2 font-medium">
                                {completedCount} de {checklist.length} itens do checklist concluídos.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Checklist and Observações Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-500" /> Checklist de Supervisão
                            </CardTitle>
                            <CardDescription>Critérios de excelência e saúde celular.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-1">
                                {checklist.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${item.completed ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 shadow-sm' : 'hover:bg-gray-50 border-transparent text-gray-600'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                                            {item.completed && <CheckCircle2 className="text-white w-3 h-3" />}
                                        </div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 border border-dashed border-emerald-200">
                                <Plus size={14} /> Adicionar Item Personalizado
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MessageSquare size={18} className="text-emerald-500" /> Observações e Fotos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                placeholder="Descreva pontos positivos, desafios e orientações dadas ao líder da célula..."
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                            />
                            <div className="mt-4 flex gap-4">
                                <Button variant="outline" className="flex-1 bg-gray-50 border-gray-200 border-dashed py-8 flex flex-col items-center gap-2 h-auto text-gray-500">
                                    <Plus size={20} />
                                    <span className="text-xs">Subir Fotos da Visita</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
