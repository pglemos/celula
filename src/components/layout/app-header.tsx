"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const breadcrumbLabels: Record<string, string> = {
    "": "Dashboard",
    membros: "Membros",
    celulas: "Células",
    supervisao: "Supervisão",
    consolidacao: "Consolidação",
    eventos: "Eventos",
    cursos: "Cursos",
    contribuicoes: "Contribuições",
    configuracoes: "Configurações",
    novo: "Novo",
};

export function AppHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs =
        segments.length === 0
            ? ["Dashboard"]
            : segments.map(
                (seg) =>
                    breadcrumbLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
            );

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-2">
                        {i > 0 && <span className="text-muted-foreground">/</span>}
                        <span
                            className={
                                i === breadcrumbs.length - 1
                                    ? "font-semibold text-foreground"
                                    : "text-muted-foreground"
                            }
                        >
                            {crumb}
                        </span>
                    </span>
                ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar..."
                        className="w-64 bg-secondary pl-9 text-sm border-none"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Badge className="absolute -right-0.5 -top-0.5 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-destructive text-white border-2 border-background">
                        3
                    </Badge>
                </Button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-2 border-l border-border">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium">Pastor Paulo</span>
                        <span className="text-[11px] text-muted-foreground">
                            Pastor Sênior
                        </span>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                            PP
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
