import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RolDeMembrosPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Rol de Membros</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Cadastro e organização inteligente de membros, visitantes e histórico de batismos. Tenha o controle total da sua membresia em um único lugar.
                </p>

                <div className="space-y-12 mb-20 md:grid md:grid-cols-2 lg:grid-cols-2 md:gap-x-12 md:gap-y-0 md:space-y-0">
                    {[
                        { title: "Gestão de Famílias", desc: "Agrupe membros por núcleos familiares para uma visão pastoral completa." },
                        { title: "Histórico de Batismo", desc: "Registre datas, pastores e fotos desse momento especial na vida do membro." },
                        { title: "Segmentação", desc: "Crie grupos por dades, interesses ou ministérios com filtros automáticos." },
                        { title: "Consolidação", desc: "Acompanhe a jornada do novo convertido desde o primeiro contato." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 mb-10">
                            <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[48px] bg-[#120a2e] text-white text-center">
                    <h2 className="text-3xl font-black mb-6">Pronto para organizar sua secretaria?</h2>
                    <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg">
                        Começar Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
