import { getCells } from "@/lib/actions/cells";
import { CellMap } from "./map";

export default async function MapaPage() {
    const cells = await getCells();

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col -m-6 mb-0 overflow-hidden bg-slate-50/50">
            {/* Header - Compact */}
            <div className="px-8 py-4 bg-white/40 backdrop-blur-md border-b border-white/50 flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mapa de Células</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                        Geolocalização e Distribuição de Grupos
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{cells.length} Células Ativas</span>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <CellMap cells={cells} />
            </div>
        </div>
    );
}
