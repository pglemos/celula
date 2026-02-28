import { getPeople } from "@/lib/actions/people";
import { getSupervisions } from "@/lib/actions/supervisions";
import NovaCelulaForm from "./form";
import { getTenantSettings } from "@/lib/actions/settings";

export default async function NovaCelulaPage() {
    const [people, supervisions, tenant] = await Promise.all([
        getPeople(),
        getSupervisions(),
        getTenantSettings()
    ]);

    return <NovaCelulaForm people={people} supervisions={supervisions} categories={tenant?.cell_categories || []} />;
}
