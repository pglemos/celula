import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, ChevronRight, Bookmark } from "lucide-react";

export default function AppDevotionalPage() {
    return (
        <div className="space-y-6 animate-fade-in-up max-w-lg mx-auto">
            {/* Header Info */}
            <div className="flex items-center justify-between pb-4 border-b border-border/20">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" /> Devocional
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sua jornada diária de leitura bíblica
                    </p>
                </div>
            </div>

            {/* Current Reading */}
            <Card className="bento-card-primary bg-gradient-to-br from-indigo-500 to-primary border-none shadow-lg">
                <CardContent className="p-6 relative text-white">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white mb-4 border-none">Plano Anual</Badge>
                    <div className="space-y-2 mb-6">
                        <h3 className="text-2xl font-black">João 14-16</h3>
                        <p className="text-sm text-white/80">Dia 124 • A Promessa do Consolidador</p>
                    </div>

                    <button className="w-full bg-white text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                        <BookOpen className="h-5 w-5" /> Iniciar Leitura
                    </button>

                    <div className="absolute top-4 right-4">
                        <Bookmark className="h-6 w-6 text-white/40" />
                    </div>
                </CardContent>
            </Card>

            {/* Weekly Progress */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Sua Semana</h3>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">4 Dias Seguidos! 🔥</span>
                </div>

                <Card className="bento-card">
                    <CardContent className="p-4 flex justify-between items-center px-6">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => {
                            const isPast = i < 4;
                            const isToday = i === 4;

                            return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {day}
                                    </span>
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isPast ? 'bg-emerald-500 text-white shadow-md' :
                                            isToday ? 'border-2 border-primary bg-primary/10' :
                                                'bg-secondary/50 text-muted-foreground'
                                        }`}>
                                        {isPast ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 12}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Previous Readings (History) */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Leituras Recentes</h3>

                {['João 11-13', 'João 8-10', 'João 5-7'].map((reading, i) => (
                    <Card key={i} className="bento-card hover:bg-secondary/20 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{reading}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase mt-0.5 tracking-wider">
                                        Dia {123 - i} • Concluído
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
