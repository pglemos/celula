"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ClientEnrollForm({
    courseId,
    people,
    enrollAction
}: {
    courseId: string;
    people: any[];
    enrollAction: (courseId: string, personId: string) => Promise<void>;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [personId, setPersonId] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleEnroll() {
        if (!personId) return;
        setLoading(true);
        setError(null);
        try {
            await enrollAction(courseId, personId);
            router.push(`/cursos/${courseId}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao matricular aluno");
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/cursos/${courseId}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Matricular Aluno</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Selecione um membro para adicionar a esta turma
                    </p>
                </div>
            </div>

            <Card className="glass-card max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-lg">Seleção de Aluno</CardTitle>
                    <CardDescription>Apenas pessoas cadastradas no sistema podem ser matriculadas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Selecione a Pessoa</Label>
                        <Select onValueChange={setPersonId}>
                            <SelectTrigger className="bg-secondary border-none h-12">
                                <SelectValue placeholder="Buscar por nome..." />
                            </SelectTrigger>
                            <SelectContent>
                                {people.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.full_name} {p.email ? `(${p.email})` : ""}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4 justify-end pt-4 border-t border-border/30">
                        <Button variant="outline" asChild className="border-border/50">
                            <Link href={`/cursos/${courseId}`}>
                                Cancelar
                            </Link>
                        </Button>
                        <Button
                            onClick={handleEnroll}
                            disabled={loading || !personId}
                            className="gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                            Matricular Agora
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
