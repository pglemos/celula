"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, CheckCircle2, UserPlus, XCircle } from "lucide-react";
import { updateFollowupStatus } from "@/lib/actions/settings";
import { useState } from "react";

export function FollowUpList({ followups }: { followups: any[] }) {
    const [loading, setLoading] = useState<string | null>(null);

    async function handleStatus(id: string, status: string) {
        setLoading(id);
        try {
            await updateFollowupStatus(id, status);
        } finally {
            setLoading(null);
        }
    }

    if (followups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 rounded-2xl border-2 border-dashed border-border/50">
                <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-bold">Nenhum follow-up pendente</h3>
                <p className="text-muted-foreground">Tudo em dia! Novos visitantes aparecerão aqui automaticamente.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {followups.map((f) => (
                <Card key={f.id} className="glass-card border-border/50 overflow-hidden group">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">{f.person?.full_name}</CardTitle>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Phone className="h-3 w-3" /> {f.person?.phone || "Sem telefone"}
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                Pendente
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Origem</p>
                            <p className="text-sm font-medium">{f.meeting?.cell?.name}</p>
                            <p className="text-xs text-muted-foreground">
                                Visitou em {new Date(f.meeting?.meeting_date).toLocaleDateString()} • Tema: {f.meeting?.theme || "N/A"}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-primary font-bold">
                            <Calendar className="h-3.5 w-3.5" />
                            Próximo contato: {new Date(f.next_contact_date).toLocaleDateString()}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button 
                                size="sm" 
                                className="flex-1 gap-1.5" 
                                onClick={() => handleStatus(f.id, "contacted")}
                                disabled={loading === f.id}
                            >
                                <CheckCircle2 className="h-4 w-4" /> Contatado
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 gap-1.5"
                                onClick={() => handleStatus(f.id, "integrated")}
                            >
                                <UserPlus className="h-4 w-4" /> Integrar
                            </Button>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="px-2 text-destructive hover:bg-destructive/10"
                                onClick={() => handleStatus(f.id, "lost")}
                            >
                                <XCircle className="h-4 w-4" /> Perda
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
