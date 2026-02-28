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
    Trophy,
    Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    section?: string;
}

const navigation: NavItem[] = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        section: "Pessoas",
        label: "Membros",
        href: "/membros",
        icon: Users,
    },
    {
        label: "Consolidação",
        href: "/consolidacao",
        icon: Heart,
    },
    {
        section: "Crescimento",
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
        section: "Atividades",
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
        section: "Gestão",
        label: "Financeiro",
        href: "/contribuicoes",
        icon: HandCoins,
    },
    {
        label: "Gamificação",
        href: "/gamificacao",
        icon: Trophy,
    },
    {
        label: "IA Pastoral",
        href: "/ia",
        icon: Bot,
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
                "relative z-40 hidden md:flex flex-col h-full bg-[#0a0a0a] text-white transition-all duration-300 rounded-[2.5rem] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.15)] overflow-hidden",
                collapsed ? "w-[88px]" : "w-[280px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-24 items-center gap-4 px-6 pt-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                    <Church className="h-6 w-6 text-white" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden animate-fade-in-up">
                        <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                            Central
                        </span>
                        <span className="text-[11px] font-medium text-white/50 uppercase tracking-[0.2em] mt-1">
                            OS 3.0
                        </span>
                    </div>
                )}
            </div>

            {/* Main Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {navigation.map((item, index) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                    const sectionLabel = item.section && (
                        <div key={`section-${item.section}`} className={cn("px-3 pt-4 pb-1", index === 0 && "pt-0")}>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                {item.section}
                            </span>
                        </div>
                    );

                    const linkContent = (
                        <Link
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

                    const navElement = collapsed ? (
                        <Tooltip key={`nav-${index}`} delayDuration={0}>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right" sideOffset={8}>
                                {item.label}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <div key={`nav-${index}`} className="relative">{linkContent}</div>
                    );

                    return (
                        <div key={`group-${index}`}>
                            {!collapsed && sectionLabel}
                            {navElement}
                        </div>
                    );
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
