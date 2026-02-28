"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Calendar, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CellData {
    id: string;
    name: string;
    category: string | null;
    meeting_day: string | null;
    meeting_time: string | null;
    address_neighborhood: string | null;
    status: string;
    members_count: number;
    leader: { id: string; full_name: string } | null;
}

function getCellHealth(membersCount: number): "green" | "yellow" | "red" {
    if (membersCount >= 5) return "green";
    if (membersCount >= 3) return "yellow";
    return "red";
}

const healthColors = {
    green: "bg-emerald-400/20 text-emerald-400 border-emerald-400/30",
    yellow: "bg-amber-400/20 text-amber-400 border-amber-400/30",
    red: "bg-red-400/20 text-red-400 border-red-400/30",
};
const healthLabels = { green: "Saudável", yellow: "Atenção", red: "Crítico" };

export function CelulasSearch({
    initialSearch,
    cells,
    meetingDays,
}: {
    initialSearch: string;
    cells: CellData[];
    meetingDays: Record<string, string>;
}) {
    const [search, setSearch] = useState(initialSearch);
    const router = useRouter();

    const handleSearch = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        router.push(`/celulas${params.toString() ? `?${params}` : ""}`);
    };

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, categoria ou bairro..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 bg-secondary border-none"
                    />
                </div>
                <Button variant="outline" size="default" className="gap-2 shrink-0">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cells.length === 0 ? (
                    <Card className="glass-card border-border/50 sm:col-span-3">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <p>Nenhuma célula encontrada.</p>
                        </CardContent>
                    </Card>
                ) : (
                    cells.map((cell, i) => {
                        const health = getCellHealth(cell.members_count);
                        return (
                            <Link href={`/celulas/${cell.id}`} key={cell.id}>
                                <Card
                                    className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up h-full"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-base">{cell.name}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {cell.leader?.full_name || "Sem líder"}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className={`text-[10px] ${healthColors[health]}`}>
                                                {healthLabels[health]}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-3.5 w-3.5 text-primary/60" />
                                                <span>{cell.members_count} participantes</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                                <span>{cell.meeting_day ? meetingDays[cell.meeting_day] || cell.meeting_day : "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-primary/60" />
                                                <span>{cell.meeting_time?.slice(0, 5) || "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                                <span>{cell.address_neighborhood || "—"}</span>
                                            </div>
                                        </div>
                                        {cell.category && (
                                            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary/80">
                                                {cell.category}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                )}
            </div>
        </>
    );
}
