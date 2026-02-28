import { getCells } from "@/lib/actions/cells";
import { CellMap } from "./map";

export default async function MapaPage() {
    const cells = await getCells();

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mapa de Células</h1>
                <p className="text-muted-foreground">Visualize a distribuição geográfica de todas as células.</p>
            </div>
            
            <div className="flex-1 rounded-2xl overflow-hidden border border-border/50 shadow-xl relative">
                <CellMap cells={cells} />
            </div>
        </div>
    );
}
