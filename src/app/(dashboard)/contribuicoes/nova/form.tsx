"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createContribution } from "@/lib/actions/finances";

export default function NovaContribuicaoForm({ people = [] }: { people: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await createContribution(formData);
            router.push("/contribuicoes");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao registrar entrada");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/contribuicoes">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Registrar Contribuição</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Dízimos, Ofertas e Doações Diversas
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 max-w-2xl">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-lg">Detalhes da Entrada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Valor (R$) *</Label>
                                    <Input id="amount" name="amount" placeholder="0,00" required className="bg-secondary border-none text-lg font-medium text-emerald-500 placeholder:text-emerald-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Data da Entrada *</Label>
                                    <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo de Contribuição *</Label>
                                    <Select name="type" defaultValue="tithe">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tithe">Dízimo</SelectItem>
                                            <SelectItem value="offering">Oferta</SelectItem>
                                            <SelectItem value="donation">Doação (Específica)</SelectItem>
                                            <SelectItem value="other">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="payment_method">Forma de Pagamento *</Label>
                                    <Select name="payment_method" defaultValue="pix">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pix">PIX</SelectItem>
                                            <SelectItem value="cash">Dinheiro em Espécie</SelectItem>
                                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                            <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                                            <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                                            <SelectItem value="other">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="person_id">Membro Vinculado (Opcional)</Label>
                                <Select name="person_id">
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue placeholder="Busque ou selecione um membro" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="anonymous">Registrar de forma Anônima</SelectItem>
                                        {people.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Observações</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    className="bg-secondary border-none"
                                    placeholder="Ex: Oferta destinada para construção do templo"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                                <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Registrar Entrada
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
