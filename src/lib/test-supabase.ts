import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";

async function testSupabaseIntegration() {
    const supabase = await createClient();

    console.log("--- Testando Integração Supabase (RF-04) ---");

    // 1. Testar se as tabelas existem
    const { error: tableError } = await supabase.from("consolidation_events").select("id").limit(1);
    if (tableError) {
        console.error("❌ Erro ao acessar consolidation_events:", tableError.message);
    } else {
        console.log("✅ Tabela consolidation_events acessível.");
    }

    // 2. Testar RPC match_ideal_cells
    // Criar um mock convert se necessário ou usar um existente
    const { data: converts } = await supabase.from("new_converts").select("id").limit(1);
    if (converts && converts.length > 0) {
        const { data: matches, error: matchError } = await supabase.rpc("match_ideal_cells", {
            p_convert_id: converts[0].id
        });
        if (matchError) {
            console.error("❌ Erro no RPC match_ideal_cells:", matchError.message);
        } else {
            console.log("✅ RPC match_ideal_cells funcionando. Sugestões:", matches?.length);
        }
    } else {
        console.log("⚠️ Nenhum novo convertido encontrado para testar matching.");
    }

    // 3. Testar RPC check_consolidation_overdue
    const { data: overdue, error: overdueError } = await supabase.rpc("check_consolidation_overdue");
    if (overdueError) {
        console.error("❌ Erro no RPC check_consolidation_overdue:", overdueError.message);
    } else {
        console.log("✅ RPC check_consolidation_overdue funcionando. Pendentes:", overdue?.length);
    }

    // 4. Testar View v_consolidation_funnel
    const { data: funnel, error: funnelError } = await supabase.from("v_consolidation_funnel").select("*").eq("tenant_id", TENANT_ID);
    if (funnelError) {
        console.error("❌ Erro ao acessar view v_consolidation_funnel:", funnelError.message);
    } else {
        console.log("✅ View v_consolidation_funnel acessível.");
    }

    console.log("--- Fim dos Testes ---");
}

testSupabaseIntegration();
