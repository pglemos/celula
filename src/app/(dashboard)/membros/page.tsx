"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MembershipBadge } from "@/components/ui/status-badge";
import { mockMembers } from "@/lib/mock-data";
import Link from "next/link";

export default function MembrosPage() {
    const [search, setSearch] = useState("");

    const filtered = mockMembers.filter(
        (m) =>
            m.full_name.toLowerCase().includes(search.toLowerCase()) ||
            m.cell_name.toLowerCase().includes(search.toLowerCase()) ||
            m.neighborhood.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Membros</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockMembers.length} pessoas cadastradas
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                    <Link href="/membros/novo">
                        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Novo Membro
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, célula ou bairro..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-secondary border-none"
                    />
                </div>
                <Button variant="outline" size="default" className="gap-2 shrink-0">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </div>

            {/* Members List */}
            <div className="grid gap-3">
                {filtered.map((member, i) => (
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
                                        {member.cell_name} • {member.neighborhood}
                                    </p>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs text-muted-foreground">
                                        {member.phone}
                                    </p>
                                </div>
                                <MembershipBadge status={member.membership_status} />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
