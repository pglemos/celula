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
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gamificação</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ranking, XP, Níveis e Conquistas
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Liderança (Leaderboard) */}
                <Card className="glass-card md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" /> Leaderboard
                            </CardTitle>
                            <CardDescription>Top membros por pontos de experiência (XP)</CardDescription>
                        </div>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-4">
                            {leaderboard.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    Nenhum participante no ranking ainda.
                                </div>
                            ) : (
                                leaderboard.map((profile, i) => {
                                    const rank = i + 1;
                                    const isTop3 = rank <= 3;
                                    return (
                                        <div key={profile.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                            <div className="flex items-center justify-center w-8 font-bold">
                                                {rank === 1 ? <Crown className="h-6 w-6 text-amber-400" /> :
                                                    rank === 2 ? <Medal className="h-6 w-6 text-slate-300" /> :
                                                        rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> :
                                                            <span className="text-muted-foreground">#{rank}</span>}
                                            </div>

                                            <Avatar className={`h-10 w-10 border-2 ${rank === 1 ? 'border-amber-400' : rank === 2 ? 'border-slate-300' : rank === 3 ? 'border-amber-700' : 'border-primary/20'}`}>
                                                <AvatarImage src={profile.person?.photo_url || ""} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {profile.person?.full_name?.substring(0, 2).toUpperCase() || "??"}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">
                                                    {profile.person?.full_name || "Membro Desconhecido"}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <Star className="h-3 w-3" /> Nível {profile.level}
                                                    </span>
                                                    {profile.current_streak > 0 && (
                                                        <span className="flex items-center gap-1 text-orange-500">
                                                            <Flame className="h-3 w-3" /> {profile.current_streak} dias
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-lg font-black text-amber-500">{profile.xp_total}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase ml-1">XP</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Badges Disponíveis */}
                <Card className="glass-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Medal className="h-5 w-5 text-indigo-500" /> Conquistas
                        </CardTitle>
                        <CardDescription>Badges disponíveis no sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {badges.length === 0 ? (
                                <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                                    Nenhuma badge cadastrada.
                                </div>
                            ) : (
                                badges.map((badge) => (
                                    <div key={badge.id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-secondary/20 text-center gap-2">
                                        <div
                                            className="h-12 w-12 rounded-full flex items-center justify-center shadow-inner"
                                            style={{ backgroundColor: `${badge.color}20`, border: `2px solid ${badge.color}` }}
                                        >
                                            <span className="text-2xl" role="img" aria-label={badge.name}>
                                                {badge.icon === 'star' ? '⭐' : badge.icon}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold leading-tight">{badge.name}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">+{badge.xp_reward} XP</p>
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
