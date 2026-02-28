"use client";

import { ArrowLeft, Users, Calendar, Clock, MapPin, Plus, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge, MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCells, mockMembers } from "@/lib/mock-data";
import Link from "next/link";
import { use } from "react";

export default function CellDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const cell = mockCells.find((c) => c.id === id) || mockCells[0];
    const cellMembers = mockMembers.slice(0, cell.members_count > 8 ? 8 : cell.members_count);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/celulas">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">{cell.name}</h1>
                        <StatusBadge status={cell.health} />
                    </div>
                    <p className="text-sm text-muted-foreground">Líder: {cell.leader}</p>
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
                {[
                    { icon: Users, label: "Participantes", value: cell.members_count },
                    { icon: Calendar, label: "Dia", value: cell.meeting_day },
                    { icon: Clock, label: "Horário", value: cell.meeting_time },
                    { icon: MapPin, label: "Bairro", value: cell.neighborhood },
                ].map((item, i) => (
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
            <Tabs defaultValue="participantes" className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
                <TabsList className="bg-secondary/50">
                    <TabsTrigger value="participantes">Participantes</TabsTrigger>
                    <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                    <TabsTrigger value="multiplicacao">Multiplicação</TabsTrigger>
                </TabsList>

                <TabsContent value="participantes" className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">{cellMembers.length} participantes</p>
                        <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Adicionar</Button>
                    </div>
                    {cellMembers.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                            <Avatar className="h-9 w-9 border border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {m.full_name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{m.full_name}</p>
                                <p className="text-xs text-muted-foreground">{m.phone}</p>
                            </div>
                            <MembershipBadge status={m.membership_status} />
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="reunioes" className="mt-4 space-y-3">
                    {[
                        { date: "26/02/2026", presence: 10, total: 12, gods_presence: 4, decisions: 1 },
                        { date: "19/02/2026", presence: 11, total: 12, gods_presence: 5, decisions: 2 },
                        { date: "12/02/2026", presence: 9, total: 12, gods_presence: 3, decisions: 0 },
                    ].map((meeting, i) => (
                        <Card key={i} className="glass-card border-border/50">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold">{meeting.date}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {meeting.presence}/{meeting.total} presentes • {"⭐".repeat(meeting.gods_presence)}  • {meeting.decisions} decisões
                                    </p>
                                </div>
                                <Badge variant="outline" className="text-xs text-emerald-400 bg-emerald-400/10 border-none">
                                    {Math.round((meeting.presence / meeting.total) * 100)}%
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="multiplicacao" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            <p>Planejamento de multiplicação será habilitado quando a célula atingir 12+ participantes.</p>
                            <p className="mt-2 text-primary font-medium">{cell.members_count}/12 participantes</p>
                            <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (cell.members_count / 12) * 100)}%` }} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
