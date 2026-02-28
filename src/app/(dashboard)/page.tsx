"use client";

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
import { mockPresenceData, mockInsights } from "@/lib/mock-data";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const insightIcons = {
    warning: AlertTriangle,
    danger: XCircle,
    success: CheckCircle2,
    info: Info,
};

const insightColors = {
    warning: "text-amber-400 bg-amber-400/10",
    danger: "text-red-400 bg-red-400/10",
    success: "text-emerald-400 bg-emerald-400/10",
    info: "text-blue-400 bg-blue-400/10",
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Visão Geral da Igreja
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Semana 09 — Fevereiro 2026
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    title="Total de Membros"
                    value="2.347"
                    icon={Users}
                    trend={{ value: "+3.2% vs mês anterior", positive: true }}
                    delay={0}
                />
                <KpiCard
                    title="Células Ativas"
                    value="184"
                    icon={CircleDot}
                    trend={{ value: "+2 novas esta semana", positive: true }}
                    delay={100}
                />
                <KpiCard
                    title="Presença Média"
                    value="87,2%"
                    icon={TrendingUp}
                    trend={{ value: "-1.5% vs semana anterior", positive: false }}
                    delay={200}
                />
                <KpiCard
                    title="Decisões p/ Cristo"
                    value="12"
                    icon={Heart}
                    trend={{ value: "+4 vs semana anterior", positive: true }}
                    delay={300}
                />
            </div>

            {/* Charts + Insights */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Presence Chart */}
                <Card className="glass-card border-border/50 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Histórico de Presença
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockPresenceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="presenceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                                    <XAxis
                                        dataKey="week"
                                        stroke="oklch(0.5 0.02 280)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        domain={[70, 100]}
                                        stroke="oklch(0.5 0.02 280)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${v}%`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "oklch(0.18 0.02 280)",
                                            border: "1px solid oklch(0.28 0.02 280)",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                        }}
                                        formatter={(value: number | undefined) => [`${value ?? 0}%`, "Presença"]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="presence"
                                        stroke="oklch(0.65 0.25 280)"
                                        strokeWidth={2}
                                        fill="url(#presenceGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

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
                            const Icon = insightIcons[insight.type as keyof typeof insightIcons];
                            const color = insightColors[insight.type as keyof typeof insightColors];
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                                >
                                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", color)}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs leading-relaxed text-foreground/90">
                                            {insight.message}
                                        </p>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-[11px] text-primary mt-1"
                                        >
                                            {insight.action}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
                <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition-transform group-hover:scale-110">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Cadastrar Membro</p>
                            <p className="text-xs text-muted-foreground">
                                Adicionar nova pessoa
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 transition-transform group-hover:scale-110">
                            <CircleDot className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Registrar Reunião</p>
                            <p className="text-xs text-muted-foreground">
                                Lançar presença da célula
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
                    <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 transition-transform group-hover:scale-110">
                            <Heart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Novo Convertido</p>
                            <p className="text-xs text-muted-foreground">
                                Registrar decisão para Cristo
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
