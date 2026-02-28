import {
    Users,
    CircleDot,
    TrendingUp,
    Heart,
    Bot,
    ChevronLeft,
    Share,
    Maximize2,
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    ArrowUpRight,
    MapPin,
    Mic,
    MessageSquare,
    Star,
    Sparkles
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/lib/actions/supervisions";
import { PresenceChart } from "@/components/dashboard/presence-chart";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockInsights = [
    { type: "warning" as const, message: "3 células com queda de presença > 20% na última semana", action: "Ver células", href: "/celulas" },
    { type: "danger" as const, message: "Líder Marcos Paulo: 2 semanas sem relatório", action: "Contatar", href: "/celulas" },
    { type: "success" as const, message: "Rede Jovens: Recorde de 92% de presença esta semana!", action: "Parabenizar", href: "/supervisao" },
];

const insightIcons = { warning: AlertTriangle, danger: XCircle, success: CheckCircle2, info: Info };
const insightColors = {
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-red-500 bg-red-500/10",
    success: "text-emerald-500 bg-emerald-500/10",
    info: "text-blue-500 bg-blue-500/10",
};

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6 animate-fade-in-up pb-20 relative">

            {/* HERO BANNER SECTION */}
            <div className="relative w-full h-[400px] md:h-[480px] rounded-[32px] overflow-hidden shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1548625361-ec84643ce769?q=80&w=2800&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    alt="Hero landscape"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top floating elements inside Hero */}
                <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-white z-10">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/30 shadow-lg">
                        <MapPin className="h-4 w-4" />
                        <span className="font-bold text-sm tracking-wide">Igreja Central</span>
                    </div>

                    {/* Avatars Group */}
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Avatar key={i} className="h-10 w-10 border-2 border-white/50 shadow-md">
                                    <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 font-bold text-sm shadow-md">
                            +5
                        </div>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10 -mt-10">
                    <h1 className="text-6xl md:text-[5.5rem] font-medium tracking-tight mb-4 drop-shadow-lg opacity-90">Visão Geral</h1>
                    <p className="max-w-xl text-white/80 font-normal text-lg leading-relaxed drop-shadow-md">
                        Acompanhe o crescimento da rede, eventos e métricas de engajamento em tempo real com os relatórios da central.
                    </p>
                </div>

                {/* Bottom Nav Pills Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex justify-center z-10">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xl p-1.5 rounded-full border border-white/20 shadow-xl">
                        <Button variant="ghost" className="rounded-full bg-white text-slate-900 hover:bg-white hover:text-slate-900 px-6 md:px-8 h-12 font-bold text-sm shadow-lg">
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 md:px-8 h-12 font-bold text-sm text-white hover:bg-white/20 hover:text-white transition-colors">
                            Membros
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 md:px-8 h-12 font-bold text-sm text-white hover:bg-white/20 hover:text-white transition-colors">
                            Células
                        </Button>
                        <Button variant="ghost" className="rounded-full px-6 md:px-8 h-12 font-bold text-sm text-white hover:bg-white/20 hover:text-white transition-colors hidden md:flex">
                            Fluxos
                        </Button>
                    </div>
                </div>
            </div>

            {/* DASHBOARD CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-20">

                {/* Assistant Card - Overlapping visually in a 3/9 or 4/8 layout */}
                <div className="md:col-span-12 lg:col-span-4 -mt-16 md:-mt-28 z-30">
                    <Card className="bento-card h-[460px] bg-gradient-to-br from-[#f2f8cd] to-[#d4ff68] border-none shadow-[0_24px_50px_rgba(200,220,50,0.2)] relative overflow-hidden flex flex-col p-8 rounded-[40px]">
                        <div className="flex items-center justify-between z-10 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-900 text-[#eaffaf] flex items-center justify-center">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm tracking-widest uppercase">Assistant</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-black/5 rounded-full">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center z-10">
                            <h2 className="text-[2.5rem] font-light text-slate-800 leading-[1.15] tracking-tight">
                                Ready to dive into some <span className="font-semibold text-slate-900">hotel options</span> or maybe <span className="font-semibold text-slate-900">an itinerary?</span>
                            </h2>

                            <div className="mt-8 flex flex-wrap gap-2">
                                <Button variant="ghost" className="rounded-2xl bg-[#e3efb8]/60 hover:bg-[#d6e89c] text-slate-800 font-semibold px-6 h-12">Sea views</Button>
                                <Button variant="ghost" className="rounded-2xl bg-[#e3efb8]/60 hover:bg-[#d6e89c] text-slate-800 font-semibold px-6 h-12">A pool</Button>
                                <Button variant="ghost" className="rounded-2xl bg-[#e3efb8]/60 hover:bg-[#d6e89c] text-slate-800 font-semibold px-6 h-12">All</Button>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10 px-2">
                            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-black/5 text-slate-900">
                                <Maximize2 className="h-5 w-5" />
                            </Button>
                            <div className="h-16 w-16 bg-slate-900 rounded-[28px] shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer">
                                <Mic className="h-6 w-6" />
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-black/5 text-slate-900">
                                <MessageSquare className="h-5 w-5" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Main Metrics Area */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {/* Top Row KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Weather / Active Members Card */}
                        <Card className="bento-card p-8 flex flex-col justify-between min-h-[180px] group cursor-pointer hover:bg-slate-50 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px]">
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <p className="text-[2.5rem] font-medium text-slate-800 tracking-tight leading-none">{stats.peopleCount}</p>
                                <p className="text-[13px] font-semibold text-slate-400 mt-2">Membros Ativos</p>
                            </div>
                        </Card>

                        {/* Pricing / Cells Card */}
                        <Card className="bento-card p-8 flex flex-col justify-between min-h-[180px] group cursor-pointer hover:bg-slate-50 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px]">
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                                    <CircleDot className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <p className="text-[2.5rem] font-medium text-slate-800 tracking-tight leading-none">{stats.cellsCount}</p>
                                <div className="flex gap-1 mt-3">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={cn("h-4 w-1.5 rounded-full", i < 7 ? "bg-emerald-500" : "bg-slate-200")} />
                                    ))}
                                </div>
                                <p className="text-[13px] font-semibold text-slate-400 mt-3">Células Ativas</p>
                            </div>
                        </Card>

                        {/* Activity / Decisions Card */}
                        <Card className="bento-card p-8 flex flex-col justify-between min-h-[180px] group cursor-pointer hover:bg-slate-50 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px]">
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                                    <Heart className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col items-center">
                                <p className="text-xl font-medium text-slate-800 tracking-tight mb-2">Decisões</p>
                                <div className="flex items-end gap-1.5 h-10">
                                    {[3, 4, 2, 5, 8, 4, 6].map((h, i) => (
                                        <div key={i} className={cn("w-3 rounded-t-sm", i === 4 ? "bg-emerald-500" : "bg-slate-200")} style={{ height: `${h * 10}%` }} />
                                    ))}
                                </div>
                                <p className="text-[13px] font-semibold text-slate-400 mt-3">{stats.totalDecisions} este mês</p>
                            </div>
                        </Card>
                    </div>

                    {/* Chart Container */}
                    <Card className="bento-card p-10 min-h-[460px] flex flex-col border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px]">
                        <div className="mb-10 flex items-center justify-between">
                            <div>
                                <h2 className="text-[1.75rem] font-medium tracking-tight text-slate-900">Engajamento Mensal</h2>
                                <p className="text-[15px] font-semibold text-slate-400 mt-2">Presença média global nos últimos 6 meses</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 h-10 w-10 border border-slate-100 shadow-sm">
                                    <Share className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 w-full bg-slate-50/50 rounded-2xl flex items-center justify-center p-4">
                            {/* The customized PresenceChart component might need its internal text adjusted. Passing down props if it had them, or assume it inherits */}
                            <PresenceChart />
                        </div>
                    </Card>

                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                {/* Members List */}
                <Card className="bento-card overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px]">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <h3 className="text-xl font-medium text-slate-900">Últimos Integrantes</h3>
                        <Link href="/membros">
                            <Button variant="ghost" size="sm" className="text-slate-600 font-bold hover:bg-slate-100 rounded-full px-5 h-10">
                                Ver Todos
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2 p-6 pt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer rounded-3xl border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 shadow-sm">
                                        <AvatarImage src={`https://i.pravatar.cc/100?img=${i}`} />
                                        <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">M{i}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-[15px] text-slate-900 group-hover:text-indigo-600 transition-colors">Ana Carolina Silva</p>
                                        <p className="text-[13px] font-medium text-slate-400 mt-0.5">Rede Jovens • Célula {i}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-slate-400 group-hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                                    <ChevronLeft className="h-5 w-5 rotate-180" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* AI Insights replacing simple list */}
                <Card className="bento-card h-full flex flex-col p-8 pb-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] relative overflow-hidden bg-white/60 backdrop-blur-sm">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-slate-900">Autopilot Insights</h3>
                            <p className="text-[13px] font-semibold text-slate-400 mt-0.5">Análise automática da rede</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-3 relative z-10 mt-2">
                        {mockInsights.map((insight, i) => {
                            const Icon = insightIcons[insight.type];
                            return (
                                <div key={i} className="flex flex-col bg-white/80 p-5 rounded-3xl border border-white/50 shadow-sm transition-all hover:translate-x-1 hover:shadow-md cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className={cn("mt-0.5 p-2 rounded-2xl", insightColors[insight.type])}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] font-semibold text-slate-800 leading-snug">
                                                {insight.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <Button variant="link" className="p-0 h-auto text-[13px] font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                                    {insight.action} →
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

        </div>
    );
}
