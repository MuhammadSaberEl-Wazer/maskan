# Maskan POC

Investor-ready Proof of Concept for **Maskan (مسكن)** — an Egypt-wide managed shared-housing operator built around speed, trust, and safety.

## Stack

- Next.js (App Router)
- TypeScript
- pnpm
- Tailwind CSS
- shadcn/ui direction
- Supabase (Database, Auth, Storage, RLS)

> This is intentionally a **Next.js project**, not a standalone React/Vite SPA.

## Documentation

Read these before continuing development, especially when using Codex or Claude Code:

- [`docs/BUSINESS.md`](docs/BUSINESS.md) — canonical business model, operations, products, economics, market assumptions, rules, and open decisions.
- [`docs/TECHNICAL.md`](docs/TECHNICAL.md) — canonical technical architecture, routes, flows, Supabase model, security direction, and implementation plan.

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open `http://localhost:3000`.

Before using live Supabase data, configure `.env.local` and apply/refine the database schema in `supabase/schema.sql` (prefer migrations as the project evolves).

## Current Routes

- `/` — Home
- `/explore` — Browse managed residences and available spaces
- `/property/[slug]` — Property details
- `/my-maskan` — Resident portal demo
- `/admin` — Operations dashboard demo

More target routes and flows are documented in `docs/TECHNICAL.md`.

## Current State

The repository is an early POC shell. It currently uses local illustrative data for immediate UI rendering while the Supabase schema is prepared for the integration pass. The intended next phase is to seed Supabase and replace local data with real Supabase reads/auth/operations.

All portfolio, occupancy, resident, payment, and financial values in the POC are **dummy / illustrative data**, not actual Maskan operating results.
