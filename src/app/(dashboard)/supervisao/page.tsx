'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    ChevronRight,
    Plus,
    TrendingUp,
    MapPin,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search,
    LayoutGrid,
    List as ListIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// Mock data based on new RFs
const supervisionStats = {
    health: 'yellow', // RF-03.02: green, yellow, red
    alerts: [
        { id: 1, type: 'missing_report', cell: 'Célula Boas Novas', leader: 'João Silva', severity: 'high', date: '2 dias atrás' },
        { id: 2, type: 'presence_drop', cell: 'Célula Ebenezer', change: '-30%', severity: 'medium', date: '1 dia atrás' },
        { id: 3, type: 'visit_overdue', cell: 'Célula Ágape', lastVisit: '15 dias atrás', severity: 'low', date: 'Hoje' },
    ],
    networks: [
        { id: '1', name: 'Rede Esperança', supervisor: 'Pr. Marcos', cells: 12, health: 'green', growth: '+5%' },
        { id: '2', name: 'Rede Vida', supervisor: 'Pra. Ana', cells: 8, health: 'yellow', growth: '-2%' },
        { id: '3', name: 'Rede Luz', supervisor: 'Diác. Paulo', cells: 15, health: 'red', growth: '+12%' },
    ]
};

export default function SupervisionDashboard() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="space-y-8 pb-20">
            {/* Header with Title and Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">
                        Supervisão e Redes
                    </h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gestão hierárquica e saúde da sua rede ministerial.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden sm:flex gap-2 rounded-[24px] h-14 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Filter className="w-5 h-5" /> Filtrar
                    </Button>
                    <Link href="/supervisao/nova">
                        <Button className="rounded-[24px] h-14 px-10 text-base tracking-wide font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md gap-2">
                            <Plus className="w-5 h-5" /> Nova Supervisão
                        </Button>
                    </Link>
                </div>
            </div>

            {/* RF-03.02: Dashboard de supervisão com semáforo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Saúde Geral da Rede</CardTitle>
                        <div className={`p-3 rounded-full ${supervisionStats.health === 'green' ? 'bg-emerald-100 text-emerald-600' : supervisionStats.health === 'yellow' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-bold flex items-center gap-3 text-slate-800">
                            {supervisionStats.health === 'green' ? 'Excelente' : supervisionStats.health === 'yellow' ? 'Atenção' : 'Crítico'}
                            <Badge variant={supervisionStats.health === 'green' ? 'outline' : 'destructive'} className={`px-3 py-1 text-xs rounded-full font-bold border-none ${supervisionStats.health === 'green' ? 'text-emerald-700 bg-emerald-50' : supervisionStats.health === 'yellow' ? 'text-amber-700 bg-amber-50' : ''}`}>
                                85% Meta
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-2">
                            Baseado em presença e relatórios semanais.
                        </p>
                        <Progress value={85} className={cn("h-2 mt-6 bg-slate-200/50", supervisionStats.health === 'green' ? '[&>div]:bg-emerald-500' : supervisionStats.health === 'yellow' ? '[&>div]:bg-amber-500' : '[&>div]:bg-rose-500')} />
                    </CardContent>
                </Card>

                {/* RF-03.03: Alertas Automáticos */}
                <Card className="col-span-1 md:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px]">
                    <CardHeader className="pb-4 px-8 pt-8">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" /> Alertas Recentes
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-full px-4">Ver todos</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-3">
                            {supervisionStats.alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-4 rounded-[24px] bg-white hover:bg-white/80 transition-colors border-none shadow-sm cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${alert.severity === 'high' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : alert.severity === 'medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500'}`} />
                                        <div>
                                            <p className="text-base font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{(alert as any).message || (alert.type === 'missing_report' ? `Líder não preencheu relatório: ${alert.cell}` : `Queda de presença: ${alert.cell}`)}</p>
                                            <p className="text-sm font-medium text-slate-400 mt-1.5">{alert.date} • {(alert as any).leader || 'Automático'}</p>
                                        </div>
                                    </div>
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500" />
                        <input
                            type="text"
                            placeholder="Buscar por rede ou supervisor..."
                            className="w-full pl-14 pr-6 py-4 bg-white/60 hover:bg-white focus:bg-white border-none rounded-[40px] text-lg font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Hierarchical Progress or List */}
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                    {supervisionStats.networks.map((network) => (
                        <Card key={network.id} className="group border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-md rounded-[40px] hover:bg-white/80 transition-all duration-300">
                            <CardHeader className="pb-4 px-8 pt-8 relative overflow-hidden">
                                {/* Soft color strip indicating health at the top rounded edge */}
                                <div className={`absolute top-0 left-0 right-0 h-2 ${network.health === 'green' ? 'bg-emerald-400' : network.health === 'yellow' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                                <div className="flex justify-between items-start pt-2">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                            {network.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1.5 mt-2 text-sm font-medium text-slate-500">
                                            <Users className="w-4 h-4" /> Supervisionado por {network.supervisor}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none font-bold text-xs px-3 py-1 rounded-full">
                                        {network.cells} Células
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-left">
                                        <p className="text-4xl font-light text-slate-900 tracking-tight">82%</p>
                                        <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mt-1">Frequência</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`flex items-center text-sm font-bold ${network.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {network.growth.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                            {network.growth} este mês
                                        </div>
                                        <div className="flex items-center justify-center gap-2 mt-3 px-3 py-1 rounded-full bg-white shadow-sm">
                                            <div className={`w-3 h-3 rounded-full ${network.health === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : network.health === 'yellow' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'} animate-pulse`} />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{network.health === 'green' ? 'Bom' : network.health === 'yellow' ? 'Atenção' : 'Crítico'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 mt-2 border-t border-slate-200/50 flex gap-3">
                                    <Link href={`/supervisao/${network.id}`} className="flex-1">
                                        <Button variant="ghost" className="w-full h-12 rounded-[20px] bg-slate-50 text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                            Gerenciar Rede
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-none shrink-0 shadow-sm">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* RF-03.01 & 03.07: Links to advanced features */}
            {/* RF-03.01 & 03.07: Links to advanced features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <Link href="/supervisao/organograma" className="block group transform hover:-translate-y-2 transition-all duration-300">
                    <Card className="border-none bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_20px_40px_rgba(99,102,241,0.2)] overflow-hidden relative rounded-[40px]">
                        <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <LayoutGrid size={160} />
                        </div>
                        <CardHeader className="px-10 pt-10">
                            <CardTitle className="flex items-center gap-3 text-3xl font-light">Organograma <TrendingUp className="w-6 h-6" /></CardTitle>
                            <CardDescription className="text-white/80 mt-2 text-base">Explore a hierarquia interativa em drag-and-drop.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <Button variant="secondary" className="w-full h-14 rounded-full bg-white/20 hover:bg-white text-white hover:text-indigo-600 border-none font-bold tracking-wide transition-colors mt-4">
                                Abrir Visualização
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/supervisao/visitas" className="block group transform hover:-translate-y-2 transition-all duration-300">
                    <Card className="border-none bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_20px_40px_rgba(16,185,129,0.2)] overflow-hidden relative rounded-[40px]">
                        <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle2 size={160} />
                        </div>
                        <CardHeader className="px-10 pt-10">
                            <CardTitle className="flex items-center gap-3 text-3xl font-light">Supervisão de Campo <CheckCircle2 className="w-6 h-6" /></CardTitle>
                            <CardDescription className="text-white/80 mt-2 text-base">Planilhas, checklists e reuniões de supervisão.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <Button variant="secondary" className="w-full h-14 rounded-full bg-white/20 hover:bg-white text-white hover:text-teal-600 border-none font-bold tracking-wide transition-colors mt-4">
                                Ver Histórico
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
