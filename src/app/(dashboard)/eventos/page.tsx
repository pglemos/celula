import { CalendarDays, MapPin, Users, Plus, CalendarClock, Filter } from "lucide-react";
import { getEvents } from "@/lib/actions/events";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function EventosPage() {
    const events = await getEvents();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Eventos</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gestão de eventos, retiros, conferências e inscrições
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="hidden sm:flex gap-2 rounded-[24px] h-14 px-8 font-bold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white/60 text-slate-500 hover:bg-white hover:text-slate-900">
                        <Filter className="w-5 h-5" /> Filtrar
                    </Button>
                    <Button asChild className="rounded-[24px] h-14 px-10 text-base tracking-wide font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md gap-2">
                        <Link href="/eventos/novo">
                            <Plus className="w-5 h-5" /> Novo Evento
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length === 0 ? (
                    <Card className="col-span-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px]">
                        <CardContent className="p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                            <CalendarDays className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-xl font-medium text-slate-600">Nenhum evento programado</p>
                            <p className="text-sm text-slate-400 mt-1">Crie o seu primeiro evento!</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => {
                        const startDate = new Date(event.start_date);
                        const endDate = new Date(event.end_date);
                        const isPast = endDate < new Date();
                        const occupancyRate = event.capacity ? Math.round((event.registered_count / event.capacity) * 100) : 0;

                        return (
                            <Card key={event.id} className={`border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg ${isPast ? 'opacity-60' : ''}`}>
                                <CardHeader className="px-8 pt-8 pb-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-xl font-semibold text-slate-800 line-clamp-2">{event.name}</CardTitle>
                                        {isPast ? (
                                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-bold border-slate-300 text-slate-400">Encerrado</Badge>
                                        ) : (
                                            <Badge className="rounded-full px-3 py-1 text-xs font-bold bg-emerald-500 text-white border-none">Ativo</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 px-8">
                                    <div className="space-y-2.5 text-sm text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <CalendarClock className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{startDate.toLocaleDateString("pt-BR")} às {startDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 shrink-0 text-slate-400" />
                                            <span>{event.registered_count} inscritos {event.capacity ? ` de ${event.capacity}` : ''}</span>
                                        </div>
                                    </div>

                                    {event.capacity && !isPast && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                                                <span>Ocupação</span>
                                                <span className={occupancyRate >= 90 ? "text-rose-500" : ""}>{occupancyRate}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${occupancyRate >= 90 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {event.description && (
                                        <p className="text-sm line-clamp-2 pt-4 border-t border-slate-100 text-slate-500">
                                            {event.description}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="px-8 pb-8 pt-4">
                                    <Button asChild variant="ghost" className="w-full rounded-[24px] h-12 font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all">
                                        <Link href={`/eventos/${event.id}`}>
                                            Gerenciar Inscrições
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
