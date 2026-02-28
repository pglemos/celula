"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getIAMatchedCells } from "@/lib/actions/consolidation";

export function CellMatchingCard({ convertId }: { convertId: string }) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getIAMatchedCells(convertId);
                setSuggestions(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [convertId]);

    if (loading) return <div className="animate-pulse h-48 bg-slate-100 rounded-xl" />;
    if (suggestions.length === 0) return null;

    return (
        <Card className="border-none shadow-md bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-md font-semibold text-indigo-900 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Sugestões da IA (Ideal Match)
                    </CardTitle>
                    <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        Top {suggestions.length}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {suggestions.map((cell, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm border border-indigo-50 hover:border-indigo-200 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {cell.match_score * 100}%
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-800">{cell.cell_name || "Célula Sugerida"}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {cell.neighborhood || "Próxima"}
                                        </span>
                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {cell.reason}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-indigo-400 group-hover:text-indigo-600 group-hover:bg-indigo-50">
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
