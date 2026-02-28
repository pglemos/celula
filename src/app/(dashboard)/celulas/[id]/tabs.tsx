"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTrainingCompetency } from "@/lib/actions/cell-advanced";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Plus, UserCheck, UserX, Target, BookOpen,
    Phone, CheckCircle2, Clock, AlertTriangle, ArrowRightLeft, Save
} from "lucide-react";
import Link from "next/link";
import { MultiplicationDistributor } from "./multiplication-distributor";

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
    offering_amount?: number | null;
    theme: string | null;
    meeting_attendance: Array<{
        id: string;
        present: boolean;
        is_visitor: boolean;
        person: { id: string; full_name: string } | null;
    }>;
}

interface Training {
    id: string;
    person: { id: string; full_name: string; phone: string | null } | null;
    competencies: Record<string, boolean>;
    status: string;
    start_date: string;
    completion_date: string | null;
}

interface Followup {
    id: string;
    person: { id: string; full_name: string; phone: string | null } | null;
    assigned: { id: string; full_name: string } | null;
    status: string;
    first_visit_date: string;
    contact_attempts: number;
}

interface MultiplicationPlan {
    id: string;
    target_date: string;
    new_cell_name: string | null;
    new_leader: { id: string; full_name: string } | null;
    status: string;
    member_distribution: { original: string[]; new: string[] };
}

const COMPETENCY_LABELS: Record<string, string> = {
    lideranca_louvor: "Liderança de Louvor",
    lideranca_palavra: "Liderança da Palavra",
    acolhimento_visitantes: "Acolhimento de Visitantes",
    preparo_estudo: "Preparo do Estudo",
    organizacao_reuniao: "Organização da Reunião",
    cuidado_pastoral: "Cuidado Pastoral",
    evangelismo: "Evangelismo",
    multiplicacao: "Visão de Multiplicação",
    relatorio_semanal: "Relatório Semanal",
    relacionamento_supervisor: "Relacionamento com Supervisor",
};

const FOLLOWUP_STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    contacted: "Contatado",
    returning: "Retornando",
    integrated: "Integrado",
    lost: "Perdido",
};

const FOLLOWUP_STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    contacted: "bg-blue-100 text-blue-700",
    returning: "bg-purple-100 text-purple-700",
    integrated: "bg-emerald-100 text-emerald-700",
    lost: "bg-red-100 text-red-700",
};

