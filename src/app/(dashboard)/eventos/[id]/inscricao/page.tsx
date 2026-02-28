import { getPeople } from "@/lib/actions/people";
import { registerForEvent } from "@/lib/actions/events";
import ClientRegisterForm from "./client-form";

export default async function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const people = await getPeople();

    return <ClientRegisterForm eventId={id} people={people} registerAction={registerForEvent} />;
}
