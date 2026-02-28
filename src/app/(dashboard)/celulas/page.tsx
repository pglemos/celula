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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Células</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gerencie as <span className="font-bold text-slate-900">{cells.length}</span> células ativas.
                    </p>
                </div>
            </div>

            <CelulasSearch initialSearch={search} cells={cells} meetingDays={MEETING_DAYS} />
        </div>
    );
}
