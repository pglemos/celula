"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRightLeft, Check, Save } from "lucide-react";
import { updateMultiplicationDistribution } from "@/lib/actions/cell-advanced";

export function MultiplicationDistributor({ 
    planId, 
    members, 
    initialDistribution 
}: { 
    planId: string; 
    members: any[]; 
    initialDistribution?: { original: string[]; new: string[] } 
}) {
    const [original, setOriginal] = useState<string[]>(
        initialDistribution?.original || members.map(m => m.person.id)
    );
    const [newCell, setNewCell] = useState<string[]>(
        initialDistribution?.new || []
    );
    const [loading, setLoading] = useState(false);

    const moveToNew = (personId: string) => {
        setOriginal(prev => prev.filter(id => id !== personId));
        setNewCell(prev => [...prev, personId]);
    };

    const moveToOriginal = (personId: string) => {
        setNewCell(prev => prev.filter(id => id !== personId));
        setOriginal(prev => [...prev, personId]);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateMultiplicationDistribution(planId, { original, new: newCell });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Original Cell */}
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Célula Atual ({original.length})</p>
                    <div className="min-h-[200px] p-2 bg-secondary/20 rounded-xl border border-border/50 space-y-2">
                        {original.map(id => {
                            const person = members.find(m => m.person.id === id)?.person;
                            return (
                                <div key={id} className="flex items-center justify-between p-2 bg-background rounded-lg border border-border/40 text-sm">
                                    <span className="truncate">{person?.full_name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveToNew(id)}>
                                        <ArrowRightLeft className="h-3 w-3" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* New Cell */}
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Nova Célula ({newCell.length})</p>
                    <div className="min-h-[200px] p-2 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                        {newCell.map(id => {
                            const person = members.find(m => m.person.id === id)?.person;
                            return (
                                <div key={id} className="flex items-center justify-between p-2 bg-background rounded-lg border border-primary/20 text-sm">
                                    <span className="truncate">{person?.full_name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={() => moveToOriginal(id)}>
                                        <ArrowRightLeft className="h-3 w-3" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Button className="w-full gap-2" onClick={handleSave} disabled={loading}>
                {loading ? "Salvando..." : <><Save className="h-4 w-4" /> Salvar Distribuição</>}
            </Button>
        </div>
    );
}
