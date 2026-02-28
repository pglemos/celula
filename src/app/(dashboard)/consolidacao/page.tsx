import { Plus, UserPlus, PhoneCall, Home, ShieldCheck, UserX } from "lucide-react";
import { getConsolidationStats, getNewConverts } from "@/lib/actions/consolidation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_ICONS = {
    new: <UserPlus className="h-5 w-5 text-blue-500" />,
    contacted: <PhoneCall className="h-5 w-5 text-amber-500" />,
    in_cell: <Home className="h-5 w-5 text-purple-500" />,
    baptized: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    lost: <UserX className="h-5 w-5 text-red-500" />
};

const STATUS_LABELS = {
    new: "Recém Chegado",
    contacted: "Em Contato",
    in_cell: "Em uma Célula",
    baptized: "Integrado/Batizado",
    lost: "Perdido"
};

export default async function ConsolidacaoPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const [stats, converts] = await Promise.all([
        getConsolidationStats(),
        getNewConverts(status)
    ]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Consolidação</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão do funil de novos convertidos e integração
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/consolidacao/novo">
                        <Plus className="h-4 w-4" /> Registrar Decisão
                    </Link>
                </Button>
            </div>

            {/* Funil Visual (Cards) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {(Object.keys(stats) as Array<keyof typeof stats>).map((key) => (
                    <Link key={key} href={status === key ? "/consolidacao" : `/consolidacao?status=${key}`}>
                        <Card className={`glass-card hover:bg-secondary/50 transition-colors ${status === key ? 'ring-2 ring-primary border-transparent' : 'border-border/50'}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                    {STATUS_LABELS[key]}
                                </CardTitle>
                                {STATUS_ICONS[key]}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats[key]}</div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Lista de Convertidos */}
            <Card className="glass-card border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg">
                        {status ? `Filtrando por: ${STATUS_LABELS[status as keyof typeof STATUS_LABELS]}` : "Últimas Decisões"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-border/30 border-t border-border/30">
                        {converts.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Nenhuma pessoa encontrada nesta etapa do funil.
                            </div>
                        ) : (
                            converts.map((person) => {
                                const decisionDate = new Date(person.decision_date);
                                const timeAgo = formatDistanceToNow(decisionDate, { addSuffix: true, locale: ptBR });
                                const isNew = person.status === "new";
                                // Let's create an alert if it's "new" for more than 48 hours
                                const hoursSinceDecision = (new Date().getTime() - decisionDate.getTime()) / (1000 * 60 * 60);
                                const needsAttention = isNew && hoursSinceDecision > 48;

                                return (
                                    <div key={person.id} className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-secondary/20 transition-colors px-2 rounded-lg -mx-2">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 rounded-full bg-secondary shrink-0">
                                                {STATUS_ICONS[person.status as keyof typeof STATUS_ICONS]}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/consolidacao/${person.id}`} className="font-medium hover:underline">
                                                        {person.full_name}
                                                    </Link>
                                                    {needsAttention && (
                                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                                                            Atrasado
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex flex-col sm:flex-row gap-x-3 gap-y-1 mt-1">
                                                    {person.phone && <span>📞 {person.phone}</span>}
                                                    <span>Decidiu {timeAgo}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <div className="text-xs text-right hidden sm:block">
                                                <p className="text-muted-foreground">Consolidador</p>
                                                <p className="font-medium">{person.consolidator?.full_name || "Não atribuído"}</p>
                                            </div>
                                            <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
                                                <Link href={`/consolidacao/${person.id}`}>
                                                    Acompanhar
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
