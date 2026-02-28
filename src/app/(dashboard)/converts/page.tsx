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
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Novos Convertidos</h1>
                    <p className="text-slate-500 text-sm">Gerencie a consolidação e integração de novos membros.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" /> Filtrar
                    </Button>
                    <RegisterDecisionModal />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b border-slate-100">
                            <CardTitle className="text-lg font-medium">Lista de Conversões</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Data Decisão</TableHead>
                                        <TableHead>Risco de Evasão</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {converts.map((nc: any) => (
                                        <TableRow key={nc.id} className="hover:bg-slate-50/80 transition-colors">
                                            <TableCell className="font-medium">{nc.person?.full_name}</TableCell>
                                            <TableCell>
                                                <Badge variant={nc.status === 'new' ? 'destructive' : 'secondary'} className="capitalize">
                                                    {nc.status === 'new' ? 'Pendente' : nc.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                {new Date(nc.decision_date).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${nc.evasion_risk_score > 0.6 ? 'bg-red-500' : nc.evasion_risk_score > 0.3 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                            style={{ width: `${nc.evasion_risk_score * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-slate-400">{(nc.evasion_risk_score * 100).toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
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
                        <Card className="border-none shadow-sm bg-amber-50/50 border border-amber-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    Alertas de 48h
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {converts.filter((nc: any) => nc.status === 'new').slice(0, 3).map((nc: any) => (
                                        <div key={nc.id} className="text-xs p-2 bg-white rounded border border-amber-100 flex justify-between items-center">
                                            <span>{nc.person?.full_name} aguarda contato</span>
                                            <Clock className="w-3 h-3 text-slate-400" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {converts[0] && <CellMatchingCard convertId={converts[0].id} />}
                </div>
            </div>
        </div>
    );
}
