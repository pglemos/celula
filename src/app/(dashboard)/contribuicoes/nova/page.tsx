import { getPeople } from "@/lib/actions/people";
import NovaContribuicaoForm from "./form";

export default async function NovaContribuicaoPage() {
    const people = await getPeople();
    return <NovaContribuicaoForm people={people} />;
}
