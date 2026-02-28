import { Trophy, Medal, Star, Flame, Crown, Users } from "lucide-react";
import { getLeaderboard, getBadges } from "@/lib/actions/phase3-advanced";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function GamificacaoPage() {
    const [leaderboard, badges] = await Promise.all([
        getLeaderboard(20),
        getBadges()
    ]);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pl-4">
                <div>
                    <h1 className="text-4xl font-light tracking-tight text-slate-800">Gamificação</h1>
                    <p className="text-base font-medium text-slate-500 mt-1">
                        Ranking, XP, Níveis e Conquistas
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Leaderboard */}
                <Card className="md:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-medium text-slate-800 tracking-tight flex items-center gap-3">
                                    <div className="p-2 rounded-2xl bg-amber-100 text-amber-600">
                                        <Trophy className="h-5 w-5" />
                                    </div>
                                    Leaderboard
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 mt-1 ml-12">Top membros por pontos de experiência (XP)</CardDescription>
                            </div>
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-3 mt-6">
                            {leaderboard.length === 0 ? (
                                <div className="py-12 text-center text-sm text-slate-400">
                                    <Trophy className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-lg font-medium text-slate-500">Nenhum participante no ranking</p>
                                </div>
                            ) : (
                                leaderboard.map((profile, i) => {
                                    const rank = i + 1;
                                    return (
                                        <div key={profile.id} className="flex items-center gap-4 p-4 rounded-[24px] bg-white/80 hover:bg-white transition-all hover:shadow-sm border border-transparent hover:border-slate-200">
                                            <div className="flex items-center justify-center w-8 font-bold">
                                                {rank === 1 ? <Crown className="h-6 w-6 text-amber-400" /> :
                                                    rank === 2 ? <Medal className="h-6 w-6 text-slate-400" /> :
                                                        rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> :
                                                            <span className="text-slate-400 font-bold text-sm">#{rank}</span>}
                                            </div>

                                            <Avatar className={`h-11 w-11 border-2 shadow-sm ${rank === 1 ? 'border-amber-400' : rank === 2 ? 'border-slate-300' : rank === 3 ? 'border-amber-700' : 'border-slate-200'}`}>
                                                <AvatarImage src={profile.person?.photo_url || ""} />
                                                <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-sm">
                                                    {profile.person?.full_name?.substring(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate text-slate-800">
                                                    {profile.person?.full_name || "Membro Desconhecido"}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                    <span className="flex items-center gap-1 text-indigo-500 font-semibold">
                                                        <Star className="h-3 w-3" /> Nível {profile.level}
                                                    </span>
                                                    {profile.current_streak > 0 && (
                                                        <span className="flex items-center gap-1 text-orange-500 font-semibold">
                                                            <Flame className="h-3 w-3" /> {profile.current_streak} dias
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-lg font-black text-amber-500">{profile.xp_total}</span>
                                                <span className="text-[10px] text-slate-400 uppercase ml-1 font-bold">XP</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Badges */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                    <CardHeader className="px-8 pt-8 pb-4 border-b border-slate-200/50">
                        <CardTitle className="text-2xl font-medium text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-600">
                                <Medal className="h-5 w-5" />
                            </div>
                            Conquistas
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-500 mt-1 ml-12">Badges disponíveis no sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {badges.length === 0 ? (
                                <div className="col-span-2 py-12 text-center text-sm text-slate-400">
                                    <Medal className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-lg font-medium text-slate-500">Nenhuma badge cadastrada</p>
                                </div>
                            ) : (
                                badges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center justify-center p-5 rounded-[24px] bg-white/80 border border-slate-100 text-center gap-2 hover:shadow-sm transition-all">
                                        <div
                                            className="h-12 w-12 rounded-full flex items-center justify-center shadow-sm"
                                            style={{ backgroundColor: `${badge.color}20`, border: `2px solid ${badge.color}` }}
                                        >
                                            <span className="text-2xl" role="img" aria-label={badge.name}>
                                                {badge.icon === 'star' ? '⭐' : badge.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-tight text-slate-700">{badge.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-semibold">+{badge.xp_reward} XP</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
