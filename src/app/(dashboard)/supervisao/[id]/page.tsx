import {
    ArrowLeft, Network, Users, TrendingUp, ClipboardCheck,
    Eye, Calendar, Star, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { getSupervisionById } from "@/lib/actions/supervisions";
import { getSupervisionVisits, getSupervisionMeetings, getSupervisionDashboard } from "@/lib/actions/supervision-advanced";
import { cn } from "@/lib/utils";
import Link from "next/link";

const dotColors = {
    green: "bg-emerald-400",
    yellow: "bg-amber-400",
    red: "bg-red-400",
};

const healthColors = {
    green: "text-emerald-600 bg-emerald-100",
    yellow: "text-amber-600 bg-amber-100",
    red: "text-red-600 bg-red-100",
};

export default async function SupervisionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [supervision, visits, meetings, dashboard] = await Promise.all([
        getSupervisionById(id),
        getSupervisionVisits(id).catch(() => []),
        getSupervisionMeetings(id).catch(() => []),
        getSupervisionDashboard(id).catch(() => ({
            totalCells: 0,
            totalMembers: 0,
            activeRate: 0,
            avgPresence: 0,
            cellStats: [],
        })),
    ]);

    const overallHealth = dashboard.avgPresence >= 80 ? "green" : dashboard.avgPresence >= 60 ? "yellow" : "red";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/supervisao">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{supervision.name}</h1>
                        <div className={cn("px-2 py-0.5 rounded-full text-xs font-medium", healthColors[overallHealth])}>
                            {dashboard.avgPresence}% presença
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Supervisor: {supervision.supervisor?.full_name || "—"}
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KpiCard title="Células" value={dashboard.totalCells} icon={Network} delay={0} />
                <KpiCard title="Membros" value={dashboard.totalMembers} icon={Users} delay={100} />
                <KpiCard
                    title="Taxa Ativa"
                    value={`${dashboard.activeRate}%`}
                    icon={TrendingUp}
                    trend={{ value: dashboard.activeRate >= 80 ? "Bom" : "Atenção", positive: dashboard.activeRate >= 80 }}
                    delay={200}
                />
                <KpiCard
                    title="Visitas"
                    value={visits.length}
                    icon={Eye}
                    delay={300}
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="celulas" className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
                <TabsList className="bg-secondary/50">
                    <TabsTrigger value="celulas">Células</TabsTrigger>
                    <TabsTrigger value="visitas">Visitas</TabsTrigger>
                    <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                </TabsList>

                {/* Cells Ranking Tab */}
                <TabsContent value="celulas" className="mt-4 space-y-3">
                    {dashboard.cellStats.length === 0 ? (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                Nenhuma célula nesta supervisão.
                            </CardContent>
                        </Card>
                    ) : (
                        dashboard.cellStats.map((cell, i) => {
                            const cellHealth = cell.avgPresence >= 80 ? "green" :
                                cell.avgPresence >= 60 ? "yellow" : "red";
                            return (
                                <Link href={`/celulas/${cell.id}`} key={cell.id}>
                                    <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 animate-fade-in-up"
                                        style={{ animationDelay: `${i * 60}ms` }}>
                                        <CardContent className="flex items-center gap-4 p-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                                                #{i + 1}
                                            </div>
                                            <div className={cn("h-2.5 w-2.5 rounded-full", dotColors[cellHealth])} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{cell.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {cell.members} membros
                                                    {cell.lastMeetingDate && ` • Última: ${new Date(cell.lastMeetingDate).toLocaleDateString("pt-BR")}`}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className={`text-xs ${cellHealth === "green" ? "text-emerald-500 bg-emerald-500/10" :
                                                cellHealth === "yellow" ? "text-amber-500 bg-amber-500/10" :
                                                    "text-red-500 bg-red-500/10"
                                                } border-none`}>
                                                {cell.avgPresence}%
                                            </Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })
                    )}
                </TabsContent>

                {/* Visits Tab */}
                <TabsContent value="visitas" className="mt-4 space-y-3">
                    {visits.length === 0 ? (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                <Eye className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p>Nenhuma visita de supervisão registrada.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        visits.map((visit: any) => {
                            const checklist = visit.checklist || {};
                            const checklistTotal = Object.keys(checklist).length;
                            const checklistDone = Object.values(checklist).filter(Boolean).length;
                            return (
                                <Card key={visit.id} className="glass-card border-border/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold">{visit.cell?.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Visitado por: {visit.visitor?.full_name || "—"}
                                                </p>
                                                {visit.notes && (
                                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{visit.notes}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[11px] text-muted-foreground">
                                                    {new Date(visit.visit_date).toLocaleDateString("pt-BR")}
                                                </span>
                                                {visit.rating && (
                                                    <div className="flex items-center gap-0.5 mt-1 justify-end">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} className={cn(
                                                                "h-3 w-3",
                                                                i < visit.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20"
                                                            )} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {checklistTotal > 0 && (
                                            <div className="mt-2">
                                                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-primary transition-all"
                                                        style={{ width: `${(checklistDone / checklistTotal) * 100}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {checklistDone}/{checklistTotal} itens do checklist
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>

                {/* Meetings Tab */}
                <TabsContent value="reunioes" className="mt-4 space-y-3">
                    {meetings.length === 0 ? (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p>Nenhuma reunião de supervisão registrada.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        meetings.map((meeting: any) => {
                            const totalAtt = meeting.supervision_meeting_attendance?.length || 0;
                            const presentAtt = meeting.supervision_meeting_attendance?.filter((a: any) => a.present).length || 0;
                            return (
                                <Card key={meeting.id} className="glass-card border-border/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {new Date(meeting.meeting_date).toLocaleDateString("pt-BR", {
                                                        weekday: "long", day: "numeric", month: "long"
                                                    })}
                                                </p>
                                                {meeting.agenda && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Pauta: {meeting.agenda}
                                                    </p>
                                                )}
                                                {meeting.minutes && (
                                                    <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">
                                                        {meeting.minutes}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {presentAtt}/{totalAtt} presentes
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
