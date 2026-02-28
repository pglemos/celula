'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    ArrowLeft,
    ChevronDown,
    MoreVertical,
    Minus,
    Maximize2,
    Plus,
    TrendingUp
} from "lucide-react";
import Link from 'next/link';

interface Node {
    id: string;
    name: string;
    supervisor: string;
    role: string;
    health: string;
    children: Node[];
}

const initialHierarchy: Node = {
    id: 'root',
    name: 'Igreja Sede',
    supervisor: 'Pr. Presidente',
    role: 'Diretoria',
    health: 'green',
    children: [
        {
            id: 'r1',
            name: 'Rede Esperança',
            supervisor: 'Pr. Marcos',
            role: 'Regional',
            health: 'green',
            children: [
                { id: 's1', name: 'Setor Norte', supervisor: 'Diác. João', role: 'Supervisão', health: 'green', children: [] },
                { id: 's2', name: 'Setor Sul', supervisor: 'Diác. Ana', role: 'Supervisão', health: 'yellow', children: [] },
            ]
        },
        {
            id: 'r2',
            name: 'Rede Vida',
            supervisor: 'Pra. Carol',
            role: 'Regional',
            health: 'red',
            children: [
                { id: 's3', name: 'Setor Leste', supervisor: 'Ev. Paulo', role: 'Supervisão', health: 'red', children: [] },
            ]
        }
    ]
};

const TreeNode = ({ node, depth = 0 }: { node: Node; depth?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="ml-8 border-l-2 border-dashed border-gray-200 pl-8 relative py-4">
            <div className="absolute left-0 top-1/2 -ml-1 w-2 h-2 rounded-full bg-gray-300 -translate-y-1/2" />

            <div className="group relative flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-violet-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className={`absolute top-0 left-0 bottom-0 w-1 rounded-l-xl ${node.health === 'green' ? 'bg-emerald-500' : node.health === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'}`} />

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{node.name}</h3>
                        <Badge variant="secondary" className="text-[10px] py-0 h-4 px-1.5 font-semibold bg-gray-100/80 text-gray-600">
                            {node.role}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Users size={12} /> {node.supervisor}
                    </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-violet-600 hover:bg-violet-50">
                        <Plus size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <MoreVertical size={16} />
                    </Button>
                </div>

                {node.children && node.children.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white border border-gray-100 shadow-sm absolute -bottom-3 left-1/2 -translate-x-1/2 z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? <Minus size={12} /> : <ChevronDown size={12} />}
                    </Button>
                )}
            </div>

            {isExpanded && node.children && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {node.children.map((child: Node) => (
                        <TreeNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function OrganogramPage() {
    const [zoom, setZoom] = useState(100);

    return (
        <div className="p-6 h-full flex flex-col space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/supervisao">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Organograma Hierárquico
                        </h1>
                        <p className="text-sm text-muted-foreground">Arraste para reorganizar as redes e visões.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>-</Button>
                    <span className="text-xs font-semibold px-2 min-w-[3rem] text-center">{zoom}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(150, zoom + 10))}>+</Button>
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <Button variant="ghost" size="sm"><Maximize2 size={14} /></Button>
                </div>
            </div>

            <div className="flex-1 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8 overflow-auto min-h-[600px] relative">
                <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }} className="transition-transform duration-200">
                    <div className="relative py-4 max-w-sm">
                        <div className="group relative flex items-center gap-4 p-5 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl shadow-xl cursor-default">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{initialHierarchy.name}</h3>
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 border-white/30 text-white bg-white/10 uppercase tracking-widest">
                                        {initialHierarchy.role}
                                    </Badge>
                                </div>
                                <p className="text-xs text-white/80 mt-1 flex items-center gap-1">
                                    <Users size={12} /> {initialHierarchy.supervisor}
                                </p>
                            </div>
                            <Plus className="opacity-40" />
                        </div>

                        <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            {initialHierarchy.children.map((child: Node) => (
                                <TreeNode key={child.id} node={child} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-10 right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-3 z-50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status de Saúde</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" /> Rede Saudável
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <div className="w-3 h-3 rounded-full bg-amber-500" /> Atenção / Alerta
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <div className="w-3 h-3 rounded-full bg-rose-500" /> Crítico / Inadimplente
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
