"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CircleDot,
    Network,
    CalendarDays,
    GraduationCap,
    Heart,
    HandCoins,
    Settings,
    Church,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const navigation = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Membros",
        href: "/membros",
        icon: Users,
    },
    {
        label: "Células",
        href: "/celulas",
        icon: CircleDot,
    },
    {
        label: "Supervisão",
        href: "/supervisao",
        icon: Network,
    },
    {
        label: "Consolidação",
        href: "/consolidacao",
        icon: Heart,
    },
    {
        label: "Eventos",
        href: "/eventos",
        icon: CalendarDays,
    },
    {
        label: "Cursos",
        href: "/cursos",
        icon: GraduationCap,
    },
    {
        label: "Contribuições",
        href: "/contribuicoes",
        icon: HandCoins,
    },
];

const bottomNav = [
    {
        label: "Configurações",
        href: "/configuracoes",
        icon: Settings,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
                collapsed ? "w-[68px]" : "w-[260px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Church className="h-5 w-5 text-primary-foreground" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
                            Central 3.0
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Church OS
                        </span>
                    </div>
                )}
            </div>

            {/* Main Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    const linkContent = (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/15 text-primary shadow-sm"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 shrink-0",
                                    isActive ? "text-primary" : ""
                                )}
                            />
                            {!collapsed && <span>{item.label}</span>}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                            )}
                        </Link>
                    );

                    if (collapsed) {
                        return (
                            <Tooltip key={item.href} delayDuration={0}>
                                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                <TooltipContent side="right" sideOffset={8}>
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    }

                    return <div key={item.href} className="relative">{linkContent}</div>;
                })}
            </nav>

            {/* Bottom Nav */}
            <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
                {bottomNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/15 text-primary"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Collapse Toggle */}
            <div className="border-t border-sidebar-border p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </aside>
    );
}
