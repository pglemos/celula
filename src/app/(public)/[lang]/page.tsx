import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Users, Globe, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function PublicLandingPage({ params }: { params: { lang: string } }) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header/Nav */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white font-black text-xl italic">c</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter italic">célula.in</span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Soluções</Link>
                    <Link href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Ferramentas</Link>
                    <Link href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Preços</Link>
                    <Link href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Blog</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="hidden sm:inline-flex text-sm font-bold rounded-xl px-6">Entrar</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 h-11 shadow-lg shadow-indigo-200">Começar Agora</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-44 pb-24 px-6 max-w-7xl mx-auto text-center">
                <Badge variant="outline" className="rounded-full px-4 py-1.5 border-indigo-100 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
                    🚀 A Revolução na Gestão Ministerial
                </Badge>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-8 animate-fade-in-up">
                    Sua igreja <span className="text-indigo-600">organizada</span>,<br />suas células <span className="italic text-slate-400">multiplicando</span>.
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                    Gestão completa de membros, células, supervisão, financeiro e eventos em uma única plataforma premium projetada para o crescimento do Reino.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                    <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-10 h-16 text-lg shadow-2xl shadow-indigo-200">
                        Testar Grátis 15 dias
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto border-slate-200 rounded-2xl px-10 h-16 text-lg font-bold group">
                        Ver Demonstração <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="mt-24 rounded-[40px] border border-slate-100 bg-slate-50/50 p-4 shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "350ms" }}>
                    <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <div className="text-center group cursor-pointer">
                            <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                                <Play className="h-8 w-8 fill-current" />
                            </div>
                            <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Assista ao Vídeo</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Tudo o que sua igreja precisa</h2>
                        <p className="text-slate-500 font-medium">Uma ferramenta construída por pastores, para pastores.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Gestão de Membros", desc: "Controle total do rol de membros, visitantes e consolidação apaixonante." },
                            { icon: Zap, title: "Visão de Células", desc: "Relatórios automatizados, trilhas de treinamento e planos de multiplicação." },
                            { icon: Globe, title: "Presença Digital", desc: "App PWA nativo para membros e mapa público de células para sua cidade." }
                        ].map((feat, i) => (
                            <Card key={i} className="rounded-[40px] border-none shadow-sm p-10 hover:shadow-xl transition-all group">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <feat.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{feat.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto rounded-[60px] bg-indigo-600 p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-300">
                    <div className="absolute top-0 right-0 -m-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 -m-20 h-60 w-60 rounded-full bg-indigo-400/20 blur-2xl" />

                    <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight relative z-10">Pronto para levar sua igreja ao próximo nível?</h2>
                    <p className="text-indigo-100 text-lg mb-12 max-w-xl mx-auto relative z-10">Junte-se a centenas de igrejas que já transformaram seus ministérios com o célula.in.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90 font-black rounded-2xl px-12 h-16 text-lg">
                            Começar Agora
                        </Button>
                        <p className="text-sm font-bold text-indigo-100 italic">Sem cartão de crédito necessário.</p>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} célula.in • Tecnologia Para o Reino</p>
            </footer>
        </div>
    );
}

function Play(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    )
}

function Card({ children, className }: any) {
    return (
        <div className={`bg-white rounded-[32px] border border-slate-100 ${className}`}>
            {children}
        </div>
    )
}
