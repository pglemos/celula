"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEvent } from "@/lib/actions/events";

export default function NovoEventoForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Combine date and time to ISO string
        const startDate = formData.get("start_date_local") as string;
        const startTime = formData.get("start_time_local") as string;
        const endDate = formData.get("end_date_local") as string;
        const endTime = formData.get("end_time_local") as string;

        // Basic timezone handling (store as local time ISO assuming server handles it or store exact UTC)
        // Here we just construct a string Date can parse
        formData.set("start_date", `${startDate}T${startTime}:00`);
        formData.set("end_date", `${endDate}T${endTime}:00`);

        try {
            await createEvent(formData);
            router.push("/eventos");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar evento");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/eventos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Criar Novo Evento</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre um congresso, retiro, treinamento ou reunião extraordinária
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Informações do Evento</CardTitle>
                            <CardDescription>O evento ficará visível para inscrições manuais pelo painel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Evento *</Label>
                                <Input id="name" name="name" placeholder="Ex: Acampamento de Jovens 2026" required className="bg-secondary border-none" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                                    <h3 className="font-semibold text-sm">Início do Evento *</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date_local">Data</Label>
                                            <Input id="start_date_local" name="start_date_local" type="date" required className="bg-background border-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="start_time_local">Hora</Label>
                                            <Input id="start_time_local" name="start_time_local" type="time" required className="bg-background border-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                                    <h3 className="font-semibold text-sm">Término do Evento *</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="end_date_local">Data</Label>
                                            <Input id="end_date_local" name="end_date_local" type="date" required className="bg-background border-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="end_time_local">Hora</Label>
                                            <Input id="end_time_local" name="end_time_local" type="time" required className="bg-background border-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Local do Evento</Label>
                                    <Input id="location" name="location" placeholder="Ex: Sítio Vale Verde / Templo Principal" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacidade Máxima (Vagas)</Label>
                                    <Input id="capacity" name="capacity" type="number" placeholder="Deixe em branco se ilimitado" className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    className="bg-secondary border-none min-h-[100px]"
                                    placeholder="Breve descrição do evento..."
                                />
                            </div>

                            <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                                <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Criar Evento
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
