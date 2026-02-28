import { ArrowLeft, Users, CalendarClock, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { notFound } from "next/navigation";
import { updateRegistrationStatus } from "@/lib/actions/events";
import { revalidatePath } from "next/cache";

export default async function EventoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from("events")
        .select(`
            *,
            event_registrations (
                id,
                status,
                registration_date,
                people (id, full_name, email, phone)
            )
        `)
        .eq("id", id)
        .eq("tenant_id", TENANT_ID)
        .single();

    if (error || !event) {
        notFound();
    }

    const startDate = new Date(event.start_date);
    const registrations = event.event_registrations || [];
    const activeRegistrations = registrations.filter((r: any) => r.status !== 'cancelled');
    const checkedInCount = registrations.filter((r: any) => r.status === 'attended').length;

    // Server Action for Quick Check-in
    async function handleCheckIn(formData: FormData) {
        "use server";
        const regId = formData.get("registration_id") as string;
        await updateRegistrationStatus(regId, "attended");
        revalidatePath(`/eventos/${id}`);
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/eventos">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gerenciamento de inscrições e check-in
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Resumo do Evento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
                                <span>{startDate.toLocaleDateString("pt-BR")} às {startDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                    <span>{event.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 shrink-0 text-primary" />
                                <span>{activeRegistrations.length} inscritos {event.capacity ? ` (Máx: ${event.capacity})` : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">{checkedInCount} presentes (Check-in)</span>
                            </div>
                        </div>

                        {event.description && (
                            <p className="text-sm pt-4 border-t border-border/30">
                                {event.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card className="glass-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg">Inscritos ({activeRegistrations.length})</CardTitle>
                            <CardDescription>Lista de participantes registrados no evento</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-border/30 border-t border-border/30 mt-4">
                            {activeRegistrations.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nenhum participante inscrito ainda.
                                </div>
                            ) : (
                                activeRegistrations.map((reg: any) => {
                                    const isAttended = reg.status === 'attended';
                                    return (
                                        <div key={reg.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{reg.people.full_name}</span>
                                                    {isAttended && <Badge className="bg-emerald-500/10 text-emerald-500 border-none">Presente</Badge>}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex gap-3 mt-1">
                                                    {reg.people.phone && <span>{reg.people.phone}</span>}
                                                    {reg.people.email && <span>{reg.people.email}</span>}
                                                </div>
                                            </div>
                                            {!isAttended && (
                                                <form action={handleCheckIn}>
                                                    <input type="hidden" name="registration_id" value={reg.id} />
                                                    <Button type="submit" size="sm" variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-500">
                                                        <CheckCircle2 className="h-4 w-4 mr-2" /> Fazer Check-in
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
