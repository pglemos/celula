"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

    const navigation = [
        { label: "Dashboard", href: "/" },
        { label: "Membros", href: "/membros" },
        { label: "Células", href: "/celulas" },
        { label: "Eventos", href: "/eventos" },
    ];

    return (
        <header className="flex h-20 items-center justify-between bg-transparent border-none px-6 md:px-8 mt-4">

            {/* Left side empty or page title placeholder depending on view, currently empty to match reference where title is below */}
            <div className="w-1/4"></div>

            {/* Center Navigation Pills (The SugarCRM Look) */}
            <div className="hidden md:flex flex-1 justify-center">
                <div className="bg-black/20 backdrop-blur-xl p-1.5 rounded-full border border-white/20 shadow-xl flex items-center gap-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link href={item.href} key={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "rounded-full px-8 font-bold tracking-wide transition-all duration-300 h-10",
                                        isActive
                                            ? "bg-white text-slate-900 shadow-md border border-white"
                                            : "text-white/80 hover:bg-white/20 hover:text-white"
                                    )}
                                >
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Right side Actions */}
            <div className="flex items-center gap-4 w-1/4 justify-end">
                {/* Search */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors" />
                    <Input
                        placeholder="Buscar..."
                        className="w-56 h-11 bg-black/20 hover:bg-black/30 focus:bg-black/40 backdrop-blur-md transition-all pl-11 text-sm font-medium border border-white/20 shadow-sm rounded-full placeholder:text-white/60 text-white"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative rounded-full h-11 w-11 bg-black/20 hover:bg-black/30 backdrop-blur-md shadow-sm border border-white/20 text-white/80 hover:text-white transition-all">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute right-0 top-0 h-4 w-4 rounded-full p-0 text-[9px] flex items-center justify-center bg-red-500 text-white border-2 border-transparent shadow-sm">
                        3
                    </Badge>
                </Button>

                {/* User Avatar */}
                <div className="flex items-center gap-3 pl-2">
                    <Avatar className="h-11 w-11 border-2 border-white/40 shadow-md">
                        <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">
                            PP
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
