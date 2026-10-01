# Goldilocks Improvement Roadmap

Consolidates the 2026-10-01 audit, API review, code review and CI discussion into one prioritised list. It **layers on top of `docs/ROADMAP.md`** (the planning source of truth, CLAUDE.md §17): it does not reorder phases or re-prioritise existing items. Where an item already exists there, the ID is given so the two files can be ticked together. Items marked **NEW** are findings with no home in `ROADMAP.md` yet — promote them into the matching section when you accept them.

Format and tags follow `ROADMAP.md`: priority 🔴 P0 / 🟠 P1 / 🟡 P2 / ⚪ P3, effort S / M / L / XL, `← depends:`. Paste-ready for Notion.

**Basis:** read-only review of `apps/api`, `packages/shared-types` and the `/dashboard` frontend. Nothing was run — test counts, coverage and runtime status codes are unmeasured. Template pages are out of scope (CLAUDE.md §1).

## Why this order

1. **Safety net first.** Everything later is a refactor of a money system. Without CI and tests you cannot make them safely.
2. **Close real defects and cheap exposure** (dead refresh call, no login throttle, docs that lie, fail-open admin gating).
3. **Make money changes traceable and correct** (audit trail, one pricing engine).
4. **Then restructure** (persistence boundary) once tests and CI exist — it unblocks 1.8 / 1.9 / BC.
5. **Then resume the existing Phase 1 plan.**

---

# STEP 1 — Safety net 🔴 (do first, about 2–3 days total)

- [ ] **CI on every PR to `master`** — S — *ROADMAP 0.10*
  - [ ] `.github/workflows/ci.yml`: install with pnpm → build `shared-types` (consumers read `dist/`) → `tsc` → ESLint (from `apps/api`, `--no-fix`; baseline is 0 problems) → API Jest → `shared-types` specs → web build
  - [ ] Turn on branch protection so a PR cannot merge while CI is red
  - [ ] Cache the pnpm store; use mocks, not real Supabase/OpenAI keys
- [ ] **Delivery gate** — S — *NEW* ← depends: CI
  - [ ] Set Railway to deploy only after CI passes
  - [ ] Optional nightly workflow for `pnpm --filter api ai:eval` (it costs a few cents, keep it opt-in)
- [ ] **`pnpm audit` + Dependabot/Renovate** — S — *ROADMAP 0.6*

# STEP 2 — Defects and cheap exposure 🔴 (about 2–3 days)

- [ ] **Resolve the dead `/auth/refresh` call** — S — *NEW (found in code review)*
  - The web client (`apps/web/src/api/base.ts`) posts to `/auth/refresh`; `AuthController` has no such route, so an expired session just fails. Pick one:
  - [ ] Implement refresh behind `AuthProviderPort` (add `refresh()`), **or**
  - [ ] Delete the refresh path and send 401 to sign-in
  - [ ] Keep it compatible with Entra SSO (ROADMAP 0.6)
- [ ] **`@nestjs/throttler` on `POST /auth/login`** — S — *ROADMAP 0.6* (the only public write endpoint)
  - [ ] A modest global throttle plus a tighter one on `POST /market-data/refresh` (spends paid vendor quota) and `POST /errors/client`
  - [ ] Redis-backed once more than one replica runs (scaling trigger)
- [ ] **Helmet security headers** — S — *ROADMAP 0.6*
- [ ] **Make Swagger match runtime** — S — *NEW*
  - [ ] POST calculation routes (`trade/cart`, `trade/melt`, `portfolio/*`, `market-data/recalculate`, `market-data/refresh`, `metals/refresh`) document 200 but Nest returns 201 → add `@HttpCode(200)` (or document 201). Confirm each with a request before changing
  - [ ] Add the missing `addTag` entries (`knowledge`, `ai`, `branches`, `errors`)
  - [ ] `@ApiQuery` on admin routes; document 401/403/429 responses; `type` on `GET /products/:id`
  - [ ] One convention for action responses (`{ message }` or 204) — *ROADMAP 0.10 "Swagger complete + grouped"*
- [ ] **Fail-closed admin gating** — S/M — *NEW*
  - `RolesGuard` allows any signed-in user when a route has no `@Roles` (`roles.guard.ts:28`), so one forgotten annotation exposes an admin route
  - [ ] Put `@Roles('admin')` on the class for admin-only controllers (`metals`, `errors`)
  - [ ] Split mixed controllers into `*.admin.controller.ts` (`products`, `market-data`, `knowledge`)
  - [ ] Extend `route-auth.spec.ts` to fail if a write route has no `@Roles`
