import { Badge } from "@/components/ui/badge";
import { Smartphone, CheckCircle2, CloudDownload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AplicativoPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-full px-4 mb-6">Ferramenta</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-[#120a2e] tracking-tight mb-8">O Aplicativo da Sua Igreja</h1>
                <p className="text-xl text-slate-500 mb-12 font-medium leading-relaxed">
                    Experiência mobile apaixonante para membros e líderes. Tudo o que sua igreja precisa, na palma da mão.
                </p>

                <div className="flex flex-col md:flex-row gap-20 mb-20 items-center">
                    <div className="w-full md:w-1/2 rounded-[56px] border-8 border-slate-900 aspect-[9/16] bg-slate-50 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-10 bg-slate-900 flex items-center justify-center">
                            <div className="h-1 w-12 bg-slate-800 rounded-full" />
                        </div>
                        <div className="p-8 pt-16 h-full flex flex-col gap-6">
                            <div className="h-4 w-2/3 bg-slate-200 rounded-full animate-pulse" />
                            <div className="h-40 w-full bg-indigo-50 rounded-3xl animate-pulse" />
                            <div className="space-y-4">
                                <div className="h-3 w-full bg-slate-100 rounded-full" />
                                <div className="h-3 w-full bg-slate-100 rounded-full" />
                                <div className="h-3 w-full bg-slate-100 rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-10">
                        <div className="p-10 rounded-[40px] bg-slate-50">
                            <h3 className="text-2xl font-black mb-4">PWA (Instalação Instantânea)</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Não precisa de App Store ou Google Play. O membro adiciona à tela de início em segundos e economiza espaço.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span className="font-bold">Offline First (Acesse dados sem internet)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span className="font-bold">Notificações Push Personalizadas</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                <span className="font-bold">Design Responsivo e Fluido</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Button className="bg-[#120a2e] text-white font-black rounded-2xl px-12 h-16 text-lg">
                        Ver Demonstração Mobile
                    </Button>
                </div>
            </div>
        </div>
    );
}
