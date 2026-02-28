import { Network, Users, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getSupervisions } from "@/lib/actions/supervisions";
import { cn } from "@/lib/utils";
import Link from "next/link";

function getHealthFromPresence(avg: number): "green" | "yellow" | "red" {
    if (avg >= 80) return "green";
    if (avg >= 60) return "yellow";
    return "red";
}

const healthColors = {
    green: "bg-emerald-400/20 text-emerald-400",
    yellow: "bg-amber-400/20 text-amber-400",
    red: "bg-red-400/20 text-red-400",
};

const dotColors = {
    green: "bg-emerald-400",
    yellow: "bg-amber-400",
    red: "bg-red-400",
};

export default async function SupervisaoPage() {
    const supervisions = await getSupervisions();

    const totalCells = supervisions.reduce((acc, s) => acc + s.cells_count, 0);
    const totalMembers = supervisions.reduce((acc, s) => acc + s.members_total, 0);
    const avgPresence =
        supervisions.length > 0
            ? Math.round(supervisions.reduce((acc, s) => acc + s.presence_avg, 0) / supervisions.length)
            : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Supervisão</h1>
                <p className="text-sm text-muted-foreground mt-1">Visão geral das redes e células</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard title="Redes" value={supervisions.length} icon={Network} delay={0} />
                <KpiCard title="Total de Células" value={totalCells} icon={Users} delay={100} />
                <KpiCard
                    title="Presença Média"
                    value={avgPresence > 0 ? `${avgPresence}%` : "—"}
                    icon={TrendingUp}
                    trend={{ value: avgPresence >= 80 ? "Saudável" : "Atenção", positive: avgPresence >= 80 }}
                    delay={200}
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Redes de Supervisão</h2>
                <div className="grid gap-4 lg:grid-cols-2">
                    {supervisions.map((supervision, i) => {
                        const health = getHealthFromPresence(supervision.presence_avg);
                        return (
                            <Card
                                key={supervision.id}
                                className="bento-card animate-fade-in-up"
                                style={{ animationDelay: `${(i + 3) * 80}ms` }}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-bold flex items-center gap-2">
                                            <Network className="h-4 w-4 text-primary" />
                                            {supervision.name}
                                        </CardTitle>
                                        <Badge variant="outline" className={`text-[10px] ${healthColors[health]}`}>
                                            {supervision.presence_avg}%
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Supervisor: {supervision.supervisor?.full_name || "—"}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-lg bg-secondary/50 p-2.5">
                                            <p className="text-lg font-bold">{supervision.cells_count}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Células</p>
                                        </div>
                                        <div className="rounded-lg bg-secondary/50 p-2.5">
                                            <p className="text-lg font-bold">{supervision.members_total}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Membros</p>
                                        </div>
                                        <div className="rounded-lg bg-secondary/50 p-2.5">
                                            <p className="text-lg font-bold">{supervision.presence_avg}%</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Presença</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        {supervision.cells.map((cell: { id: string; name: string; members_count: number; neighborhood: string | null }) => {
                                            const cellHealth = cell.members_count >= 5 ? "green" : cell.members_count >= 3 ? "yellow" : "red";
                                            return (
                                                <Link href={`/celulas/${cell.id}`} key={cell.id}>
                                                    <div className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2 hover:bg-secondary/50 transition-colors">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("h-2 w-2 rounded-full", dotColors[cellHealth])} />
                                                            <span className="text-xs font-medium">{cell.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{cell.members_count} membros</span>
                                                            <ChevronRight className="h-3.5 w-3.5" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
