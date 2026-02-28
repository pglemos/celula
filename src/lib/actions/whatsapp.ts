import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getWhatsAppSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data, error } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function connectWhatsApp() {
    // Mock simulation of getting a QR Code from a gateway
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Não autenticado");

    // In a real scenario, this would call an external API (Evolution, etc.)
    const { data: person } = await supabase
        .from("people")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    if (!person) throw new Error("Perfil não encontrado");

    const mockQRCode = "BASE64_QR_CODE_MOCK_" + Math.random().toString(36).substring(7);

    const { error } = await supabase
        .from("whatsapp_sessions")
        .upsert({
            tenant_id: TENANT_ID,
            person_id: person.id,
            session_name: "Principal",
            status: "pairing",
            qr_code: mockQRCode,
            updated_at: new Date().toISOString()
        });

    if (error) throw error;
    revalidatePath("/configuracoes");
    return { qrCode: mockQRCode };
}

export async function disconnectWhatsApp() {
    const supabase = await createClient();
    const { error } = await supabase
        .from("whatsapp_sessions")
        .delete()
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/configuracoes");
}
