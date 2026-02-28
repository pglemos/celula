import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Users, Globe, ArrowRight, Star, ShieldCheck, Infinity, Layers, MousePointerClick, TrendingUp, Calendar, Heart, GraduationCap, HandCoins } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function PublicLandingPage({ params }: { params: { lang: string } }) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header/Nav */}
            <header className="fixed top-0 inset-x-0 z-50 bg-[#120a2e]/90 backdrop-blur-lg border-b border-white/10 px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                        <span className="text-white font-black text-xl italic">c</span>
                    </div>
                    <span className="text-xl font-black tracking-tighter italic text-white">célula.in</span>
                </div>
                <nav className="hidden lg:flex items-center gap-8">
                    <div className="group relative">
                        <button className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                            Soluções <ArrowRight className="h-3 w-3 rotate-90" />
                        </button>
                    </div>
                    <div className="group relative">
                        <button className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                            Ferramentas <ArrowRight className="h-3 w-3 rotate-90" />
                        </button>
                    </div>
                    <Link href={`/${params.lang}/precos`} className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Preços</Link>
                    <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Blog</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="hidden sm:inline-flex text-sm font-bold text-white hover:bg-white/10 rounded-xl px-6">Entrar</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-xl px-6 h-11 shadow-lg shadow-emerald-500/20">Começar Agora</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-52 pb-32 px-6 bg-[#120a2e] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]" />
                <div className="absolute bottom-0 left-0 -m-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-fade-in-up">
                        O melhor aplicativo<br /><span className="text-[#22c55e]">para igrejas.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
                        Vamos te ajudar a organizar sua igreja em células. Gestão completa, ministerial e apaixonante.
                    </p>

                    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                        <Input placeholder="Seu e-mail profissional" className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 px-6 text-lg focus:ring-[#22c55e]" />
                        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-10 h-16 text-lg whitespace-nowrap">
                            Comece a usar
                        </Button>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#22c55e]" /> Teste Grátis</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#22c55e]" /> Sem Cartão</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#22c55e]" /> Setup Instantâneo</span>
                    </div>
                </div>
            </section>

            {/* Vantagens Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Por que o célula.in?</h2>
                    <p className="text-slate-500 text-lg">A plataforma pioneira que entende o coração do líder.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[
                        { icon: ShieldCheck, title: "Risco Zero", desc: "Teste todas as funcionalidades por 15 dias sem compromisso." },
                        { icon: Infinity, title: "Ilimitado", desc: "Cadastre quantos membros e visitantes sua igreja alcançar." },
                        { icon: Layers, title: "Integração", desc: "Todos os ministérios conectados em um único ecossistema." },
                        { icon: MousePointerClick, title: "Simplicidade", desc: "Interface intuitiva projetada para líderes de todas as idades." },
                        { icon: Star, title: "Pioneirismo", desc: "Primeiro sistema focado 100% na visão de células do Brasil." },
                        { icon: Zap, title: "Personalizável", desc: "Adapte as nomenclaturas e fluxos à cultura da sua igreja." }
                    ].map((v, i) => (
                        <div key={i} className="group">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <v.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{v.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Funcionalidades em Destaque */}
            <section className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 px-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Módulos que transformam a gestão</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Users, title: "Rol de Membros", desc: "Organização completa de famílias, batismos e histórico ministerial." },
                            { icon: TrendingUp, title: "Reuniões de Células", desc: "Lançamento de frequência, dízimos e relatórios em segundos." },
                            { icon: Heart, title: "Novos Convertidos", desc: "Fluxo de consolidação e integração para novos membros." },
                            { icon: GraduationCap, title: "Formação de Líderes", desc: "Crie trilhas de treinamento e acompanhe o progresso do aluno." },
                            { icon: Calendar, title: "Organização de Eventos", desc: "Inscrições on-line com pagamento integrado e check-in digital." },
                            { icon: HandCoins, title: "Gestão Financeira", desc: "Dízimos, ofertas e relatórios financeiros transparentes." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white p-10 rounded-[48px] shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-[#22c55e]/10 text-[#16a34a] flex items-center justify-center">
                                    <f.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-12 inline-flex items-center justify-center h-24 w-24 rounded-full border-4 border-indigo-100 overflow-hidden grayscale hover:grayscale-0 transition-all">
                        <img src="https://images.unsplash.com/photo-1544168190-79c17527004f?w=400&q=80" alt="Pr. Paulo Mazoni" className="object-cover h-full w-full" />
                    </div>
                    <p className="text-2xl md:text-4xl font-black text-[#120a2e] leading-tight mb-8">
                        "O célula.in é o sistema que mais compreende a dinâmica de uma igreja em células no Brasil. Essencial para nossa expansão."
                    </p>
                    <div className="font-bold">
                        <div className="text-indigo-600 text-lg uppercase tracking-widest">Pr. Paulo Mazoni</div>
                        <div className="text-slate-400 text-sm uppercase">Igreja Batista Central de BH</div>
                    </div>
                </div>
            </section>

            {/* CTA Rodapé */}
            <section className="py-32 bg-[#120a2e] text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-12">Pronto para organizar sua igreja?</h2>
                    <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                        <Input placeholder="Seu e-mail" className="h-16 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 px-6" />
                        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-[#120a2e] font-black rounded-2xl px-10 h-16 text-lg">
                            Comece a usar
                        </Button>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-white border-t border-slate-100 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-white italic">c</div>
                        <span className="text-lg font-black tracking-tighter italic">célula.in</span>
                    </div>
                    <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-indigo-600">Central de Ajuda</Link>
                        <Link href="#" className="hover:text-indigo-600">Podcast</Link>
                        <Link href="#" className="hover:text-indigo-600">Suporte</Link>
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© {new Date().getFullYear()} Tecnologia Para o Reino</p>
                </div>
            </footer>
        </div>
    );
}
