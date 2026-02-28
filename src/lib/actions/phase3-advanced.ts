"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ============================================
// FINANCIAL REPORTS (DRE, BALANCE SHEET, CASH FLOW)
// ============================================
export async function getDRE(startDate: string, endDate: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("contributions")
        .select(`
            amount, type, created_at,
            category:financial_categories!contributions_category_id_fkey(name, type, dre_group)
        `)
        .eq("tenant_id", TENANT_ID)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at");

    if (error) throw error;

    const dre: Record<string, { label: string; total: number; items: any[] }> = {
        dizimos: { label: "Dízimos", total: 0, items: [] },
        ofertas: { label: "Ofertas", total: 0, items: [] },
        campanhas: { label: "Campanhas", total: 0, items: [] },
        eventos: { label: "Eventos", total: 0, items: [] },
        cursos: { label: "Cursos", total: 0, items: [] },
        outros_receitas: { label: "Outras Receitas", total: 0, items: [] },
        pessoal: { label: "Pessoal", total: 0, items: [] },
        administrativo: { label: "Administrativo", total: 0, items: [] },
        manutencao: { label: "Manutenção", total: 0, items: [] },
        missoes: { label: "Missões", total: 0, items: [] },
        social: { label: "Social", total: 0, items: [] },
        outros_despesas: { label: "Outras Despesas", total: 0, items: [] },
    };

    (data || []).forEach((item: any) => {
        const group = item.category?.dre_group ||
            (item.type === "tithe" ? "dizimos" :
                item.type === "offering" ? "ofertas" :
                    item.type === "campaign" ? "campanhas" : "outros_receitas");

        if (dre[group]) {
            dre[group].total += Number(item.amount);
            dre[group].items.push(item);
        }
    });

    const totalReceitas = Object.entries(dre)
        .filter(([k]) => ["dizimos", "ofertas", "campanhas", "eventos", "cursos", "outros_receitas"].includes(k))
        .reduce((acc, [, v]) => acc + v.total, 0);

    const totalDespesas = Object.entries(dre)
        .filter(([k]) => ["pessoal", "administrativo", "manutencao", "missoes", "social", "outros_despesas"].includes(k))
        .reduce((acc, [, v]) => acc + v.total, 0);

    return {
        groups: dre,
        totalReceitas,
        totalDespesas,
        resultado: totalReceitas - totalDespesas,
        period: { startDate, endDate },
    };
}

export async function getCashFlow(year: number) {
    const supabase = await createClient();

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
        .from("contributions")
        .select("amount, type, created_at")
        .eq("tenant_id", TENANT_ID)
        .gte("created_at", startDate)
        .lte("created_at", endDate)
        .order("created_at");

    if (error) throw error;

    // Group by month
    const months = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        label: new Date(year, i).toLocaleDateString("pt-BR", { month: "short" }),
        income: 0,
        expense: 0,
        net: 0,
    }));

    (data || []).forEach((item: any) => {
        const month = new Date(item.created_at).getMonth();
        const amount = Number(item.amount);
        // Tithes, offerings, campaigns = income; expense categories = expense
        if (["tithe", "offering", "campaign", "special"].includes(item.type)) {
            months[month].income += amount;
        } else {
            months[month].expense += amount;
        }
        months[month].net = months[month].income - months[month].expense;
    });

    return months;
}

// ============================================
// CAMPAIGNS
// ============================================
export async function getCampaigns() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .order("start_date", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function createCampaign(formData: FormData) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .insert({
            tenant_id: TENANT_ID,
            name: formData.get("name") as string,
            description: (formData.get("description") as string) || null,
            goal_amount: parseFloat(formData.get("goal_amount") as string),
            start_date: formData.get("start_date") as string,
            end_date: formData.get("end_date") as string,
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/contribuicoes");
    return data;
}

// ============================================
// GAMIFICATION
// ============================================
export async function getLeaderboard(limit = 20) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("gamification_profiles")
        .select(`
            *,
            person:people!gamification_profiles_person_id_fkey(id, full_name, photo_url)
        `)
        .eq("tenant_id", TENANT_ID)
        .order("xp_total", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}

export async function getProfileGamification(personId: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("gamification_profiles")
        .select("*")
        .eq("person_id", personId)
        .maybeSingle();

    const { data: badges } = await supabase
        .from("earned_badges")
        .select(`
            *,
            badge:badges!earned_badges_badge_id_fkey(id, name, description, icon, color, category, xp_reward)
        `)
        .eq("person_id", personId)
        .order("earned_at", { ascending: false });

    const { data: recentXP } = await supabase
        .from("xp_transactions")
        .select("*")
        .eq("person_id", personId)
        .order("created_at", { ascending: false })
        .limit(10);

    return {
        profile: profile || { xp_total: 0, level: 1, current_streak: 0, longest_streak: 0 },
        badges: badges || [],
        recentXP: recentXP || [],
    };
}

export async function awardXP(
    personId: string,
    amount: number,
    reason: string,
    sourceType: string,
    sourceId?: string
) {
    const supabase = await createClient();

    // Create XP transaction
    await supabase.from("xp_transactions").insert({
        person_id: personId,
        tenant_id: TENANT_ID,
        amount,
        reason,
        source_type: sourceType,
        source_id: sourceId || null,
    });

    // Update or create profile
    const { data: profile } = await supabase
        .from("gamification_profiles")
        .select("id, xp_total, level")
        .eq("person_id", personId)
        .maybeSingle();

    const newXP = (profile?.xp_total || 0) + amount;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

    if (profile) {
        await supabase
            .from("gamification_profiles")
            .update({
                xp_total: newXP,
                level: newLevel,
                last_activity_date: new Date().toISOString().split("T")[0],
                updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
    } else {
        await supabase.from("gamification_profiles").insert({
            person_id: personId,
            tenant_id: TENANT_ID,
            xp_total: amount,
            level: 1,
            last_activity_date: new Date().toISOString().split("T")[0],
        });
    }
}

export async function getBadges() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("badges")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .order("category", { ascending: true });

    if (error) throw error;
    return data || [];
}

export async function awardBadge(personId: string, badgeId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("earned_badges")
        .insert({
            person_id: personId,
            badge_id: badgeId,
        })
        .select()
        .single();

    if (error && error.code === "23505") return null; // Already earned
    if (error) throw error;

    // Get badge XP reward
    const { data: badge } = await supabase
        .from("badges")
        .select("xp_reward, name")
        .eq("id", badgeId)
        .single();

    if (badge) {
        await awardXP(personId, badge.xp_reward, `Badge: ${badge.name}`, "badge", badgeId);
    }

    return data;
}

export async function updateStreak(personId: string) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("gamification_profiles")
        .select("id, current_streak, longest_streak, last_activity_date")
        .eq("person_id", personId)
        .maybeSingle();

    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];
    const lastActivity = profile.last_activity_date;

    let newStreak = profile.current_streak;
    if (lastActivity) {
        const diff = Math.floor(
            (new Date(today).getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff === 1) {
            newStreak++;
        } else if (diff > 1) {
            newStreak = 1;
        }
        // diff === 0 means same day, no change
    } else {
        newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, profile.longest_streak);

    await supabase
        .from("gamification_profiles")
        .update({
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today,
            updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
}
