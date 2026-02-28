"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupervision } from "@/lib/actions/supervisions";

export default function NovaSupervisaoForm({ people = [], supervisions = [] }: { people: any[], supervisions: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            await createSupervision(formData);
            router.push("/supervisao");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar supervisão/rede");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/supervisao">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nova Área de Supervisão</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre uma nova Rede, Sub-rede ou Distrito
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="max-w-2xl">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg">Dados da Rede</CardTitle>
                        <CardDescription>
                            Organize a hierarquia da igreja definindo quem supervisiona quem.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Supervisão/Rede *</Label>
                            <Input id="name" name="name" placeholder="Ex: Rede Jovem, Distrito Norte" required className="bg-secondary border-none" />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="level">Nível Hierárquico</Label>
                                <Select name="level" defaultValue="1">
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Nível 1 (Acima de todos)</SelectItem>
                                        <SelectItem value="2">Nível 2</SelectItem>
                                        <SelectItem value="3">Nível 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent_id">Subordinação (Opcional)</Label>
                                <Select name="parent_id">
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue placeholder="Responde a..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Principal da Igreja</SelectItem>
                                        {supervisions.map(sup => (
                                            <SelectItem key={sup.id} value={sup.id}>
                                                {sup.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supervisor_id">Pastor ou Supervisor Responsável *</Label>
                            <Select name="supervisor_id" required>
                                <SelectTrigger className="bg-secondary border-none">
                                    <SelectValue placeholder="Selecione a pessoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    {people.map(person => (
                                        <SelectItem key={person.id} value={person.id}>
                                            {person.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                            <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="gap-2">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Criar Supervisão
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
