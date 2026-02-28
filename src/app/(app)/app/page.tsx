import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, Flame, Bell, MoreHorizontal, User, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const posts = [
    {
        id: "1",
        author: "Pr. Paulo Mazoni",
        role: "Pastor Presidente",
        avatar: "https://i.pravatar.cc/150?img=11",
        content: "Neste domingo teremos um culto especial de missões com o missionário Pedro Caxilé. Venha e traga um visitante! Deus tem algo tremendo para nossa igreja.",
        time: "Há 2 horas",
        likes: 124,
        comments: 18,
        image: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=2000&auto=format&fit=crop",
        type: "Aviso"
    },
    {
        id: "2",
        author: "Departamento de Jovens",
        role: "Comunidade",
        avatar: "https://i.pravatar.cc/150?img=33",
        content: "Preparem-se para a Conferência Jovem! Inscrições abertas no módulo de eventos. #GeraçãoQueTransforma",
        time: "Há 5 horas",
        likes: 89,
        comments: 12,
        type: "Evento"
    }
];

export default function AppHomePage() {
    return (
        <div className="max-w-xl mx-auto space-y-8 animate-fade-in-up pb-20">
            {/* Header / Stories Placeholder */}
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mural</h2>
                    <p className="text-xs text-slate-500">O que está acontecendo na sua igreja</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-600" />
                </Button>
            </div>

            {/* Featured Post / Devotional */}
            <Card className="bg-indigo-600 border-none shadow-xl shadow-indigo-100 overflow-hidden relative group cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Flame className="h-32 w-32 text-white" />
                </div>
                <CardContent className="p-8 relative z-10 text-white">
                    <Badge className="bg-white/20 text-white border-none mb-4 backdrop-blur-md">Devocional Diário</Badge>
                    <h3 className="text-2xl font-bold mb-2">A Força da Comunhão</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 line-clamp-2">
                        "Oh! quão bom e quão suave é que os irmãos vivam em união." - Salmos 133:1.
                        A verdadeira força da igreja está nos laços que nos unem...
                    </p>
                    <Button className="bg-white text-indigo-600 hover:bg-white/90 font-bold px-8 rounded-full h-11 border-none shadow-lg">
                        Ler Devocional
                    </Button>
                </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <Card key={post.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all hover:shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-slate-50">
                                        <AvatarImage src={post.avatar} />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 leading-none">{post.author}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{post.role} • {post.time}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                </Button>
                            </div>

                            <p className="text-[14px] text-slate-600 leading-relaxed mb-4">
                                {post.content}
                            </p>

                            {post.image && (
                                <div className="rounded-2xl overflow-hidden mb-4 border border-slate-50">
                                    <img src={post.image} alt="Post content" className="w-full h-48 object-cover" />
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors group">
                                    <Heart className="h-4 w-4 group-hover:fill-rose-500" />
                                    <span className="text-[11px] font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors group">
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="text-[11px] font-bold">{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-2 text-slate-400 hover:text-sky-500 transition-colors ml-auto">
                                    <Share2 className="h-4 w-4" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Event Highlight Card */}
                <div className="p-1 group cursor-pointer">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-6 rounded-[32px] text-white flex items-center justify-between shadow-lg shadow-emerald-100 group-hover:scale-[1.02] transition-transform">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Próximo Evento</p>
                                <h4 className="font-bold text-lg">Retiro de Inverno</h4>
                            </div>
                        </div>
                        <Button className="bg-white/20 hover:bg-white/30 border-none rounded-full h-10 px-6 font-bold text-xs uppercase">Inscrições</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
