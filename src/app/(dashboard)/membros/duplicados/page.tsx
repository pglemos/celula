"use client";

import { useState, useEffect, useTransition } from "react";
import { ArrowLeft, UserPlus, Users, Merge, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { findDuplicates, mergePeople } from "@/lib/actions/people-advanced";
import Link from "next/link";
import { toast } from "sonner";

export default function DuplicadosPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        loadDuplicates();
    }, []);

    const loadDuplicates = async () => {
        setLoading(true);
        try {
            const data = await findDuplicates();
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar duplicados");
        } finally {
            setLoading(false);
        }
    };

    const handleMerge = (sourceId: string, targetId: string) => {
        if (!confirm("Tem certeza que deseja mesclar estes perfis? Esta ação moverá todo o histórico para o perfil principal e desativará o perfil secundário.")) return;

        startTransition(async () => {
            try {
                await mergePeople(sourceId, targetId);
                toast.success("Perfis mesclados com sucesso!");
                loadDuplicates();
            } catch (error) {
                console.error(error);
                toast.error("Erro ao mesclar perfis");
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/membros">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Deduplicação Inteligente</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Identificamos cadastros com nomes, e-mails ou telefones semelhantes
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Analisando base de membros...</p>
                </div>
            ) : groups.length === 0 ? (
                <Card className="glass-card border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">Tudo limpo!</h3>
                        <p className="text-muted-foreground max-w-xs">
                            Não encontramos nenhum cadastro duplicado na sua base de membros no momento.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {groups.map((group, groupIdx) => (
                        <Card key={groupIdx} className="glass-card border-border/50 border-l-4 border-l-amber-500/50">
                            <CardHeader className="pb-3 px-6">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="h-4 w-4 text-amber-500" />
                                    Grupo de Possíveis Duplicados ({group.group.length})
                                </CardTitle>
                                <CardDescription>
                                    Escolha o perfil principal para manter e mescle os outros a ele.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="grid gap-4">
                                    {group.group.map((person: any, i: number) => (
                                        <div key={person.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border-2 border-primary/10">
                                                    {person.photo_url && <AvatarImage src={person.photo_url} />}
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                        {person.full_name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{person.full_name}</p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {person.email && <Badge variant="secondary" className="text-[10px] font-normal">{person.email}</Badge>}
                                                        {person.phone && <Badge variant="secondary" className="text-[10px] font-normal">{person.phone}</Badge>}
                                                        {person.birth_date && (
                                                            <Badge variant="secondary" className="text-[10px] font-normal">
                                                                {new Date(person.birth_date).toLocaleDateString("pt-BR")}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Only allow merging if there's someone else in the group */}
                                                {group.group.filter((p: any) => p.id !== person.id).map((other: any) => (
                                                    <Button
                                                        key={other.id}
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                        onClick={() => handleMerge(person.id, other.id)}
                                                        disabled={isPending}
                                                    >
                                                        <Merge className="h-3.5 w-3.5" />
                                                        Mesclar em {other.full_name.split(" ")[0]}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold text-amber-700 dark:text-amber-400">O que acontece na mesclagem?</p>
                    <p className="text-amber-600/80 dark:text-amber-400/70 mt-1">
                        Todo o histórico (timeline, presenças, transferências) do perfil secundário será movido para o perfil principal. O perfil secundário será anonimizado e desativado para cumprir com a LGPD.
                    </p>
                </div>
            </div>
        </div>
    );
}
