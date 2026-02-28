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
    const [isCollapsed, setCollapsed] = useState(true);

    return (
        <aside
            className={cn(
                "relative z-50 h-full rounded-[32px] overflow-visible border-none bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 flex flex-col shrink-0",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center justify-center border-b border-white/20 px-4">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-3 transition-all",
                        isCollapsed ? "justify-center" : "w-full pl-2"
                    )}
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-slate-900 text-white shadow-md">
                        <Church className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            Célula<span className="font-light">IN</span>
                        </span>
                    )}
                </Link>
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
                                "group flex h-11 items-center gap-3 rounded-[20px] px-3 font-semibold transition-all duration-300 relative",
                                isActive
                                    ? "bg-slate-900 text-white shadow-md transform scale-[1.02]"
                                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : ""
                                )}
                            />
                            {!isCollapsed && (
                                <span className="transition-all duration-300">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );

                    const navElement = isCollapsed ? (
                        <Tooltip key={`nav-${index}`} delayDuration={0}>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right" className="bg-slate-900 text-white border-none rounded-xl ml-2 px-3 py-1.5 font-medium shadow-xl">
                                    {item.label}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    ) : (
                        <div key={`nav-${index}`} className="relative">{linkContent}</div>
                    );

                    return (
                        <div key={`group-${index}`}>
                            {!isCollapsed && sectionLabel}
                            {navElement}
                        </div>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="p-3 mt-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!isCollapsed)}
                    className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/40 text-slate-500 hover:bg-white/80 hover:text-slate-900 shadow-sm border border-white/50 transition-all duration-300"
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", isCollapsed && "rotate-180")} />
                </Button>
            </div>
        </aside>
    );
}
