import { Search, Plus, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPeople } from "@/lib/actions/people";
import { MembrosSearch } from "./search";
import Link from "next/link";

export default async function MembrosPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const search = params.q || "";
    const people = await getPeople(search);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Membros</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Gerencie os <span className="font-bold text-slate-900">{people.length}</span> membros cadastrados.
                    </p>
                </div>
            </div>

            <MembrosSearch initialSearch={search} people={people} />
        </div>
    );
}
