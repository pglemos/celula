import { Badge } from "@/components/ui/badge";
import { Smartphone, Map, ListChecks, MessageCircle } from "lucide-react";

const TOOLS = [
    { title: "Aplicativo PWA", icon: Smartphone, desc: "Seus membros acessam tudo de qualquer dispositivo, sem baixar nada." },
    { title: "Mapa de Células", icon: Map, desc: "Geolocalização para que novos moradores encontrem sua igreja." },
    { title: "Listas Dinâmicas", icon: ListChecks, desc: "Crie segmentos personalizados de membros com filtros avançados." },
    { title: "Envios WhatsApp", icon: MessageCircle, desc: "Comunicação em massa e automations integradas à ferramenta." }
];

export default function FerramentasPage() {
    return (
        <div className="min-h-screen bg-slate-900 pt-32 pb-24 px-6 md:px-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -m-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -m-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl opacity-50" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20 animate-fade-in-up">
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-none rounded-full px-4 mb-4">Tech Stack</Badge>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Ferramentas de <span className="text-indigo-400">Ponta</span></h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">Equipe sua liderança com o que há de mais moderno em tecnologia para gestão eclesiástica.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {TOOLS.map((t, i) => (
                        <div key={i} className="p-12 rounded-[56px] bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-all group">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="h-16 w-16 rounded-[22px] bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <t.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-4">{t.title}</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">{t.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
