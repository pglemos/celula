import {
    Users,
    CircleDot,
    Heart,
    Bot,
    ChevronRight,
    Share,
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    Sparkles,
    Activity,
    ArrowUpRight,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/supervisions";
import { PresenceChart } from "@/components/dashboard/presence-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockInsights = [
    { type: "warning" as const, message: "3 células com queda de presença > 20% na última semana", action: "Ver células", href: "/celulas" },
    { type: "danger" as const, message: "Líder Marcos Paulo: 2 semanas sem relatório de célula", action: "Contatar", href: "/supervisao" },
    { type: "success" as const, message: "Rede Jovens: Recorde de 92% de presença esta semana!", action: "Parabenizar", href: "/supervisao" },
];

const insightIcons = { warning: AlertTriangle, danger: XCircle, success: CheckCircle2, info: Info };
const insightColors = {
    warning: "text-amber-500 bg-amber-50",
    danger: "text-red-500 bg-red-50",
    success: "text-emerald-500 bg-emerald-50",
    info: "text-blue-500 bg-blue-50",
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6 animate-fade-in-up pb-8">

            {/* Welcome Section */}
            <div className="pt-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    Visão Geral
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Acompanhe o crescimento da rede, eventos e métricas em tempo real.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Membros Ativos"
                    value={stats.peopleCount}
                    icon={Users}
                    variant="default"
                />
                <KpiCard
                    title="Células Ativas"
                    value={stats.cellsCount}
                    icon={CircleDot}
                    variant="default"
                    delay={50}
                />
                <KpiCard
                    title="Presença Média"
                    value={`${stats.presenceAvg}%`}
                    icon={Activity}
                    variant="default"
                    delay={100}
                    trend={{ value: "+3%", positive: true }}
                />
                <KpiCard
                    title="Decisões (Mês)"
                    value={stats.totalDecisions}
                    icon={Heart}
                    variant="primary"
                    delay={150}
                />
            </div>

            {/* Middle — Assistant + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* Assistant Card */}
                <div className="lg:col-span-4">
                    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#f0f5d0] to-[#dff07c] p-7 h-full min-h-[380px] flex flex-col">
                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="h-8 w-8 rounded-full bg-slate-900 text-[#e8f5a0] flex items-center justify-center">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-slate-800 text-[13px] tracking-wider uppercase">
                                Assistant
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <h2 className="text-2xl font-medium text-slate-800 leading-snug tracking-tight">
                                Pronto para analisar{" "}
                                <span className="font-bold text-slate-900">relatórios das células</span>{" "}
                                ou{" "}
                                <span className="font-bold text-slate-900">novos membros?</span>
                            </h2>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button asChild variant="ghost" className="rounded-full bg-white/50 hover:bg-white/80 text-slate-800 font-semibold px-5 h-9 text-[13px]">
                                    <Link href="/celulas">Ver Células</Link>
                                </Button>
                                <Button asChild variant="ghost" className="rounded-full bg-white/50 hover:bg-white/80 text-slate-800 font-semibold px-5 h-9 text-[13px]">
                                    <Link href="/supervisao">Supervisão</Link>
                                </Button>
                                <Button asChild variant="ghost" className="rounded-full bg-white/50 hover:bg-white/80 text-slate-800 font-semibold px-5 h-9 text-[13px]">
                                    <Link href="/converts">Convertidos</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="lg:col-span-8">
                    <div className="rounded-[24px] bg-white border border-slate-100 p-7 h-full min-h-[380px] flex flex-col">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Engajamento Mensal</h2>
                                <p className="text-[13px] text-slate-500 mt-0.5">Presença média global nos últimos 6 meses</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                <Share className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 w-full min-h-[260px]">
                            <PresenceChart />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom — Insights + Members */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* AI Insights */}
                <div className="rounded-[24px] bg-white border border-slate-100 p-7 flex flex-col">
                    <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                        <div className="h-9 w-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-sm">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Autopilot Insights</h3>
                            <p className="text-[12px] text-slate-500">Análise automática de saúde e crescimento</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {mockInsights.map((insight, i) => {
                            const Icon = insightIcons[insight.type];
                            return (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors group">
                                    <div className={cn("p-2 rounded-xl shrink-0", insightColors[insight.type])}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-slate-800 leading-snug">
                                            {insight.message}
                                        </p>
                                        <Button asChild variant="link" className="p-0 h-auto text-[12px] font-semibold text-indigo-500 hover:text-indigo-700 mt-1.5">
                                            <Link href={insight.href}>{insight.action} →</Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Members List */}
                <div className="rounded-[24px] bg-white border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-7 pb-5 flex items-center justify-between border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">Últimos Integrantes</h3>
                            <p className="text-[12px] text-slate-500">Membros recém-adicionados à base</p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-slate-500 font-semibold rounded-full px-4 h-8 text-[13px] hover:bg-slate-100">
                            <Link href="/membros">Ver Todos</Link>
                        </Button>
                    </div>
                    <div className="flex flex-col">
                        {[1, 2, 3, 4].map((i) => (
                            <Link key={i} href="/membros" className="block focus:outline-none">
                                <div className="px-7 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group border-b border-slate-50 last:border-none">
                                    <div className="flex items-center gap-3.5">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={`https://i.pravatar.cc/150?img=${i * 10}`} />
                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold text-[13px]">M{i}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-[14px] text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {i === 1 ? 'Maria Eduarda Costa' : i === 2 ? 'Pedro Guilherme Lemos' : i === 3 ? 'João Paulo Silva' : 'Ana Beatriz Campos'}
                                            </p>
                                            <p className="text-[12px] text-slate-400 mt-0.5">Adicionado recentemente</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
