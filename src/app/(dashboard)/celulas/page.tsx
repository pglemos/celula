import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCells } from "@/lib/actions/cells";
import { MEETING_DAYS } from "@/lib/constants";
import { CelulasSearch } from "./search";
import Link from "next/link";

export default async function CelulasPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const search = params.q || "";
    const cells = await getCells(search);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Células</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {cells.length} células ativas
                    </p>
                </div>
                <Link href="/celulas/nova">
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                        Nova Célula
                    </Button>
                </Link>
            </div>

            <CelulasSearch initialSearch={search} cells={cells} meetingDays={MEETING_DAYS} />
        </div>
    );
}