- [ ] **Web auth tidy-up** — S — *NEW*
  - [ ] Single exported token-storage constant (`"token"` is hard-coded in `auth-context.tsx` and `base.ts`)
  - [ ] Remove the CSRF-cookie sniffing and `credentials: "include"` in `withAuth` (the API uses Bearer tokens)
  - [ ] Verify the Knowledge Center Markdown renderer escapes HTML

# STEP 3 — Validation consistency 🟠 (about 1–2 days)

- [ ] **Shared query-param schemas** — S — *NEW* (CLAUDE.md §4)
  - [ ] `PaginationQuerySchema` / `LimitQuerySchema` / `LogLevelQuery` in `packages/shared-types`, wrapped in `dtos.ts`
  - [ ] Replace the hand-written parsing in `admin/logs`, `admin/audit`, `errors`, `metals/fetch-log`, `market-data/backfill-history`
  - [ ] `metals/:metal/retry`: use `ZodValidationPipe(MetalTypeEnum)` like `trade`
  - [ ] Rebuild `shared-types` and restart `--watch` after changing it
- [ ] **Central env validation as a Zod schema** — S — *ROADMAP 0.1* (replaces the `REQUIRED_ENV_VARS` list; checks formats)

# STEP 4 — Money you can trust 🔴/🟠 (about 1–2 weeks)

- [ ] **Audit trail on every pricing and product write, in the same transaction** — M — *ROADMAP 0.6 "Audit log"*
  - Today only DB-browser edits are audited; `PATCH /products/admin/products/:id` (spreads, VAT) leaves no record
  - [ ] A small transactional helper: domain write + audit row + cache invalidation as one unit
  - [ ] Store old → new values (the current Redis log has none), with a persistent store instead of capped Redis
  - [ ] Cover products, settings/market-mode, branches, KB status
  - [ ] Collapse the check-then-write sequences in `ProductsService` into that transaction
- [ ] **One pricing engine in `shared-types`** — M/L — *ROADMAP 0.2 + ground rule 4*
  - [ ] Move `calculateProductPrice` / `mergeMetalPrices` out of `apps/api/src/common/utils/pricing.util.ts`; keep Prisma-row mapping (`toRawProduct`) in the API as an adapter
  - [ ] `decimal.js` throughout, round only at output (ROADMAP 0.2)
  - [ ] Audit remaining `Float`s (ROADMAP 0.2)
  - [ ] Model market modes (Weekend / Volatile / Shortage, buy vs sell) as a `PricingStrategy` interface, one class per mode, so the opposite-direction Shortage rule lives in one place
  - [ ] Golden-file specs at the 100% target (CLAUDE.md §10)
  - [ ] A `MarketDataFacade` as the single "priced catalogue" entry point for Trade, Portfolio and the AI tool
  - [ ] Snapshot the full pricing context on any committed price (ROADMAP 0.2)
- [ ] **Web tests: Vitest + MSW + Testing Library** — M — *ROADMAP 0.10*
  - [ ] Start with money-handling UI: trade tab, portfolio tab, calculators, product table copy output
  - [ ] One e2e smoke test (load → select → copy)

# STEP 5 — Persistence boundary and structure 🟠 (about 2+ weeks) ← depends: Steps 1 and 4

Justified by a real constraint, not by pattern preference (CLAUDE.md §18): 18 files inject `PrismaService` directly, only one `$transaction` exists, and 1.8 / 1.9 / the BC integration all need atomic write + audit + invalidate.

- [ ] **Aggregate-level repository ports** — L — *NEW; prerequisite for ROADMAP 1.8, 1.9*
  - [ ] `ProductRepository` (owns its cache invalidation), `SpotPriceRepository` (single writer of `metalSpotPrice`), `KbDocumentRepository`
  - [ ] Only where there is a real test or swap seam; no blanket repositories, no CQRS
  - [ ] Service tests then mock one port instead of Prisma
- [ ] **Split `MetalsProvider` (407 lines)** — M — *NEW*
  - [ ] Inject `FreshnessCascade` as a strategy (launch read: cache → DB → live; refresh: live → DB)
  - [ ] Write path moves to `SpotPriceRepository`; metrics stay in `CascadeMetricsService`
- [ ] **Replace `@Global()` on `admin` and `error-log` modules** with explicit imports — S
- [ ] **Business Central port** — XL — *ROADMAP 1.8 / 1.9 / 2.6*; follow `AuthProviderPort` (interface + DI token); read architecture first (`nestjs-architecture-principles`)

# STEP 6 — Resilience and operations 🟠

