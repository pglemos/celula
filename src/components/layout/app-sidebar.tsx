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
                "relative z-40 hidden md:flex flex-col h-full bg-white text-slate-800 transition-all duration-300 rounded-[2.5rem] shadow-[0_4px_40px_rgba(0,0,0,0.03)] overflow-hidden",
                collapsed ? "w-[96px]" : "w-[280px]"
            )}
        >
            {/* Logo */}
            <div className="flex h-24 items-center gap-4 px-6 pt-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#121212] shadow-xl shadow-black/10">
                    <Church className="h-6 w-6 text-white" />
                </div>
                {!collapsed && (
                    <div className="flex flex-col overflow-hidden animate-fade-in-up">
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
                                "flex items-center gap-3 rounded-full px-4 mx-2 py-3 text-sm font-semibold transition-all duration-300",
                                isActive
                                    ? "bg-[#121212] text-white shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-[1px]"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                                collapsed && "justify-center px-0 mx-3 py-3"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : ""
                                )}
                            />
                            {!collapsed && <span>{item.label}</span>}
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
            <div className="border-t border-slate-100 px-1 py-3 space-y-2">
                {bottomNav.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-full px-4 mx-2 py-3 text-sm font-semibold transition-all duration-300",
                                isActive
                                    ? "bg-[#121212] text-white shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-[1px]"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                                collapsed && "justify-center px-0 mx-3 py-3"
                            )}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Collapse Toggle */}
            <div className="border-t border-slate-100 p-3">
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
