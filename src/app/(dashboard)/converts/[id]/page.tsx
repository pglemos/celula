import { getConvertById, getIAMatchedCells, logConsolidationEvent, updateConvertStatus } from "@/lib/actions/consolidation";
import { CellMatchingCard } from "@/components/converts/cell-matching-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Phone, MapPin, CheckCircle2, AlertCircle, Clock, UserCheck } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { notFound } from "next/navigation";

export default async function ConvertDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const convert = await getConvertById(id).catch(() => null);

    if (!convert) {
        notFound();
    }

    const decisionDate = new Date(convert.decision_date);
    const timeSinceDecision = formatDistanceToNow(decisionDate, { addSuffix: true, locale: ptBR });

    const statusConfig = {
        new: { label: "Pendente", color: "bg-red-500", icon: <Clock className="w-4 h-4" /> },
        contacted: { label: "Contatado", color: "bg-amber-500", icon: <Phone className="w-4 h-4" /> },
        in_cell: { label: "Em Célula", color: "bg-purple-500", icon: <MapPin className="w-4 h-4" /> },
        baptized: { label: "Batizado", color: "bg-emerald-500", icon: <CheckCircle2 className="w-4 h-4" /> },
        lost: { label: "Perdido", color: "bg-slate-500", icon: <AlertCircle className="w-4 h-4" /> }
    };

    const currentStatus = statusConfig[convert.status as keyof typeof statusConfig] || statusConfig.new;

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen animate-fade-in">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/converts">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900">{convert.person?.full_name}</h1>
                        <Badge className={`${currentStatus.color} text-white gap-1`}>
                            {currentStatus.icon}
                            {currentStatus.label}
                        </Badge>
                    </div>
                    <p className="text-slate-500 text-sm">Decidido {timeSinceDecision}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Perfil e Informações */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Informações do Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold">Telefone</p>
                                <p className="text-slate-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {convert.person?.phone || "Não informado"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold">Bairro</p>
                                <p className="text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {convert.person?.address_neighborhood || "Não informado"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold">Tipo de Decisão</p>
                                <p className="text-slate-700 capitalize">{convert.decision_context || "Não informado"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-semibold">Consolidador</p>
                                <p className="text-slate-700 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-slate-400" />
                                    {convert.consolidator?.full_name || "Sem consolidador definido"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline de Consolidação */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium text-slate-800">Linha do Tempo</CardTitle>
                            <CardDescription>Histórico de integração e contatos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                                {convert.consolidation_events?.map((event: any, idx: number) => (
                                    <div key={event.id} className="relative flex items-center gap-6 group">
                                        <div className={`w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 
                                            ${event.event_type === 'decision' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{event.description}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(event.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Ações Rápidas */}
                    <Card className="border-none shadow-sm bg-white border border-slate-100">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold uppercase text-slate-500 tracking-wider">Ações de Consolidação</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800" asChild>
                                <a href={`https://wa.me/55${convert.person?.phone?.replace(/\D/g, '')}`} target="_blank">
                                    <Phone className="w-4 h-4" />
                                    Enviar WhatsApp
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full justify-start gap-2 border-slate-200 text-slate-700">
                                <CheckCircle2 className="w-4 h-4" />
                                Marcar como Contatado
                            </Button>
                        </CardContent>
                    </Card>

                    {/* IA cell Suggestions */}
                    <CellMatchingCard convertId={convert.id} />

                    {/* Risco de Evasão */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className={`h-1 w-full ${convert.evasion_risk_score > 0.6 ? 'bg-red-500' : convert.evasion_risk_score > 0.3 ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Risco de Evasão</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-slate-800">{(convert.evasion_risk_score * 100).toFixed(0)}%</span>
                                <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400 border-slate-200">Heurística IA</Badge>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Baseado no tempo desde a decisão e falta de contatos registrados.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
