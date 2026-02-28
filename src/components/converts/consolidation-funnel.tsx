"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell as ReCell } from "recharts";

interface FunnelData {
    total_decisions: number;
    total_contacted: number;
    total_in_cell: number;
    total_integrated: number;
}

export function ConsolidationFunnel({ data }: { data: FunnelData }) {
    const chartData = [
        { name: "Decisões", value: data.total_decisions, color: "#3b82f6" },
        { name: "Contatados", value: data.total_contacted, color: "#6366f1" },
        { name: "Em Célula", value: data.total_in_cell, color: "#8b5cf6" },
        { name: "Integrados", value: data.total_integrated, color: "#10b981" },
    ];

    return (
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-700">Funil de Consolidação</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white p-2 shadow-lg border rounded-lg text-xs">
                                                <p className="font-bold">{payload[0].payload.name}</p>
                                                <p className="text-blue-600">{payload[0].value} Pessoas</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                {chartData.map((entry, index) => (
                                    <ReCell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
