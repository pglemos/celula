"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Placeholder chart data — will be replaced with real aggregated data from meetings
const chartData = [
    { week: "S1", presence: 85 },
    { week: "S2", presence: 88 },
    { week: "S3", presence: 82 },
    { week: "S4", presence: 90 },
    { week: "S5", presence: 87 },
    { week: "S6", presence: 85 },
    { week: "S7", presence: 89 },
    { week: "S8", presence: 92 },
    { week: "S9", presence: 86 },
    { week: "S10", presence: 84 },
    { week: "S11", presence: 88 },
    { week: "S12", presence: 87 },
];

export function PresenceChart() {
    return (
        <Card className="glass-card border-border/50 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Histórico de Presença
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="presenceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="oklch(0.65 0.25 280)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                            <XAxis dataKey="week" stroke="oklch(0.5 0.02 280)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis domain={[70, 100]} stroke="oklch(0.5 0.02 280)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "oklch(0.18 0.02 280)",
                                    border: "1px solid oklch(0.28 0.02 280)",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                }}
                                formatter={(value: number | undefined) => [`${value ?? 0}%`, "Presença"]}
                            />
                            <Area type="monotone" dataKey="presence" stroke="oklch(0.65 0.25 280)" strokeWidth={2} fill="url(#presenceGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
