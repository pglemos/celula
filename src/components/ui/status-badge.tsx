"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "green" | "yellow" | "red";

interface StatusBadgeProps {
    status: Status;
    label?: string;
    className?: string;
}

const statusConfig: Record<
    Status,
    { bg: string; text: string; dot: string; defaultLabel: string }
> = {
    green: {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        dot: "bg-emerald-400",
        defaultLabel: "Saudável",
    },
    yellow: {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        dot: "bg-amber-400",
        defaultLabel: "Atenção",
    },
    red: {
        bg: "bg-red-500/15",
        text: "text-red-400",
        dot: "bg-red-400",
        defaultLabel: "Crítico",
    },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <Badge
            variant="outline"
            className={cn(
                "gap-1.5 border-none font-medium text-xs px-2.5 py-1",
                config.bg,
                config.text,
                className
            )}
        >
            <span
                className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)}
            />
            {label || config.defaultLabel}
        </Badge>
    );
}

interface MembershipBadgeProps {
    status: "member" | "baptized_non_member" | "non_baptized" | "visitor";
    className?: string;
}

const membershipConfig: Record<
    MembershipBadgeProps["status"],
    { bg: string; text: string; label: string }
> = {
    member: {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        label: "Membro",
    },
    baptized_non_member: {
        bg: "bg-blue-500/15",
        text: "text-blue-400",
        label: "Batizado",
    },
    non_baptized: {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        label: "Não Batizado",
    },
    visitor: {
        bg: "bg-purple-500/15",
        text: "text-purple-400",
        label: "Visitante",
    },
};

export function MembershipBadge({ status, className }: MembershipBadgeProps) {
    const config = membershipConfig[status];
    return (
        <Badge
            variant="outline"
            className={cn(
                "border-none font-medium text-xs px-2.5 py-1",
                config.bg,
                config.text,
                className
            )}
        >
            {config.label}
        </Badge>
    );
}
