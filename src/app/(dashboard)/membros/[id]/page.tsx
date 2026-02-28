import {
    ArrowLeft, Phone, Mail, MapPin, CircleDot, Calendar,
    Shield, FileText, Clock, Heart, GraduationCap, HandCoins,
    UserMinus, Award, Pencil
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getPersonById } from "@/lib/actions/people";
import { getPersonTimeline, getPersonTransfers } from "@/lib/actions/people-advanced";
import Link from "next/link";

const TIMELINE_ICONS: Record<string, typeof CircleDot> = {
    cell_joined: CircleDot,
    cell_left: UserMinus,
    course_enrolled: GraduationCap,
    course_completed: Award,
    event_attended: Calendar,
    contribution: HandCoins,
    baptism: Heart,
    conversion: Heart,
    transfer: FileText,
    badge_earned: Award,
    level_up: Award,
};

const TIMELINE_COLORS: Record<string, string> = {
    cell_joined: "bg-emerald-500/15 text-emerald-500",
    cell_left: "bg-red-500/15 text-red-500",
    course_enrolled: "bg-blue-500/15 text-blue-500",
    course_completed: "bg-purple-500/15 text-purple-500",
    event_attended: "bg-amber-500/15 text-amber-500",
    contribution: "bg-yellow-500/15 text-yellow-500",
    baptism: "bg-cyan-500/15 text-cyan-500",
    conversion: "bg-pink-500/15 text-pink-500",
    transfer: "bg-gray-500/15 text-gray-500",
    badge_earned: "bg-orange-500/15 text-orange-500",
    level_up: "bg-indigo-500/15 text-indigo-500",
};

