"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Person {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
    membership_status: string;
    address_neighborhood: string | null;
    cell_members: Array<{
        cell_id: string;
        cells: { id: string; name: string } | null;
    }>;
}

export function MembrosSearch({
    initialSearch,
    people,
}: {
    initialSearch: string;
    people: Person[];
}) {
    const [search, setSearch] = useState(initialSearch);
    const router = useRouter();

    const handleSearch = (value: string) => {
        setSearch(value);
        const params = new URLSearchParams();
        if (value) params.set("q", value);
        router.push(`/membros${params.toString() ? `?${params}` : ""}`);
    };

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
                <Button variant="outline" size="default" className="gap-2 shrink-0">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </div>

            <div className="grid gap-3">
                {people.length === 0 ? (
                    <Card className="glass-card border-border/50">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <p>Nenhum membro encontrado.</p>
                            <Link href="/membros/novo">
                                <Button className="mt-4 bg-primary hover:bg-primary/90" size="sm">
                                    Cadastrar primeiro membro
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    people.map((member, i) => {
                        const cellName =
                            member.cell_members?.[0]?.cells?.name || "Sem célula";
                        return (
                            <Link href={`/membros/${member.id}`} key={member.id}>
                                <Card
                                    className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <Avatar className="h-11 w-11 border-2 border-primary/20">
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
                                            </p>
                                        </div>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {member.phone || "—"}
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
