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
import { createCourse } from "@/lib/actions/courses";

export default function NovoCursoForm({ instructors = [] }: { instructors: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await createCourse(formData);
            router.push("/cursos");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar curso");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/cursos">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Criar Novo Curso / Trilha</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Cadastre uma nova turma para capacitação ou membresia
                    </p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="glass-card md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Informações do Curso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Curso / Trilha *</Label>
                                <Input id="name" name="name" placeholder="Ex: Escola de Líderes Nível 1" required className="bg-secondary border-none" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="instructor_id">Professor / Instrutor</Label>
                                    <Select name="instructor_id">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione um professor (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Deixar para depois</SelectItem>
                                            {instructors.map(c => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status Inicial da Turma</Label>
                                    <Select name="status" defaultValue="open">
                                        <SelectTrigger className="bg-secondary border-none">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Rascunho</SelectItem>
                                            <SelectItem value="open">Inscrições Abertas</SelectItem>
                                            <SelectItem value="in_progress">Em Andamento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Data de Início Estimada</Label>
                                    <Input id="start_date" name="start_date" type="date" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Data de Término Estimada</Label>
                                    <Input id="end_date" name="end_date" type="date" className="bg-secondary border-none" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="total_classes">Total de Aulas Planejadas *</Label>
                                    <Input id="total_classes" name="total_classes" type="number" min="1" defaultValue="1" required className="bg-secondary border-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Ementa / Descrição</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    className="bg-secondary border-none min-h-[100px]"
                                    placeholder="Breve resumo sobre o que o curso abordará..."
                                />
                            </div>

                            <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                                <Button variant="outline" type="button" onClick={() => router.back()} className="border-border/50">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Criar Curso
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
