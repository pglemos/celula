"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppHeader() {
    const pathname = usePathname();

    const navigation = [
        { label: "Dashboard", href: "/" },
        { label: "Membros", href: "/membros" },
        { label: "Células", href: "/celulas" },
        { label: "Eventos", href: "/eventos" },
    ];

    return (
        <header className="flex h-16 items-center justify-between bg-transparent border-none px-6 md:px-8">
            {/* Left spacer */}
            <div className="w-1/4" />

            {/* Center Navigation Pills */}
            <div className="hidden md:flex flex-1 justify-center">
                <div className="backdrop-blur-xl p-1 rounded-full border border-slate-200/60 bg-white/70 shadow-sm flex items-center gap-0.5">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link href={item.href} key={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "rounded-full px-5 font-semibold text-[13px] tracking-wide transition-all duration-200 h-9",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
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
            <div className="flex items-center gap-3 w-1/4 justify-end">
                {/* Search */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600" />
                    <Input
                        placeholder="Buscar..."
                        className="w-48 h-9 pl-10 text-[13px] font-medium border-slate-200/60 bg-white/70 rounded-full focus:w-56 transition-all"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100/60">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[9px] flex items-center justify-center bg-red-500 text-white border-2 border-white shadow-sm">
                        3
                    </Badge>
                </Button>

                {/* User Avatar */}
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="text-[11px] font-bold bg-slate-900 text-white">
                        PP
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
