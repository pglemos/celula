"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTrainingCompetency } from "@/lib/actions/cell-advanced";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    Plus, UserCheck, UserX, Target, BookOpen,
    Phone, CheckCircle2, Clock, AlertTriangle, ArrowRightLeft, Save,
    Zap, ChevronRight, Star
} from "lucide-react";
import Link from "next/link";
import { MultiplicationDistributor } from "./multiplication-distributor";
import { cn } from "@/lib/utils";

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
            <TabsContent value="participantes" className="mt-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Membros e Frequentadores</h3>
                    <Button size="sm" className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-xl gap-2 h-9 px-4">
                        <Plus className="h-4 w-4" /> Novo Membro
                    </Button>
                </div>

                <div className="grid gap-3">
                    {members.map((m) => (
                        <Card key={m.id} className="glass-card border-border/50 group">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                        <AvatarFallback className="bg-slate-100 font-bold text-slate-400">
                                            {m.person?.full_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-700">{m.person?.full_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <MembershipBadge status={(m.person?.membership_status as any) || "visitante"} />
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter bg-secondary/30 px-2 py-0.5 rounded-full">
                                                {m.role === 'leader' ? 'LÍDER' : 'MEMBRO'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/app/membros/${m.person?.id}/edit`}>
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-[11px] font-bold border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 gap-2">
                                            Editar Cadastro
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            {/* Meetings/Acontecimentos Tab */}
            <TabsContent value="reunioes" className="mt-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Histórico de Reuniões</h3>
                    <Link href={`/celulas/${cellId}/reuniao`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-xl gap-2 h-9 px-4">
                            <Plus className="h-4 w-4" /> Lançar Frequência
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-3">
                    {meetings.length === 0 ? (
                        <div className="p-12 text-center bg-secondary/10 rounded-[32px] border-2 border-dashed border-border/20">
                            <p className="text-sm text-muted-foreground">Nenhuma reunião registrada ainda.</p>
                        </div>
                    ) : (
                        meetings.map((m) => (
                            <Card key={m.id} className="glass-card border-border/50 hover:border-primary/30 transition-all group">
                                <CardContent className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                                            {new Date(m.meeting_date).getDate()}<br />
                                            {new Date(m.meeting_date).toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '')}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">{m.theme || "Reunião de Célula"}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                                                    {m.meeting_attendance.filter(a => a.present).length} PRESENTES
                                                </span>
                                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                                                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {m.gods_presence || 0}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/celulas/${cellId}/reuniao?edit=${m.id}`}>
                                            <Button variant="outline" size="sm" className="rounded-xl h-9 text-[11px] font-bold border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50">
                                                Editar Relatório
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 group-hover:text-primary">
                                            <ArrowRightLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </TabsContent>

            {/* Visitors Follow-up Tab */}
            {/* ... lines 257-291 ... */}

            {/* Training Tab */}
            {/* ... lines 294-357 ... */}

            {/* Multiplication Tab */}
            <TabsContent value="multiplicacao" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50 overflow-hidden">
                    <CardHeader className="bg-indigo-500/5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-indigo-500" /> Planejamento de Multiplicação
                                </CardTitle>
                                <CardDescription>Siga os 4 passos para planejar o crescimento do grupo</CardDescription>
                            </div>
                            <Badge className="bg-indigo-500">PASSO 1 DE 4</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Step 1: Strategy */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. Qual a Estratégia?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50/50 cursor-pointer">
                                        <p className="font-bold text-indigo-700 text-sm">Divisão Simétrica</p>
                                        <p className="text-[10px] text-indigo-600/70 mt-1">O grupo se divide ao meio, gerando duas novas células equilibradas.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer">
                                        <p className="font-bold text-slate-600 text-sm">Ninho (Célula Mãe/Filha)</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Um grupo menor sai para formar a nova célula, mantendo a base.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border/30">
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. Novos Líderes</h4>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selecione quem assumirá o novo grupo</Label>
                                    <Select>
                                        <SelectTrigger className="bg-secondary/50 border-none rounded-xl">
                                            <SelectValue placeholder="Selecione um líder em treinamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {members.filter(m => m.role !== 'leader').map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.person?.full_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 font-bold gap-2">
                                    Próximo Passo <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-4 gap-2 px-2">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className={cn("h-1.5 rounded-full", s === 1 ? "bg-indigo-500" : "bg-slate-100")} />
                    ))}
                </div>
            </TabsContent>

            {/* Indicadores Tab */}
            <TabsContent value="indicadores" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="glass-card border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-500" /> Presença Média (Últimas 6)
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
                                <BookOpen className="h-4 w-4 text-emerald-500" /> Saúde do Grupo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Índice de Discipulado</span>
                                <span className="font-bold">75%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "75%" }} />
                            </div>
                            <div className="pt-2 grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-700 font-bold text-center">3 MEMBROS EM L2</div>
                                <div className="p-2 rounded-lg bg-blue-50 text-[10px] text-blue-700 font-bold text-center">5 MEMBROS EM L1</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">📚 Progresso de Cursos (Audit Parity)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/30 bg-secondary/10">
                                        <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Pessoa</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Curso</th>
                                        {[1, 2, 3, 4, 5, 6, 7].map(l => (
                                            <th key={l} className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">L{l}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.slice(0, 5).map((m, i) => (
                                        <tr key={m.id} className="border-b border-border/10 last:border-none hover:bg-secondary/5 transition-colors">
                                            <td className="p-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-7 w-7 border border-white shadow-sm">
                                                        <AvatarFallback className="text-[10px] bg-slate-100">{m.person?.full_name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{m.person?.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="text-[9px] h-5 bg-indigo-50/50 text-indigo-600 border-indigo-100">
                                                    {i % 2 === 0 ? "CRESÇA 1" : "LIDERE 2"}
                                                </Badge>
                                            </td>
                                            {[1, 2, 3, 4, 5, 6, 7].map(l => (
                                                <td key={l} className="p-4 text-center">
                                                    <div className={cn(
                                                        "h-4 w-4 rounded-full mx-auto flex items-center justify-center",
                                                        l <= (i + 3) ? "bg-emerald-500 text-white" : "bg-slate-100"
                                                    )}>
                                                        {l <= (i + 3) && <CheckCircle2 className="h-2.5 w-2.5" />}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
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

            {/* Profile Tab */}
            <TabsContent value="config" className="mt-4 space-y-4">
                <Card className="glass-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Informações Básicas da Célula</CardTitle>
                        <CardDescription>Dados públicos e configurações de funcionamento</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome da Célula</Label>
                                <Input defaultValue={membersCount > 0 ? members[0]?.role : ""} className="bg-secondary border-none h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacidade</Label>
                                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/20 h-11">
                                    <Checkbox defaultChecked id="public-map" />
                                    <label htmlFor="public-map" className="text-xs font-semibold text-slate-600">Visível no Mapa Público</label>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-border/30">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lote/Vaga Máxima</Label>
                                <Input defaultValue={maxParticipants} type="number" className="bg-secondary border-none h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dia da Semana</Label>
                                <Select defaultValue="5">
                                    <SelectTrigger className="bg-secondary border-none h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Segunda</SelectItem>
                                        <SelectItem value="2">Terça</SelectItem>
                                        <SelectItem value="3">Quarta</SelectItem>
                                        <SelectItem value="4">Quinta</SelectItem>
                                        <SelectItem value="5">Sexta</SelectItem>
                                        <SelectItem value="6">Sábado</SelectItem>
                                        <SelectItem value="0">Domingo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horário</Label>
                                <Input type="time" defaultValue="20:00" className="bg-secondary border-none h-11 rounded-xl" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold px-10 h-11 rounded-xl shadow-lg shadow-indigo-200">
                                Salvar Configurações
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
