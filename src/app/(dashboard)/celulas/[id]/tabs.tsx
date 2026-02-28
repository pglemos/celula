"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Member {
    id: string;
    role: string;
    joined_at: string;
    person: {
        id: string;
        full_name: string;
        phone: string | null;
        membership_status: string;
    } | null;
}

interface Meeting {
    id: string;
    meeting_date: string;
    gods_presence: number | null;
    decisions_for_christ: number | null;
    theme: string | null;
    meeting_attendance: Array<{
        id: string;
        present: boolean;
        person: { id: string; full_name: string } | null;
    }>;
}

export function CellDetailTabs({
    cellId,
    members,
    meetings,
    membersCount,
}: {
    cellId: string;
    members: Member[];
    meetings: Meeting[];
    membersCount: number;
}) {
    return (
        <Tabs defaultValue="participantes" className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
            <TabsList className="bg-secondary/50">
                <TabsTrigger value="participantes">Participantes</TabsTrigger>
                <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                <TabsTrigger value="multiplicacao">Multiplicação</TabsTrigger>
            </TabsList>

            <TabsContent value="participantes" className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{membersCount} participantes</p>
                    <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Adicionar</Button>
                </div>
                {members.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">Nenhum participante.</CardContent>
                    </Card>
                ) : (
                    members.map((m) => {
                        if (!m.person) return null;
                        const initials = m.person.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                        return (
                            <div key={m.id} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                                <Avatar className="h-9 w-9 border border-primary/20">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{m.person.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{m.person.phone || "—"}</p>
                                </div>
                                <MembershipBadge
                                    status={m.person.membership_status as "member" | "baptized_non_member" | "non_baptized" | "visitor"}
                                />
                            </div>
                        );
                    })
                )}
            </TabsContent>

            <TabsContent value="reunioes" className="mt-4 space-y-3">
                {meetings.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            Nenhuma reunião registrada ainda.
                        </CardContent>
                    </Card>
                ) : (
                    meetings.map((meeting) => {
                        const totalAtt = meeting.meeting_attendance?.length || 0;
                        const presentAtt = meeting.meeting_attendance?.filter((a) => a.present).length || 0;
                        const pct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;
                        return (
                            <Card key={meeting.id} className="glass-card border-border/50">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">
                                            {new Date(meeting.meeting_date).toLocaleDateString("pt-BR")}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {presentAtt}/{totalAtt} presentes
                                            {meeting.gods_presence ? ` • ${"⭐".repeat(meeting.gods_presence)}` : ""}
                                            {meeting.decisions_for_christ ? ` • ${meeting.decisions_for_christ} decisões` : ""}
                                            {meeting.theme ? ` • ${meeting.theme}` : ""}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs text-emerald-400 bg-emerald-400/10 border-none">
                                        {pct}%
                                    </Badge>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </TabsContent>

            <TabsContent value="multiplicacao" className="mt-4">
                <Card className="glass-card border-border/50">
                    <CardContent className="p-6 text-center text-muted-foreground text-sm">
                        <p>Planejamento de multiplicação será habilitado quando a célula atingir 12+ participantes.</p>
                        <p className="mt-2 text-primary font-medium">{membersCount}/12 participantes</p>
                        <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (membersCount / 12) * 100)}%` }} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
