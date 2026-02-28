"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTrainingCompetency } from "@/lib/actions/cell-advanced";
import { Input } from "@/components/ui/input";
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
                <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
                <TabsTrigger value="historico">Ex-participantes</TabsTrigger>
                <TabsTrigger value="metas">Metas</TabsTrigger>
                <TabsTrigger value="config">Perfil</TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            {/* ... lines 156-198 ... */}

            {/* Meetings Tab */}
            {/* ... lines 201-254 ... */}

            {/* Visitors Follow-up Tab */}
            {/* ... lines 257-291 ... */}

            {/* Training Tab */}
            {/* ... lines 294-357 ... */}

            {/* Multiplication Tab */}
            {/* ... lines 360-436 ... */}

            {/* Indicadores Tab */}
            <TabsContent value="indicadores" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass-card border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-500" /> Presença Média
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-40 flex items-end gap-1.5 px-4 pb-4">
                            {[40, 65, 45, 90, 85, 95].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-lg relative group transition-all hover:bg-indigo-500/20">
                                    <div
                                        className="absolute bottom-0 inset-x-0 bg-indigo-500 rounded-t-lg transition-all duration-700"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-emerald-500" /> Conclusão de Cursos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Membros Formados</span>
                                <span className="font-bold">8/12</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "66%" }} />
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">
                                * A meta é ter 100% dos membros fixos formados no curso de Liderança.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* Ex-participantes Tab */}
            <TabsContent value="historico" className="mt-4 space-y-3">
                <Card className="glass-card border-border/50">
                    <CardContent className="p-0">
                        {[
                            { name: "Carlos Eduardo", date: "15/01/2026", reason: "Mudança de cidade" },
                            { name: "Fernanda Lima", date: "02/12/2025", reason: "Transferência para Célula Shalon" },
                        ].map((ex, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-border/30 last:border-none">
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{ex.name}</p>
                                    <p className="text-[10px] text-muted-foreground">Saiu em {ex.date}</p>
                                </div>
                                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">
                                    {ex.reason}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Metas Tab */}
            <TabsContent value="metas" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Definição de Metas Anuais</h4>
                                <p className="text-[11px] text-muted-foreground">Projeção de crescimento para {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Membros</p>
                                <p className="text-xl font-black text-slate-700">18</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Visitantes</p>
                                <p className="text-xl font-black text-slate-700">50</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Líderes</p>
                                <p className="text-xl font-black text-slate-700">02</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Perfil/Config Tab */}
            <TabsContent value="config" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50">
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-900">Configurações do Grupo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lote/Vaga Máxima</label>
                                    <Input defaultValue={maxParticipants} type="number" className="rounded-xl border-slate-200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Privacidade</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <Checkbox defaultChecked id="public" />
                                        <label htmlFor="public" className="text-xs font-semibold text-slate-600">Visível no Mapa Público</label>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button className="rounded-xl bg-indigo-600 text-white font-bold h-11 px-8 shadow-md">
                                    Salvar Alterações
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
