import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContatoPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    <div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-4 mb-6 font-bold">Fale Conosco</Badge>
                        <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">Estamos aqui para <span className="text-emerald-500">servir.</span></h1>
                        <p className="text-lg text-slate-500 font-medium mb-12 max-w-md">Dúvidas, sugestões ou suporte técnico? Nossa equipe está pronta para te atender ministerialmente.</p>

                        <div className="space-y-10">
                            {[
                                { icon: Mail, title: "E-mail", value: "contato@celula.in" },
                                { icon: Phone, title: "WhatsApp", value: "+55 31 99210-0053" },
                                { icon: MapPin, title: "Sede", value: "Belo Horizonte / MG" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-center group">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 text-[#120a2e] flex items-center justify-center shrink-0 group-hover:bg-[#120a2e] group-hover:text-white transition-all shadow-sm">
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.title}</div>
                                        <div className="text-xl font-bold text-[#120a2e]">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 rounded-[64px] bg-slate-900 text-white relative h-fit">
                        <h2 className="text-3xl font-black mb-8">Envie uma mensagem</h2>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                <Input className="h-14 bg-white/5 border-white/10 rounded-2xl" placeholder="Ex: Pr. André Santos" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                                <Input className="h-14 bg-white/5 border-white/10 rounded-2xl" placeholder="contato@igreja.com.br" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Assunto</label>
                                <Input className="h-14 bg-white/5 border-white/10 rounded-2xl" placeholder="Suporte, Comercial, Parcerias..." />
                            </div>
                            <Button className="w-full h-16 bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl text-lg mt-4">
                                <Send className="mr-2 h-5 w-5" /> Enviar Mensagem
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
