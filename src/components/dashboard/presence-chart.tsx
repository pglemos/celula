"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Placeholder chart data
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
        <div className="h-full w-full min-h-[300px] animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="presenceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="week"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        domain={[70, 100]}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#0f172a"
                        }}
                        formatter={(value?: number) => [`${value || 0}%`, "Presença"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="presence"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        fill="url(#presenceGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
