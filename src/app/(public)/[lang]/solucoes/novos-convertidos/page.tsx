import { Badge } from "@/components/ui/badge";
import { Heart, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NovosConvertidosPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-pink-50 text-pink-600 border-none rounded-full px-4 mb-6 italic">Em Desenvolvimento</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Novos Convertidos</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Acolhimento e consolidação apaixonante. Não perca nenhum fruto fiel que o Senhor enviar para sua casa.
                </p>

                <div className="relative p-12 rounded-[56px] border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Badge className="bg-[#22c55e] text-white rounded-full">Coming Soon</Badge>
                    </div>
                    <div className="h-24 w-24 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-8">
                        <Heart className="h-10 w-10 fill-current" />
                    </div>
                    <h2 className="text-3xl font-black text-[#120a2e] mb-6">O funil de consolidação perfeito.</h2>
                    <p className="text-slate-500 max-w-sm mb-10 font-medium">Estamos finalizando uma ferramenta exclusiva para o acompanhamento dos primeiros passos na fé.</p>
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>• Primeiro Contato</span>
                        <span>• Visita e Oração</span>
                        <span>• Início da Trilha</span>
                        <span>• Batismo</span>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-sm font-bold text-slate-400 mb-4">QUER SER O PRIMEIRO A TESTAR?</p>
                    <Button className="bg-[#120a2e] text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Entrar na Lista de Espera
                    </Button>
                </div>
            </div>
        </div>
    );
}
