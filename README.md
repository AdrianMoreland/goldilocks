# Merrion Gold Pricing Workbook

An internal pricing and trading dashboard for Merrion Gold, an Irish bullion dealer. It shows live metal spot prices, a per-product pricing table (premiums/discounts/VAT), a trade calculator, a portfolio builder, tax reference calculators, and an admin-gated pricing editor.

## Tech stack

pnpm workspace monorepo, orchestrated with Turborepo.

| Package | Stack |
|---|---|
| `apps/api` | NestJS 11, Prisma 7 (Postgres via Supabase), Redis (cache-aside), `nestjs-zod`, Supabase Auth |
| `apps/web` | React + Vite, React Router, TanStack Query + TanStack Table, shadcn/ui + Radix, Tailwind CSS v4 |
| `apps/site` | The public website (roadmap 2.1): React Router v7 on Vite, prerendered to static HTML, Tailwind CSS v4 |
| `packages/ui` | shadcn primitives shared by `apps/web` and `apps/site` |
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
- `pnpm check-types` — type-check the workspace (`shared-types` is not clean yet: its spec files have strict-null errors)
- `pnpm --filter api exec jest` — API tests
- `pnpm --filter @goldilocks/shared-types test` — shared-types tests

## CI

`.github/workflows/ci.yml` runs on every pull request to `master`: install, build `shared-types`, API type-check, API ESLint (any problem fails), API Jest, `shared-types` tests, web build. It needs no secrets. `audit.yml` (dependency audit, report-only) and `dependabot.yml` run alongside it; `ai-eval.yml` is manual-only and spends a few cents. Run the same gates locally from the repo root:

```bash
pnpm --filter @goldilocks/shared-types build
pnpm --filter api exec tsc --noEmit
(cd apps/api && node node_modules/eslint/bin/eslint.js src --no-fix --no-cache --max-warnings 0)
pnpm --filter api exec jest --ci
pnpm --filter @goldilocks/shared-types test
pnpm --filter web build
```

## Deployment

Deployed on Railway as two services (`api`, `web`) plus a Redis instance, backed by Supabase for Postgres and Auth. See `docs/ENGINEERING.md` for the full architecture, conventions, and deployment notes.
