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
    const cardClass = {
        default: "bento-card",
        primary: "bento-card",
        accent: "bento-card",
        dark: "bento-card-dark border-0",
    }[variant];

    const iconBgClass = {
        default: "bg-slate-50 text-slate-700 border border-slate-100 shadow-sm",
        primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 border-0",
        accent: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-0",
        dark: "bg-white/10 text-white border border-white/10",
    }[variant];

    const textClass = {
        default: "text-slate-500",
        primary: "text-slate-500",
        accent: "text-slate-500",
        dark: "text-zinc-400",
    }[variant];

    const valueClass = {
        default: "text-slate-900",
        primary: "text-slate-900",
        accent: "text-slate-900",
        dark: "text-white",
    }[variant];

    return (
        <Card
            className={cn(
                cardClass,
                "animate-fade-in-up overflow-hidden relative group p-1 transition-all hover:-translate-y-[2px] rounded-[2rem]",
                className
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                    <div className="space-y-4">
                        <p className={cn("text-[11px] font-bold uppercase tracking-widest", textClass)}>
                            {title}
                        </p>
                        <p className={cn("text-4xl lg:text-5xl font-extrabold tracking-tighter mt-1", valueClass)}>
                            {value}
                        </p>
                    </div>
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 shadow-sm", iconBgClass)}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>

                {trend && (
                    <div className="mt-6 flex items-center gap-2">
                        <div
                            className={cn(
                                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                trend.positive
                                    ? variant === 'default' ? "bg-success/10 text-success" : "bg-white/20 text-white"
                                    : variant === 'default' ? "bg-destructive/10 text-destructive" : "bg-black/20 text-white"
                            )}
                        >
                            {trend.positive ? (
                                <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                                <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {trend.value}
                        </div>
                        <span className={cn("text-[10px] font-medium", textClass)}>vs último mês</span>
                    </div>
                )}
            </CardContent>
            {variant === 'default' && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
            )}
        </Card>
    );
}
