import { ArrowLeft, Phone, Mail, MapPin, CircleDot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getPersonById } from "@/lib/actions/people";
import Link from "next/link";

export default async function MemberDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const member = await getPersonById(id);
    const initials = member.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("");
    const cellName = member.cell_members?.[0]?.cells?.name || "Sem célula";

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{member.full_name}</h1>
                    <p className="text-sm text-muted-foreground">{cellName}</p>
                </div>
            </div>

            <Card className="glass-card border-border/50 animate-fade-in-up">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
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
                                    <div className="flex items-center gap-2 justify-center sm:justify-start"><Phone className="h-4 w-4" />{member.phone}</div>
                                )}
                                {member.email && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start"><Mail className="h-4 w-4" />{member.email}</div>
                                )}
                                {member.address_neighborhood && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <MapPin className="h-4 w-4" />
                                        {member.address_neighborhood}, {member.address_city || "Belo Horizonte"} - {member.address_state || "MG"}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 justify-center sm:justify-start"><CircleDot className="h-4 w-4" />{cellName}</div>
                            </div>
                            {member.birth_date && (
                                <p className="text-xs text-muted-foreground">
                                    Nascimento: {new Date(member.birth_date).toLocaleDateString("pt-BR")}
                                    {member.gender && ` • ${member.gender === "M" ? "Masculino" : member.gender === "F" ? "Feminino" : "Outro"}`}
                                </p>
                            )}
                        </div>
                        <Link href={`/membros/${id}/editar`}>
                            <Button variant="outline" size="sm">Editar</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="envolvimento" className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <TabsList className="bg-secondary/50">
                    <TabsTrigger value="envolvimento">Envolvimento</TabsTrigger>
                    <TabsTrigger value="celulas">Células</TabsTrigger>
                    <TabsTrigger value="dados">Dados Completos</TabsTrigger>
                </TabsList>
                <TabsContent value="envolvimento" className="mt-4 space-y-4">
                    {member.meeting_attendance && member.meeting_attendance.length > 0 ? (
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/40 before:to-transparent pt-2">
                            {member.meeting_attendance.map((att: any) => {
                                const meetingDate = new Date(att.cell_meetings?.meeting_date);
                                const isPresent = att.present;
                                return (
                                    <div key={att.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            {isPresent ? <CircleDot className="h-4 w-4 text-primary" /> : <div className="h-2 w-2 rounded-full bg-destructive/50" />}
                                        </div>
                                        <Card className="glass-card md:w-[calc(50%-2.5rem)] p-4 border-border/50">
                                            <div className="flex flex-col justify-between h-full">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-sm">{att.cell_meetings?.cells?.name || "Reunião de Célula"}</span>
                                                    <span className="text-xs text-muted-foreground">{meetingDate.toLocaleDateString("pt-BR")}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Status: {isPresent ? <span className="text-primary font-medium">Presente</span> : <span className="text-destructive font-medium">Ausente</span>}
                                                </p>
                                                {att.cell_meetings?.theme && (
                                                    <p className="text-xs text-muted-foreground mt-1">Tema: {att.cell_meetings.theme}</p>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                Nenhuma atividade ou presença registrada ainda.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="celulas" className="mt-4 space-y-3">
                    {member.cell_members && member.cell_members.length > 0 ? (
                        member.cell_members.map((cm: { cell_id: string; role: string; joined_at: string; cells: { id: string; name: string; category: string } | null }) => (
                            <Card key={cm.cell_id} className="glass-card border-border/50">
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-semibold text-sm">{cm.cells?.name || "—"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {cm.cells?.category || "—"} • {cm.role === "participant" ? "Participante" : cm.role}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">
                                        Desde {new Date(cm.joined_at).toLocaleDateString("pt-BR")}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="glass-card border-border/50">
                            <CardContent className="p-6 text-center text-muted-foreground text-sm">
                                Este membro não está em nenhuma célula.
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="dados" className="mt-4">
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-5 space-y-3">
                            {[
                                { label: "Nome completo", value: member.full_name },
                                { label: "Nome preferido", value: member.preferred_name },
                                { label: "Email", value: member.email },
                                { label: "Telefone", value: member.phone },
                                { label: "WhatsApp", value: member.whatsapp },
                                { label: "Endereço", value: [member.address_street, member.address_number, member.address_complement].filter(Boolean).join(", ") || null },
                                { label: "Bairro", value: member.address_neighborhood },
                                { label: "CEP", value: member.address_zip },
                                { label: "Estado civil", value: member.marital_status },
                                { label: "LGPD Consentimento", value: member.lgpd_consent ? "✅ Concedido" : "❌ Pendente" },
                                { label: "Observações", value: member.notes },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between py-1.5 border-b border-border/30 last:border-0">
                                    <span className="text-xs text-muted-foreground">{item.label}</span>
                                    <span className="text-xs font-medium text-right max-w-[60%]">{item.value || "—"}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
