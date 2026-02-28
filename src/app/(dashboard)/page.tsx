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
                <div className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/80 to-accent/90 border-0 shadow-[0_12px_40px_var(--color-primary)] text-white p-8 md:p-10 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_50px_var(--color-primary)]">
                    <div className="absolute top-0 right-0 w-3/4 h-full opacity-30 mix-blend-overlay pointer-events-none">
                        <Image
                            src="/images/dashboard-banner.png"
                            alt="Dashboard Banner"
                            fill
                            className="object-cover object-right"
                            priority
                        />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md text-white border border-white/30">
                            Central 3.0 OS
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight max-w-[500px]">
                            Gestão Moderna & Integrada.
                        </h1>
                        <p className="text-white/80 text-lg max-w-[400px] font-medium">
                            Acompanhe o pulso da sua igreja em tempo real. Bem-vindo ao novo painel de controle.
                        </p>
                    </div>
                    <div className="relative z-10 mt-8 flex gap-4">
                        <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-8 shadow-xl">
                            Visualizar Relatórios
                        </Button>
                        <Button variant="outline" className="rounded-full bg-transparent border-white/40 text-white hover:bg-white/10 font-bold px-6">
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
                <Card className="col-span-1 md:col-span-2 xl:col-span-1 bento-card border-border/40 animate-fade-in-up flex flex-col h-full bg-white/40 backdrop-blur-2xl" style={{ animationDelay: "500ms" }}>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white">
                                <Bot className="h-5 w-5" />
                            </div>
                            IA Pastoral
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {mockInsights.map((insight, i) => {
                            const Icon = insightIcons[insight.type];
                            const colorClass = {
                                warning: "text-amber-500 bg-amber-50 border-amber-200",
                                danger: "text-red-500 bg-red-50 border-red-200",
                                success: "text-emerald-500 bg-emerald-50 border-emerald-200",
                                info: "text-blue-500 bg-blue-50 border-blue-200",
                            }[insight.type];

                            return (
                                <div key={i} className="flex flex-col gap-2 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                    <div className="flex justify-between items-start">
                                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border", colorClass)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <Link href={insight.href}>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs font-semibold px-3 bg-secondary/50 hover:bg-secondary">
                                                {insight.action}
                                            </Button>
                                        </Link>
                                    </div>
                                    <p className="text-sm font-medium leading-snug text-foreground/90 mt-1">
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
