import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Users, Target, Building, Crown } from "lucide-react";

const PLANS = [
    {
        name: "Iniciante",
        price: "180",
        desc: "Ideal para congregações sem células estruturadas.",
        features: ["Células: Nenhuma", "Gestão de Membros", "Financeiro Básico", "App para Membros"],
        color: "slate",
        icon: Building,
    },
    {
        name: "Plano 10",
        price: "319",
        desc: "Perfeito para o primeiro passo na visão celular.",
        features: ["Até 10 Células", "Supervisão de Rede", "Relatórios de Liderança", "Suporte Padrão"],
        color: "emerald",
        icon: Target,
    },
    {
        name: "Plano 30",
        price: "389",
        desc: "Nosso plano mais popular para igrejas em expansão.",
        features: ["Até 30 Células", "Eventos Integrados", "IA Pastoral", "Suporte Prioritário"],
        color: "indigo",
        icon: Users,
        highlight: true
    },
    {
        name: "Plano 100",
        price: "579",
        desc: "Estrutura robusta para conselhos e distritos.",
        features: ["Até 100 Células", "Multi-Campus", "PWA Customizado", "Treinamento VIP"],
        color: "purple",
        icon: TrendingUp,
    },
    {
        name: "Plano 200",
        price: "699",
        desc: "Potência total para grandes ministérios.",
        features: ["Até 200 Células", "Consultoria Ministerial", "Hospedagem Dedicada", "Prioridade Máxima"],
        color: "amber",
        icon: Crown,
    }
];

export default function PrecosPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in-up">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-4 font-bold">Investimento Para o Reino</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Escolha sua <span className="text-indigo-600">estratégia.</span></h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium mb-8">Todos os planos ganham 15% de desconto no pagamento anual e 15 dias de teste grátis.</p>
                </div>

                <div className="flex overflow-x-auto pb-12 gap-6 snap-x snap-mandatory lg:flex-nowrap">
                    {PLANS.map((plan, i) => (
                        <div key={i} className={`snap-center shrink-0 w-[300px] lg:w-full rounded-[48px] p-8 flex flex-col justify-between transition-all hover:scale-[1.02] ${plan.highlight ? 'bg-[#120a2e] text-white shadow-2xl ring-8 ring-indigo-50' : 'bg-white text-slate-900 shadow-sm border border-slate-100'}`}>
                            <div>
                                <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-8 ${plan.highlight ? 'bg-indigo-500/20' : 'bg-slate-50'}`}>
                                    <plan.icon className={`h-8 w-8 ${plan.highlight ? 'text-indigo-400' : 'text-slate-600'}`} />
                                </div>
                                <h3 className="text-xl font-black mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-xs font-bold text-slate-400">R$</span>
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="text-sm font-bold text-slate-400">/mês</span>
                                </div>
                                <p className={`text-xs mb-8 font-medium leading-relaxed ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>

                                <div className="space-y-4 mb-10">
                                    {plan.features.map((feat, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <CheckCircle2 className={`h-4 w-4 ${plan.highlight ? 'text-emerald-500' : 'text-slate-200'}`} />
                                            <span className="text-[13px] font-bold tracking-tight">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button className={`w-full rounded-2xl h-14 font-black text-sm shadow-lg ${plan.highlight ? 'bg-[#22c55e] text-[#120a2e] hover:bg-[#16a34a]' : 'bg-[#120a2e] text-white'}`}>
                                Selecionar
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-12 rounded-[56px] border border-slate-200 bg-white shadow-inner flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl font-black text-[#120a2e] mb-4">Tem alguma dúvida?</h2>
                        <p className="text-slate-500 font-medium">Nossa equipe ministerial está pronta para te atender agora no WhatsApp.</p>
                    </div>
                    <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg whitespace-nowrap">
                        Falar com Consultor
                    </Button>
                </div>
            </div>
        </div>
    );
}
