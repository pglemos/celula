import {
    Users,
    CircleDot,
    TrendingUp,
    Heart,
    Bot,
    ChevronLeft,
    Share,
    Calendar,
    Maximize2,
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/supervisions";
import { PresenceChart } from "@/components/dashboard/presence-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockInsights = [
    { type: "warning" as const, message: "3 células com queda de presença > 20% na última semana", action: "Ver células", href: "/celulas" },
    { type: "danger" as const, message: "Líder Marcos Paulo: 2 semanas sem relatório", action: "Contatar", href: "/celulas" },
    { type: "success" as const, message: "Rede Jovens: Recorde de 92% de presença esta semana!", action: "Parabenizar", href: "/supervisao" },
];

const insightIcons = { warning: AlertTriangle, danger: XCircle, success: CheckCircle2, info: Info };
const insightColors = {
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-red-500 bg-red-500/10",
    success: "text-emerald-500 bg-emerald-500/10",
    info: "text-blue-500 bg-blue-500/10",
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Header Area mimicking SugarCRM reference */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Button variant="ghost" size="icon" className="h-12 w-12 bg-white shadow-sm rounded-full text-slate-400 hover:text-slate-900 border border-slate-100/50">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            Visão Geral
                        </h1>
                    </div>
                </div>

                {/* Sub-Navigation Tabs (The SugarCRM Pills below title) */}
                <div className="flex items-center gap-2">
                    <div className="bg-white/40 p-1 rounded-full border border-white/50 shadow-sm flex items-center">
                        <Button variant="ghost" className="rounded-full bg-slate-900 text-white hover:bg-slate-800 hover:text-white px-8 h-10 font-bold text-sm shadow-md">
                            Minha Rede
                        </Button>
                        <Button variant="ghost" className="rounded-full px-8 h-10 font-bold text-sm text-slate-500 hover:text-slate-900">
                            Em Progresso
                        </Button>
                        <Button variant="ghost" className="rounded-full px-8 h-10 font-bold text-sm text-slate-500 hover:text-slate-900">
                            Concluídos
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dash Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Metrics & Chart */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Top KPI Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bento-card p-4 flex items-center justify-between group overflow-hidden">
                            <div className="flex items-center gap-4 pl-2">
                                <div className="h-14 w-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-black/10">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Membros</p>
                                    <p className="text-3xl font-extrabold text-slate-900">{stats.peopleCount.toLocaleString("pt-BR")}</p>
                                </div>
                            </div>
                            <div className="pr-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                <ArrowUpRight className="h-5 w-5 text-slate-300" />
                            </div>
                        </Card>

                        <Card className="bento-card p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-4 pl-2">
                                <div className="h-14 w-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <CircleDot className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Células Ativas</p>
                                    <p className="text-3xl font-extrabold text-slate-900">{stats.cellsCount}</p>
                                </div>
                            </div>
                            <div className="pr-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                                <ArrowUpRight className="h-5 w-5 text-slate-300" />
                            </div>
                        </Card>
                    </div>

                    {/* Chart Container */}
                    <Card className="bento-card p-8 min-h-[500px] flex flex-col">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Métricas de Crescimento</h2>
                                <p className="text-sm font-semibold text-slate-400 mt-1">Presença média global nos últimos 6 meses</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                                    <Share className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <PresenceChart />
                        </div>
                    </Card>

                    {/* Members List mimicking the CRM Case Table */}
                    <Card className="bento-card overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Membros Recentes</h3>
                            <Link href="/membros">
                                <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-full px-4">
                                    Ver Todos
                                </Button>
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold px-4">M{i}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Novo Membro #{i}</p>
                                            <p className="text-xs font-semibold text-slate-400">Cadastrado há {i} dias</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Status</span>
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Ativo</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-300 group-hover:text-slate-900">
                                            <ChevronLeft className="h-5 w-5 rotate-180" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: AI & Side Metrics */}
                <div className="space-y-8">
                    {/* Secondary Metrics Container */}
                    <div className="grid grid-cols-1 gap-6">
                        <KpiCard
                            title="Presença Média"
                            value={stats.presenceAvg > 0 ? `${stats.presenceAvg}%` : "—"}
                            icon={TrendingUp}
                            variant="default"
                            delay={100}
                        />
                        <KpiCard
                            title="Decisões"
                            value={stats.totalDecisions}
                            icon={Heart}
                            variant="default"
                            delay={200}
                        />
                    </div>

                    {/* AI Autopilot Block */}
                    <Card className="bento-card h-fit flex flex-col bg-slate-900 text-white border-0 shadow-2xl shadow-indigo-900/20">
                        <CardHeader className="pb-4 pt-8 px-8">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                                    <Bot className="h-6 w-6" />
                                </div>
                                Autopilot IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 px-8 pb-10 pt-4">
                            {mockInsights.map((insight, i) => {
                                const Icon = insightIcons[insight.type];
                                return (
                                    <div key={i} className="flex flex-col rounded-3xl bg-white/5 p-5 border border-white/10 transition-all hover:bg-white/10 hover:translate-x-1 group cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className={cn("mt-1 p-2 rounded-xl backdrop-blur-md", insightColors[insight.type])}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <p className="text-sm font-bold leading-tight">
                                                    {insight.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Notificação</span>
                                                    <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors">Ver Agora →</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Help/Support Section mimicking footer of CRM */}
                    <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100/50 flex flex-col gap-4">
                        <h4 className="font-extrabold text-indigo-900">Precisa de ajuda?</h4>
                        <p className="text-sm font-semibold text-indigo-600/70 leading-relaxed">
                            Acesse nossa central de ajuda ou fale com o suporte pastoral.
                        </p>
                        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-full font-bold h-12 shadow-lg shadow-indigo-600/20">
                            Suporte
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
