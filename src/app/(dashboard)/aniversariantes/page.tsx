"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cake, MessageSquare, Phone, ChevronRight } from "lucide-react";

const TODAY = [
    { id: 1, name: "Maria Eduarda Costa", cell: "Célula Legado", age: 24, photo: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Pedro Guilherme Lemos", cell: "Célula Ágape", age: 31, photo: "https://i.pravatar.cc/150?img=12" },
];

const MONTH = [
    { id: 3, name: "Ana Beatriz Rocha", cell: "Célula Videira", day: 15, age: 19, photo: "https://i.pravatar.cc/150?img=5" },
    { id: 4, name: "João Paulo Silva", cell: "Célula Shalon", day: 22, age: 28, photo: "https://i.pravatar.cc/150?img=13" },
    { id: 5, name: "Lucas Ferreira", cell: "Célula Graça", day: 28, age: 35, photo: "https://i.pravatar.cc/150?img=33" },
];

export default function AniversariantesPage() {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="pt-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Aniversariantes</h1>
                <p className="text-sm text-slate-500 mt-1">Celebre a vida dos seus irmãos.</p>
            </div>

            <Tabs defaultValue="hoje" className="w-full">
                <TabsList className="bg-white/50 border border-slate-200 p-1 rounded-2xl w-fit">
                    <TabsTrigger value="hoje" className="rounded-xl px-8 relative">
                        Hoje
                        {TODAY.length > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {TODAY.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="mes" className="rounded-xl px-8">Mês</TabsTrigger>
                </TabsList>

                <TabsContent value="hoje" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TODAY.map((p, i) => (
                            <Card key={p.id} className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping opacity-25" />
                                        <Avatar className="h-16 w-16 border-2 border-white shadow-sm relative z-10">
                                            <AvatarImage src={p.photo} />
                                            <AvatarFallback>{p.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm z-20">
                                            <Cake className="h-4 w-4 text-indigo-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-900 truncate">{p.name}</h4>
                                        <p className="text-xs text-slate-500 mb-1">{p.cell}</p>
                                        <Badge variant="ghost" className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                            {p.age} anos
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button size="icon" className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-none shadow-none transition-all">
                                            <MessageSquare className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-none shadow-none transition-all">
                                            <Phone className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="mes" className="mt-6">
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
                        <CardContent className="p-0">
                            {MONTH.map((p, i) => (
                                <div key={p.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none group">
                                    <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                                        <span className="text-[10px] font-bold text-indigo-500 group-hover:text-white uppercase leading-none mb-1">MAR</span>
                                        <span className="text-lg font-black text-indigo-600 group-hover:text-white leading-none">{p.day}</span>
                                    </div>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={p.photo} />
                                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                                        <p className="text-xs text-slate-400">{p.cell}</p>
                                    </div>
                                    <div className="text-right mr-4">
                                        <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-500 transition-colors">{p.age} anos</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-600">
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
