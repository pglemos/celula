import { Badge } from "@/components/ui/badge";
import { ListChecks, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListasPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-6">Ferramenta</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Listas Dinâmicas</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Filtros e segmentação avançada de membros. Encontre exatamente quem você procura para uma ação pastoral específica.
                </p>

                <div className="space-y-8 mb-20">
                    {[
                        { title: "Filtros Ilimitados", desc: "Combine idade, localização, data de batismo, frequência e mais." },
                        { title: "Segmentação Automática", desc: "As listas se atualizam sozinhas conforme os dados dos membros mudam." },
                        { title: "Exportação Facilitada", desc: "Leve seus dados para Excel ou PDF para relatórios físicos." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-8 items-start group">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-[#22c55e] transition-colors">
                                <Filter className="h-6 w-6 text-white" />
                            </div>
                            <div className="pb-8 border-b border-slate-100 last:border-none w-full">
                                <h3 className="text-2xl font-black text-[#120a2e] mb-3">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[56px] border border-slate-100 bg-slate-50 text-center">
                    <h2 className="text-3xl font-black text-[#120a2e] mb-6">Poder de análise para sua igreja.</h2>
                    <Button className="bg-[#120a2e] text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Começar Segmentação
                    </Button>
                </div>
            </div>
        </div>
    );
}
