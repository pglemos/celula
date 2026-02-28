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

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Visão Geral da Igreja</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Total de Membros" value={stats.peopleCount.toLocaleString("pt-BR")} icon={Users} delay={0} />
                <KpiCard title="Células Ativas" value={stats.cellsCount} icon={CircleDot} delay={100} />
                <KpiCard
                    title="Presença Média"
                    value={stats.presenceAvg > 0 ? `${stats.presenceAvg}%` : "—"}
                    icon={TrendingUp}
                    delay={200}
                />
                <KpiCard title="Decisões p/ Cristo" value={stats.totalDecisions} icon={Heart} delay={300} />
            </div>

            {/* Charts + Insights */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <PresenceChart />

                {/* AI Insights */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            IA Pastoral
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockInsights.map((insight, i) => {
                            const Icon = insightIcons[insight.type];
                            const color = insightColors[insight.type];
                            return (
                                <div key={i} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary">
                                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", color)}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs leading-relaxed text-foreground/90">{insight.message}</p>
                                        <Link href={insight.href}>
                                            <Button variant="link" className="h-auto p-0 text-[11px] text-primary mt-1">
                                                {insight.action}
                                                <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <Link href="/membros/novo">
                    <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition-transform group-hover:scale-110">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Cadastrar Membro</p>
                                <p className="text-xs text-muted-foreground">Adicionar nova pessoa</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/celulas">
                    <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 transition-transform group-hover:scale-110">
                                <CircleDot className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Registrar Reunião</p>
                                <p className="text-xs text-muted-foreground">Lançar presença da célula</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/membros/novo">
                    <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                        <CardContent className="flex items-center gap-4 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 transition-transform group-hover:scale-110">
                                <Heart className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Novo Convertido</p>
                                <p className="text-xs text-muted-foreground">Registrar decisão para Cristo</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
