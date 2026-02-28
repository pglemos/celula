import { Badge } from "@/components/ui/badge";
import { Star, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";

const TESTIMONIALS = [
    {
        name: "Pr. Estevam Fernandes",
        church: "Igreja Batista de João Pessoa",
        text: "Uma revolução na forma como pastoreamos nossas redes. O célula.in é indispensável.",
        img: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=400&q=80"
    },
    {
        name: "Pr. Danilo Figueira",
        church: "Comunidade Cristã de Ribeirão Preto",
        text: "Simplicidade e robustez. Exatamente o que uma igreja em células precisa para crescer saudável.",
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
    },
    {
        name: "Pr. Pedro Estrela",
        church: "Igreja da Cidade",
        text: "O acompanhamento dos dízimos e relatórios de célula nunca foi tão transparente e ágil.",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
    }
];

export default function DepoimentosPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24 max-w-2xl mx-auto">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-4 font-bold">Vozes do Reino</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Quem usa, <span className="text-indigo-600">multiplica.</span></h1>
                    <p className="text-lg text-slate-500 font-medium">Líderes e pastores que transformaram sua gestão ministerial com tecnologia apaixonante.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="group relative p-12 rounded-[56px] bg-slate-50 border border-slate-100 hover:bg-[#120a2e] hover:text-white transition-all">
                            <MessageSquareQuote className="h-12 w-12 text-indigo-500/20 absolute top-8 right-8" />
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                            </div>
                            <p className="text-xl font-bold leading-relaxed mb-10 italic">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                                    <img src={t.img} alt={t.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <div className="font-black text-sm uppercase tracking-widest">{t.name}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-500">{t.church}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-20 rounded-[80px] bg-indigo-600 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-900 opacity-50" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-8">Sua igreja é a próxima.</h2>
                        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg">
                            Começar Agora
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