export default async function MemberDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [member, timeline, transfers] = await Promise.all([
        getPersonById(id),
        getPersonTimeline(id).catch(() => []),
        getPersonTransfers(id).catch(() => []),
    ]);

    const initials = member.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("");
    const cellName = member.cell_members?.[0]?.cells?.name || "Sem célula";
    const age = member.birth_date
        ? Math.floor((Date.now() - new Date(member.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">{member.full_name}</h1>
                    <p className="text-sm text-muted-foreground">{cellName}</p>
                </div>
                <Link href={`/membros/${id}/editar`}>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                    </Button>
                </Link>
            </div>

            {/* Profile Card */}
            <Card className="glass-card border-border/50 animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            {member.photo_url && <AvatarImage src={member.photo_url} alt={member.full_name} />}
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-4 text-center sm:text-left">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <h2 className="text-xl font-bold">{member.preferred_name || member.full_name}</h2>
                                <MembershipBadge
                                    status={member.membership_status as "member" | "baptized_non_member" | "non_baptized" | "visitor"}
                                />
                            </div>
                            <div className="grid gap-2 text-sm text-muted-foreground">
                                {member.phone && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Phone className="h-4 w-4" />{member.phone}
                                    </div>
                                )}
                                {member.email && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Mail className="h-4 w-4" />{member.email}
                                    </div>
                                )}
                                {member.address_neighborhood && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <MapPin className="h-4 w-4" />
                                        {[member.address_street, member.address_number].filter(Boolean).join(", ")}
                                        {member.address_street ? " — " : ""}
                                        {member.address_neighborhood}, {member.address_city || "BH"} - {member.address_state || "MG"}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <CircleDot className="h-4 w-4" />{cellName}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-xs text-muted-foreground">
                                {member.birth_date && (
                                    <span>🎂 {new Date(member.birth_date).toLocaleDateString("pt-BR")}{age !== null ? ` (${age} anos)` : ""}</span>
                                )}
                                {member.gender && (
                                    <span>• {member.gender === "M" ? "Masculino" : member.gender === "F" ? "Feminino" : "Outro"}</span>
                                )}
                                {member.baptism_date && (
                                    <span>• 💧 Batismo: {new Date(member.baptism_date).toLocaleDateString("pt-BR")}</span>
                                )}
                                {member.conversion_date && (
                                    <span>• ✝️ Conversão: {new Date(member.conversion_date).toLocaleDateString("pt-BR")}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="timeline" className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <TabsList className="bg-secondary/50 flex-wrap">
                    <TabsTrigger value="timeline">Cronologia</TabsTrigger>
                    <TabsTrigger value="celulas">Células</TabsTrigger>
                    <TabsTrigger value="presencas">Presenças</TabsTrigger>
                    <TabsTrigger value="dados">Dados</TabsTrigger>
                    <TabsTrigger value="lgpd">LGPD</TabsTrigger>
                </TabsList>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="mt-4">
                    {timeline.length > 0 ? (
                        <div className="space-y-3">
                            {timeline.map((event: any) => {
                                const Icon = TIMELINE_ICONS[event.event_type] || Clock;
                                const color = TIMELINE_COLORS[event.event_type] || "bg-gray-500/15 text-gray-500";
                                return (
                                    <Card key={event.id} className="glass-card border-border/50">
                                        <CardContent className="flex items-start gap-4 p-4">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm">{event.title}</p>
                                                {event.description && (
                                                    <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                {new Date(event.event_date).toLocaleDateString("pt-BR")}
                                            </span>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-8 text-center text-muted-foreground text-sm">
                                <Clock className="h-8 w-8 mx-auto mb-3 opacity-30" />
                                <p>Nenhum evento registrado na cronologia.</p>
                                <p className="text-xs mt-1">Eventos como participação em células, cursos e batismo aparecerão aqui automaticamente.</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Transfers Section */}
                    {transfers.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Transferências / Desligamentos
                            </h3>
                            <div className="space-y-3">
                                {transfers.map((t: any) => (
                                    <Card key={t.id} className="glass-card border-border/50 border-l-4 border-l-amber-500/50">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-sm capitalize">
                                                        {t.type === "transfer_out" ? "Transferência (saída)" :
                                                            t.type === "transfer_in" ? "Transferência (entrada)" :
                                                                t.type === "dismissal" ? "Desligamento" : "Falecimento"}
                                                    </p>
                                                    {t.destination_church && (
                                                        <p className="text-xs text-muted-foreground mt-1">Destino: {t.destination_church}</p>
                                                    )}
                                                    {t.reason && (
                                                        <p className="text-xs text-muted-foreground mt-1">Motivo: {t.reason}</p>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {new Date(t.date).toLocaleDateString("pt-BR")}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Cells Tab */}
                <TabsContent value="celulas" className="mt-4 space-y-3">
                    {member.cell_members && member.cell_members.length > 0 ? (
                        member.cell_members.map((cm: any) => (
                            <Link href={`/celulas/${cm.cell_id}`} key={cm.cell_id}>
                                <Card className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                                <CircleDot className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{cm.cells?.name || "—"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {cm.cells?.category || "—"} • {
                                                        cm.role === "participant" ? "Participante" :
                                                            cm.role === "trainee" ? "Líder em Treinamento" :
                                                                cm.role === "future_host" ? "Futuro Anfitrião" : cm.role
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">
                                            Desde {new Date(cm.joined_at).toLocaleDateString("pt-BR")}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                Este membro não está em nenhuma célula.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="presencas" className="mt-4">
                    {member.meeting_attendance && member.meeting_attendance.length > 0 ? (
                        <div className="space-y-2">
                            {member.meeting_attendance.slice(0, 20).map((att: any) => {
                                const meetingDate = att.cell_meetings?.meeting_date
                                    ? new Date(att.cell_meetings.meeting_date)
                                    : null;
                                return (
                                    <Card key={att.id} className="glass-card border-border/50">
                                        <CardContent className="flex items-center gap-3 p-3">
                                            <div className={`h-2.5 w-2.5 rounded-full ${att.present ? "bg-emerald-500" : "bg-red-400"}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {att.cell_meetings?.cells?.name || "Reunião de Célula"}
                                                </p>
                                                {att.cell_meetings?.theme && (
                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                        {att.cell_meetings.theme}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-medium ${att.present ? "text-emerald-600" : "text-red-400"}`}>
                                                    {att.present ? "Presente" : "Ausente"}
                                                </span>
                                                {meetingDate && (
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {meetingDate.toLocaleDateString("pt-BR")}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                Nenhuma presença registrada ainda.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Full Data Tab */}
                <TabsContent value="dados" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5 space-y-0">
                            {[
                                { label: "Nome completo", value: member.full_name },
                                { label: "Nome preferido", value: member.preferred_name },
                                { label: "Email", value: member.email },
                                { label: "Telefone", value: member.phone },
                                { label: "WhatsApp", value: member.whatsapp },
                                { label: "Data de nascimento", value: member.birth_date ? new Date(member.birth_date).toLocaleDateString("pt-BR") : null },
                                { label: "Gênero", value: member.gender === "M" ? "Masculino" : member.gender === "F" ? "Feminino" : member.gender },
                                { label: "Estado civil", value: member.marital_status },
                                { label: "Endereço", value: [member.address_street, member.address_number, member.address_complement].filter(Boolean).join(", ") || null },
                                { label: "Bairro", value: member.address_neighborhood },
                                { label: "Cidade/Estado", value: [member.address_city, member.address_state].filter(Boolean).join(" - ") || null },
                                { label: "CEP", value: member.address_zip },
                                { label: "Data de membresia", value: member.membership_date ? new Date(member.membership_date).toLocaleDateString("pt-BR") : null },
                                { label: "Data de batismo", value: member.baptism_date ? new Date(member.baptism_date).toLocaleDateString("pt-BR") : null },
                                { label: "Data de conversão", value: member.conversion_date ? new Date(member.conversion_date).toLocaleDateString("pt-BR") : null },
                                { label: "Tags", value: member.tags?.length > 0 ? member.tags.join(", ") : null },
                                { label: "Observações", value: member.notes },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between py-2.5 border-b border-border/30 last:border-0">
                                    <span className="text-xs text-muted-foreground">{item.label}</span>
                                    <span className="text-xs font-medium text-right max-w-[60%] break-words">{item.value || "—"}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LGPD Tab */}
                <TabsContent value="lgpd" className="mt-4 space-y-4">
                    <Card className="glass-card border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Conformidade LGPD
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-border/30">
                                <span className="text-sm">Consentimento para tratamento de dados</span>
                                <Badge variant={member.lgpd_consent ? "default" : "destructive"}>
                                    {member.lgpd_consent ? "✅ Concedido" : "❌ Pendente"}
                                </Badge>
                            </div>
                            {member.lgpd_consent_date && (
                                <div className="flex items-center justify-between py-2 border-b border-border/30">
                                    <span className="text-sm text-muted-foreground">Data do consentimento</span>
                                    <span className="text-sm">
                                        {new Date(member.lgpd_consent_date).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                De acordo com a Lei Geral de Proteção de Dados (LGPD), o titular dos dados
                                tem direito a solicitar a exclusão de seus dados pessoais a qualquer momento.
                                A funcionalidade de &quot;Direito ao Esquecimento&quot; pode ser executada na página de edição deste membro.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
