import {
    ArrowLeft, Users, Calendar, Clock, MapPin, ClipboardCheck,
    BookOpen, UserPlus, Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCellById, getCellMeetings } from "@/lib/actions/cells";
import { getLeaderTraining, getVisitorFollowups, getMultiplicationPlan, calculateCellHealth } from "@/lib/actions/cell-advanced";
import { MEETING_DAYS } from "@/lib/constants";
import { CellDetailTabs } from "./tabs";
import Link from "next/link";

const HEALTH_CONFIG = {
    green: { label: "Saudável", color: "bg-emerald-500", textColor: "text-emerald-600" },
    yellow: { label: "Atenção", color: "bg-amber-500", textColor: "text-amber-600" },
    red: { label: "Crítica", color: "bg-red-500", textColor: "text-red-600" },
};

export default async function CellDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [cell, meetings, training, followups, multiplicationPlan, health] = await Promise.all([
        getCellById(id),
        getCellMeetings(id),
        getLeaderTraining(id).catch(() => []),
        getVisitorFollowups(id).catch(() => []),
        getMultiplicationPlan(id).catch(() => null),
        calculateCellHealth(id).catch(() => "green" as const),
    ]);

    const membersCount = cell.cell_members?.length || 0;
    const healthConfig = HEALTH_CONFIG[health];

    const infoCards = [
        { icon: Users, label: "Participantes", value: membersCount },
        { icon: Calendar, label: "Dia", value: cell.meeting_day ? MEETING_DAYS[cell.meeting_day] || cell.meeting_day : "—" },
        { icon: Clock, label: "Horário", value: cell.meeting_time?.slice(0, 5) || "—" },
        { icon: MapPin, label: "Bairro", value: cell.address_neighborhood || "—" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/celulas">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{cell.name}</h1>
                        <div className="flex items-center gap-1.5">
                            <div className={`h-2.5 w-2.5 rounded-full ${healthConfig.color}`} />
                            <span className={`text-xs font-medium ${healthConfig.textColor}`}>
                                {healthConfig.label}
                            </span>
                        </div>
                        {cell.category && (
                            <Badge variant="outline" className="text-xs">{cell.category}</Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Líder: {cell.leader?.full_name || "—"}
                        {cell.co_leader && ` • Co-líder: ${cell.co_leader.full_name}`}
                        {cell.supervision && ` • Rede: ${cell.supervision.name}`}
                    </p>
                </div>
                <Link href={`/celulas/${id}/reuniao`}>
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                        <ClipboardCheck className="h-4 w-4" />
                        Registrar Reunião
                    </Button>
                </Link>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {infoCards.map((item, i) => (
                    <Card key={i} className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <item.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-lg font-bold">{item.value}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <CellDetailTabs
                cellId={id}
                members={cell.cell_members || []}
                meetings={meetings}
                membersCount={membersCount}
                training={training}
                followups={followups}
                multiplicationPlan={multiplicationPlan}
                maxParticipants={cell.max_participants || 15}
            />
        </div>
    );
}
