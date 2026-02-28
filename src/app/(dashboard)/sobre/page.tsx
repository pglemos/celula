"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock, Phone, Mail, Instagram, Facebook } from "lucide-react";

const PASTORS = [
    { name: "Pr. Marcos Paulo", role: "Pastor Sênior", photo: "https://i.pravatar.cc/150?img=11" },
    { name: "Pra. Ana Luiza", role: "Pastora de Células", photo: "https://i.pravatar.cc/150?img=5" },
    { name: "Pr. Ricardo Silva", role: "Coordenador de Redes", photo: "https://i.pravatar.cc/150?img=12" },
];

const SCHEDULE = [
    { day: "Domingo", events: [{ time: "09:00", name: "Escola Bíblica" }, { time: "18:00", name: "Culto de Celebração" }] },
    { day: "Segunda", events: [{ time: "20:00", name: "Reunião de Oração" }] },
    { day: "Quarta", events: [{ time: "19:30", name: "Culto da Vitória" }] },
    { day: "Sábado", events: [{ time: "19:00", name: "Rede de Jovens" }] },
];

export default function SobreIgrejaPage() {
    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="pt-2">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sobre a Igreja</h1>
                <p className="text-sm text-slate-500 mt-1">Conheça nossa história, visão e liderança.</p>
            </div>

            <Tabs defaultValue="quem-somos" className="w-full">
                <TabsList className="bg-white/50 border border-slate-200 p-1 rounded-2xl">
                    <TabsTrigger value="quem-somos" className="rounded-xl px-6">Quem Somos</TabsTrigger>
                    <TabsTrigger value="pastores" className="rounded-xl px-6">Pastores</TabsTrigger>
                    <TabsTrigger value="localizacao" className="rounded-xl px-6">Onde Estamos</TabsTrigger>
                    <TabsTrigger value="programacao" className="rounded-xl px-6">Programação</TabsTrigger>
                </TabsList>

                {/* Quem Somos */}
                <TabsContent value="quem-somos" className="mt-6">
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden">
                        <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                <h1 className="text-9xl font-black text-white italic select-none">CENTRAL</h1>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-slate-900">Nossa História</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Fundada com o propósito de levar o amor de Cristo a todas as famílias, nossa igreja cresceu baseada na visão de células, onde cada casa se torna um farol de esperança.
                                        Acreditamos que a verdadeira igreja acontece nos relacionamentos e no cuidado mútuo do dia a dia.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-slate-900">Missão & Visão</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">Missão</p>
                                            <p className="text-sm text-slate-700 italic">"Ir e fazer discípulos de todas as nações, batizando-os e ensinando-os em comunhão."</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-1">Visão</p>
                                            <p className="text-sm text-slate-700 italic">"Ser uma igreja relevante que manifesta o Reino de Deus através de células saudáveis e líderes capacitados."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pastores */}
                <TabsContent value="pastores" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PASTORS.map((pastor, i) => (
                            <Card key={i} className="rounded-[32px] border-none shadow-sm hover:shadow-md transition-shadow text-center p-8">
                                <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-indigo-100 p-1">
                                    <AvatarImage src={pastor.photo} className="rounded-full" />
                                    <AvatarFallback>{pastor.name[0]}</AvatarFallback>
                                </Avatar>
                                <h4 className="text-lg font-bold text-slate-900">{pastor.name}</h4>
                                <p className="text-sm text-slate-500 mb-4">{pastor.role}</p>
                                <div className="flex justify-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">
                                        <Instagram className="h-4 w-4" />
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors">
                                        <Facebook className="h-4 w-4" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Localização */}
                <TabsContent value="localizacao" className="mt-6">
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 space-y-6">
                                <h3 className="text-2xl font-bold text-slate-900">Onde Estamos</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Sede Principal</p>
                                            <p className="text-sm text-slate-500">Av. Cristiano Machado, 12000 - Belo Horizonte, MG</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-500">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Telefones</p>
                                            <p className="text-sm text-slate-500">(31) 99210-0053 / (31) 3456-7890</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-500">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">E-mail</p>
                                            <p className="text-sm text-slate-500">contato@celula.in</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-80 bg-slate-100 relative">
                                {/* Mock Google Maps */}
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                                    <div className="text-center">
                                        <MapPin className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Google Maps View</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Programação */}
                <TabsContent value="programacao" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SCHEDULE.map((item, i) => (
                            <Card key={i} className="rounded-3xl border-none shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-indigo-500" />
                                        {item.day}
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    {item.events.map((ev, j) => (
                                        <div key={j} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                                                <span className="text-sm font-medium text-slate-700">{ev.name}</span>
                                            </div>
                                            <Badge variant="ghost" className="bg-slate-50 text-slate-500 text-[11px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" /> {ev.time}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
