"use client";

import { ArrowLeft, Phone, Mail, MapPin, Calendar, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMembers } from "@/lib/mock-data";
import Link from "next/link";
import { use } from "react";

export default function MemberDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const member = mockMembers.find((m) => m.id === id) || mockMembers[0];
    const initials = member.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("");

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{member.full_name}</h1>
                    <p className="text-sm text-muted-foreground">{member.cell_name}</p>
                </div>
            </div>

            {/* Profile Card */}
            <Card className="glass-card border-border/50 animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <h2 className="text-xl font-bold">{member.full_name}</h2>
                                <MembershipBadge status={member.membership_status} />
                            </div>
                            <div className="grid gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Phone className="h-4 w-4" />
                                    {member.phone}
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Mail className="h-4 w-4" />
                                    {member.email}
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <MapPin className="h-4 w-4" />
                                    {member.neighborhood}, Belo Horizonte - MG
                                </div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <CircleDot className="h-4 w-4" />
                                    {member.cell_name}
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Editar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="envolvimento" className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <TabsList className="bg-secondary/50">
                    <TabsTrigger value="envolvimento">Envolvimento</TabsTrigger>
                    <TabsTrigger value="celulas">Células</TabsTrigger>
                    <TabsTrigger value="cursos">Cursos</TabsTrigger>
                    <TabsTrigger value="contribuicoes">Contribuições</TabsTrigger>
                </TabsList>
                <TabsContent value="envolvimento" className="mt-4 space-y-3">
                    {[
                        { date: "26/02/2026", event: "Presença na célula Jovens Norte", type: "cell" },
                        { date: "23/02/2026", event: "Presença no culto dominical", type: "worship" },
                        { date: "19/02/2026", event: "Matrícula no curso Escola de Líderes", type: "course" },
                        { date: "16/02/2026", event: "Presença na célula Jovens Norte", type: "cell" },
                        { date: "14/02/2026", event: "Contribuição — Dízimo R$350,00", type: "contribution" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm">{item.event}</p>
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                                {item.type === "cell" ? "Célula" : item.type === "worship" ? "Culto" : item.type === "course" ? "Curso" : "Financeiro"}
                            </Badge>
                        </div>
                    ))}
                </TabsContent>
                <TabsContent value="celulas" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardHeader><CardTitle className="text-sm">Célula Atual</CardTitle></CardHeader>
                        <CardContent>
                            <p className="font-semibold">{member.cell_name}</p>
                            <p className="text-sm text-muted-foreground">Participante desde Jan 2025</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="cursos" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            Nenhum curso matriculado no momento.
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="contribuicoes" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            Histórico de contribuições será exibido aqui.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
