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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNewConvert } from "@/lib/actions/consolidation";

export default function NovoConvertidoForm({ consolidators = [] }: { consolidators: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            await createNewConvert(formData);
            router.push("/consolidacao");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao registrar decisão");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/consolidacao">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Registrar Decisão</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Inicie o processo de consolidação de uma nova vida
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Dados do Novo Convertido / Visitante</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Nome Completo *</Label>
                                    <Input id="full_name" name="full_name" placeholder="Ex: João da Silva" required className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                                    <Input id="phone" name="phone" placeholder="(31) 99999-9999" required className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="decision_date">Data da Decisão / Visita *</Label>
                                    <Input id="decision_date" name="decision_date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="decision_type">Tipo Contato</Label>
                                    <Select name="decision_type" defaultValue="accept">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="accept">Aceitou a Jesus</SelectItem>
                                            <SelectItem value="reconcile">Reconciliação</SelectItem>
                                            <SelectItem value="visitor">Primeira Visita</SelectItem>
                                            <SelectItem value="transfer">Transferência</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Equipe de Consolidação</CardTitle>
                            <CardDescription>Atribua um membro para fazer o acompanhamento inicial</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="consolidator_id">Consolidador Responsável</Label>
                                <Select name="consolidator_id">
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue placeholder="Selecione um consolidador (opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Deixar para depois</SelectItem>
                                        {consolidators.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Observações / Pedidos de Oração</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    className="bg-secondary border-none min-h-[100px]"
                                    placeholder="Ex: Conheceu a igreja através de um amigo. Pediu oração pela família..."
                                />
                            </div>

                            <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                                <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Registrar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
