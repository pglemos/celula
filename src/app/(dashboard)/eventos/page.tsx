import { CalendarDays, MapPin, Users, Plus, CalendarClock } from "lucide-react";
import { getEvents } from "@/lib/actions/events";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function EventosPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gestão de eventos, retiros, conferências e inscrições
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/eventos/novo">
                        <Plus className="h-4 w-4" /> Novo Evento
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/20 rounded-lg border border-border/50">
                        Nenhum evento programado. Crie o seu primeiro evento!
                    </div>
                ) : (
                    events.map((event) => {
                        const startDate = new Date(event.start_date);
                        const endDate = new Date(event.end_date);
                        const isPast = endDate < new Date();
                        const occupancyRate = event.capacity ? Math.round((event.registered_count / event.capacity) * 100) : 0;

                        return (
                            <Card key={event.id} className={`glass-card flex flex-col ${isPast ? 'opacity-70' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
                                        {isPast ? (
                                            <Badge variant="outline">Encerrado</Badge>
                                        ) : (
                                            <Badge className="bg-primary text-primary-foreground">Ativo</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="h-4 w-4 shrink-0" />
                                            <span>{startDate.toLocaleDateString("pt-BR")} às {startDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 shrink-0" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 shrink-0" />
                                            <span>{event.registered_count} inscritos {event.capacity ? ` de ${event.capacity}` : ''}</span>
                                        </div>
                                    </div>

                                    {event.capacity && !isPast && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Ocupação</span>
                                                <span className={occupancyRate >= 90 ? "text-destructive font-medium" : ""}>{occupancyRate}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${occupancyRate >= 90 ? 'bg-destructive' : 'bg-primary'}`}
                                                    style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {event.description && (
                                        <p className="text-sm line-clamp-2 mt-4 pt-4 border-t border-border/30">
                                            {event.description}
                                        </p>
                                    )}
                                </CardContent>
                                <CardFooter className="pt-4 border-t border-border/30">
                                    <Button variant="secondary" className="w-full" asChild>
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
