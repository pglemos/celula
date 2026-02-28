import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { getContributions, getFinancialStats } from "@/lib/actions/finances";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TYPE_LABELS = {
    tithe: "Dízimo",
    offering: "Oferta",
    donation: "Doação",
    other: "Outros",
};

export default async function FinanceiroPage() {
    const [stats, contributions] = await Promise.all([
        getFinancialStats(),
        getContributions()
    ]);

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão simplificada de dízimos e ofertas (Mês Atual)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/contribuicoes/relatorios">
                            <Activity className="h-4 w-4" /> Relatórios
                        </Link>
                    </Button>
                    <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href="/contribuicoes/nova">
                            <Plus className="h-4 w-4" /> Nova Entrada
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bento-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Entradas Totais</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter.format(stats.total)}</div>
                    </CardContent>
                </Card>

                <Card className="bento-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dízimos</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter.format(stats.tithes)}</div>
                    </CardContent>
                </Card>

                <Card className="bento-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ofertas</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter.format(stats.offerings)}</div>
                    </CardContent>
                </Card>

                <Card className="bento-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outros</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatter.format(stats.other)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bento-card">
                <CardHeader>
                    <CardTitle className="text-lg">Últimas Entradas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-border/30">
                        {contributions.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Nenhuma contribuição registrada ainda.
                            </div>
                        ) : (
                            contributions.map((item) => (
                                <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-emerald-500">
                                                + {formatter.format(Number(item.amount))}
                                            </span>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] || item.type}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {item.person ? item.person.full_name : "Registro Anônimo"}
                                            <span className="mx-2">•</span>
                                            {new Date(item.date).toLocaleDateString('pt-BR')}
                                            <span className="mx-2">•</span>
                                            <span className="capitalize">{String(item.payment_method).replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    {item.description && (
                                        <div className="text-xs text-muted-foreground max-w-xs text-right hidden sm:block">
                                            "{item.description}"
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
