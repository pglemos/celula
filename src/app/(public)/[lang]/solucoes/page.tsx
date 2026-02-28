import { Badge } from "@/components/ui/badge";
import { Users, CircleDot, Network, GraduationCap, Heart, HandCoins } from "lucide-react";

const SOLUTIONS = [
    { title: "Rol de Membros", icon: Users, desc: "Gestão inteligente de pessoas, famílias e ministérios." },
    { title: "Células", icon: CircleDot, desc: "Controle de relatórios, lições e crescimento de grupos." },
    { title: "Supervisão", icon: Network, desc: "Acompanhamento em tempo real da saúde da sua rede." },
    { title: "Novos Convertidos", icon: Heart, desc: "Funil de consolidação para não perder nenhum fruto." },
    { title: "Cursos e Formação", icon: GraduationCap, desc: "EAD própria para capacitação de novos líderes." },
    { title: "Contribuições", icon: HandCoins, desc: "Gestão financeira transparente de dízimos e ofertas." }
];

export default function SolucoesPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in-up">
                    <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-4">Ecosystem</Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Soluções para o <span className="text-indigo-600">Reino</span></h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">Uma infraestrutura completa para que você possa focar no que realmente importa: cuidar de pessoas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SOLUTIONS.map((s, i) => (
                        <div key={i} className="group p-10 rounded-[48px] bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all">
                            <div className="h-16 w-16 rounded-[22px] bg-white text-indigo-600 flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <s.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{s.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
