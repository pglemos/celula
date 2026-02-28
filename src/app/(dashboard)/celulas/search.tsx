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
            <div className="flex flex-col gap-4 sm:flex-row items-center mb-6">
                <div className="relative flex-1 group w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px]">
                    <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        placeholder="Buscar por nome, categoria ou bairro..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-14 h-16 bg-white/60 hover:bg-white focus:bg-white transition-all border-none rounded-[40px] placeholder:text-slate-400 text-lg font-medium text-slate-700"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="ghost" className="gap-2 rounded-[24px] h-16 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </Button>
                    <Link href="/celulas/nova">
                        <Button className="rounded-[24px] h-16 px-10 text-base tracking-wide font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                            Nova Célula
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cells.length === 0 ? (
                    <Card className="bento-card sm:col-span-3 border-none rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60">
                        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center min-h-[300px] justify-center">
                            <p className="text-lg">Nenhuma célula encontrada.</p>
                            <Link href="/celulas/nova">
                                <Button className="mt-6 bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-12 font-bold shadow-md">
                                    Cadastrar primeira célula
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    cells.map((cell, i) => {
                        const health = getCellHealth(cell.members_count);
                        return (
                            <Link href={`/celulas/${cell.id}`} key={cell.id} className="block group">
                                <Card
                                    className="cursor-pointer h-full border-none rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-md group-hover:bg-white/80 transition-all duration-300"
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-2xl text-slate-800 group-hover:text-indigo-600 transition-colors">{cell.name}</h3>
                                                <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                                                    {cell.leader?.full_name || "Sem líder"}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border-none ${healthColors[health]}`}>
                                                {healthLabels[health]}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-indigo-500" />
                                                </div>
                                                <span className="text-slate-700">{cell.members_count} <span className="text-slate-400 text-xs">membros</span></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <span className="text-slate-700">{cell.meeting_day ? meetingDays[cell.meeting_day] || cell.meeting_day : "—"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 col-span-2 mt-2">
                                                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                                    <MapPin className="h-4 w-4 text-emerald-500" />
                                                </div>
                                                <span className="text-slate-700 truncate">{cell.address_neighborhood || "Endereço não informado"}</span>
                                            </div>
                                        </div>
                                        {cell.category && (
                                            <div className="pt-2">
                                                <Badge variant="outline" className="px-4 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 border-none rounded-2xl">
                                                    {cell.category}
                                                </Badge>
                                            </div>
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
