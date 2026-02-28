import { getPeople } from "@/lib/actions/people";
import { getSupervisions } from "@/lib/actions/supervisions";
import NovaCelulaForm from "./form";

export default async function NovaCelulaPage() {
    const [people, supervisions] = await Promise.all([
        getPeople(),
        getSupervisions()
    ]);

    return <NovaCelulaForm people={people} supervisions={supervisions} />;
}
