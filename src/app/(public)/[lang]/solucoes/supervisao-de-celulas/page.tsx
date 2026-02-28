import { Badge } from "@/components/ui/badge";
import { Network, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupervisaoPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Supervisão de Células</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Relatórios de supervisão com privacidade por nível hierárquico. A visão que o pastor precisa para guiar a igreja.
                </p>

                <div className="space-y-6 mb-20">
                    {[
                        { title: "Privacidade por Nível", desc: "Líderes, Supervisores e Pastores veem apenas o que lhes compete." },
                        { title: "Checklist de Visita", desc: "Siga um roteiro de acompanhamento e registre o feedback do líder." },
                        { title: "Alertas Automáticos", desc: "Seja notificado quando uma célula não reportar ou tiver queda de frequência." },
                        { title: "Gráficos de Saúde", desc: "Visualize o crescimento das redes e distritos em tempo real." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{item.title}</h3>
                                    <p className="text-slate-400 text-sm">{item.desc}</p>
                                </div>
                            </div>
                            <Lock className="h-4 w-4 text-slate-200 hidden md:block" />
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[48px] bg-indigo-600 text-white text-center">
                    <h2 className="text-3xl font-black mb-6">Gestão em todos os níveis.</h2>
                    <Button className="bg-white text-indigo-600 hover:bg-white/90 font-black rounded-2xl px-12 h-16 text-lg">
                        Começar Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
