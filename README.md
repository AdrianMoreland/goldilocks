# Merrion Gold Pricing Workbook

An internal pricing and trading dashboard for Merrion Gold, an Irish bullion dealer. It shows live metal spot prices, a per-product pricing table (premiums/discounts/VAT), a trade calculator, a portfolio builder, tax reference calculators, and an admin-gated pricing editor.

## Tech stack

pnpm workspace monorepo, orchestrated with Turborepo.

| Package | Stack |
|---|---|
| `apps/api` | NestJS 11, Prisma 7 (Postgres via Supabase), Redis (cache-aside), `nestjs-zod`, Supabase Auth |
| `apps/web` | React + Vite, React Router, TanStack Query + TanStack Table, shadcn/ui + Radix, Tailwind CSS v4 |
| `packages/shared-types` | Zod schemas + pure pricing math, built with `tsup` |
| `packages/typescript-config` | Shared `tsconfig` bases |

## Getting started

```bash
pnpm install
pnpm dev
```

This starts the API on `http://localhost:4000` (Swagger docs at `/docs`) and the web app on `http://localhost:5173`.

Each app reads its own `.env` — see `apps/api/.env.example` for the required variables (Supabase, Redis, MetalPrice API).

## Scripts

- `pnpm dev` — run both apps in watch mode
- `pnpm build` — build all packages/apps
- `pnpm check-types` — type-check the whole workspace

## Deployment

Deployed on Railway as two services (`api`, `web`) plus a Redis instance, backed by Supabase for Postgres and Auth. See `CLAUDE.md` for the full architecture, conventions, and deployment notes.
