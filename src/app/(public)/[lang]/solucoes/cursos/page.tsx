import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CursosPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Cursos e Matrículas</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Trilha de Liderança e formação. Capacite sua membresia com uma plataforma de EAD própria, integrada à gestão da igreja.
                </p>

                <div className="flex flex-col gap-12 mb-20 md:flex-row items-center">
                    <div className="flex-1 space-y-8">
                        {[
                            { title: "Aulas em Vídeo", desc: "Hospede seu conteúdo e controle o acesso por turmas ou redes." },
                            { title: "Certificados Automáticos", desc: "Gere certificados de conclusão personalizados para seus alunos." },
                            { title: "Controle de Frequência", desc: "Acompanhe quem está realmente assistindo e fazendo os cursos." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 p-10 rounded-[48px] bg-slate-900 aspect-square flex items-center justify-center relative overflow-hidden group border-8 border-white shadow-2xl">
                        <PlayCircle className="h-20 w-20 text-[#22c55e] group-hover:scale-110 transition-transform cursor-pointer" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    </div>
                </div>

                <div className="text-center">
                    <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg">
                        Começar Sua Escola
                    </Button>
                </div>
            </div>
        </div>
    );
}
