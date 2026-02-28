import { getNewConverts, getFunnelData } from "@/lib/actions/consolidation";
import { ConsolidationFunnel } from "@/components/converts/consolidation-funnel";
import { CellMatchingCard } from "@/components/converts/cell-matching-card";
import { RegisterDecisionModal } from "@/components/converts/register-decision-modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function ConvertsPage() {
    const [converts, funnelData] = await Promise.all([
        getNewConverts(),
        getFunnelData()
    ]);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Novos Convertidos</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">Gerencie a consolidação e integração de novos membros.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden sm:flex gap-2 rounded-[24px] h-14 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Filter className="w-5 h-5" /> Filtrar
                    </Button>
                    <RegisterDecisionModal />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                        <CardHeader className="bg-transparent border-b border-slate-200/50 px-8 pt-8 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Lista de Conversões</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-transparent">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Nome</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Data Decisão</TableHead>
                                        <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Risco Evasão</TableHead>
                                        <TableHead className="text-right px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {converts.map((nc: any) => (
                                        <TableRow key={nc.id} className="hover:bg-white/40 transition-colors border-none group cursor-pointer">
                                            <TableCell className="px-8 py-5">
                                                <div className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">
                                                    {nc.person?.full_name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <Badge variant={nc.status === 'new' ? 'destructive' : 'secondary'} className={`capitalize px-3 py-1 font-bold text-xs rounded-full border-none ${nc.status === 'new' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {nc.status === 'new' ? 'Pendente' : nc.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 font-medium text-sm py-5">
                                                {new Date(nc.conversion_date).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-20 h-2 bg-slate-200/50 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${nc.evasion_risk_score > 0.6 ? 'bg-rose-500' : nc.evasion_risk_score > 0.3 ? 'bg-amber-500' : 'bg-emerald-500'} transition-all`}
                                                            style={{ width: `${nc.evasion_risk_score * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500">{(nc.evasion_risk_score * 100).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right px-8 py-5">
                                                <Button variant="ghost" size="sm" asChild className="rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
                                                    <Link href={`/converts/${nc.id}`}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Ver Detalhes
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <ConsolidationFunnel data={funnelData} />

                    {converts.length > 0 && (
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-amber-50/80 backdrop-blur-md rounded-[32px]">
                            <CardHeader className="pb-4 px-6 pt-6">
                                <CardTitle className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Alertas de 48h
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="space-y-3">
                                    {converts.filter((nc: any) => nc.status === 'new').slice(0, 3).map((nc: any) => (
                                        <div key={nc.id} className="text-sm font-bold p-4 bg-white hover:bg-white/80 transition-colors rounded-[20px] border-none shadow-sm flex justify-between items-center group cursor-pointer text-slate-700">
                                            <span>{nc.person?.full_name} <span className="text-slate-400 font-medium ml-1">aguarda contato</span></span>
                                            <Clock className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {converts[0] && (
                        <div className="[&>div]:rounded-[32px] [&>div]:shadow-[0_8px_30px_rgb(0,0,0,0.04)] [&>div]:border-none">
                            <CellMatchingCard convertId={converts[0].id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
