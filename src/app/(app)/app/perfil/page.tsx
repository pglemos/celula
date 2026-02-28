import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Settings, ShieldAlert, CreditCard, ChevronRight, QrCode } from "lucide-react";

export default function AppProfilePage() {
    return (
        <div className="space-y-6 animate-fade-in-up max-w-lg mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl font-black">
                            JS
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white h-8 w-8 rounded-full border-2 border-background flex items-center justify-center shadow-md">
                        <Trophy className="h-4 w-4" />
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">João Silva</h2>
                    <p className="text-sm text-muted-foreground mb-2">Membro desde Nov/2023</p>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px]">
                        Nível 4 • Discípulo
                    </Badge>
                </div>

                {/* Virtual ID Card / QR Code Action */}
                <Button variant="outline" className="w-full gap-2 mt-2 h-12 bg-secondary/50">
                    <QrCode className="h-5 w-5 text-primary" /> Carteirinha Digital
                </Button>
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
                <h3 className="font-semibold text-lg text-muted-foreground px-2">Minha Conta</h3>

                <Card className="bento-card hover:bg-secondary/20 transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-sm">Dízimos e Ofertas</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>

                <Card className="bento-card hover:bg-secondary/20 transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-sm">Minhas Conquistas (Badges)</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>

                <Card className="bento-card hover:bg-secondary/20 transition-colors cursor-pointer group">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-500/10 text-zinc-500 flex items-center justify-center shrink-0">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-sm">Configurações do App</div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                </Card>

                <Card className="bento-card hover:bg-secondary/20 transition-colors cursor-pointer group mt-6">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-sm text-rose-500">Sair da Conta</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
