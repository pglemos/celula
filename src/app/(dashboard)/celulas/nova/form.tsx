"use client";

import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEETING_DAYS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCell } from "@/lib/actions/cells";

export default function NovaCelulaForm({ people = [], supervisions = [], categories = [] }: { people: any[], supervisions: any[], categories: string[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        try {
            await createCell(formData);
            router.push("/celulas");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar célula");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/celulas">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Nova Célula</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre um novo grupo, PG ou Célula e defina sua liderança
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Dados Principais */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Dados Principais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome da Célula *</Label>
                                    <Input id="name" name="name" placeholder="Ex: Célula Betel" required className="bg-secondary border-none" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoria / Foco</Label>
                                    <Select name="category">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione um foco" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="meeting_day">Dia de Encontro</Label>
                                    <Select name="meeting_day">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o dia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(MEETING_DAYS).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meeting_time">Horário</Label>
                                    <Input id="meeting_time" name="meeting_time" type="time" className="bg-secondary border-none" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liderança e Papéis */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Liderança e Papéis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="leader_id">Líder Principal *</Label>
                                    <Select name="leader_id" required>
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o líder" />
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

                                <div className="space-y-2">
                                    <Label htmlFor="co_leader_id">Co-Líder (Opcional)</Label>
                                    <Select name="co_leader_id">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o co-líder" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {people.map(person => (
                                                <SelectItem key={person.id} value={person.id}>
                                                    {person.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="host_id">Anfitrião (Opcional)</Label>
                                    <Select name="host_id">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o anfitrião" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {people.map(person => (
                                                <SelectItem key={person.id} value={person.id}>
                                                    {person.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trainee_id">Líder em Treinamento / Estagiário</Label>
                                    <Select name="trainee_id">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione o trainee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhum</SelectItem>
                                            {people.map(person => (
                                                <SelectItem key={person.id} value={person.id}>
                                                    {person.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="supervision_id">Supervisão / Rede (Opcional)</Label>
                                <Select name="supervision_id">
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue placeholder="Selecione a rede vinculada" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Nenhuma</SelectItem>
                                        {supervisions.map(sup => (
                                            <SelectItem key={sup.id} value={sup.id}>
                                                {sup.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Endereço */}
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Endereço de Realização</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-4">
                                <div className="space-y-2 sm:col-span-1">
                                    <Label htmlFor="address_zip">CEP</Label>
                                    <Input id="address_zip" name="address_zip" placeholder="00000-000" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2 sm:col-span-3">
                                    <Label htmlFor="address_street">Endereço (Rua, Av, etc)</Label>
                                    <Input id="address_street" name="address_street" placeholder="Rua das Flores" className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="address_number">Número / Complemento</Label>
                                    <Input id="address_number" name="address_number" placeholder="123 - Apt 45" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address_neighborhood">Bairro</Label>
                                    <Input id="address_neighborhood" name="address_neighborhood" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address_city">Cidade / UF</Label>
                                    <Input id="address_city" name="address_city" placeholder="Belo Horizonte - MG" className="bg-secondary border-none" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4 md:col-span-2 justify-end mt-4">
                        <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Criar Célula
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
