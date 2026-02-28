// Mock data for the MVP — will be replaced with Supabase queries

export const mockMembers = [
    { id: "1", full_name: "Ana Silva", phone: "(31) 99876-5432", email: "ana@email.com", membership_status: "member" as const, cell_name: "Jovens Norte", neighborhood: "Savassi", photo_url: null },
    { id: "2", full_name: "Bruno Santos", phone: "(31) 99765-4321", email: "bruno@email.com", membership_status: "member" as const, cell_name: "Casais Centro", neighborhood: "Funcionários", photo_url: null },
    { id: "3", full_name: "Carlos Lima", phone: "(31) 99654-3210", email: "carlos@email.com", membership_status: "baptized_non_member" as const, cell_name: "Jovens Norte", neighborhood: "Santo Agostinho", photo_url: null },
    { id: "4", full_name: "Diana Costa", phone: "(31) 99543-2109", email: "diana@email.com", membership_status: "visitor" as const, cell_name: "Mulheres Sul", neighborhood: "Lourdes", photo_url: null },
    { id: "5", full_name: "Eduardo Alves", phone: "(31) 99432-1098", email: "eduardo@email.com", membership_status: "member" as const, cell_name: "Homens Oeste", neighborhood: "Pampulha", photo_url: null },
    { id: "6", full_name: "Fernanda Reis", phone: "(31) 99321-0987", email: "fernanda@email.com", membership_status: "non_baptized" as const, cell_name: "Jovens Norte", neighborhood: "Centro", photo_url: null },
    { id: "7", full_name: "Gabriel Oliveira", phone: "(31) 99210-9876", email: "gabriel@email.com", membership_status: "member" as const, cell_name: "Casais Centro", neighborhood: "Barro Preto", photo_url: null },
    { id: "8", full_name: "Helena Martins", phone: "(31) 99109-8765", email: "helena@email.com", membership_status: "member" as const, cell_name: "Mulheres Sul", neighborhood: "Gutierrez", photo_url: null },
];

export const mockCells = [
    { id: "1", name: "Jovens Norte", category: "Jovens", leader: "Carlos Mendes", co_leader: "Ana Silva", meeting_day: "Quarta", meeting_time: "19:30", members_count: 12, status: "active" as const, health: "green" as const, last_meeting: "2026-02-26", neighborhood: "Savassi" },
    { id: "2", name: "Casais Centro", category: "Casais", leader: "Roberto e Maria", co_leader: null, meeting_day: "Terça", meeting_time: "20:00", members_count: 8, status: "active" as const, health: "green" as const, last_meeting: "2026-02-25", neighborhood: "Funcionários" },
    { id: "3", name: "Mulheres Sul", category: "Mulheres", leader: "Patricia Souza", co_leader: "Helena Martins", meeting_day: "Quinta", meeting_time: "15:00", members_count: 15, status: "active" as const, health: "yellow" as const, last_meeting: "2026-02-20", neighborhood: "Lourdes" },
    { id: "4", name: "Homens Oeste", category: "Homens", leader: "Marcos Paulo", co_leader: null, meeting_day: "Sexta", meeting_time: "19:00", members_count: 6, status: "active" as const, health: "red" as const, last_meeting: "2026-02-10", neighborhood: "Pampulha" },
    { id: "5", name: "Adolescentes Leste", category: "Adolescentes", leader: "Juliana Rocha", co_leader: "Pedro Henrique", meeting_day: "Sábado", meeting_time: "16:00", members_count: 18, status: "active" as const, health: "green" as const, last_meeting: "2026-02-22", neighborhood: "Santa Efigênia" },
    { id: "6", name: "Seniores Centro", category: "Seniores", leader: "José Alberto", co_leader: null, meeting_day: "Quarta", meeting_time: "14:00", members_count: 10, status: "active" as const, health: "green" as const, last_meeting: "2026-02-26", neighborhood: "Centro" },
];

export const mockSupervisions = [
    {
        id: "1",
        name: "Rede Jovens",
        supervisor: "Pr. André",
        level: 1,
        cells: [mockCells[0], mockCells[4]],
        members_total: 30,
        presence_avg: 88,
    },
    {
        id: "2",
        name: "Rede Casais",
        supervisor: "Pra. Cristina",
        level: 1,
        cells: [mockCells[1]],
        members_total: 8,
        presence_avg: 92,
    },
    {
        id: "3",
        name: "Rede Mulheres",
        supervisor: "Diac. Sandra",
        level: 1,
        cells: [mockCells[2]],
        members_total: 15,
        presence_avg: 72,
    },
    {
        id: "4",
        name: "Rede Homens",
        supervisor: "Pr. Ricardo",
        level: 1,
        cells: [mockCells[3]],
        members_total: 6,
        presence_avg: 55,
    },
    {
        id: "5",
        name: "Rede Seniores",
        supervisor: "Diac. Maria",
        level: 1,
        cells: [mockCells[5]],
        members_total: 10,
        presence_avg: 90,
    },
];

export const mockPresenceData = [
    { week: "S1", presence: 85 },
    { week: "S2", presence: 88 },
    { week: "S3", presence: 82 },
    { week: "S4", presence: 90 },
    { week: "S5", presence: 87 },
    { week: "S6", presence: 85 },
    { week: "S7", presence: 89 },
    { week: "S8", presence: 92 },
    { week: "S9", presence: 86 },
    { week: "S10", presence: 84 },
    { week: "S11", presence: 88 },
    { week: "S12", presence: 87 },
];

export const mockInsights = [
    { type: "warning", message: "3 células com queda de presença > 20% na última semana", action: "Ver células" },
    { type: "danger", message: "Líder Marcos Paulo: 2 semanas sem relatório", action: "Contatar" },
    { type: "success", message: "Rede Jovens: Recorde de 92% de presença esta semana!", action: "Parabenizar" },
    { type: "info", message: "Tema 'comunidade' está gerando mais engajamento nas células", action: "Detalhes" },
];
