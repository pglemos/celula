"use client";

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
    className?: string;
    delay?: number;
}

export function KpiCard({
    title,
    value,
    icon: Icon,
    trend,
    className,
    delay = 0,
}: KpiCardProps) {
    return (
        <Card
            className={cn(
                "glass-card border-border/50 animate-fade-in-up overflow-hidden relative group",
                className
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                        {trend && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-xs font-medium",
                                    trend.positive ? "text-success" : "text-destructive"
                                )}
                            >
                                {trend.positive ? (
                                    <TrendingUp className="h-3.5 w-3.5" />
                                ) : (
                                    <TrendingDown className="h-3.5 w-3.5" />
                                )}
                                {trend.value}
                            </div>
                        )}
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />
        </Card>
    );
}
