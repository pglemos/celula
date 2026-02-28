"use client";

import { useState } from "react";
import { Search, Plus, Filter, MapPin, Calendar, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { mockCells } from "@/lib/mock-data";
import Link from "next/link";

export default function CelulasPage() {
    const [search, setSearch] = useState("");

    const filtered = mockCells.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.leader.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase()) ||
            c.neighborhood.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Células</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {mockCells.length} células ativas
                    </p>
                </div>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Nova Célula
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, líder, categoria ou bairro..."
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

            {/* Cells Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((cell, i) => (
                    <Link href={`/celulas/${cell.id}`} key={cell.id}>
                        <Card
                            className="glass-card border-border/50 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in-up h-full"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <CardContent className="p-5 space-y-4">
                                {/* Title + Status */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-base">{cell.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {cell.leader}
                                        </p>
                                    </div>
                                    <StatusBadge status={cell.health} />
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5 text-primary/60" />
                                        <span>{cell.members_count} participantes</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-primary/60" />
                                        <span>{cell.meeting_day}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-primary/60" />
                                        <span>{cell.meeting_time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                        <span>{cell.neighborhood}</span>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <Badge
                                    variant="outline"
                                    className="text-[10px] border-primary/20 text-primary/80"
                                >
                                    {cell.category}
                                </Badge>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
