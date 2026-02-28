import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Activity, Filter } from "lucide-react";
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
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Financeiro</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gestão simplificada de dízimos e ofertas (Mês Atual)
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" className="hidden sm:flex gap-2 rounded-[24px] h-14 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Link href="/contribuicoes/relatorios">
                            <Activity className="w-5 h-5" /> Relatórios
                        </Link>
                    </Button>
                    <Button asChild className="rounded-[24px] h-14 px-10 text-base tracking-wide font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md gap-2">
                        <Link href="/contribuicoes/nova">
                            <Plus className="w-5 h-5" /> Nova Entrada
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Entradas Totais</CardTitle>
                        <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-600">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-bold text-slate-800 tracking-tight">{formatter.format(stats.total)}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dízimos</CardTitle>
                        <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-600">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-bold text-slate-800 tracking-tight">{formatter.format(stats.tithes)}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ofertas</CardTitle>
                        <div className="p-2.5 rounded-full bg-blue-100 text-blue-600">
                            <Activity className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-bold text-slate-800 tracking-tight">{formatter.format(stats.offerings)}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Outros</CardTitle>
                        <div className="p-2.5 rounded-full bg-slate-100 text-slate-500">
                            <ArrowDownRight className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-bold text-slate-800 tracking-tight">{formatter.format(stats.other)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions List */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                    <CardTitle className="text-2xl font-medium text-slate-800 tracking-tight">Últimas Entradas</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <div className="divide-y divide-slate-100">
                        {contributions.length === 0 ? (
                            <div className="py-12 text-center text-sm text-slate-400">
                                <Wallet className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-lg font-medium text-slate-500">Nenhuma contribuição registrada</p>
                            </div>
                        ) : (
                            contributions.map((item) => (
                                <div key={item.id} className="py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-emerald-600 text-lg">
                                                + {formatter.format(Number(item.amount))}
                                            </span>
                                            <Badge variant="outline" className="text-xs font-bold rounded-full px-3 py-0.5 border-slate-200 text-slate-500">
                                                {TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] || item.type}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1.5 font-medium">
                                            {item.person ? item.person.full_name : "Registro Anônimo"}
                                            <span className="mx-2 text-slate-300">•</span>
                                            {new Date(item.date).toLocaleDateString('pt-BR')}
                                            <span className="mx-2 text-slate-300">•</span>
                                            <span className="capitalize">{String(item.payment_method).replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    {item.description && (
                                        <div className="text-xs text-slate-400 max-w-xs text-right hidden sm:block italic">
                                            &ldquo;{item.description}&rdquo;
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