export function CellDetailTabs({
    cellId,
    members,
    meetings,
    membersCount,
    training = [],
    followups = [],
    multiplicationPlan,
    maxParticipants = 15,
}: {
    cellId: string;
    members: Member[];
    meetings: Meeting[];
    membersCount: number;
    training?: Training[];
    followups?: Followup[];
    multiplicationPlan?: MultiplicationPlan | null;
    maxParticipants?: number;
}) {
    const router = useRouter();
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const handleCompetencyToggle = async (trainingId: string, key: string, checked: boolean) => {
        const loadingKey = `${trainingId}-${key}`;
        setLoadingMap(prev => ({ ...prev, [loadingKey]: true }));
        try {
            await updateTrainingCompetency(trainingId, key, checked);
            router.refresh();
        } catch (error) {
            console.error("Erro ao atualizar competência:", error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    return (
        <Tabs defaultValue="participantes" className="animate-fade-in-up" style={{ animationDelay: "350ms" }}>
            <TabsList className="bg-secondary/50 flex-wrap">
                <TabsTrigger value="participantes">Participantes</TabsTrigger>
                <TabsTrigger value="reunioes">Reuniões</TabsTrigger>
                <TabsTrigger value="visitantes">
                    Visitantes
                    {followups.filter(f => f.status === "pending").length > 0 && (
                        <Badge variant="destructive" className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] rounded-full">
                            {followups.filter(f => f.status === "pending").length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="treinamento">Treinamento</TabsTrigger>
                <TabsTrigger value="multiplicacao">Multiplicação</TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="participantes" className="mt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{membersCount} participantes</p>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" />Adicionar
                    </Button>
                </div>
                {members.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            Nenhum participante.
                        </CardContent>
                    </Card>
                ) : (
                    members.map((m) => {
                        if (!m.person) return null;
                        const initials = m.person.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("");
                        return (
                            <Link href={`/membros/${m.person.id}`} key={m.id}>
                                <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/60 cursor-pointer">
                                    <Avatar className="h-9 w-9 border border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{m.person.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {m.person.phone || "—"}
                                            {m.role !== "participant" && (
                                                <span className="ml-2 text-primary font-medium">
                                                    {m.role === "trainee" ? "• Líder em Treinamento" : "• Futuro Anfitrião"}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <MembershipBadge
                                        status={m.person.membership_status as "member" | "baptized_non_member" | "non_baptized" | "visitor"}
                                    />
                                </div>
                            </Link>
                        );
                    })
                )}
            </TabsContent>

            {/* Meetings Tab */}
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
                        const visitors = meeting.meeting_attendance?.filter((a) => a.is_visitor).length || 0;
                        const pct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0;
                        return (
                            <Card key={meeting.id} className="glass-card border-border/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold">
                                            {new Date(meeting.meeting_date).toLocaleDateString("pt-BR", {
                                                weekday: "short", day: "numeric", month: "short"
                                            })}
                                        </p>
                                        <Badge variant="outline" className="text-xs text-emerald-400 bg-emerald-400/10 border-none">
                                            {pct}%
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <UserCheck className="h-3 w-3" /> {presentAtt}/{totalAtt}
                                        </span>
                                        {visitors > 0 && (
                                            <span className="flex items-center gap-1 text-blue-500">
                                                <Plus className="h-3 w-3" /> {visitors} visitante{visitors > 1 ? "s" : ""}
                                            </span>
                                        )}
                                        {meeting.gods_presence && (
                                            <span>{"⭐".repeat(meeting.gods_presence)}</span>
                                        )}
                                        {meeting.decisions_for_christ ? (
                                            <span className="text-pink-500 font-medium">{meeting.decisions_for_christ} decisão(ões)</span>
                                        ) : null}
                                        {meeting.offering_amount ? (
                                            <span>R$ {Number(meeting.offering_amount).toFixed(2)}</span>
                                        ) : null}
                                    </div>
                                    {meeting.theme && (
                                        <p className="text-xs text-muted-foreground/70 mt-1">Tema: {meeting.theme}</p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </TabsContent>

            {/* Visitors Follow-up Tab */}
            <TabsContent value="visitantes" className="mt-4 space-y-3">
                {followups.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            <UserX className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>Nenhum visitante com follow-up pendente.</p>
                            <p className="text-xs mt-1">Visitantes registrados nas reuniões aparecerão aqui automaticamente.</p>
                        </CardContent>
                    </Card>
                ) : (
                    followups.map((f) => (
                        <Card key={f.id} className="glass-card border-border/50">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                                    <UserCheck className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{f.person?.full_name || "—"}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {f.person?.phone || "Sem telefone"}
                                        {f.assigned && ` • Responsável: ${f.assigned.full_name}`}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/70">
                                        1ª visita: {new Date(f.first_visit_date).toLocaleDateString("pt-BR")}
                                        {f.contact_attempts > 0 && ` • ${f.contact_attempts} tentativa(s)`}
                                    </p>
                                </div>
                                <Badge className={`text-[10px] ${FOLLOWUP_STATUS_COLORS[f.status] || ""}`}>
                                    {FOLLOWUP_STATUS_LABELS[f.status] || f.status}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))
                )}
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="treinamento" className="mt-4 space-y-4">
                {training.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>Nenhum líder em treinamento nesta célula.</p>
                        </CardContent>
                    </Card>
                ) : (
                    training.map((t) => {
                        const total = Object.keys(t.competencies || {}).length;
                        const completed = Object.values(t.competencies || {}).filter(Boolean).length;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                        return (
                            <Card key={t.id} className="glass-card border-border/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            {t.person?.full_name || "—"}
                                        </span>
                                        <Badge variant={t.status === "completed" ? "default" : "outline"} className="text-[10px]">
                                            {t.status === "completed" ? "✅ Concluído" : `${pct}% concluído`}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {/* Progress Bar */}
                                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    {/* Competency Checklist */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                                        {Object.entries(COMPETENCY_LABELS).map(([key, label]) => {
                                            const isDone = !!(t.competencies && t.competencies[key]);
                                            const loadingKey = `${t.id}-${key}`;
                                            return (
                                                <div key={key} className="flex items-center gap-2 text-xs">
                                                    <Checkbox
                                                        checked={isDone}
                                                        disabled={loadingMap[loadingKey]}
                                                        onCheckedChange={(checked) => handleCompetencyToggle(t.id, key, !!checked)}
                                                        className="h-3.5 w-3.5"
                                                    />
                                                    <span className={isDone ? "text-foreground" : "text-muted-foreground"}>
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        Início: {new Date(t.start_date).toLocaleDateString("pt-BR")}
                                        {t.completion_date && ` • Conclusão: ${new Date(t.completion_date).toLocaleDateString("pt-BR")}`}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </TabsContent>

            {/* Multiplication Tab */}
            <TabsContent value="multiplicacao" className="mt-4 space-y-4">
                {/* Progress */}
                <Card className="glass-card border-border/50">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                <p className="text-sm font-semibold">Progresso para Multiplicação</p>
                            </div>
                            <span className="text-sm font-bold text-primary">{membersCount}/{maxParticipants}</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
                                style={{ width: `${Math.min(100, (membersCount / maxParticipants) * 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {membersCount >= maxParticipants
                                ? "🎉 Célula pronta para multiplicação!"
                                : `Faltam ${maxParticipants - membersCount} participantes para atingir a meta.`}
                        </p>
                    </CardContent>
                </Card>

                {/* Multiplication Plan */}
                {multiplicationPlan ? (
                    <Card className="glass-card border-border/50 border-l-4 border-l-primary/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">📋 Plano de Multiplicação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Data Alvo</p>
                                    <p className="font-medium">
                                        {new Date(multiplicationPlan.target_date).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Nova Célula</p>
                                    <p className="font-medium">{multiplicationPlan.new_cell_name || "A definir"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Novo Líder</p>
                                    <p className="font-medium">{multiplicationPlan.new_leader?.full_name || "A definir"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <Badge variant="outline" className="text-xs capitalize">{multiplicationPlan.status}</Badge>
                                </div>
                            </div>

                            {/* Visual distribution */}
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                                    Distribuição de Participantes
                                </p>
                                <MultiplicationDistributor
                                    planId={multiplicationPlan.id}
                                    members={members}
                                    initialDistribution={multiplicationPlan.member_distribution}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-6 text-center text-muted-foreground text-sm">
                            {membersCount >= maxParticipants
                                ? "Crie um plano de multiplicação para esta célula."
                                : "Um plano de multiplicação pode ser criado quando a célula atingir a meta de participantes."}
                        </CardContent>
                    </Card>
                )}
            </TabsContent>
        </Tabs>
    );
}
