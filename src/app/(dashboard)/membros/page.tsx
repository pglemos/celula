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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Membros</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {people.length} pessoas cadastradas
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                    </Button>
                    <Link href="/membros/novo">
                        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4" />
                            Novo Membro
                        </Button>
                    </Link>
                </div>
            </div>

            <MembrosSearch initialSearch={search} people={people} />
        </div>
    );
}
