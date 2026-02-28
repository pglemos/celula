import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Share2, Flame } from "lucide-react";

export default function AppHomePage() {
    return (
        <div className="space-y-6 animate-fade-in-up max-w-lg mx-auto">
            {/* Header Greeting */}
            <div>
                <h2 className="text-2xl font-bold">Olá, João!</h2>
                <p className="text-sm text-muted-foreground">Que bom ter você aqui hoje.</p>
            </div>

            {/* Daily Devotional Highlight */}
            <Card className="bento-card-primary border-none shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Flame className="h-24 w-24" />
                </div>
                <CardHeader className="pb-2 relative z-10">
                    <Badge className="w-fit bg-white/20 text-white hover:bg-white/30 border-none mb-2">Devocional Diário</Badge>
                    <CardTitle className="text-xl">A Força da Comunhão</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                    <p className="text-sm text-primary-foreground/90 line-clamp-3 mb-4">
                        "Oh! quão bom e quão suave é que os irmãos vivam em união." - Salmos 133:1.
                        A verdadeira força da igreja não está em suas paredes, mas nos laços que nos unem...
                    </p>
                    <Button variant="secondary" className="w-full text-primary font-bold">
                        Ler Completo
                    </Button>
                </CardContent>
            </Card>

            {/* News Feed / Announcements */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">Feed da Igreja</h3>

                <Card className="bento-card">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/10">Aviso</Badge>
                            <span className="text-[10px] text-muted-foreground">Há 2 horas</span>
                        </div>
                        <h4 className="font-bold">Culto de Celebração Especial</h4>
                        <p className="text-sm text-muted-foreground">
                            Neste domingo teremos um culto especial de missões com o missionário Pedro Caxilé. Venha e traga um visitante!
                        </p>
                        <div className="flex gap-2 pt-2 border-t border-border/30">
                            <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground h-8">
                                <Heart className="h-4 w-4 mr-2" /> 24
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground h-8">
                                <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Event */}
                <Card className="bento-card">
                    <CardContent className="p-4 flex gap-4 items-center">
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-xl flex flex-col items-center justify-center shrink-0 border border-emerald-500/20">
                            <span className="text-xs font-bold text-emerald-500 uppercase">NOV</span>
                            <span className="text-xl font-black text-emerald-500 leading-none">15</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Conferência Jovem</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" /> 19:30 - Templo Principal
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
