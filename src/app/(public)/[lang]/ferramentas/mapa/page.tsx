import { Badge } from "@/components/ui/badge";
import { Map, CheckCircle2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapaPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-6">Ferramenta</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Mapa de Células</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Localizador de grupos por área e perfil. Facilite que novas pessoas encontrem a célula ideal próxima de casa ou do trabalho.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className="p-10 rounded-[48px] bg-slate-50 border border-slate-100 flex flex-col justify-center">
                        <h3 className="text-2xl font-black mb-6">Integração Google Maps</h3>
                        <div className="space-y-4">
                            {[
                                "Clusters automáticos por região",
                                "Filtro por Categoria e Dia",
                                "Busca por Bairro ou CEP",
                                "Instruções de rota direta no App"
                            ].map((v, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="h-5 w-5 bg-[#22c55e] border-2 border-white rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5" />
                                    <span className="font-bold text-slate-600">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[48px] bg-indigo-50 p-4 border border-indigo-100 relative overflow-hidden group shadow-2xl">
                        <Map className="h-full w-full opacity-20 text-indigo-600 absolute -bottom-20 -right-20 rotate-12" />
                        <div className="relative z-10 h-full w-full bg-white border border-indigo-100 rounded-[40px] p-8 flex flex-col justify-between">
                            <Badge className="bg-indigo-100/50 text-indigo-600 w-fit">Público</Badge>
                            <div className="h-8 w-1/2 bg-slate-100 rounded-full" />
                            <div className="h-32 w-full bg-slate-100 rounded-[32px]" />
                            <Button size="sm" className="bg-indigo-600 text-white rounded-xl h-10 w-fit px-6">Ver no Mapa</Button>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button className="bg-[#120a2e] text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Ativar Meu Mapa Público
                    </Button>
                </div>
            </div>
        </div>
    );
}
