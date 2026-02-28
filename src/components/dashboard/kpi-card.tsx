import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    variant?: "default" | "primary" | "accent" | "dark";
    className?: string;
    delay?: number;
}

export function KpiCard({
    title,
    value,
    icon: Icon,
    trend,
    variant = "default",
    className,
    delay = 0,
}: KpiCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-[24px] p-6 animate-fade-in-up transition-all duration-300 hover:-translate-y-1",
                variant === "dark"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : variant === "primary"
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-white shadow-sm border border-slate-100",
                className
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className={cn(
                        "text-[12px] font-semibold uppercase tracking-wider",
                        variant === "default" ? "text-slate-400" : "text-white/70"
                    )}>
                        {title}
                    </p>
                    <p className={cn(
                        "text-3xl font-bold tracking-tight",
                        variant === "default" ? "text-slate-900" : "text-white"
                    )}>
                        {value}
                    </p>
                </div>
                <div className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl transition-transform",
                    variant === "default"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-white/20 text-white"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <div
                        className={cn(
                            "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                            trend.positive
                                ? variant === 'default' ? "bg-emerald-50 text-emerald-600" : "bg-white/20 text-white"
                                : variant === 'default' ? "bg-red-50 text-red-500" : "bg-black/20 text-white"
                        )}
                    >
                        {trend.positive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {trend.value}
                    </div>
                    <span className={cn(
                        "text-[11px] font-medium",
                        variant === "default" ? "text-slate-400" : "text-white/60"
                    )}>
                        vs último mês
                    </span>
                </div>
            )}
        </div>
    );
}
