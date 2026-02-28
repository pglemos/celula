import { getPastoralInsights } from "@/lib/actions/ai-advanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, AlertTriangle, MessageSquare, TrendingUp, BookOpen, Sparkles } from "lucide-react";

export default async function PastoralAIPage() {
    const insights = await getPastoralInsights();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800 flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-600">
                            <Bot className="h-6 w-6" />
                        </div>
                        IA Pastoral
                    </h1>
                    <p className="text-base font-medium text-slate-500 mt-1 ml-14">
                        Assistente virtual com insights estratégicos para o pastoreio
                    </p>
                </div>
                <Badge className="rounded-full px-4 py-1.5 text-xs font-bold bg-indigo-100 text-indigo-600 border-none shadow-sm">
                    <Sparkles className="h-3 w-3 mr-1" /> BETA
                </Badge>
            </div>

            {/* Resumo Semanal */}
            <Card className="border-none shadow-[0_16px_40px_rgba(99,102,241,0.1)] bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[40px] overflow-hidden text-white">
                <CardHeader className="px-8 pt-8 pb-2">
                    <CardTitle className="text-xl font-medium flex items-center gap-2 text-white/90">
                        <TrendingUp className="h-5 w-5" /> Resumo Semanal da Igreja
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <p className="text-base leading-relaxed text-white/90 font-medium">
                        &ldquo;{insights.summary}&rdquo;
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Alertas Preditivos */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                        <CardTitle className="text-xl font-medium text-slate-800 flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-amber-100 text-amber-600">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            Alertas Preditivos
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 mt-1 ml-12">Padrões detectados pela IA que exigem atenção</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-3 mt-6">
                            {insights.predictiveAlerts.map((alert, idx) => (
                                <div key={idx} className="p-5 rounded-[24px] bg-white/80 border border-slate-100 relative overflow-hidden hover:shadow-sm transition-all">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-full ${alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <div className="flex items-start justify-between gap-2 ml-3">
                                        <h4 className="font-semibold text-sm text-slate-800">{alert.title}</h4>
                                        <Badge variant="outline" className={`text-[10px] uppercase rounded-full font-bold ${alert.severity === 'high' ? 'text-rose-500 border-rose-200 bg-rose-50' : alert.severity === 'medium' ? 'text-amber-500 border-amber-200 bg-amber-50' : 'text-emerald-500 border-emerald-200 bg-emerald-50'}`}>
                                            {alert.severity === 'high' ? 'Crítico' : alert.severity === 'medium' ? 'Atenção' : 'Info'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 leading-relaxed ml-3">
                                        {alert.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sugestões de Pregação */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                        <CardTitle className="text-xl font-medium text-slate-800 flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-violet-100 text-violet-600">
                                <Lightbulb className="h-5 w-5" />
                            </div>
                            Temas Sugeridos
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 mt-1 ml-12">Sermões recomendados para o momento atual</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-3 mt-6">
                            {insights.preachingTopics.map((topic: any, idx) => (
                                <div key={idx} className="p-5 rounded-[24px] bg-indigo-50/50 border border-indigo-100">
                                    <h4 className="font-semibold text-sm text-indigo-600">{topic.topic || topic.title}</h4>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                        <span className="font-semibold text-slate-700">Motivo:</span> {topic.reason}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-indigo-100 flex flex-wrap gap-2">
                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" /> Referências:
                                        </span>
                                        {topic.scriptures.map((ref: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-full font-bold">
                                                {ref}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Alertas do Sistema */}
                <Card className="md:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                        <CardTitle className="text-xl font-medium text-slate-800 flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-blue-100 text-blue-600">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            Alertas Ativos do Sistema
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 mt-1 ml-12">Notificações geradas automaticamente pelas regras de supervisão</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        {insights.systemAlerts.length === 0 ? (
                            <div className="py-8 text-center text-sm text-slate-400">
                                <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-lg font-medium text-slate-500">A igreja está saudável</p>
                                <p className="text-sm text-slate-400 mt-1">Nenhum alerta pendente</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {insights.systemAlerts.map((alert, idx) => (
                                    <div key={idx} className="p-4 rounded-[24px] bg-white/80 border border-slate-100 hover:shadow-sm transition-all">
                                        <p className="font-semibold truncate text-sm text-slate-800">{alert.title}</p>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
