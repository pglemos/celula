# ⛪ Central 3.0 — Church OS

> A plataforma definitiva de gestão para igrejas em células. White-label, mobile-first, com IA nativa.

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Charts** | Recharts |
| **Database** | PostgreSQL (Supabase) + RLS |
| **Auth** | Supabase Auth / Clerk |
| **Data Fetching** | TanStack React Query |
| **Forms** | react-hook-form + zod |

## 📦 Módulos MVP

- ✅ **Dashboard** — KPIs, gráfico de presença, IA Pastoral, ações rápidas
- ✅ **Membros** — CRUD, busca, filtros, perfil com timeline
- ✅ **Células** — Grid, detalhes, registro de reunião (presença, ⭐, decisões)
- ✅ **Supervisão** — Redes, semáforo de saúde, métricas por célula

## 🛠️ Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# 3. Rodar em desenvolvimento
npm run dev

# 4. Build de produção
npm run build
```

## 📐 Estrutura

```
src/
├── app/(dashboard)/          # Páginas do dashboard
│   ├── page.tsx              # Dashboard principal
│   ├── membros/              # Módulo de membros
│   ├── celulas/              # Módulo de células
│   └── supervisao/           # Módulo de supervisão
├── components/
│   ├── layout/               # Sidebar + Header
│   ├── dashboard/            # KPI cards
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── supabase/             # Clients (server + browser)
│   └── mock-data.ts          # Dados de demonstração
supabase/
└── migrations/               # Schema SQL com RLS
```

## 📋 Roadmap

- **MVP** (Semanas 1–8): Membros, Células, Supervisão ← _estamos aqui_
- **V1.0** (Semanas 9–16): Consolidação, Eventos, Cursos, Financeiro, App Membro
- **V2.0** (Semanas 17–24): IA Pastoral, Gamificação, WhatsApp, Mapa 3D, API pública

## 📄 Licença

Proprietário — © 2026 Igreja Central de Belo Horizonte
