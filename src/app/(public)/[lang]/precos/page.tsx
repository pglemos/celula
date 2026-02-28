import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Zap, Building2, Building, Store } from "lucide-react";

const PLANS = [
    {
        name: "Starter",
        price: "Grátis",
        desc: "Perfeito para pequenas congregações iniciando a visão.",
        features: ["Atê 2 Células", "Gestão de Membros", "Relatórios Básicos", "App para Líderes"],
        icon: Store,
        highlight: false
    },
    {
        name: "Plano 30",
        price: "R$ 97",
        desc: "Ideal para igrejas em crescimento moderado.",
        features: ["Até 30 Células", "Supervisão Completa", "Financeiro & Contribuções", "Eventos & Inscrições", "Suporte Prioritário"],
        icon: Building,
        highlight: true
    },
    {
        name: "Enterprise",
        price: "Sob Consulta",
        desc: "Estrutura robusta para grandes ministérios e redes.",
        features: ["Células Ilimitadas", "IA Pastoral Avançada", "Multi-Campus", "API de Integração", "Gerente de Conta"],
        icon: Building2,
        highlight: false
    }
];

export default function PrecosPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in-up">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-4">Planos Flexíveis</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Investimento Para o Reino</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">Escolha o plano que melhor se adapta ao momento da sua igreja. Sem taxas de adesão ou fidelidade.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`rounded-[48px] p-10 flex flex-col justify-between transition-all hover:scale-[1.02] ${plan.highlight ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50' : 'bg-white text-slate-900 shadow-sm border border-slate-100'}`}>
                            <div>
                                <div className={`h-16 w-16 rounded-[22px] flex items-center justify-center mb-8 ${plan.highlight ? 'bg-white/10' : 'bg-indigo-50'}`}>
                                    <plan.icon className={`h-8 w-8 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`} />
                                </div>
                                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    {plan.price !== "Grátis" && plan.price !== "Sob Consulta" && <span className={`text-sm font-bold ${plan.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>/mês</span>}
                                </div>
                                <p className={`text-sm mb-10 font-medium leading-relaxed ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>

                                <div className="space-y-4 mb-12">
                                    {plan.features.map((feat, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <CheckCircle2 className={`h-5 w-5 ${plan.highlight ? 'text-indigo-300' : 'text-emerald-500'}`} />
                                            <span className="text-sm font-bold tracking-tight">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className={`w-full rounded-2xl h-14 font-black text-base shadow-lg ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-white/90' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                Começar Trial
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center animate-fade-in-up">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Precisa de um plano personalizado?</p>
                    <Button variant="link" className="text-indigo-600 font-black text-lg p-0 h-auto mt-2 hover:no-underline">Consulte nossos especialistas via WhatsApp</Button>
                </div>
            </div>
        </div>
    );
}
