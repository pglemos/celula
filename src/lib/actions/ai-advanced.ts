"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";

// ============================================
// PASTORAL AI (Simulated for Demo / DB analysis)
// ============================================

export async function getPastoralInsights() {
    const supabase = await createClient();

    // 1. Fetch cell data for the week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Simplification for demo: fetch recent meetings and cell stats
    const { data: cells } = await supabase
        .from("cells")
        .select("id, name, health_score")
        .eq("tenant_id", TENANT_ID)
        .eq("status", "active");

    const { data: alerts } = await supabase
        .from("alerts")
        .select("title, message, type, severity")
        .eq("tenant_id", TENANT_ID)
        .eq("is_read", false);

    const { data: recentMeetings } = await supabase
        .from("cell_meetings")
        .select("god_presence_rating, topic")
        .eq("tenant_id", TENANT_ID)
        .gte("date", lastWeek.toISOString());

    // Generate analytical summary
    const totalCells = cells?.length || 0;
    const lowHealthCells = cells?.filter(c => (c.health_score || 0) < 50).length || 0;
    const avgPresence = recentMeetings && recentMeetings.length > 0
        ? Math.round(recentMeetings.reduce((a, b) => a + (b.god_presence_rating || 0), 0) / recentMeetings.length)
        : 0;

    // Simulated "AI generated" insights based on real DB stats
    const summary = `Nesta semana tivemos ${recentMeetings?.length || 0} reuniões reportadas. A nota média de presença de Deus foi de ${avgPresence}/10. Há um alerta: ${lowHealthCells} células (${totalCells > 0 ? Math.round((lowHealthCells / totalCells) * 100) : 0}%) estão com saúde abaixo do ideal e precisam de supervisão próxima.`;

    const predictiveAlerts = [
        {
            title: "Risco de Evasão",
            description: "Com base na queda de frequência, 3 membros da Célula Esperança podem estar precisando de visita pastoral rápida.",
            severity: "high",
        },
        {
            title: "Potencial de Multiplicação",
            description: "A Célula Jovem Fonte tem mantido 100% de presença e alta nota espiritual. Estão prontos para iniciar o trilho de multiplicação com o novo co-líder.",
            severity: "low",
        },
        {
            title: "Consolidação Lenta",
            description: "O tempo médio de contato com novos convertidos subiu para 48h. Recomendado reforçar a equipe de consolidação.",
            severity: "medium",
        }
    ];

    // Final Preaching Topics (Refined to be more dynamic)
    const preachingTopics = [
        {
            topic: avgPresence < 7 ? "Renovo Espiritual: Buscando a Presença" : "Vivendo na Plenitude do Espírito",
            reason: avgPresence < 7
                ? "A percepção da 'Presença de Deus' nas células baixou. É hora de clamar por um novo fôlego e avivamento."
                : "As células relatam experiências profundas de Deus. Momento ideal para ensinar sobre maturidade espiritual.",
            scriptures: avgPresence < 7 ? ["Salmos 51:10", "Atos 3:19"] : ["Efésios 5:18", "Gálatas 5:22"],
        },
        {
            topic: lowHealthCells > 0 ? "O Cuidado de Deus e o Corpo de Cristo" : "Multiplicação: O Mandato do Reino",
            reason: lowHealthCells > 0
                ? `${lowHealthCells} células estão em alerta de saúde. O rebanho precisa de pastoreio e unidade.`
                : "A saúde das células está excelente. Momento profético para focar em expansão e liderança.",
            scriptures: lowHealthCells > 0 ? ["1 Corintios 12:25", "Gálatas 6:2"] : ["Mateus 28:19", "Atos 1:8"],
        }
    ];

    const systemAlerts = alerts || [];

    return {
        summary,
        predictiveAlerts,
        preachingTopics,
        systemAlerts
    };
}
