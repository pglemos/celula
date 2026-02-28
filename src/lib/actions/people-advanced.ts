"use server";

import { createClient } from "@/lib/supabase/server";
import { TENANT_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// ============================================
// PEOPLE TIMELINE
// ============================================
export async function getPersonTimeline(personId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("people_timeline")
        .select("*")
        .eq("person_id", personId)
        .eq("tenant_id", TENANT_ID)
        .order("event_date", { ascending: false })
        .limit(50);

    if (error) throw error;
    return data || [];
}

export async function addTimelineEvent(
    personId: string,
    eventType: string,
    title: string,
    description?: string,
    metadata?: Record<string, unknown>
) {
    const supabase = await createClient();
    const { error } = await supabase.from("people_timeline").insert({
        person_id: personId,
        tenant_id: TENANT_ID,
        event_type: eventType,
        title,
        description,
        metadata: metadata || {},
    });

    if (error) throw error;
}

// ============================================
// TRANSFERS / DISMISSAL
// ============================================
export async function createTransfer(formData: FormData) {
    const supabase = await createClient();

    const personId = formData.get("person_id") as string;
    const type = formData.get("type") as string;

    const transfer = {
        person_id: personId,
        tenant_id: TENANT_ID,
        type,
        destination_church: (formData.get("destination_church") as string) || null,
        origin_church: (formData.get("origin_church") as string) || null,
        reason: (formData.get("reason") as string) || null,
        letter_content: (formData.get("letter_content") as string) || null,
        date: (formData.get("date") as string) || new Date().toISOString().split("T")[0],
    };

    const { data, error } = await supabase
        .from("people_transfers")
        .insert(transfer)
        .select()
        .single();

    if (error) throw error;

    // Deactivate person if transfer_out or dismissal
    if (type === "transfer_out" || type === "dismissal") {
        await supabase
            .from("people")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq("id", personId)
            .eq("tenant_id", TENANT_ID);
    }

    // Add to timeline
    await addTimelineEvent(personId, "transfer", `Transferência: ${type}`, transfer.reason || undefined);

    revalidatePath("/membros");
    revalidatePath(`/membros/${personId}`);
    return data;
}

export async function getPersonTransfers(personId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("people_transfers")
        .select("*")
        .eq("person_id", personId)
        .eq("tenant_id", TENANT_ID)
        .order("date", { ascending: false });

    if (error) throw error;
    return data || [];
}

// ============================================
// ADVANCED SEARCH
// ============================================
export async function searchPeopleAdvanced(filters: {
    search?: string;
    membership_status?: string;
    gender?: string;
    neighborhood?: string;
    cell_id?: string;
    age_min?: number;
    age_max?: number;
    has_phone?: boolean;
    has_email?: boolean;
    tags?: string[];
}) {
    const supabase = await createClient();

    let query = supabase
        .from("people")
        .select(`
            *,
            cell_members (
                cell_id,
                role,
                cells (id, name)
            )
        `)
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("full_name");

    if (filters.search) {
        query = query.or(
            `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,address_neighborhood.ilike.%${filters.search}%`
        );
    }
    if (filters.membership_status) {
        query = query.eq("membership_status", filters.membership_status);
    }
    if (filters.gender) {
        query = query.eq("gender", filters.gender);
    }
    if (filters.neighborhood) {
        query = query.ilike("address_neighborhood", `%${filters.neighborhood}%`);
    }
    if (filters.has_phone) {
        query = query.not("phone", "is", null);
    }
    if (filters.has_email) {
        query = query.not("email", "is", null);
    }
    if (filters.age_min || filters.age_max) {
        const today = new Date();
        if (filters.age_max) {
            const minDate = new Date(today.getFullYear() - filters.age_max - 1, today.getMonth(), today.getDate() + 1);
            query = query.gte("birth_date", minDate.toISOString().split("T")[0]);
        }
        if (filters.age_min) {
            const maxDate = new Date(today.getFullYear() - filters.age_min, today.getMonth(), today.getDate());
            query = query.lte("birth_date", maxDate.toISOString().split("T")[0]);
        }
    }

    if (filters.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = data || [];

    // Client-side filter for cell_id since it's a relation
    if (filters.cell_id) {
        results = results.filter((p: any) =>
            p.cell_members?.some((cm: any) => cm.cell_id === filters.cell_id)
        );
    }

    return results;
}

// ============================================
// CSV EXPORT
// ============================================
export async function exportPeopleCSV(filters?: {
    membership_status?: string;
    neighborhood?: string;
}) {
    const supabase = await createClient();

    let query = supabase
        .from("people")
        .select(`
            full_name, preferred_name, birth_date, gender, marital_status,
            phone, whatsapp, email,
            address_street, address_number, address_complement,
            address_neighborhood, address_city, address_state, address_zip,
            membership_status, membership_date, baptism_date, conversion_date,
            notes
        `)
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("full_name");

    if (filters?.membership_status) {
        query = query.eq("membership_status", filters.membership_status);
    }
    if (filters?.neighborhood) {
        query = query.ilike("address_neighborhood", `%${filters.neighborhood}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) return "";

    // Generate CSV
    const headers = [
        "Nome Completo", "Nome Preferido", "Data Nascimento", "Gênero",
        "Estado Civil", "Telefone", "WhatsApp", "Email",
        "Rua", "Número", "Complemento", "Bairro", "Cidade", "Estado", "CEP",
        "Status", "Data Membresia", "Data Batismo", "Data Conversão", "Observações"
    ];

    const rows = data.map((p: any) => [
        p.full_name, p.preferred_name || "", p.birth_date || "", p.gender || "",
        p.marital_status || "", p.phone || "", p.whatsapp || "", p.email || "",
        p.address_street || "", p.address_number || "", p.address_complement || "",
        p.address_neighborhood || "", p.address_city || "", p.address_state || "",
        p.address_zip || "", p.membership_status || "", p.membership_date || "",
        p.baptism_date || "", p.conversion_date || "", (p.notes || "").replace(/\n/g, " ")
    ]);

    const csvContent = [
        headers.join(";"),
        ...rows.map((row: string[]) => row.map(v => `"${v}"`).join(";"))
    ].join("\n");

    return csvContent;
}

// ============================================
// DEDUPLICATION
// ============================================
export async function findDuplicates() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("people")
        .select("id, full_name, phone, email, birth_date")
        .eq("tenant_id", TENANT_ID)
        .eq("is_active", true)
        .order("full_name");

    if (error) throw error;
    if (!data) return [];

    const duplicates: Array<{ group: typeof data }> = [];
    const checked = new Set<string>();

    for (let i = 0; i < data.length; i++) {
        if (checked.has(data[i].id)) continue;

        const group = [data[i]];
        for (let j = i + 1; j < data.length; j++) {
            if (checked.has(data[j].id)) continue;

            const nameMatch = similarNames(data[i].full_name, data[j].full_name);
            const phoneMatch = data[i].phone && data[j].phone &&
                normalizePhone(data[i].phone) === normalizePhone(data[j].phone);
            const emailMatch = data[i].email && data[j].email &&
                data[i].email?.toLowerCase() === data[j].email?.toLowerCase();

            if (nameMatch || phoneMatch || emailMatch) {
                group.push(data[j]);
                checked.add(data[j].id);
            }
        }

        if (group.length > 1) {
            checked.add(data[i].id);
            duplicates.push({ group });
        }
    }

    return duplicates;
}

function normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "").slice(-11);
}

function similarNames(a: string, b: string): boolean {
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const na = normalize(a);
    const nb = normalize(b);

    if (na === nb) return true;

    // Simple Levenshtein-like check: if <= 2 edits apart for short names
    const maxLen = Math.max(na.length, nb.length);
    if (maxLen <= 4) return na === nb;

    let diffs = 0;
    const minLen = Math.min(na.length, nb.length);
    for (let i = 0; i < minLen; i++) {
        if (na[i] !== nb[i]) diffs++;
        if (diffs > 2) return false;
    }
    diffs += Math.abs(na.length - nb.length);
    return diffs <= 2;
}

// ============================================
// IMPORT WIZARD
// ============================================
export async function importPeopleFromCSV(rows: Array<Record<string, string>>) {
    const supabase = await createClient();

    const people = rows.map(row => ({
        tenant_id: TENANT_ID,
        full_name: row.full_name || row.nome || row["Nome Completo"] || "",
        preferred_name: row.preferred_name || row.apelido || row["Nome Preferido"] || null,
        phone: row.phone || row.telefone || row["Telefone"] || null,
        whatsapp: row.whatsapp || row["WhatsApp"] || null,
        email: row.email || row["Email"] || null,
        birth_date: row.birth_date || row.nascimento || row["Data Nascimento"] || null,
        gender: mapGender(row.gender || row.genero || row["Gênero"] || ""),
        address_neighborhood: row.address_neighborhood || row.bairro || row["Bairro"] || null,
        address_city: row.address_city || row.cidade || row["Cidade"] || "Belo Horizonte",
        address_state: row.address_state || row.estado || row["Estado"] || "MG",
        membership_status: mapMembershipStatus(row.membership_status || row.status || row["Status"] || ""),
        lgpd_consent: false,
        is_active: true,
    })).filter(p => p.full_name.length > 0);

    if (people.length === 0) return { imported: 0, errors: [] };

    const batchSize = 100;
    let imported = 0;
    const errors: string[] = [];

    for (let i = 0; i < people.length; i += batchSize) {
        const batch = people.slice(i, i + batchSize);
        const { data, error } = await supabase.from("people").insert(batch).select("id");
        if (error) {
            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        } else {
            imported += data?.length || 0;
        }
    }

    revalidatePath("/membros");
    return { imported, errors };
}

function mapGender(value: string): string | null {
    const v = value.toLowerCase().trim();
    if (v === "m" || v === "masculino" || v === "male") return "M";
    if (v === "f" || v === "feminino" || v === "female") return "F";
    return null;
}

function mapMembershipStatus(value: string): string {
    const v = value.toLowerCase().trim();
    if (v === "membro" || v === "member") return "member";
    if (v === "batizado" || v === "baptized") return "baptized_non_member";
    if (v === "visitante" || v === "visitor") return "visitor";
    return "visitor";
}

// ============================================
// RELATIONSHIPS
// ============================================
export async function getPersonRelationships(personId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("people_relationships")
        .select(`
            *,
            related_person:people!people_relationships_related_person_id_fkey (id, full_name, photo_url)
        `)
        .eq("person_id", personId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    return data || [];
}

export async function addPersonRelationship(
    personId: string,
    relatedPersonId: string,
    relationshipType: string
) {
    const supabase = await createClient();

    // Add A -> B
    const { error: error1 } = await supabase.from("people_relationships").insert({
        person_id: personId,
        related_person_id: relatedPersonId,
        relationship_type: relationshipType,
        tenant_id: TENANT_ID,
    });

    if (error1) throw error1;

    // Add B -> A (reciprocal logic)
    let reciprocalType = relationshipType;
    if (relationshipType === "child") reciprocalType = "parent";
    else if (relationshipType === "parent") reciprocalType = "child";
    else if (relationshipType === "grandchild") reciprocalType = "grandparent";
    else if (relationshipType === "grandparent") reciprocalType = "grandchild";

    const { error: error2 } = await supabase.from("people_relationships").upsert({
        person_id: relatedPersonId,
        related_person_id: personId,
        relationship_type: reciprocalType,
        tenant_id: TENANT_ID,
    }, { onConflict: "person_id,related_person_id,relationship_type" });

    revalidatePath(`/membros/${personId}`);
    revalidatePath(`/membros/${relatedPersonId}`);
    return { success: true };
}

export async function removePersonRelationship(id: string) {
    const supabase = await createClient();

    // Find the relationship to get IDs for revalidation and reciprocal removal
    const { data: rel } = await supabase
        .from("people_relationships")
        .select("person_id, related_person_id")
        .eq("id", id)
        .single();

    if (rel) {
        // Remove both directions for simplicity in this schema
        await supabase
            .from("people_relationships")
            .delete()
            .or(`and(person_id.eq.${rel.person_id},related_person_id.eq.${rel.related_person_id}),and(person_id.eq.${rel.related_person_id},related_person_id.eq.${rel.person_id})`)
            .eq("tenant_id", TENANT_ID);

        revalidatePath(`/membros/${rel.person_id}`);
        revalidatePath(`/membros/${rel.related_person_id}`);
    }

    return { success: true };
}

// ============================================
// MERGE PROFILES
// ============================================
export async function mergePeople(sourceId: string, targetId: string) {
    const supabase = await createClient();

    // 1. Move Timeline entries
    await supabase
        .from("people_timeline")
        .update({ person_id: targetId })
        .eq("person_id", sourceId)
        .eq("tenant_id", TENANT_ID);

    // 2. Move Transfers
    await supabase
        .from("people_transfers")
        .update({ person_id: targetId })
        .eq("person_id", sourceId)
        .eq("tenant_id", TENANT_ID);

    // 3. Move Cell Memberships (handle potential conflicts)
    const { data: sourceCells } = await supabase
        .from("cell_members")
        .select("cell_id")
        .eq("person_id", sourceId);

    if (sourceCells) {
        for (const cell of sourceCells) {
            // Check if target is already in this cell
            const { data: exists } = await supabase
                .from("cell_members")
                .select("id")
                .eq("person_id", targetId)
                .eq("cell_id", cell.cell_id)
                .single();

            if (!exists) {
                await supabase
                    .from("cell_members")
                    .update({ person_id: targetId })
                    .eq("person_id", sourceId)
                    .eq("cell_id", cell.cell_id);
            }
        }
    }

    // 4. Move Relationships
    await supabase
        .from("people_relationships")
        .update({ person_id: targetId })
        .eq("person_id", sourceId)
        .eq("tenant_id", TENANT_ID);

    await supabase
        .from("people_relationships")
        .update({ related_person_id: targetId })
        .eq("related_person_id", sourceId)
        .eq("tenant_id", TENANT_ID);

    // 5. Anonymize/Deactivate Source
    await anonymizePerson(sourceId);

    // 6. Record merge in target timeline
    await addTimelineEvent(
        targetId,
        "badge_earned",
        "Perfil Mesclado",
        "Dados de um perfil duplicado foram incorporados a este cadastro."
    );

    revalidatePath("/membros");
    revalidatePath(`/membros/${targetId}`);

    return { success: true };
}

export async function anonymizePerson(personId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("people")
        .update({
            full_name: "Usuário Excluído",
            preferred_name: null,
            email: null,
            phone: null,
            whatsapp: null,
            address_street: null,
            address_number: null,
            address_complement: null,
            address_neighborhood: null,
            address_zip: null,
            notes: "Cadastro anonimizado por solicitação ou mesclagem (LGPD).",
            photo_url: null,
            is_active: false,
            updated_at: new Date().toISOString()
        })
        .eq("id", personId)
        .eq("tenant_id", TENANT_ID);

    if (error) throw error;
    revalidatePath("/membros");
    revalidatePath(`/membros/${personId}`);
    return { success: true };
}
