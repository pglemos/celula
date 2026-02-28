import {
    Users,
    CircleDot,
    TrendingUp,
    Heart,
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
    Bot,
    ArrowRight,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/supervisions";
import { PresenceChart } from "@/components/dashboard/presence-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mockInsights = [
    { type: "warning" as const, message: "3 células com queda de presença > 20% na última semana", action: "Ver células", href: "/celulas" },
    { type: "danger" as const, message: "Líder Marcos Paulo: 2 semanas sem relatório", action: "Contatar", href: "/celulas" },
    { type: "success" as const, message: "Rede Jovens: Recorde de 92% de presença esta semana!", action: "Parabenizar", href: "/supervisao" },
    { type: "info" as const, message: "Tema 'comunidade' está gerando mais engajamento nas células", action: "Detalhes", href: "/supervisao" },
];

const insightIcons = { warning: AlertTriangle, danger: XCircle, success: CheckCircle2, info: Info };
const insightColors = {
    warning: "text-amber-400 bg-amber-400/10",
    danger: "text-red-400 bg-red-400/10",
    success: "text-emerald-400 bg-emerald-400/10",
    info: "text-blue-400 bg-blue-400/10",
};

import Image from "next/image";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
            {/* Bento Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-min">

                /* --- ROW 1: Hero & Active Members (Bento Focus) --- */
                {/* Hero / Main Insight (col-span-2, row-span-1 or 2) */}
                <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 relative overflow-hidden rounded-[2.5rem] bg-white border-0 shadow-[0_4px_40px_rgba(0,0,0,0.03)] text-slate-900 p-8 md:p-10 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_12px_50px_rgba(0,0,0,0.06)] hover:-translate-y-[2px]">
                    <div className="absolute top-0 right-0 w-3/4 h-full opacity-5 pointer-events-none grayscale">
                        <Image
                            src="/images/dashboard-banner.png"
                            alt="Dashboard Banner"
                            fill
                            className="object-cover object-right"
                            priority
                        />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center rounded-full bg-[#121212] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                            Central 3.0 OS
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight max-w-[500px] text-slate-900">
                            Gestão Moderna & Integrada.
                        </h1>
                        <p className="text-slate-500 text-lg max-w-[400px] font-medium leading-relaxed">
                            Acompanhe o pulso da sua igreja em tempo real. Bem-vindo ao novo painel de controle.
                        </p>
                    </div>
                    <div className="relative z-10 mt-8 flex gap-4">
                        <Button className="rounded-full bg-[#121212] text-white hover:bg-[#222] font-semibold px-8 py-6 h-auto shadow-lg shadow-black/10">
                            Visualizar Relatórios
                        </Button>
                        <Button variant="outline" className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border-0 font-semibold px-6 py-6 h-auto">
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Primary KPIs in Bento Grid */}
                <KpiCard
                    title="Total de Membros"
                    value={stats.peopleCount.toLocaleString("pt-BR")}
                    icon={Users}
                    variant="dark"
                    delay={100}
                    className="col-span-1 md:col-span-1 xl:col-span-1 min-h-[180px]"
                />

                <KpiCard
                    title="Células Ativas"
                    value={stats.cellsCount}
                    icon={CircleDot}
                    variant="accent"
                    delay={200}
                    className="col-span-1 md:col-span-1 xl:col-span-1 min-h-[180px]"
                />

                <KpiCard
                    title="Presença Média (Mês)"
                    value={stats.presenceAvg > 0 ? `${stats.presenceAvg}%` : "—"}
                    icon={TrendingUp}
                    variant="default"
                    trend={{ value: "+5%", positive: true }}
                    delay={300}
                    className="col-span-1 md:col-span-1 xl:col-span-1 min-h-[180px]"
                />

                <KpiCard
                    title="Decisões p/ Cristo"
                    value={stats.totalDecisions}
                    icon={Heart}
                    variant="default"
                    trend={{ value: "+12", positive: true }}
                    delay={400}
                    className="col-span-1 md:col-span-1 xl:col-span-1 min-h-[180px]"
                />

                /* --- ROW 3: Charts & AI Insights --- */
                <div className="col-span-1 md:col-span-2 xl:col-span-3 min-h-[400px]">
                    <PresenceChart />
                </div>

                {/* AI Insights - Vertical Bento Card */}
                <Card className="col-span-1 md:col-span-2 xl:col-span-1 border-0 shadow-[0_4px_40px_rgba(0,0,0,0.03)] rounded-[2rem] animate-fade-in-up flex flex-col h-full bg-white transition-all hover:shadow-[0_12px_50px_rgba(0,0,0,0.06)] hover:-translate-y-[2px]" style={{ animationDelay: "500ms" }}>
                    <CardHeader className="pb-4 pt-6 px-6">
                        <CardTitle className="text-xl font-extrabold flex items-center gap-3 text-slate-900">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#121212] shadow-lg text-white">
                                <Bot className="h-6 w-6" />
                            </div>
                            IA Pastoral
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                        {mockInsights.map((insight, i) => {
                            const Icon = insightIcons[insight.type];
                            const colorClass = {
                                warning: "text-[#121212] bg-amber-200 border-amber-300",
                                danger: "text-white bg-red-500 border-red-600",
                                success: "text-emerald-900 bg-emerald-200 border-emerald-300",
                                info: "text-blue-900 bg-blue-200 border-blue-300",
                            }[insight.type];

                            return (
                                <div key={i} className="flex flex-col gap-3 rounded-2xl border-0 bg-slate-50/80 p-5 transition-all hover:bg-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-black/5 shadow-sm", colorClass)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <Link href={insight.href}>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs font-bold px-4 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700">
                                                {insight.action}
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-[15px] font-semibold leading-snug text-slate-800 mt-2">
                                        {insight.message}
                                    </p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
