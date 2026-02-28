import { ArrowLeft, Users, Calendar, Clock, MapPin, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCellById, getCellMeetings } from "@/lib/actions/cells";
import { MEETING_DAYS } from "@/lib/constants";
import { CellDetailTabs } from "./tabs";
import Link from "next/link";

export default async function CellDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const cell = await getCellById(id);
    const meetings = await getCellMeetings(id);
    const membersCount = cell.cell_members?.length || 0;

    const infoCards = [
        { icon: Users, label: "Participantes", value: membersCount },
        { icon: Calendar, label: "Dia", value: cell.meeting_day ? MEETING_DAYS[cell.meeting_day] || cell.meeting_day : "—" },
        { icon: Clock, label: "Horário", value: cell.meeting_time?.slice(0, 5) || "—" },
        { icon: MapPin, label: "Bairro", value: cell.address_neighborhood || "—" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/celulas">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{cell.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Líder: {cell.leader?.full_name || "—"}
                        {cell.co_leader && ` • Co-líder: ${cell.co_leader.full_name}`}
                    </p>
                </div>
                <Link href={`/celulas/${id}/reuniao`}>
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                        <ClipboardCheck className="h-4 w-4" />
                        Registrar Reunião
                    </Button>
                </Link>
            </div>

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

            <CellDetailTabs
                cellId={id}
                members={cell.cell_members || []}
                meetings={meetings}
                membersCount={membersCount}
            />
        </div>
    );
}
