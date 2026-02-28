import { getPastoralInsights } from "@/lib/actions/ai-advanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Lightbulb, AlertTriangle, MessageSquare, TrendingUp, BookOpen } from "lucide-react";

export default async function PastoralAIPage() {
    const insights = await getPastoralInsights();

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Bot className="h-6 w-6 text-primary" /> IA Pastoral
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Assistente virtual com insights estratégicos para o pastoreio
                    </p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    BETA
                </Badge>
            </div>

            {/* Resumo Semanal */}
            <Card className="bento-card-primary">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" /> Resumo Semanal da Igreja
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed text-primary-foreground/90 font-medium">
                        "{insights.summary}"
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Alertas Preditivos */}
                <Card className="bento-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" /> Alertas Preditivos
                        </CardTitle>
                        <CardDescription>Padrões detectados pela IA que exigem atenção</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mt-4">
                            {insights.predictiveAlerts.map((alert, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-border/50 bg-secondary/30 relative overflow-hidden group hover:bg-secondary/50 transition-colors">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.severity === 'high' ? 'bg-rose-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-bold text-sm">{alert.title}</h4>
                                        <Badge variant="outline" className={`text-[10px] uppercase ${alert.severity === 'high' ? 'text-rose-500 border-rose-500/30' : alert.severity === 'medium' ? 'text-amber-500 border-amber-500/30' : 'text-emerald-500 border-emerald-500/30'}`}>
                                            {alert.severity === 'high' ? 'Crítico' : alert.severity === 'medium' ? 'Atenção' : 'Info'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        {alert.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sugestões de Pregação */}
                <Card className="bento-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-indigo-500" /> Temas Sugeridos para Pregação
                        </CardTitle>
                        <CardDescription>Sermões recomendados baseados no momento atual da igreja</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mt-4">
                            {insights.preachingTopics.map((topic: any, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 relative">
                                    <h4 className="font-bold text-sm text-indigo-400">{topic.topic || topic.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                        <span className="font-semibold text-foreground/80">Motivo:</span> {topic.reason}
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-indigo-500/10 flex flex-wrap gap-2">
                                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" /> Referências:
                                        </span>
                                        {topic.scriptures.map((ref: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20">
                                                {ref}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Resumo de Alertas do Sistema */}
                <Card className="bento-card md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-500" /> Alertas Ativos do Sistema
                        </CardTitle>
                        <CardDescription>Notificações geradas automaticamente pelas regras de supervisão</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {insights.systemAlerts.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                A igreja está saudável. Nenhum alerta pendente.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                {insights.systemAlerts.map((alert, idx) => (
                                    <div key={idx} className="p-3 rounded-lg bg-secondary/30 text-sm">
                                        <p className="font-bold truncate">{alert.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
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
