import { getPeople } from "@/lib/actions/people";
import { getSupervisions } from "@/lib/actions/supervisions";
import NovaSupervisaoForm from "./form";

export default async function NovaSupervisaoPage() {
    const [people, supervisions] = await Promise.all([
        getPeople(),
        getSupervisions()
    ]);

    return <NovaSupervisaoForm people={people} supervisions={supervisions} />;
}
