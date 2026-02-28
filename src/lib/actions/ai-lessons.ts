"use server";

import { OpenAI } from "openai";
import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAILesson(topic: string, scripture?: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Configuração de IA ausente (API Key).");
    }

    const prompt = `Crie um roteiro de estudo para uma célula cristã sobre o tema "${topic}" ${scripture ? `baseado no texto bíblico ${scripture}` : ""}.
    O roteiro deve conter:
    1. Título impactante.
    2. Quebra-gelo sugestivo.
    3. Texto bíblico principal e breve comentário (3-4 parágrafos).
    4. 3 a 5 perguntas para discussão prática.
    5. Desafio prático para a semana.
    
    Retorne o resultado estritamente em formato JSON com as seguintes chaves:
    {
        "title": "string",
        "content": "string (markdown)",
        "scripture_reference": "string",
        "discussion_questions": ["string"]
    }`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    // Salvar no banco
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("cell_lessons")
        .insert({
            tenant_id: TENANT_ID,
            title: result.title,
            content: result.content,
            verse_text: result.scripture_reference || scripture, // Era scripture_reference no JS, mas verse_text no SQL
            questions: result.discussion_questions, // Era discussion_questions no JS, mas questions no SQL
            is_ai_generated: true, // Era ai_generated no JS, mas is_ai_generated no SQL
            suggested_at: new Date().toISOString().split('T')[0] // Era week_date no JS, mas suggested_at no SQL
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath("/licoes");
    return data;
}
