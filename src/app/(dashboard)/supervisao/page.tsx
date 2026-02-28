"use client";

import { Network, Users, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { mockSupervisions, mockCells } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function getHealthFromPresence(avg: number): "green" | "yellow" | "red" {
    if (avg >= 80) return "green";
    if (avg >= 60) return "yellow";
    return "red";
}

export default function SupervisaoPage() {
    const totalCells = mockCells.length;
    const totalMembers = mockCells.reduce((acc, c) => acc + c.members_count, 0);
    const avgPresence = Math.round(
        mockSupervisions.reduce((acc, s) => acc + s.presence_avg, 0) /
        mockSupervisions.length
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Supervisão</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Visão geral das redes e células
                </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                    title="Redes"
                    value={mockSupervisions.length}
                    icon={Network}
                    delay={0}
                />
                <KpiCard
                    title="Total de Células"
                    value={totalCells}
                    icon={Users}
                    delay={100}
                />
                <KpiCard
                    title="Presença Média"
                    value={`${avgPresence}%`}
                    icon={TrendingUp}
                    trend={{
                        value: avgPresence >= 80 ? "Saudável" : "Atenção",
                        positive: avgPresence >= 80,
                    }}
                    delay={200}
                />
            </div>

            {/* Supervision Network Cards */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Redes de Supervisão</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                    {mockSupervisions.map((supervision, i) => (
                        <Card
                            key={supervision.id}
                            className="glass-card border-border/50 animate-fade-in-up cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                            style={{ animationDelay: `${(i + 3) * 80}ms` }}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Network className="h-4 w-4 text-primary" />
                                        {supervision.name}
                                    </CardTitle>
                                    <StatusBadge
                                        status={getHealthFromPresence(supervision.presence_avg)}
                                        label={`${supervision.presence_avg}%`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Supervisor: {supervision.supervisor}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="rounded-lg bg-secondary/50 p-2.5">
                                        <p className="text-lg font-bold">
                                            {supervision.cells.length}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                            Células
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-secondary/50 p-2.5">
                                        <p className="text-lg font-bold">
                                            {supervision.members_total}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                            Membros
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-secondary/50 p-2.5">
                                        <p className="text-lg font-bold">
                                            {supervision.presence_avg}%
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                            Presença
                                        </p>
                                    </div>
                                </div>

                                {/* Cells list */}
                                <div className="space-y-1.5">
                                    {supervision.cells.map((cell) => (
                                        <div
                                            key={cell.id}
                                            className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={cn(
                                                        "h-2 w-2 rounded-full",
                                                        cell.health === "green" && "bg-emerald-400",
                                                        cell.health === "yellow" && "bg-amber-400",
                                                        cell.health === "red" && "bg-red-400"
                                                    )}
                                                />
                                                <span className="text-xs font-medium">
                                                    {cell.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{cell.members_count} membros</span>
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
