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
        href: "/converts",
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
    const [collapsed, setCollapsed] = useState(true);

    return (
        <aside
            className={cn(
                "relative z-40 hidden md:flex flex-col h-full bg-transparent text-slate-800 transition-all duration-300 py-4",
                collapsed ? "w-[96px]" : "w-[280px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-24 items-center gap-4 px-6 pt-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#121212] shadow-xl shadow-black/10">
                    <Church className="h-6 w-6 text-white" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col animate-fade-in-up">
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                            Central
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-1">
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
                                "flex items-center justify-center rounded-2xl transition-all duration-300",
                                collapsed ? "h-12 w-12 mx-auto" : "h-12 w-12 mx-4",
                                isActive
                                    ? "bg-white text-slate-900 shadow-[0_8px_16px_rgba(0,0,0,0.06)] border border-transparent"
                                    : "text-slate-400 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-slate-900" : ""
                                )}
                            />
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
            <div className="px-1 py-3 space-y-2">
                {bottomNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-center rounded-full h-12 w-12 mx-4 transition-all duration-300",
                                isActive
                                    ? "bg-white/80 text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-white"
                                    : "text-slate-400 hover:bg-white/40 hover:text-slate-800"
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                        </Link>
                    );
                })}
            </div>

            {/* Collapse Toggle */}
            <div className="p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full justify-center text-slate-400 hover:text-slate-900 rounded-full py-6"
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
