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
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header with Title and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Supervisão e Redes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestão hierárquica e saúde da sua rede ministerial.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                        <Filter className="w-4 h-4" /> Filtrar
                    </Button>
                    <Link href="/supervisao/nova">
                        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md gap-2">
                            <Plus className="w-4 h-4" /> Nova Supervisão
                        </Button>
                    </Link>
                </div>
            </div>

            {/* RF-03.02: Dashboard de supervisão com semáforo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden group">
                    <div className={`h-1.5 w-full ${supervisionStats.health === 'green' ? 'bg-emerald-500' : supervisionStats.health === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saúde Geral da Rede</CardTitle>
                        <div className={`p-2 rounded-full ${supervisionStats.health === 'green' ? 'bg-emerald-100 text-emerald-600' : supervisionStats.health === 'yellow' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            {supervisionStats.health === 'green' ? 'Excelente' : supervisionStats.health === 'yellow' ? 'Atenção' : 'Crítico'}
                            <Badge variant={supervisionStats.health === 'green' ? 'outline' : 'destructive'} className={`${supervisionStats.health === 'green' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : supervisionStats.health === 'yellow' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''}`}>
                                85% Meta
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Baseado em presença e relatórios semanais.
                        </p>
                        <Progress value={85} className="h-1 mt-4" />
                    </CardContent>
                </Card>

                {/* RF-03.03: Alertas Automáticos */}
                <Card className="col-span-1 md:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> Alertas Recentes
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 px-0">Ver todos</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisionStats.alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                        <div>
                                            <p className="text-sm font-medium leading-none">{(alert as any).message || (alert.type === 'missing_report' ? `Líder não preencheu relatório: ${alert.cell}` : `Queda de presença: ${alert.cell}`)}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{alert.date} • {(alert as any).leader || 'Automático'}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por rede ou supervisor..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                    </div>
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 ${viewMode === 'grid' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" /> Grade
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={`h-7 px-3 ${viewMode === 'list' ? 'shadow-sm bg-white' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon className="w-4 h-4 mr-2" /> Lista
                        </Button>
                    </div>
                </div>

                {/* Hierarchical Progress or List */}
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {supervisionStats.networks.map((network) => (
                        <Card key={network.id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
                            <div className={`h-1.5 w-full ${network.health === 'green' ? 'bg-emerald-500' : network.health === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold group-hover:text-indigo-600 transition-colors">
                                            {network.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <Users className="w-3 h-3" /> Supervisionado por {network.supervisor}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none font-semibold">
                                        {network.cells} Células
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">82%</p>
                                        <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mr-1">Frequência</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`flex items-center text-xs font-medium ${network.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {network.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                            {network.growth} este mês
                                        </div>
                                        <div className="flex gap-1 mt-2">
                                            <div className={`w-3 h-3 rounded-full ${network.health === 'green' ? 'bg-emerald-500' : network.health === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex gap-2">
                                    <Link href={`/supervisao/${network.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-9 text-xs border-gray-200 group-hover:border-violet-200 transition-colors">
                                            Gerenciar Rede
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 border-none">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* RF-03.01 & 03.07: Links to advanced features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/supervisao/organograma" className="block transform hover:-translate-y-1 transition-all">
                    <Card className="border-none bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute right-0 top-0 p-8 opacity-10">
                            <LayoutGrid size={120} />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Organograma Interativo <TrendingUp className="w-4 h-4" /></CardTitle>
                            <CardDescription className="text-white/80">Reorganize sua estrutura hierárquica por drag-and-drop.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-medium">
                                Abrir Visualização
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/supervisao/visitas" className="block transform hover:-translate-y-1 transition-all">
                    <Card className="border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg overflow-hidden relative">
                        <div className="absolute right-0 top-0 p-8 opacity-10">
                            <CheckCircle2 size={120} />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Visitas e Checklist <CheckCircle2 className="w-4 h-4" /></CardTitle>
                            <CardDescription className="text-white/80">Acompanhe as reuniões de supervisão e visitas de campo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-medium">
                                Ver Histórico
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