- [ ] **Timeout, retry and circuit breaker around the metal-price API** — M — *ROADMAP 0.1*
- [ ] **Prove the Redis-down path** — S — *NEW*
  - [ ] A test that simulates an outage and asserts every `CacheAsideStore.get` falls through to the source
- [ ] **DB browser hardening** — S — *NEW*
  - [ ] Hostile table/column-name tests asserting rejection (it uses `$queryRawUnsafe` in 8 places; names are catalogue-checked, values bound — keep it that way and comment why `quote()` is safe)
  - [ ] Extend `CACHE_KEYS_BY_TABLE` beyond `products` (`branches`, `historic_spot_prices`, `kb_documents` edits can serve stale data)
  - [ ] Move the DELETE row key into a query param or a POST (some proxies strip DELETE bodies)
- [ ] **Sentry on API and web** — S — *ROADMAP 0.7*
- [ ] **Staging environment, tested DB backup/restore, Railway alerts, real Redis on Railway** — S–M — *ROADMAP 0.7* (production `REDIS_URL` must not be `127.0.0.1`)
- [ ] **Microsoft Entra ID SSO behind `AuthProviderPort`** — M — *ROADMAP 0.6*
- [ ] **Remove shared in-memory state; BullMQ price job; SSE via Redis pub/sub** — M each — *ROADMAP 0.7* (only when a second replica is planned, per Scaling triggers)

# STEP 7 — API shape clean-up 🟡 (breaking; do together with the web client)

- [ ] **Normalise the products routes** — M — *NEW*
  - Today: `GET /products/products`, `POST /products/admin/products`, `DELETE /products/:id` (delete is the only write outside `admin/`)
  - Target: `GET /products`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`, admin enforced by `@Roles`
  - [ ] Change `apps/web/src/api/products.api.ts` in the same PR; check `:id` cannot shadow literal routes
- [ ] **Consolidate or clearly separate the two refresh endpoints** (`/metals/refresh` admin vs `/market-data/refresh` any user) — S
- [ ] **Role granularity beyond `admin`** (`MANAGER`, `SALES`, `ACCOUNTING`, `AUDITOR`) — M — *ROADMAP 1.18 "RBAC per role and branch"*

# STEP 8 — Hygiene ⚪

- [ ] Drop the redundant `@@index([sku])` on `Product` (`sku @unique` already indexes it) — S, one migration
- [ ] Remove the 2 `any` in `apps/api/src` — S
- [ ] Remove dead code and unused dependencies — S — *ROADMAP 0.1*
- [ ] `.env.example` current; root `.gitignore` check — S — *ROADMAP 0.6*
- [ ] Mention the new `/health` and CI status in `README` — S — *ROADMAP 0.10*
- [ ] Prune unused template routes from `routes.tsx` — S — *only on explicit request; out of scope per CLAUDE.md §1*

# STEP 9 — Resume the existing Phase 1 plan

Unchanged from `ROADMAP.md` "Suggested sequencing". Two additions from this review:

- **Start the 1.0 prerequisite conversations now** (BC read access, GDPR sign-off, bank, hedge APIs) — they are non-code and gate 1.6 – 1.17 and all of Phase 2.
- **1.8 Hedge control and 1.9 Audit hub should not start before Step 4 (transactional audit) and Step 5 (repository ports).**
- Then: 1.3 historic spot → 1.1 desk tools and price-lock log → 1.6 inquiry hub → 1.7 / 1.8 → 1.9, and 1.18 branch rollout once SSO, the multi-branch model and the audit log are live.
- **Before any customer-facing work (Phase 2):** real rate limiting, public response caching and the 2.0 prerequisites (Scaling triggers; CLAUDE.md §14).

---

# Deliberately not on the list

- CQRS, Clean-Architecture layers, microservices, a repository for every entity (CLAUDE.md §18)
- Splitting `AskService` (546 lines): it already coordinates collaborators
- Pagination: ~150 products (CLAUDE.md §7); the log tables already have indexes and a retention job
- Docker, a secrets manager, API versioning (CLAUDE.md §14), until something customer-facing appears
- `class-validator` or any second validation system (CLAUDE.md §4)

# Where each source message landed

| Source | Items |
|---|---|
| Top-3 changes — #1 persistence boundary | Step 4 (transactional audit), Step 5 |
| Top-3 changes — #2 one pricing engine | Step 4 |
| Top-3 changes — #3 safety net | Steps 1, 2, 4 (web tests), 6 |
| CI / CD / Actions explanation | Step 1 |
| API review | Steps 2, 3, 7 |
| Code review (C1 refresh, C2 atomicity/audit, C3 throttle, R1–R8) | Steps 2, 4, 5, 6 |
