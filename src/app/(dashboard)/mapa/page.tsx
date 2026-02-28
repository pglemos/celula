import { getCells } from "@/lib/actions/cells";
import { CellMap } from "./map";

export default async function MapaPage() {
    const cells = await getCells();

    return (
        <div className="h-[calc(100vh-180px)] flex flex-col space-y-6 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Mapa de Células</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Visualize a distribuição geográfica de todas as células.
                    </p>
                </div>
            </div>

            <div className="flex-1 rounded-[32px] overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
                <CellMap cells={cells} />
            </div>
        </div>
    );
}
