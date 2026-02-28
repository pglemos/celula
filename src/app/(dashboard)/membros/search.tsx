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

    // Extract unique neighborhoods for autocomplete
    const neighborhoods = [...new Set(
        people.map(p => p.address_neighborhood).filter(Boolean)
    )].sort() as string[];

    const activeFiltersCount = [
        statusFilter !== "all",
        genderFilter !== "all",
        neighborhoodFilter.length > 0,
    ].filter(Boolean).length;

    return (
        <>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, email, telefone ou bairro..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9 bg-secondary border-none"
                    />
                </div>
                <Button
                    variant={showFilters ? "default" : "outline"}
                    size="default"
                    className="gap-2 shrink-0"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="h-4 w-4" />
                    Filtros
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full bg-primary text-primary-foreground">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="default"
                    className="gap-2 shrink-0"
                    onClick={handleExport}
                    disabled={isPending}
                >
                    <Download className="h-4 w-4" />
                    {isPending ? "Exportando..." : "CSV"}
                </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <Card className="bento-card animate-fade-in-up">
                    <CardContent className="p-4">
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
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredPeople.length} resultado{filteredPeople.length !== 1 ? "s" : ""}
                    {activeFiltersCount > 0 && " (filtrado)"}
                </p>
            </div>

            <div className="grid gap-3">
                {filteredPeople.length === 0 ? (
                    <Card className="bento-card">
                        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
                            <p>Nenhum membro encontrado.</p>
                            <Link href="/membros/novo">
                                <Button className="mt-4 bg-primary hover:bg-primary/90" size="sm">
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
                                    className="bento-card cursor-pointer animate-fade-in-up"
                                    style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
                                >
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <Avatar className="h-11 w-11 border-2 border-primary/20">
                                            {member.photo_url ? (
                                                <AvatarImage src={member.photo_url} alt={member.full_name} />
                                            ) : null}
                                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                                {member.full_name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .slice(0, 2)
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {member.full_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {cellName} •{" "}
                                                {member.address_neighborhood || "Sem bairro"}
                                                {age !== null && ` • ${age} anos`}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {member.phone || "—"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 truncate max-w-[150px]">
                                                {member.email || ""}
                                            </p>
                                        </div>
                                        <MembershipBadge
                                            status={
                                                member.membership_status as
                                                | "member"
                                                | "baptized_non_member"
                                                | "non_baptized"
                                                | "visitor"
                                            }
                                        />
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
