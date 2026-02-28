"use client";

import { useState, useTransition } from "react";
import { Search, Filter, Download, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { exportPeopleCSV } from "@/lib/actions/people-advanced";
import { MEMBERSHIP_STATUS_LABELS, type MembershipStatus } from "@/types";
import { Users, Merge } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    photo_url: string | null;
    membership_status: string;
    address_neighborhood: string | null;
    gender: string | null;
    birth_date: string | null;
    cell_members: Array<{
        cell_id: string;
        cells: { id: string; name: string } | null;
    }>;
}

function getAge(birthDate: string | null): number | null {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

export function MembrosSearch({
    initialSearch,
    people,
}: {
    initialSearch: string;
    people: Person[];
}) {
    const [search, setSearch] = useState(initialSearch);
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [genderFilter, setGenderFilter] = useState<string>("all");
    const [neighborhoodFilter, setNeighborhoodFilter] = useState("");
    const [ageMin, setAgeMin] = useState<string>("");
    const [ageMax, setAgeMax] = useState<string>("");
    const [hasPhone, setHasPhone] = useState<boolean | "all">("all");
    const [hasEmail, setHasEmail] = useState<boolean | "all">("all");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSearch = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        router.push(`/membros${params.toString() ? `?${params}` : ""}`);
    };

    const handleExport = async () => {
        startTransition(async () => {
            const csv = await exportPeopleCSV({
                membership_status: statusFilter !== "all" ? statusFilter : undefined,
                neighborhood: neighborhoodFilter || undefined,
            });
            if (!csv) return;

            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `membros_${new Date().toISOString().split("T")[0]}.csv`;
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    // Client-side filtering
    let filteredPeople = people;
    if (statusFilter !== "all") {
        filteredPeople = filteredPeople.filter(p => p.membership_status === statusFilter);
    }
    if (genderFilter !== "all") {
        filteredPeople = filteredPeople.filter(p => p.gender === genderFilter);
    }
    if (neighborhoodFilter) {
        filteredPeople = filteredPeople.filter(p =>
            p.address_neighborhood?.toLowerCase().includes(neighborhoodFilter.toLowerCase())
        );
    }
    if (ageMin) {
        filteredPeople = filteredPeople.filter(p => {
            const age = getAge(p.birth_date);
            return age !== null && age >= parseInt(ageMin);
        });
    }
    if (ageMax) {
        filteredPeople = filteredPeople.filter(p => {
            const age = getAge(p.birth_date);
            return age !== null && age <= parseInt(ageMax);
        });
    }
    if (hasPhone !== "all") {
        filteredPeople = filteredPeople.filter(p => !!p.phone === hasPhone);
    }
    if (hasEmail !== "all") {
        filteredPeople = filteredPeople.filter(p => !!p.email === hasEmail);
    }

    // Extract unique neighborhoods for autocomplete
    const neighborhoods = [...new Set(
        people.map(p => p.address_neighborhood).filter(Boolean)
    )].sort() as string[];

    const activeFiltersCount = [
        statusFilter !== "all",
        genderFilter !== "all",
        neighborhoodFilter.length > 0,
        ageMin.length > 0,
        ageMax.length > 0,
        hasPhone !== "all",
        hasEmail !== "all",
    ].filter(Boolean).length;

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row items-center">
                <div className="relative flex-1 group w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px]">
                    <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                        placeholder="Buscar por nome, email, telefone ou bairro..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-14 h-16 bg-white/60 hover:bg-white focus:bg-white transition-all border-none rounded-[32px] placeholder:text-slate-400 text-lg font-medium text-slate-700"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant={showFilters ? "default" : "ghost"}
                        size="default"
                        className={cn(
                            "gap-2 rounded-[24px] h-16 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none",
                            showFilters ? "bg-slate-900 text-white" : "bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900"
                        )}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-5 w-5" />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-6 w-6 p-0 flex items-center justify-center text-[11px] rounded-full bg-indigo-500 text-white border-none">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        className="gap-2 rounded-[24px] h-16 px-8 font-bold bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none"
                        onClick={handleExport}
                        disabled={isPending}
                    >
                        <Download className="h-5 w-5" />
                        {isPending ? "..." : "CSV"}
                    </Button>
                    <Link href="/membros/novo">
                        <Button className="rounded-[24px] h-16 px-10 text-base tracking-wide font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                            Novo Membro
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <Card className="bento-card animate-fade-in-up border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 rounded-[32px]">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">Filtros Avançados</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setGenderFilter("all");
                                    setNeighborhoodFilter("");
                                    setAgeMin("");
                                    setAgeMax("");
                                    setHasPhone("all");
                                    setHasEmail("all");
                                }}
                            >
                                Limpar filtros
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {Object.entries(MEMBERSHIP_STATUS_LABELS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Gênero</label>
                                <Select value={genderFilter} onValueChange={setGenderFilter}>
                                    <SelectTrigger className="bg-secondary border-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="M">Masculino</SelectItem>
                                        <SelectItem value="F">Feminino</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Bairro</label>
                                <Input
                                    placeholder="Filtrar por bairro..."
                                    value={neighborhoodFilter}
                                    onChange={(e) => setNeighborhoodFilter(e.target.value)}
                                    className="bg-secondary border-none"
                                    list="neighborhoods"
                                />
                                <datalist id="neighborhoods">
                                    {neighborhoods.map(n => (
                                        <option key={n} value={n} />
                                    ))}
                                </datalist>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Idade (Mín/Máx)</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Min"
                                        value={ageMin}
                                        onChange={(e) => setAgeMin(e.target.value)}
                                        className="bg-secondary border-none"
                                        type="number"
                                    />
                                    <Input
                                        placeholder="Max"
                                        value={ageMax}
                                        onChange={(e) => setAgeMax(e.target.value)}
                                        className="bg-secondary border-none"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Possui Dados</label>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={hasPhone === true ? "default" : "secondary"}
                                        onClick={() => setHasPhone(hasPhone === true ? "all" : true)}
                                        className="text-[10px] h-8 flex-1"
                                    >
                                        Telefone
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={hasEmail === true ? "default" : "secondary"}
                                        onClick={() => setHasEmail(hasEmail === true ? "all" : true)}
                                        className="text-[10px] h-8 flex-1"
                                    >
                                        E-mail
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4 mb-2 px-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                    {filteredPeople.length} resultado{filteredPeople.length !== 1 ? "s" : ""}
                    {activeFiltersCount > 0 && " (filtrado)"}
                </p>
            </div>

            <div className="grid gap-4">
                {filteredPeople.length === 0 ? (
                    <Card className="bento-card border-none rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60">
                        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
                            <p className="text-lg">Nenhum membro encontrado.</p>
                            <Link href="/membros/novo">
                                <Button className="mt-6 bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-12 font-bold shadow-md">
                                    Cadastrar primeiro membro
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPeople.map((member, i) => {
                        const cellName =
                            member.cell_members?.[0]?.cells?.name || "Sem célula";
                        const age = getAge(member.birth_date);
                        return (
                            <Link href={`/membros/${member.id}`} key={member.id}>
                                <Card
                                    className="cursor-pointer group hover:bg-white/80 transition-all border-none rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/40 backdrop-blur-md"
                                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                                >
                                    <CardContent className="flex items-center gap-6 p-4 pl-6">
                                        <Avatar className="h-14 w-14 border-4 border-white shadow-sm ring-2 ring-slate-100/50">
                                            {member.photo_url ? (
                                                <AvatarImage src={member.photo_url} alt={member.full_name} />
                                            ) : null}
                                            <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-bold">
                                                {member.full_name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .slice(0, 2)
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                {member.full_name}
                                            </p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate mt-1">
                                                {cellName} • {member.address_neighborhood || "Sem bairro"}
                                            </p>
                                        </div>
                                        <div className="hidden lg:flex items-center gap-8 px-8 text-right border-r border-slate-200/50 mr-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Contato</span>
                                                <span className="text-sm font-semibold text-slate-600">{member.phone || "—"}</span>
                                            </div>
                                        </div>
                                        <div className="pr-4">
                                            <MembershipBadge
                                                status={
                                                    member.membership_status as any
                                                }
                                            />
                                        </div>
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
