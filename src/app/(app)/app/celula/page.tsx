import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, CalendarClock, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppMyCellPage() {
    return (
        <div className="space-y-6 animate-fade-in-up max-w-lg mx-auto">
            {/* Header Info */}
            <div className="flex items-center justify-between pb-4 border-b border-border/20">
                <div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-2">Minha Célula</Badge>
                    <h2 className="text-2xl font-bold">Célula Esperança</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> Centro, Campinas
                    </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                </div>
            </div>

            {/* Next Meeting Card */}
            <Card className="bento-card-primary bg-gradient-to-br from-primary to-accent border-none shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-primary-foreground flex items-center gap-2">
                        <CalendarClock className="h-5 w-5" /> Próxima Reunião
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-primary-foreground/90">
                        <div>
                            <p className="text-2xl font-black">Quarta, 19:30</p>
                            <p className="text-sm">Casa do João (Rua das Flores, 123)</p>
                        </div>
                        <div className="pt-3 border-t border-primary-foreground/20 flex gap-2">
                            <Button variant="secondary" className="flex-1 font-bold"> Confirmar Presença </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leaders and Members */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Liderança</h3>
                <Card className="bento-card">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-primary/20 text-primary font-bold">MC</AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-bold text-sm">Marcos Costa</h4>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Líder</p>
                            </div>
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                            <MessageCircle className="h-4 w-4 text-primary" />
                        </Button>
                    </CardContent>
                </Card>

                <h3 className="font-semibold text-lg mt-6">Participantes (12)</h3>
                <Card className="bento-card">
                    <CardContent className="p-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Avatar key={i} className="h-10 w-10 border-2 border-background shadow-xs m-auto">
                                <AvatarFallback className="bg-secondary text-xs">P{i + 1}</AvatarFallback>
                            </Avatar>
                        ))}
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground border-2 border-background shadow-xs m-auto">
                            +4
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
