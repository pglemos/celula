import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventosPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6">Solução</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Eventos e Inscrições</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Check-in, inscrições e pagamentos on-line. Elimine as filas e erros manuais na secretaria do seu evento ou congresso.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: "Pagamento Integrado", desc: "Receba via Cartão ou Pix com repasse automático." },
                        { title: "Check-in QR Code", desc: "Valide inscrições em segundos pelo celular da recepção." },
                        { title: "Lotes e Cupons", desc: "Gestão inteligente de preços e promoções para membros." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-4">
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs">0{i + 1}</div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="p-12 rounded-[56px] bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                    <QrCode className="h-16 w-16 text-[#120a2e] mb-8" />
                    <h2 className="text-3xl font-black text-[#120a2e] mb-6">Transforme a experiência do congressista.</h2>
                    <Button className="bg-[#120a2e] text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Criar Meu Primeiro Evento
                    </Button>
                </div>
            </div>
        </div>
    );
}
