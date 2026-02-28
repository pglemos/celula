"use client";

import { useState } from "react";
import { ArrowLeft, Check, Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockMembers } from "@/lib/mock-data";
import Link from "next/link";
import { use } from "react";
import { cn } from "@/lib/utils";

export default function MeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const members = mockMembers.slice(0, 6);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [godsPresence, setGodsPresence] = useState(0);
    const [decisions, setDecisions] = useState(0);
    const [theme, setTheme] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const toggleAttendance = (memberId: string) => {
        setAttendance((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in-up">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-10 w-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Reunião Registrada!</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    {presentCount} de {members.length} presentes • {decisions} decisões para Cristo
                </p>
                <Link href={`/celulas/${id}`}>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                        Voltar para a Célula
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href={`/celulas/${id}`}>
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Registro de Reunião</h1>
                    <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                </div>
            </div>

            {/* Attendance */}
            <Card className="glass-card border-border/50 animate-fade-in-up">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                        <span>✅ Presença</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {presentCount}/{members.length}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {members.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => toggleAttendance(m.id)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg p-3 transition-all text-left",
                                attendance[m.id]
                                    ? "bg-emerald-500/10 border border-emerald-500/30"
                                    : "bg-secondary/30 border border-transparent hover:bg-secondary/60"
                            )}
                        >
                            <Checkbox checked={!!attendance[m.id]} className="pointer-events-none" />
                            <span className="text-sm font-medium flex-1">{m.full_name}</span>
                            {!attendance[m.id] && (
                                <span className="text-[10px] text-amber-400">⚠️ Ausente</span>
                            )}
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* God's Presence */}
            <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">⭐ Presença de Deus</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setGodsPresence(rating)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={cn(
                                        "h-8 w-8 transition-colors",
                                        rating <= godsPresence
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-muted-foreground/30"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Decisions */}
            <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">✝️ Decisões para Cristo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => setDecisions(Math.max(0, decisions - 1))}>-</Button>
                        <span className="text-3xl font-bold w-12 text-center">{decisions}</span>
                        <Button variant="outline" size="icon" onClick={() => setDecisions(decisions + 1)}>+</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Theme & Notes */}
            <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm">📖 Tema da reunião</Label>
                        <Input
                            placeholder="Ex: Amor ao próximo"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="bg-secondary border-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">📝 Observações</Label>
                        <Textarea
                            placeholder="Observações sobre a reunião..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-secondary border-none min-h-[80px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Submit */}
            <Button
                onClick={() => setSubmitted(true)}
                className="w-full gap-2 bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
            >
                <Send className="h-5 w-5" />
                Enviar Relatório
            </Button>
        </div>
    );
}
