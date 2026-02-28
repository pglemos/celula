import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MensagensPage() {
    return (
        <div className="min-h-screen bg-[#120a2e] pt-32 pb-24 px-6 md:px-12 font-sans text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 -m-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="max-w-4xl mx-auto relative z-10">
                <Badge className="bg-emerald-500/10 text-emerald-400 border-none rounded-full px-4 mb-6">Ferramenta</Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Envio de Mensagens</h1>
                <p className="text-xl text-slate-400 mb-12 font-medium leading-relaxed">
                    Comunicação direta com a membresia via WhatsApp e Notificações Push nativas. Fale com sua igreja agora.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl">
                        <div className="h-12 w-12 rounded-2xl bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center mb-6">
                            <MessageCircle className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Envios Diretos</h3>
                        <p className="text-slate-400 leading-relaxed font-medium">Integração com WhatsApp para que você fale com todos os líderes de uma vez só, sem salvar contatos.</p>
                    </div>
                    <div className="p-10 rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-3xl">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                            <Send className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Push Notifications</h3>
                        <p className="text-slate-400 leading-relaxed font-medium">Apareça na tela do celular do membro instantaneamente com novidades, avisos e cultos.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span>Ilimitado</span>
                        <div className="h-1 w-1 bg-slate-700 rounded-full" />
                        <span>Instantâneo</span>
                        <div className="h-1 w-1 bg-slate-700 rounded-full" />
                        <span>Eficiente</span>
                    </div>
                    <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-12 h-16 text-lg">
                        Começar Envio Agora
                    </Button>
                </div>
            </div>
        </div>
    );
}
