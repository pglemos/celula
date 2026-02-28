"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, Star, Send, Loader2, Plus, Trash2, MapPin, WifiOff, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitMeeting } from "@/lib/actions/cells";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { saveMeetingOffline, syncMeetings, PendingMeeting } from "@/lib/offline-sync";

interface MeetingFormProps {
    cellId: string;
    cellName: string;
    leaderId: string;
    members: Array<{ id: string; full_name: string }>;
}

export function MeetingForm({ cellId, cellName, leaderId, members }: MeetingFormProps) {
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [visitors, setVisitors] = useState<Array<{ id: string; name: string }>>([]);
    const [godsPresence, setGodsPresence] = useState(0);
    const [decisions, setDecisions] = useState(0);
    const [offering, setOffering] = useState("");
    const [theme, setTheme] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        setIsOffline(!navigator.onLine);
        const handleStatusChange = () => {
            setIsOffline(!navigator.onLine);
            if (navigator.onLine) syncMeetings(submitMeeting);
        };
        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // Obter geolocalização para check-in
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    const toggleAttendance = (memberId: string) => {
        setAttendance((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
    };

    const addVisitor = () => {
        const name = prompt("Nome do visitante:");
        if (name) {
            setVisitors(prev => [...prev, { id: `visitor-${Date.now()}`, name }]);
        }
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;

    async function handleSubmit() {
        setLoading(true);
        setError(null);

        const meetingData: PendingMeeting = {
            id: `meeting-${Date.now()}`,
            cell_id: cellId,
            meeting_date: new Date().toISOString().split("T")[0],
            gods_presence: godsPresence,
            decisions_for_christ: decisions,
            offering_amount: parseFloat(offering) || 0,
            theme: theme,
            observations: notes,
            submitted_by: leaderId || members[0]?.id || "",
            timestamp: Date.now(),
            attendance: [
                ...members.map((m) => ({
                    person_id: m.id,
                    present: !!attendance[m.id],
                    checkin_lat: attendance[m.id] ? location?.lat : undefined,
                    checkin_lng: attendance[m.id] ? location?.lng : undefined,
                    checkin_at: attendance[m.id] ? new Date().toISOString() : undefined,
                })),
                ...visitors.map(v => ({
                    person_id: v.id, // Em produção, criaríamos a pessoa antes ou no sync
                    present: true,
                    is_visitor: true,
                    checkin_lat: location?.lat,
                    checkin_lng: location?.lng,
                    checkin_at: new Date().toISOString(),
                }))
            ]
        };

        try {
            if (!navigator.onLine) {
                await saveMeetingOffline(meetingData);
                setSubmitted(true);
                return;
            }

            const formData = new FormData();
            formData.set("cell_id", meetingData.cell_id);
            formData.set("submitted_by", meetingData.submitted_by);
            formData.set("meeting_date", meetingData.meeting_date);
            formData.set("gods_presence", String(meetingData.gods_presence));
            formData.set("decisions_for_christ", String(meetingData.decisions_for_christ));
            formData.set("offering_amount", String(meetingData.offering_amount));
            formData.set("theme", meetingData.theme);
            formData.set("observations", meetingData.observations);
            formData.set("attendance", JSON.stringify(meetingData.attendance));

            await submitMeeting(formData);
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao registrar reunião");
            // Se falhar a submissão mas estiver online, podemos tentar salvar offline como backup
            await saveMeetingOffline(meetingData);
            setSubmitted(true);
            setError("Falha na conexão. Relatório salvo localmente e será enviado quando houver internet.");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in-up text-center px-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Relatório Concluído!</h2>
                <p className="text-muted-foreground max-w-md">
                    {isOffline ? "Você está offline. O relatório foi salvo localmente e sincronizará automaticamente quando houver conexão." : "Relatório enviado com sucesso e dados sincronizados."}
                </p>
                <Link href={`/celulas/${cellId}`}>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">Voltar para a Célula</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl pb-20">
            <div className="flex items-center gap-4">
                <Link href={`/celulas/${cellId}`}>
                    <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Registro de Reunião</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{cellName}</span>
                        {isOffline ? (
                            <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <WifiOff className="h-3 w-3" /> Offline
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <Globe className="h-3 w-3" /> Online
                            </span>
                        )}
                        {location && (
                            <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                <MapPin className="h-3 w-3" /> GPS OK
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">{error}</div>
            )}

            {/* Attendance */}
            <Card className="glass-card border-border/50 animate-fade-in-up shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                        <span>✅ Presença e Check-in</span>
                        <span className="text-sm font-normal text-muted-foreground">{presentCount}/{members.length + visitors.length}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid gap-2">
                        {members.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => toggleAttendance(m.id)}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl p-4 transition-all text-left border-2",
                                    attendance[m.id]
                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                        : "bg-secondary/20 border-transparent hover:bg-secondary/40"
                                )}
                            >
                                <Checkbox checked={!!attendance[m.id]} className="h-5 w-5 pointer-events-none" />
                                <div className="flex-1">
                                    <span className="text-sm font-semibold">{m.full_name}</span>
                                    {attendance[m.id] && location && (
                                        <p className="text-[10px] text-emerald-500/70 flex items-center gap-1 mt-0.5">
                                            <MapPin className="h-3 w-3" /> Check-in registrado
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 space-y-3">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Visitantes</Label>
                        {visitors.map(v => (
                            <div key={v.id} className="flex items-center gap-3 rounded-xl p-4 bg-primary/5 border-2 border-primary/20">
                                <Plus className="h-5 w-5 text-primary" />
                                <span className="text-sm font-semibold flex-1">{v.name}</span>
                                <Button variant="ghost" size="icon" onClick={() => setVisitors(prev => prev.filter(x => x.id !== v.id))}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addVisitor} className="w-full border-dashed border-2 h-12 gap-2 text-primary hover:bg-primary/5 border-primary/20">
                            <Plus className="h-4 w-4" /> Adicionar Visitante
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* God's Presence */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-amber-400" /> Presença de Deus</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between px-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button key={rating} onClick={() => setGodsPresence(rating)} className="transition-transform hover:scale-125">
                                    <Star className={cn("h-8 w-8 transition-colors", rating <= godsPresence ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Decisions */}
                <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2">✝️ Decisões</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center gap-6">
                            <Button variant="outline" className="h-10 w-10 rounded-full" onClick={() => setDecisions(Math.max(0, decisions - 1))}>-</Button>
                            <span className="text-4xl font-black w-12 text-center">{decisions}</span>
                            <Button variant="outline" className="h-10 w-10 rounded-full" onClick={() => setDecisions(decisions + 1)}>+</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Offering, Theme & Notes */}
            <Card className="glass-card border-border/50 animate-fade-in-up shadow-md" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-sm font-bold">💰 Oferta do Dia (Opcional)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/50">R$</span>
                            <Input type="number" step="0.01" placeholder="0,00" value={offering} onChange={(e) => setOffering(e.target.value)} className="bg-secondary/40 border-none h-12 pl-10 text-lg font-semibold" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold">📖 Tema Estudado</Label>
                        <Input placeholder="Título da lição ou tema..." value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-secondary/40 border-none h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-bold">📝 Observações & Notas</Label>
                        <Textarea placeholder="Como foi o mover de Deus hoje? Pedidos de oração? Desafios?" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-secondary/40 border-none min-h-[100px] resize-none" />
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 md:relative md:bg-transparent md:p-0 md:border-none">
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full gap-3 bg-primary hover:bg-primary/90 h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl"
                >
                    {loading ? <><Loader2 className="h-6 w-6 animate-spin" /> Processando...</> : <><Send className="h-6 w-6" /> Finalizar Relatório</>}
                </Button>
            </div>
        </div>
    );
}
