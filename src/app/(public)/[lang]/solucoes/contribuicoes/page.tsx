import { Badge } from "@/components/ui/badge";
import { HandCoins, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContribuicoesPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Contribuições On-line</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Dízimos e ofertas via app. Facilite a generosidade da sua igreja com métodos seguros e relatórios em tempo real.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {[
                        { title: "Dízimos via Pix & Cartão", desc: "Integração direta para que o membro contribua em segundos." },
                        { title: "Relatórios de Pastor/Tesoureiro", desc: "Visão consolidada das entradas com total transparência." },
                        { title: "Comprovantes Automáticos", desc: "O membro recebe o comprovante no e-mail logo após a doação." },
                        { title: "Campanhas de Ofertas", desc: "Crie metas para reformas, missões ou projetos especiais." }
                    ].map((item, i) => (
                        <div key={i} className="p-10 rounded-[40px] bg-white border border-slate-100 hover:shadow-xl transition-all">
                            <Zap className="h-6 w-6 text-emerald-500 mb-6" />
                            <h3 className="font-bold text-xl mb-4">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[56px] bg-[#120a2e] text-white flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-md text-center md:text-left">
                        <h2 className="text-3xl font-black mb-4">Generosidade sem atrito.</h2>
                        <p className="text-slate-400 font-medium italic">"Cada um dê conforme determinou em seu coração..."</p>
                    </div>
                    <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg shrink-0">
                        Ativar Doações
                    </Button>
                </div>
            </div>
        </div>
    );
}
