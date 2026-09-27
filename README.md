# Maskan POC

Investor-ready Proof of Concept for **Maskan (مسكن)** — an Egypt-wide managed-housing operator for shared residences and complete family apartments, built around speed, trust, and safety.

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

The repository contains a functional end-to-end POC using local illustrative data and signed demo sessions. The Supabase schema remains a starting point for the production integration pass. The intended next phase is to migrate the current rental model into versioned Supabase migrations, seed the portfolio, and replace local data and demo authentication with real database reads, Auth, RLS, and operations.

All portfolio, occupancy, resident, payment, and financial values in the POC are **dummy / illustrative data**, not actual Maskan operating results.
