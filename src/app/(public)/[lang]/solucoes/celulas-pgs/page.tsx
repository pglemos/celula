import { Badge } from "@/components/ui/badge";
import { CircleDot, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CelulasPgsPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Células / PGs</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Relatórios semanais, presença, visitantes e dízimos. A ferramenta definitiva para o líder de célula focar no que importa: as pessoas.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {[
                        { title: "Relatórios Facilitados", desc: "Lançamento em menos de 1 minuto diretamente pelo smartphone." },
                        { icon: CircleDot, title: "Gestão de Presença", desc: "Visualize o engajamento de cada membro ao longo do tempo." },
                        { title: "Registro de Visitantes", desc: "Não perca nenhum convidado. Inicie o fluxo de consolidação agora." },
                        { title: "Dízimos da Célula", desc: "Controle as ofertas e contribuições semanais com transparência." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-[32px] bg-slate-50 border border-slate-100">
                            <div className="h-4 w-4 text-emerald-600 mb-4 font-bold">✓</div>
                            <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Button className="bg-[#120a2e] hover:bg-black text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Testar Ilimitado
                    </Button>
                </div>
            </div>
        </div>
    );
}
