import { getDRE, getCashFlow, getCampaigns } from "@/lib/actions/phase3-advanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Wallet, Target, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RelatoriosFinanceirosPage() {
    const today = new Date();
    // Default to current month for DRE
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    const currentYear = today.getFullYear();

    const [dre, cashFlow, campaigns] = await Promise.all([
        getDRE(startOfMonth, endOfMonth),
        getCashFlow(currentYear),
        getCampaigns()
    ]);

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/contribuicoes">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Relatórios Financeiros</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            DRE Mensal, Fluxo de Caixa Anual e Campanhas
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* DRE Resumo */}
                <Card className="glass-card md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" /> DRE do Mês
                        </CardTitle>
                        <CardDescription>
                            {new Date(startOfMonth).toLocaleDateString("pt-BR")} a {new Date(endOfMonth).toLocaleDateString("pt-BR")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2 text-emerald-500 font-medium tracking-tight">
                                <TrendingUp className="h-4 w-4" /> Receitas Totais
                            </div>
                            <span className="font-bold text-emerald-500">{formatter.format(dre.totalReceitas)}</span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                            <div className="flex items-center gap-2 text-rose-500 font-medium tracking-tight">
                                <TrendingDown className="h-4 w-4" /> Despesas Totais
                            </div>
                            <span className="font-bold text-rose-500">{formatter.format(dre.totalDespesas)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 font-bold tracking-tight text-white/90">
                                <Wallet className="h-4 w-4" /> Resultado (Lucro/Prejuízo)
                            </div>
                            <span className={`font-black text-lg ${dre.resultado >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {formatter.format(dre.resultado)}
                            </span>
                        </div>
                        <div className="mt-6 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Detalhamento Receitas</p>
                            {Object.entries(dre.groups).filter(([k, v]) => ['dizimos', 'ofertas', 'campanhas', 'eventos'].includes(k) && v.total > 0).map(([k, v]) => (
                                <div key={k} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{v.label}</span>
                                    <span className="font-variant-numeric">{formatter.format(v.total)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cash Flow */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" /> Fluxo de Caixa Anual ({currentYear})
                        </CardTitle>
                        <CardDescription>Resumo de entradas e saídas por mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mt-2">
                            {cashFlow.filter(m => m.income > 0 || m.expense > 0).length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nenhum movimento financeiro registrado no ano.
                                </div>
                            ) : (
                                cashFlow.map((month) => {
                                    if (month.income === 0 && month.expense === 0) return null;
                                    const isPositive = month.net >= 0;
                                    return (
                                        <div key={month.month} className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                            <div className="w-12 font-bold text-center uppercase text-sm tracking-wider text-muted-foreground">
                                                {month.label}
                                            </div>
                                            <div className="flex-1 w-full space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-emerald-500">Rec: {formatter.format(month.income)}</span>
                                                    <span className="text-rose-500">Desp: {formatter.format(month.expense)}</span>
                                                </div>
                                                {/* Simple Progress Bars */}
                                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                                                    <div
                                                        className="h-full bg-emerald-500/80"
                                                        style={{ width: `${Math.max(10, (month.income / (month.income + month.expense || 1)) * 100)}%` }}
                                                    />
                                                    <div
                                                        className="h-full bg-rose-500/80"
                                                        style={{ width: `${Math.max(10, (month.expense / (month.income + month.expense || 1)) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={`w-24 text-right font-bold text-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {formatter.format(month.net)}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Campanhas */}
                <Card className="glass-card md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5 text-blue-500" /> Campanhas Arrecadatórias
                            </CardTitle>
                            <CardDescription>Progresso de metas financeiras (construção, missões, etc)</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                            Criar Campanha
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                            {campaigns.length === 0 ? (
                                <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                                    Nenhuma campanha ativa no momento.
                                </div>
                            ) : (
                                campaigns.map((campaign) => {
                                    const percent = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));
                                    const isComplete = percent >= 100;
                                    return (
                                        <div key={campaign.id} className="p-4 rounded-xl border border-border/50 bg-secondary/20 relative overflow-hidden">
                                            {isComplete && (
                                                <div className="absolute -right-6 top-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-8 rotate-45 shadow-lg">
                                                    Atingida
                                                </div>
                                            )}
                                            <h3 className="font-bold text-lg leading-tight mb-1 pr-6">{campaign.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                                {campaign.description || "Sem descrição"}
                                            </p>

                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Progresso</span>
                                                    <span className={isComplete ? "text-emerald-500" : "text-blue-500"}>{percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                    <span>{formatter.format(campaign.current_amount)}</span>
                                                    <span>Meta: {formatter.format(campaign.goal_amount)}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <Badge variant="outline" className="text-[10px]">
                                                    {new Date(campaign.end_date).toLocaleDateString('pt-BR')}
                                                </Badge>
                                                {!isComplete && (
                                                    <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
                                                        Contribuir
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
