# Goldilocks Super Roadmap

Single source of truth for what to build and in what order. Merges three earlier roadmaps and idea lists, plus the 2026-10-01 code-health review (safety net, defects, money, market-data flow, refactors). Paste-ready for Notion (nested `- [ ]` checklists).

**Last consolidated:** 2026-10-01 · statuses re-checked against the code 2026-10-01

## How to read this

- **Phases:** `0` = harden/polish the current internal app · `1` = new internal features + branch rollout · `2` = separate, parallel customer site + eshop + scale-up.
- **Priority:** 🔴 P0 do now / blocks other work · 🟠 P1 high value, next · 🟡 P2 planned · ⚪ P3 idea / icebox.
- **Effort:** S (≤ 1 day) · M (2–5 days) · L (1+ week) · XL (multi-week, needs a plan first).
- **`← depends: X`** = do not start before X. **`[BC]`** = needs Business Central access. **`[LEGAL]`** = needs a legal/compliance decision first.
- `[x]` = done as of the consolidation date (taken from the source roadmaps + git history). **Verify in code before claiming something is done or missing** — this file can lag the repo.
- An item can carry its own priority emoji when it differs from its section (e.g. CI inside 0.10). **Work in the order given by "Suggested sequencing" at the bottom**, not section number; section IDs are stable labels, not a queue. Do not start Phase 2 build work before its 2.0 prerequisites are closed.
- `*(confirm)*` = a claim from the code-health review that was not re-checked in the code; verify before starting the item.

## Ground rules (apply to every phase)

1. **Business Central (BC) is the system of record** for customers, vendors, quotes, sales orders, payments, purchase orders, serials and collection signatures. Goldilocks reads from BC and writes only through its API. Goldilocks stores *snapshots, logs and decisions* (price locks, inquiries, hedges, audits), never a competing ledger. Therefore: **no invoicing module, no full CRM** in Goldilocks (dropped from the old list); customer records are BC-backed.
2. **Money:** `decimal.js` + Prisma `Decimal`; round only at output; every committed price snapshots its full context (spot, premium, discount, VAT, FX, totals).
3. **Monolith API + modules first.** Split out only when a scaling trigger fires (see the bottom of this file).
4. **Shared logic lives in `packages/shared-types`** (Zod schemas + pure pricing math) so the internal app and the customer site can never disagree on a price.
5. **Internal-only until compliance signs off.** Market commentary, AI output and anything customer-facing needs a review gate; no predictions, no "should buy" phrasing; AI-written content is always labelled.
6. **Every admin write is audited** (who, what, old → new, when) once 0.6 lands.

### Conflicts between the source roadmaps, and how they were resolved

| Topic | Resolution |
|---|---|
| Quotes / PDF / invoices (old list says build in-app) | Goldilocks keeps a **price-lock log + quote snapshot**; the formal quote is created in **BC via API**. No invoice module. |
| Customer management / CRM | Dropped as a standalone feature. Customer data comes from BC (+ Zoho history import, 1.15). |
| Roles | Admin-mode flag exists today. Target tiers: **ADMIN · MANAGER · SALES/broker · ACCOUNTING · AUDITOR** (matches the Prisma `role` enum). Branch scoping added in 0.8. |
| Customer portal location | Roadmap 2 said `apps/customer-portal`; Roadmap 1 says a new React + NestJS site. **Decision:** a separate parallel web app `apps/site` (public site + customer portal + eshop) sharing `packages/shared-types` and the pricing services, backed by the same core API with a separate public/cached controller surface and separate customer auth. |
| Workbook retirement | Marked done in Roadmap 1; keep as done. |
| Price fetch job | Roadmap 1 wants BullMQ; Roadmap 2's "Tier 3" wants a worker app. Do **BullMQ in-process first (0.7)**, extract `apps/worker` only when a trigger fires. |
| Palladium | Decided (done). |
| Persistence boundary (should services get repository classes before 1.8/1.9?) | **No new repository layer.** `ProductsProvider` already is the product repository (all product reads/writes + cache refresh) and the spot-price write path is `MetalsProvider`. The real gaps are (a) a write, its audit row and its cache refresh are not one transaction, (b) the admin DB browser writes products behind the provider's back, (c) `MetalsProvider` mixes vendor fetching with storing. Fixed in 0.6 (transactional audit) and 0.14 (provider clean-up). Ports (interface + DI token) only at genuinely swappable external seams: BC, Open Banking, hedge platform. |
| Query-param validation | **Shared Zod query schemas** in `shared-types` (one validation system). No `ParseBoundedIntPipe`; `ParseIntPipe` stays for numeric path params. |
| Live price updates | The app has no SSE for prices (SSE exists only for the AI stream). **Poll now (spot `refetchInterval`), SSE + Redis pub/sub later** as one conditional item under the multi-replica / Phase 2 trigger. |
| Splitting `AskService` | Default is **do not split**; kept as a conditional ⚪ item in 0.14, taken up only when the service has to change (new mode or tool), with characterisation tests first. |
| Pruning the unused template pages | Kept in the Icebox, **only on explicit request** (scope rule in `docs/ENGINEERING.md` §1). |
| Test runner wording | API uses **Jest**, `shared-types` uses **Vitest**; the web app gets Vitest + MSW + Testing Library (0.10). |

---

# PHASE 0 — Harden and polish the current app

**Goal:** Goldilocks fully replaces the Google Sheets workbook and is safe to roll out to every branch.
**Exit:** multi-instance safe, SSO live, tests + CI green, money math correct, observability in place.

## 0.1 Core pricing modules 🔴

- [x] `ProductsModule` and `MetalsModule`
- [x] Full pricing for silver and platinum; palladium decision made
- [x] Market modes: Weekend, Volatile, Metal Shortage (admin toggle + premium adjustments) + market-mode banner
- [x] Stale-price handling: serve last good price from Redis
- [x] `MetalPriceApiClient` `/timeframe` endpoint (real historical ranges) — M *(used by the history seed and the 5-year backfill)*
- [x] Redis cache on `ProductsRepository.findAllActive`, invalidated on admin edit — S *(5-min TTL; `ProductsProvider` rewrites it after every write, and the admin database editor clears it too)*
- [x] 🔴 Timeout, retry and circuit breaker around the metal-price API client — M *(confirmed: `infrastructure/metal-price-api` sets no timeout or retry, unlike the OpenAI client's 30 s / 3 retries. A failing vendor is re-called on every launch-cascade miss and burns paid quota. Add a breaker that serves last-known-good)* *(done 2026-10-02: `ResilientMetalPriceApi` behind `METAL_PRICE_API` — 10 s timeout, circuit opens after 3 failures incl. `success=false` quota bodies, 60 s cooldown, falls back to the last stored price; deliberately no automatic retry, each call spends paid quota)*
- [ ] Central config validation: Zod-parse `process.env` at boot, replacing the `REQUIRED_ENV_VARS` list and checking formats — S *(partly there: `main.ts` fails fast on a list of required variables)*
- [ ] Remove dead code/unused deps, resolve TODO/FIXME — S
  - [ ] `apps/web/src/api/api.ts`: redefines `ProductSchema`/`MetalTypeEnum` for a backend shape that no longer exists and nothing imports it — delete
  - [ ] Commented-out `toRawMetalSpotPrice` block in `pricing.util.ts`; orphaned JSDoc on `market-data.service.ts` (seed-history) and above `AssistantToggle`
  - [ ] One `ALL_METALS` (defined in `market-data.service.ts` and `pricing.util.ts`, again as the keys of `SYMBOL_MAP`) — derive from the shared-types `MetalType` enum; same for `METALS` in `use-pricing-workbook.hook.ts`
  - [ ] The one explicit `any` in `apps/api/src` (`redis.service.ts` `set(value: any)`) → `unknown`
  - [ ] Redundant `@@index([sku])` on `Product` (`sku` is already `@unique`) — one migration
  - [ ] Unused no-op `onNavigate={() => undefined}` prop through `ExchangeView`/`Citations`

## 0.2 Money correctness 🔴

- [x] Rounding guards float noise: `roundSellPrice`/`roundBuyPrice` snap to cents before `ceil`/`floor`, so a whole-euro price is not pushed up by €1 *(checked in `pricing-math.ts`)*
- [ ] Characterisation tests for the current rounding before any change: values around `.00` and `.5`, negative spreads, zero spot — S
- [ ] 🔴 **One pricing engine:** move `calculateProductPrice` (+ `mergeMetalPrices`, `enrichSpotPrices`) from `apps/api/src/common/utils/pricing.util.ts` into `packages/shared-types`; Prisma-row mapping stays in the API as an adapter; keep an API re-export so imports don't all change at once; golden-file specs — M *(ground rule 4; prerequisite for 0.13)*
- [ ] `decimal.js` in all pricing code (shared pricing functions, `TradeService.calculateCart` totals and `averagePerGram`, tools); round only at output; `number` stays at the JSON boundary — M *(`decimal.js` is not yet a dependency of the API or `shared-types`; `toNumber()` in `pricing.util.ts` drops to float immediately)*
- [x] Prisma `Decimal` for all money fields — S *(no `Float` columns remain in `schema.prisma`; the float risk is in the JS layer above)*
- [ ] Web calculators (CGT / VAT / percent): decide exact (`Decimal`) or label "approximate reference"; extract the pure functions to `shared-types` with tests — S
- [ ] Snapshot full pricing context on any committed price (spot, premium, discount, VAT, FX, totals) — M
- [ ] Consistent number formatting (€, thousands separators, decimals) across cards, table and copy output — S
- [x] Test coverage: `calcSellPrice`, `calcBuyPrice`, VAT/gold-exemption/discount edge cases — S *(Jest, not Vitest: `pricing-math.spec.ts`, `pricing.util.spec.ts`; the ported tools' math is covered by the portfolio/trade specs. 483 API tests plus the shared-types specs pass, re-run 2026-10-01)*

## 0.3 Data freshness and feed resilience 🟠

- [x] Per-metal "last updated" + source badge (Redis / DB / live API)
- [x] Staleness threshold banner ("Prices may be outdated — last fetched N min ago")
- [x] Fresh / stale / failed state per card
- [x] Countdown to next scheduled fetch
- [x] "Stale since HH:MM" badge
- [x] Admin cron control (pause/resume) and fetch-time toast
- [x] Admin error log / system status panel (first version)
- [x] Distinct toast on fetch **failure** (vs. stale data) — S *(`use-market-data.hook.ts`: "Live price fetch failed — showing the last known prices from the database", plus separate refresh-failed and fetch-error toasts)*
- [ ] Explicit "serving last-known-good" fallback indicator on the cards — S *(the toast and the stale-prices notice say it; no persistent per-card marker)*
- [ ] Retry button per failed metal fetch on the dashboard cards — S *(the API route `POST /metals/:metal/retry` and an admin Overview retry exist; the cards have no button)*
- [ ] 🟠 **Spot polling:** `refetchInterval` (60 s – 5 min) on the spot query so prices update without a reload or Refresh — S *(today only the admin tabs and a few tool queries poll; the dashboard's market data does not. Part of 0.13)*
- [ ] Polling indicator (live / retrying / offline) and backoff on repeated failures — M *(replaces the earlier SSE indicator and auto-reconnect items; SSE is now a conditional item in 0.7)*
- [ ] Loading skeletons + empty states for cards, chart, table — S *(none exist today)*
- [ ] Customer-facing display mode: fullscreen, hides premiums/margins, sell prices only — M

## 0.4 Table and UX polish 🟠

- [x] Keyboard shortcuts (Esc closes dialogs, arrow-key row nav, `/` focuses search)
- [x] Table filters and column customization
- [ ] Sticky first column (mobile included) — S *(the header is already sticky; the first column is not)*
- [x] Column sorting + persisted sort/filter state per user — S
- [ ] Inline search/filter (name, weight, premium range) — S
- [ ] Fuzzy product search with aliases ("brit", "krug", "1oz bar", "10g"), `/` or Cmd+K — M
- [ ] Price per gram/oz column toggle; oz/g/kg and EUR/GBP unit toggles — S
- [ ] Favourites/pinned products per user — S
- [ ] Buy/sell quick toggle with spread shown (buyback quick view) — S
- [ ] Rounding-rule setting (quote to nearest €1/€5/€10 so the desk says the same number) — S
- [ ] Theme toggle persisted; contrast checked in both themes — S
- [ ] Mobile/tablet pass for desk iPad and phone — M
- [ ] Admin edits: inline validation, unsaved-changes guard, toast confirmations — S
- [ ] Undo toast after product delete (soft-delete) — S
- [x] Product visibility toggle (hide without deleting) — S *(`isActive`, plus soft delete with a restore dialog)*
- [ ] CSV/Excel export of the full table — S
- [ ] Admin-mode inactivity timeout (auto-revert to user mode) — S

## 0.5 Copy and message output (v1) 🟠

Foundation for 1.6 (templates / inquiry hub). Build the renderer once and reuse it.

- [ ] Copy button becomes a popover with three formats — S
  - [x] Table (HTML for Outlook)
  - [ ] Email: template with `{greeting}`, `{items}`, `{validity}`, `{signature}` — M *(partly there: the Trade tab's "Message customer" button already builds an Email and a WhatsApp reply from the quote (channel → stock → price scope). Still missing: the placeholder template, `{validity}`/`{signature}`, and offering it from the table's copy button)*
  - [ ] WhatsApp: plain text, one line per product, `*bold*` — S *(same button; confirm it matches this format, then tick)*
- [ ] Shared placeholder/template renderer used by all formats — M
- [ ] Choose columns to include (sell / buy / premium / discount) — S
- [ ] "Prices valid until HH:MM / subject to spot movement" line — S
- [ ] Remember last-used format — S
- [ ] Preview + confirmation toast before/after copy — S
- [ ] Optional quantity per selected row with total — M
- [ ] Admin-editable templates stored in DB — M
- [ ] Copy basket in **BC line order** (item, qty, unit price, location) — S
- [ ] Later: FR/ES template variants — S

## 0.6 Security baseline 🔴

- [x] Roles in DB (`User.role`, `User.admin`); server-side admin guard (verified 403)
- [x] Every route guarded server-side (audit all controllers) — S *(global `JwtAuthGuard` + `@Public()` opt-out; `route-auth.spec.ts` fails if a route is added unguarded)*
- [ ] Microsoft Entra ID SSO (Supabase Azure provider), behind the existing `AuthProviderPort` — M
- [ ] 🔴 `@nestjs/throttler` (Redis-backed once multi-instance) — S
  - [x] Tight limit on `POST /auth/login`, the only public write endpoint
  - [x] A modest global limit, tighter on `POST /market-data/refresh` (spends paid vendor quota) and `POST /errors/client` *(global 300/min per user, login 10/min, refresh 30/min, market-data and metals refresh 6/min, client errors 20/min; in-memory counters, switch to Redis with a second replica)*
  - [ ] Confirm the AI quota and daily budget hold under concurrent requests
- [x] CORS from `FRONTEND_URL` env, not hardcoded — S
- [x] 🔴 Helmet security headers — S *(`helmet()`; CSP dropped only while Swagger is on; needs `TRUST_PROXY_HOPS` correct behind Railway — verify after deploy)*
- [ ] Secrets only in Railway env; `.env.example` current; rotate anything ever committed; root `.gitignore` check — S
- [ ] 🔴 **Transactional, persistent audit log** for premium, product, settings and role changes (who, what, old → new, when) + admin UI — M ← gate for 1.8 and 1.9
  - [ ] A Postgres `audit` table written in the **same `$transaction`** as the change (and followed by the cache refresh), so a change cannot exist without its audit row or the reverse; one small shared helper, used by `ProductsService`, market mode, branches, KB status and user creation
  - [ ] Replaces the capped Redis list (500 entries, in-memory fallback, `persisted: false` when Redis is down) and the logger-only `[audit]` lines in `KnowledgeService`; the admin Audit tab reads the new table
  - [ ] `AuthService.createUser` does two writes that cannot share a transaction (it compensates by deleting the identity) — document that exception
  - *(started: edits made in the admin Database tab are logged with the admin's email in Redis, capped at 500 and without old → new values. Product, premium and role changes through the normal screens are not logged yet)*
- [ ] Per-user admin trail (no blanket admin flag) — part of the audit log
- [ ] Supabase RLS reviewed — S
- [ ] Google Drive permission cleanup: ID scans and customer data out of shared folders — S
- [ ] Dependency audit (`pnpm audit`, Renovate/Dependabot) — S *(wire into CI, 0.10)*

## 0.7 Reliability and scalability baseline 🟠

- [ ] Move the 10-min price fetch to a BullMQ repeatable job — M
- [ ] ⚪ Conditional: push updates over SSE with Redis pub/sub fan-out — M ← only when a second replica is planned or Phase 2 needs push *(spot polling in 0.3/0.13 is the default until then)*
- [ ] Remove shared in-memory state (multi-instance safe) — M *(examples: the price-cron pause toggle in `metals.cron`, which resets to running on restart; the admin log buffer; the audit-log memory fallback)*
- [ ] Prove the Redis-down path: a test that simulates an outage and asserts every `CacheAsideStore.get` falls through to the source — S
- [x] Pino structured logging + request IDs; log cache hit/miss, DB fallback, external call + duration — S *(`nestjs-pino`: JSON in production, request lines with duration, secrets redacted, an in-memory tail in the admin Logs tab. Request IDs are generated but not yet written to the log line)*
- [ ] 🟠 Sentry on API and web; breadcrumbs on the pricing cascade — S
- [x] `/health` (`@nestjs/terminus`): DB, Redis, MetalsAPI, last successful fetch — S *(public `/health` for uptime monitors; the admin Overview runs the same checks through Terminus, plus memory and event-loop lag)*
- [ ] Railway metrics + crash/restart/uptime alerts — S
- [ ] Prisma migration workflow (no manual DB changes) — S
- [ ] Database backup + **tested** restore — S
- [ ] Staging environment on Railway — M *(where the 0.13/0.14 changes get tried first; wire it behind the CI deploy gate in 0.10)*
- [ ] Redis deployment for production (local `127.0.0.1` will not work on Railway) — S

## 0.8 Multi-branch data model 🟠

- [ ] `Branch` table: address, phone, opening hours — S *(partly there: the table has `name`, `address`, `currency`; phone, opening hours and `region` (needed by the AI's `getBranch`, 1.5) are missing)*
- [ ] `branchId` + `currency` on products, prices, orders — M
- [ ] VAT rules table (per country and metal) instead of hardcoded logic — M
- [ ] Spot per currency (EUR, GBP) — M
- [ ] RBAC per role **and** branch — M *(today only `admin` and `manager` are enforced; `SALES`, `ACCOUNTING`, `AUDITOR` exist in the enum but gate nothing. Fail-closed gating is in 0.12)*

## 0.9 Health and monitoring panel (admin) 🟡

Four sections, ordered by "is the app lying to me right now?". Builds on the 0.3 status panel. Backing tables: `FetchLog` and `HealthCheck`.

- [x] `FetchLog` (timestamp, trigger, metal, source, status, durationMs, httpStatus, error, priceReturned) — M *(built as `FetchAttempt`: trigger, duration, success, error, metals resolved; one row per vendor call)*
- [ ] `HealthCheck` (timestamp, dependency, ok, latencyMs, detail) — S
- [ ] **Live status:** per-metal age/source/dot, next-fetch countdown, pause state, polling state + failure count, overall banner (good / degraded / failed) — M
- [ ] **Dependency health:** Postgres latency + pool use, Redis latency/hit ratio/TTLs, MetalsAPI latency + status, **quota used vs plan + projected monthly**, process uptime + commit SHA + env — M
- [ ] **Fetch history table:** last 50–100 attempts, filter by metal/outcome, expandable failure snippet, per-row retry, CSV export, summary (success rate 24h/7d, avg + p95 latency, longest gap) — M
- [ ] **Data sanity:** sudden-move flag (optionally reject), gold/silver ratio band, zero/null/stale-timestamp rejection, **currency check (EUR not USD)**, market-open-aware staleness — M
- [ ] Config snapshot (read-only, key masked) and actions row (force refresh, clear Redis, run health check, download diagnostics JSON) — S
- [ ] Usage analytics: most-viewed metals, most-copied products, copy-format usage, active sessions (management pitch evidence) — M
- [x] Metrics widget: fetch success rate 24h, avg latency, cache hit ratio — S

## 0.10 Testing, CI and docs 🟠

- [x] 🔴 **CI on every PR to `master`** (GitHub Actions) — S *(done 2026-10-02)*
  - [x] Steps: pnpm install → build `@goldilocks/shared-types` first (consumers read `dist/`) → `tsc` → ESLint from `apps/api` with `--no-fix` → API Jest → `shared-types` specs → web build
  - [x] Fail on any non-zero ESLint count (the baseline is 0); cache the pnpm store; mocks only, no real Supabase/OpenAI keys
  - [x] Branch protection on `master` requiring the CI check
  - [x] Delivery gate: Railway deploys only after CI passes; optional opt-in nightly `pnpm --filter api ai:eval` (costs a few cents) *(`master` ruleset requires a PR and the `ci` check; Railway "Wait for CI" is on for `api` and `web`; `ai-eval.yml` is manual-only and needs `OPENAI_API_KEY` + `DATABASE_URL` repo secrets)*
  - [x] `pnpm audit` / Dependabot in the same workflow (see 0.6) *(report-only: 127 findings today, so it is not a required check; Dependabot is configured)*
  - [ ] `shared-types` `check-types` fails on strict-null errors in `kb-markdown.spec.ts`, `kb-search.spec.ts`, `roadmap.spec.ts`; fix them, then add it to CI and make root `pnpm check-types` meaningful
- [ ] 🔴 **Web test runner:** Vitest + MSW + Testing Library, first specs on the pure money/calculator functions (no DOM), then the Trade/Portfolio tabs and the copy output — M *(the web app has no tests and no `test` script)*
- [ ] 🔴 **`TradeService` and `PortfolioService` specs** — M *(neither has a spec file; the shared-types math is covered, the service-layer validation is not)*
  - [ ] `calculateCart`: product not found, wrong metal, bad percent (buying vs selling), quantity coercion, `customSpot`
  - [ ] `calculateProfitAnalysis` / `buildPortfolio`: error mapping to `BadRequestException`
- [ ] Vitest for the pricing utils and the repository cascade (Redis → Prisma → API) — M *(the API already tests these with Jest: `pricing-math.spec.ts`, `pricing.util.spec.ts`; extend rather than add a second runner)*
- [ ] One e2e smoke test (load → select → copy) — M
- [ ] Strict TypeScript and consistent ESLint/Prettier — S *(API ESLint is at 0 problems; the web app's baseline is unmeasured)*
- [ ] README (what / setup / scripts / env vars) — S *(a short README exists; add `/health`, CI status, test commands)*
- [ ] Architecture doc (module map, data flow, pricing formulas, price-polling flow) — M
- [ ] Swagger complete + grouped — S
  - [ ] POST calculation routes (`trade/cart`, `trade/melt`, `portfolio/*`, `market-data/recalculate`, `market-data/refresh`, `metals/refresh`) document 200 but Nest returns 201 by default, and only two `@HttpCode` exist *(confirm each with a request, then add `@HttpCode(200)` or document 201)*
  - [ ] Add the missing `addTag` entries: `knowledge`, `ai`, `branches`, `errors`; `@ApiQuery` on admin routes; document 401/403/429; `type` on `GET /products/:id`; one convention for action responses (`{ message }` or 204)
  - [ ] Redo after the 0.13 route renames
- [ ] ADRs (price polling over SSE/WS, no response envelope, runtime-derived prices, BC as source of truth, client-side pricing, three-query market data, `Decimal` at the boundary) — S
- [ ] Desk user guide with screenshots — M
- [ ] CHANGELOG + semver tags — S *(no `CHANGELOG.md` and no tags yet)*
- [ ] Fix stale statements in `docs/ENGINEERING.md`: it says there is no root `.gitignore` (there is one) and that CORS is hardcoded to `localhost:5173` (`main.ts` reads `FRONTEND_URL`); refresh the test counts — S
- [ ] Management one-pager (time saved per quote, error reduction, fetch success rate) — M

## 0.11 Spot isolation, rounding and shared market mode 🟠

Vocabulary is in `GLOSSARY.md`; the isolation decision is `docs/adr/0001-tool-spots-are-isolated-from-the-card-spot.md`.

- [x] One staleness limit (15 min) in `shared-types`, read by the cards and the assistant — S
- [x] Offered prices round in the dealer's favour (Sell up, Buyback down) through one shared rule; unit prices such as €/g keep cents — S
- [x] Tool spots: Trade, Melt and Portfolio each hold their own spot, following the Card spot until edited; editing never freezes a card or moves the table — M
  - [x] Per-tool "Reset" re-attaches the tool to the Card spot; helper text "Following the app's main spot price"; banner "Frozen — live market €Y" (+ " · Card frozen at €Z" when the card is frozen)
  - [x] Tool spots survive tab switches, are lost on reload, and are not touched by Ctrl+Z
  - [x] Melt gets a spot editor + slider like Price/Buyback
  - [x] Easy Copy and Message customer price from the Trade tool spot
- [x] AI assistant staff note (not part of the reply, only on replies with a price): custom/frozen spot, stale live spot, or healthy, with the snapshot time in Irish time — S
- [x] Market mode held on the server and shared by every user; Admin and Manager can change it; banner shows the mode; last-changed (who, when) in the Admin Console audit log — M *(needs `prisma migrate deploy` for `market_mode_state`; percentages still local to each browser)*
- [ ] Apply market-mode adjustments to the product table and portfolio builder (today only the Trade tab applies them) — M *(parked by the owner; modes are rarely used)*
- [ ] Market modes as one `PricingStrategy` per mode (buy vs sell; the opposite-direction Shortage rule in one place), once the pricing engine is shared — M ← depends: 0.2 shared pricing engine *(the mode logic currently lives client-side in `pricing-settings-context.tsx`)*

## 0.12 Defects, hardening and validation 🔴

Found by the 2026-10-01 code review. Do these right after CI (0.10) and before the money and market-data rework; they are small and several are security. Items marked *(confirm)* were not re-checked in the code.

- [x] **Dead `/auth/refresh` call** — S. The web app POSTs to `/auth/refresh` from two places (`hooks/useApi.ts`, `api/base.ts`), but `AuthController` only has `login`, `me` and `admin/users`. An expired session costs a wasted 404, then a generic error; it never recovers or logs out. *(done: real refresh implemented, see below)*
  - [x] Decide: implement refresh behind `AuthProviderPort` (compatible with Entra SSO, 0.6) **or** delete it and send a final 401 to sign-in (clear the token, call `logout`) *(implemented: `POST /auth/refresh` behind `AuthProviderPort`; the account is re-checked on every refresh)*
  - [x] If refresh is kept, fix the racy `refreshPromise.finally(() => refreshPromise = null)` *(`lib/session.ts`: one in-flight refresh, reuses a token another tab renewed, signs out only on a definite 401)*
- [ ] **Two parallel HTTP clients** (`api/base.ts` and `hooks/useApi.ts`) — find which has live callers and consolidate into one — S/M *(`api/base.ts` helpers had no callers and were removed; `hooks/useApi.ts` is the one client)*
  - [x] One `tokenStore` (get/set/clear): the `"token"` key is hard-coded in `auth-context.tsx`, `useApi.ts` and `base.ts`
  - [x] Remove the CSRF-cookie sniffing in `base.ts` and the `credentials: "include"` that only served the refresh cookie (the API uses Bearer tokens)
  - [ ] Token storage decision: `localStorage` is readable by any XSS; accept and document, or move to an httpOnly cookie — M ← depends: Entra SSO decision (0.6) *(interim: accepted and documented in `lib/session.ts`; a refresh token in `localStorage` is a longer-lived credential than the access token, so revisit with the Entra SSO decision)*
  - [x] Confirm the Knowledge Center Markdown renderer escapes HTML (`react-markdown` ignores raw HTML by default; check no `rehype-raw` is added) *(confirm)* *(confirmed: `react-markdown` 10 with no `rehype-raw` anywhere)*
- [ ] **Fail-closed admin gating** — S/M. `RolesGuard` returns `true` for any signed-in user when a route has no `@Roles`, so one forgotten annotation exposes an admin route.
  - [x] `@Roles('admin')` at class level for admin-only controllers (`metals`, `errors`); this also removes the per-route `@UseGuards(...) @Roles('admin') @ApiBearerAuth()` repetition in `MetalsController`
  - [ ] Split mixed controllers into `*.admin.controller.ts` (`products`, `market-data`, `knowledge`)
  - [x] Extend `route-auth.spec.ts` so a write route without `@Roles` fails, as an allow-list (trade, portfolio and ai are legitimately non-admin) *(allow-list of non-admin writes in `route-auth.spec.ts`; `RolesGuard` is now global so `@Roles` can never be inert)*
- [x] **Shared Zod query schemas** (`PaginationQuery`, `LimitQuery`, `LogLevelQuery`) in `shared-types`, wrapped in `dtos.ts` — S
  - [x] Replace the hand-written parsing in `admin/logs`, `admin/audit`, `errors`, `metals/fetch-log`, `market-data/backfill-history` (`Math.min(Math.max(Number(x) || n, a), b)` appears 3× in `AdminController`; `Number(page) || 1` silently accepts garbage)
  - [x] `metals/:metal/retry`: validate with `ZodValidationPipe(MetalTypeEnum)` like `trade`
  - [x] Audit every numeric `@Param` for a missing `ParseIntPipe` *(only `products` has numeric params and all use `ParseIntPipe`; `:table` and `:slug` are validated by the DB browser and a Zod slug pipe)*
  - [x] Move the quantity coercion `Math.max(1, Math.floor(q) || 1)` in `TradeService.calculateCart` into the Zod schema (it silently rewrites bad input) *(the schema already enforced whole numbers >= 1; the silent rewrite in the service is gone)*
- [ ] **Web number inputs:** one shared `NumberInput` that keeps the string while editing; `Number(e.target.value) || 0` snaps a field to `0` on every empty edit, so you cannot clear it and type `0.5` — S
- [ ] **`DbBrowserService` spec + hardening** — M. Raw SQL is used in 10 places (`$queryRawUnsafe`/`$executeRawUnsafe`); table and column names are checked against the catalogue and values are bound — keep it that way and comment why `quote()` is safe.
  - [ ] Spec: unknown table → 404, read-only table → 403, hidden column never returned, identifiers only from the catalogue, **hostile table/column names are rejected**
  - [ ] Extend `CACHE_KEYS_BY_TABLE` beyond `products` for any table that is actually cached (check `branches`, the history table and knowledge reads); the new history cache from 0.13 must be registered, or an admin edit serves stale data
  - [ ] Move the DELETE row key into a query param or a POST (some proxies strip DELETE bodies)
- [ ] **Characterisation tests before each big refactor** — M each ← depends: the refactor it protects: `KnowledgeService.importDocuments`, `useTradeTools` cart behaviour, `AskService` (only if taken up)

## 0.13 Market-data flow rework 🟠 ← depends: 0.2 shared pricing engine

**Today:** one bundled `GET /market-data` (spot + ~5 years of thinned history + ~150 priced products), plus `POST /market-data/recalculate` on every spot-override change (300 ms debounce) and `POST /market-data/refresh`, all writing one query-cache key (`marketData.all`) that 8 call sites invalidate.
**Problems:**
1. History is re-read from the DB with no cache and resent on every load, Refresh and product edit *(size is an estimate; measure it first)*.
2. A Refresh or any refetch can overwrite recalculated products while overrides are unchanged, so the cards show the frozen spot and the table shows live prices *(confirm by reproducing)*.
3. Recalc responses are unordered (the last to finish wins).
4. No spot `refetchInterval`: prices update only on reload or Refresh.
5. `/recalculate` is a server round trip for pure arithmetic the client can do.
6. Three near-copies of the composition on the server: `composeMarketData`, `recalculate`, `getPricedCatalogue`.

**Plan:** three queries (spot, products, history) plus client-side pricing. Note the Trade/Melt/Portfolio tool spots stay isolated from the card spot (`docs/adr/0001-tool-spots-are-isolated-from-the-card-spot.md`); client-side pricing must not change that.

- [ ] Reproduce problem 2 (freeze a spot → Refresh → compare a card with a table row; also a product edit while frozen) and measure the real payload and the history share — S
- [ ] `GET /market-data/history` with a `HistoryCacheStore extends CacheAsideStore` (Redis, TTL of hours, busted by the daily close job); coordinate with 1.3 — M
- [ ] `GET /market-data/spot` (cards, freshness, `isFallback`, `degradedMetals`) — S
- [ ] Web: `useSpotQuery` (poll 60 s – 5 min), `useProductsQuery` (staleTime ~5 min), `useHistoryQuery` (staleTime of hours); `useMarketData()` stays as a thin composite so consumers barely change — M
- [ ] Client-side pricing: `pricedProducts = useMemo(() => products.map(p => calculateProductPrice(p, displayPrices)))` — M
- [ ] Targeted invalidation: a product edit/delete/restore invalidates products only; Refresh invalidates spot only; one `invalidateProducts()` helper for the 8 call sites — S
- [ ] Remove `/market-data/recalculate`, `useDebouncedRecalc` and `recalcMutation`; make `getPricedCatalogue` the single server-side "priced catalogue" entry point for Trade, Portfolio and the AI tools — M ← depends: the four items above
- [ ] Optional: keep `GET /market-data` as a first-paint bundle if three parallel requests prove noticeable — S
- [ ] **Normalise the products routes** in the same PR as the web `products.api.ts` change — M. Today: `GET /products/products`, `POST /products/admin/products`, `PATCH /products/admin/products/:id`, `PATCH …/:id/stock`, `GET …/deleted`, `POST …/:id/restore`, `GET /products/:id`, `DELETE /products/:id`. Target: `GET/POST /products`, `PATCH/DELETE /products/:id`, admin by `@Roles`. Declare literal routes before `:id` (a shadowed `deleted` would become a 400 from `ParseIntPipe`). Redo the Swagger pass afterwards (0.10).
- [ ] Consolidate the two refresh endpoints: `POST /metals/refresh` (admin) and `POST /market-data/refresh` (any signed-in user) — decide one route, role, response shape and throttle — S
- **Not recommended:** pagination (~150 rows), websockets, per-product or per-metal endpoints, GraphQL.

## 0.14 Backend and frontend refactors 🟡 ← depends: 0.12 tests, 0.2

Structural clean-up, ordered by risk (cheap first). Keep the existing architecture: Zod via `nestjs-zod`, modular monolith, Prisma used directly in services. Every item needs the characterisation tests from 0.12 first. A refactor is taken up when it unblocks a feature or the code is being changed anyway, not on a calendar.

**Quick wins (any time, low risk, covered by existing tests):**
- [ ] `ProductsProvider.requireById()`: the "get, else `NotFoundException`" block repeats in `ProductsService.update/delete/updateStock` and in trade/portfolio — S
- [ ] One `resolveSpot(metal, customSpot?)` helper: `customSpot > 0 ? customSpot : live` appears 3× and "No spot price available for X" 4× in `trade.service.ts` and `portfolio.service.ts` — S
- [ ] `dayWindow(date)` helper for the `T00:00:00.000Z`/`T23:59:59.999Z` pair repeated 3× in `historic-spot.service.ts` — S
- [ ] `queryKeys.admin.db()` for the literal `["admin","db"]` in `database-tab.tsx`; add `setSelectedMetal` to the deps of `toggleSelectedMetal` in `use-pricing-workbook.hook.ts` — S

**Backend:**
- [ ] `AllExceptionsFilter` → exception mappers (`ExceptionMapper { supports(e); map(e) }` for HttpException, Prisma known/init/panic/validation, fallback); the ~140-line if-ladder becomes unit-testable pieces — M
- [ ] **Provider clean-up** (the repository question): `ProductsProvider` stays the product write path — M
  - [ ] Make the provider the only writer: route the admin DB browser's product edits through the same cache refresh via a shared constant/hook instead of the hard-coded `'products:all'`
  - [ ] Split `MetalsProvider` (407 lines): `PriceSourceStrategy` (`CacheFirst` for launch reads, `LiveFirst` for refresh) over a shared `resolveFromDb()`; one `recordAttempt()` in `fetchFromExternalApi` (3 near-identical calls); extract a `SpotPriceWriter` so "the only writer of `metalSpotPrice`" is structural, not a comment; put the circuit breaker (0.1) in the same area
- [ ] `DbBrowserService` split (357 lines) ← depends: its spec in 0.12 — M: one `TablePolicy { writable, hiddenColumns, cacheKeys }` registry replacing `WRITABLE_TABLES`/`HIDDEN_COLUMNS`/`CACHE_KEYS_BY_TABLE`; `SchemaCatalogue` (cached, not re-queried per call); `SqlBuilder`; fix the N+1 `count(*)` in `listTables`
- [ ] `KnowledgeService` split (516 lines) ← depends: its characterisation tests — L: `KbImporter` of pure steps (`parseFiles`, `rejectDuplicateSlugs`, `findLinkProblems`, `decideAction`, `buildWrites`), `KbApprovalService` for `updateDocument`/`setStatus`, shared `toLinkNode(row)`. Code only; SOP content stays the owners' to edit
- [ ] `OpenAiLlmClient`: extract `LlmErrorTranslator` (testable without the SDK); share content-filter and empty-answer checks between `generate` and `stream` — S
- [ ] `TradeService`/`PortfolioService` tidy ← depends: their specs (0.10) — S: `for…of` instead of throwing inside `.forEach`; bar-vs-coin classification (`/bar/i.test(name)`) belongs with the product model
- [ ] Split `pricing.util.ts` (mappers, pricing, metal constants, history thinning, enrichment) into `mappers/`, `pricing/`, `history-thinning.ts` after the pricing move (0.2); let the admin controller call `HistoricSpotService` directly instead of the pass-throughs on `MarketDataService` — S
- [ ] Verify and decide: why `AdminModule` is `@Global()` (`ErrorLogModule` is justified by the exception filter); whether `lib/db/prisma.ts` reading `process.env` directly is intentional for seed scripts; whether `ProductsService.getRawProducts` (a one-line pass-through) is used — S
- [ ] ⚪ Conditional: split the `AskService.askStream` pipeline (~330-line method) into `QuestionPreparer`, `ToolLoopRunner`, `AnswerValidator`, `AskRecorder`, `AnswerCachePolicy`; draft vs procedures as two mode handlers — L ← only when the service has to change (new mode or tool)

**Frontend:**
- [ ] **Stabilise the API client** — M: the `request`/`get`/`post` helpers are redeclared every render and every `useXApi()` returns a fresh object, so `AuthProvider.login` changes every render and every `useAuth()` consumer re-renders. Use a module-level client (or `useMemo`), type `request<T = unknown>`, then remove the `exhaustive-deps` suppressions this unlocks (9 in scope). Do it with the HTTP-client consolidation in 0.12
- [ ] Break up `useTradeTools` (358 lines, 5 effects) — L: pure `cartReducer` with `useReducer`, `useCartSelectionSync`, `useDebouncedValue`, event-like effects become dispatches, replace the `initializedMetals` once-guard ref, one `priceDefault(productId)` closure (repeated 6×)
- [ ] Split `PricingToolsContext` (22 members) into panel and selection contexts; replace `focusTradeQuantity`'s `document.getElementById` polling with a ref or counter; replace the mutable `tableCopySource` ref-in-context with explicit registration — M
- [ ] `useMarketData` notifications ← depends: 0.13 — S: one `usePriceToasts` with a single dedupe map instead of three hand-rolled "fire once" refs; `loading: isLoading || isFetching` marks the dashboard loading on every background refetch (probably only `isLoading` is wanted); shared `useNow(intervalMs)`
- [ ] `usePricingWorkbook`: `toMetalCard(spot, override, now)` instead of the 10-field options bag; drop `recalc({})` on mount (goes with 0.13) — S
- [ ] Data-fetching convention: components call `useXQuery()` hooks, only those hooks know the API object; reset `page` in the handlers that change `q`/`sort`/`dir` instead of `useEffect(() => setPage(1), …)` in `database-tab.tsx` — M
- [ ] `calculators-tab.tsx` (547 lines, five components) ← depends: web tests (0.10) — M: pure `computeCgt`/`convertVat`/percent result with tests, `PercentVisual` renderers in the `PERCENT_MODES` table, one file per calculator
- [ ] `AssistantDock` split into `ModeTabs`, `Composer`, `StartScreen` — S
- [ ] Small a11y and correctness: `PillField`'s `Label` has no `htmlFor`/`id`; `key={index}` in `knowledge/components/search-results.tsx`; `useLocalStorageState` calls `setState` during render under an `eslint-disable` — S
- [ ] Naming per `docs/ENGINEERING.md` §3: `useApi.ts` → `use-api.hook.ts`; `use-product-table.ts` and `use-theme-manager.ts` → `.hook.ts` — S

---

# PHASE 1 — Internal features and branch rollout

**Exit:** all branches live on Goldilocks; ad-hoc sheets and monthly tradesheets retired.

## 1.0 Prerequisites (start the conversations early) 🔴

- [ ] Confirm BC API/OData **read** access with the contractor — unblocks 1.8, 1.9, 1.12, 1.16 `[BC]`
- [ ] Management sign-off on storing customer data in Goldilocks (GDPR) — unblocks 1.6, 1.10, 1.15
- [ ] Bank approval for Open Banking read-only — unblocks 1.7
- [ ] Check StoneX / CoinInvest / hedging platform APIs — unblocks 1.8
- [ ] Decide the email provider for customer alerts (transactional email, not Outlook) — unblocks 1.10

## 1.1 Desk tools: speed at inquiry, negotiation, handoff 🟠

The sidebar is capped at **5 tabs**; consolidate rather than add. Already shipped: trade calculator, premium + break-even, melt/scrap, portfolio P&L, currency converter, percent calc, VAT/CGT/CAT, workbook parity.

- [ ] **Quote snapshot + price-lock log**: select products + quantities → locked-price snapshot with expiry timer, copyable to WhatsApp/email; log "quoted customer X €Y at HH:MM" for dispute resolution — L
- [ ] **Basket calculator**: type "4 × 1oz bar" → running total, per-unit, VAT split — M
- [ ] **Budget solver**: "€10k in gold" → best combinations (lowest premium / fewest units / mixed), leftover € — M
- [ ] **Upsell comparison**: 1oz vs 10×1g, €/g side by side; bar vs coin vs bonded silver incl. VAT and 1% storage — M
- [ ] **Reverse calculator**: customer's target price → implied premium, clears margin floor? — S
- [ ] **"Spot needed" calc**: at what spot does product hit €X (feeds limit orders) — S
- [ ] **Re-price at lock**: enter quoted price + time, see today's price and the difference — S
- [ ] Spot volatility flag: spot moved > X% in the last hour, warn the customer — S
- [ ] Quantity-tier premiums (5+/10+/25+) if the desk negotiates that way — M
- [ ] Bonded silver storage cost calc (1% p.a., pro-rata by month) — S
- [ ] Limit-order calculator — S
- [ ] Bonded silver serial tracker `[BC]` — L (only if BC lacks it)

## 1.2 Admin and management controls 🟠

- [ ] Scheduled premium changes (effective date/time) — M
- [ ] Premium presets per metal/category ("all Britannias +0.5%") — S
- [ ] Margin floor guard (warn or block below minimum premium) — S
- [ ] Stock/availability flag (in stock / low / out / on order) visible to sales — S
- [ ] Supplier cost reference (StoneX/CoinInvest) per product, margin visible in admin mode only — M
- [ ] Competitor price notes (price + date checked) — S
- [ ] Daily end-of-day price snapshot per product ("what did we charge on date X") — M
- [ ] Dealer margin monitor (admin only) and margin-leakage flags — M
- [x] **Project Management page** (admin only, `/project`): three views: **Roadmap** (browse by section with icons and progress, tick/untick, add, edit and delete tasks), **Engineering** (the project guide plus architecture, SOLID, patterns, runtime and operations topics with diagrams) and **Design system** (colour swatches, type scale, shapes and live component mockups from `DESIGN.md`) — M *(the Markdown is stored in the `roadmap_document` table so it works on Railway; the Engineering and Design views read `docs/ENGINEERING.md` and `DESIGN.md` at build time; edits are written back to `docs/ROADMAP.md` when run from a local checkout. `pnpm --filter api roadmap:import` after editing the file by hand, `roadmap:export` after editing in the deployed app)*
- [ ] Bulk product importer — M
- [ ] Role tiers enforced in UI (sales can log quotes but not edit premiums) — S

## 1.3 Historic spot and market analytics 🟠 *(quick win; feeds charts, AI, customer site)*

- [ ] `SpotPriceDaily` (metalId, date, open/high/low/close, currency), index `(metalId, date)` — S *(partly there: `historic_spot_prices` stores one EUR and GBP close per metal per `recordedAt`, unique on `(metalType, recordedAt)`; no open/high/low. Decide whether to extend it or keep closes only)*
- [x] Backfill script batched by year within API quota; daily job appends closes — M *(`POST /market-data/backfill-history?years=5`, admin-only, skips windows already stored. Done for 5 years on 2026-10-01; the table holds daily closes, not full open/high/low/close)*
- [ ] Chart ranges 1D/1W/1M/1Y/5Y/Max + Redis cache for history queries — M *(1W, 1M, 3M, 6M, 1Y and 5Y are built; 1D, Max and the Redis cache are not. Data older than a year is sent weekly to keep the payload small)*
- [ ] Daily change (€ and %) per metal; intraday high/low — S
- [ ] Gold/silver ratio card (+ percentile); gold/platinum/palladium ratios — S
- [ ] Hover crosshair; compare metals normalised to % — M
- [ ] Price comparison vs yesterday — S
- [ ] Panel metrics (all labelled historical/descriptive, with lookback shown):
  - [ ] Change on day/week/month/YTD/1Y; distance from 52-week and all-time high; percentile within 1/5/10Y — M
  - [ ] 50/100/200-day MAs, drawdown from high, RSI with plain-language label — M
  - [ ] Realised volatility (10d/30d), average intraday move → **suggested quote-validity window** — M
  - [ ] EUR vs USD gold performance (FX contribution), EUR/USD effect on euro price — M
  - [ ] Seasonality (avg monthly return, multi-year) — S
  - [ ] Product price history in euro terms ("what did a Britannia cost last year?") — M
  - [ ] Metal correlation indicator; liquidity indicator — S
  - [ ] Market event calendar (CPI, Fed, ECB) and event tagging on chart — M
- [ ] Spot price alerts (threshold → toast/browser notification, later email) — M

## 1.4 Knowledge Center 🟡

- [ ] Resolve all `[TODO]`s in SOP drafts with process owners; management approval — S (people work) *(10 of 12 SOPs are approved; still open: `limit-orders` — 3 TODOs — and `branch-directory` — Cork, Blanchardstown, Barcelona, Madrid and Glasgow details, plus its owner)*
- [x] `KbDocument` (slug, title, category, jurisdiction, owner, markdown, version, status) — M *(`jurisdiction` replaces `branchId`, per `docs/sops/00-README.md`; add a branch link with 0.8 if per-branch SOPs appear)*
- [x] Markdown importer with frontmatter; article pages with heading anchors — M *(`pnpm --filter api kb:import`, source files in `docs/sops/`; articles live at `/knowledge/articles/:slug#section`, as the README specifies, not `/kb/:slug`)*
- [x] Side-menu entry + search — S *(sidebar now shown to all signed-in users; search is section-level and runs in the browser)*
- [x] Admin editor with draft → approved workflow — M *(admins edit title, owner and text on the article page; changing the text sends an approved SOP back to draft; approving is refused while a `[TODO]` remains and bumps the version + date; retire/return-to-draft too. Drafts carry a "Not yet approved" banner for everyone, per the README; retired SOPs are hidden from non-admins. Edits are logged with the admin's email until the 0.6 audit log exists; a re-import of the SOP file will not overwrite an in-app edit unless forced)*
- [ ] Write the missing `kyc-aml` SOP — four SOPs link to it and currently show "not written yet" (import runs with `--allow-unresolved` until it exists)
- [x] 6-month SOP review reminders — S *(in-app: every approved SOP shows its next review date, a "due soon" notice 30 days ahead and a loud "overdue" notice after; admins also get a list on the Knowledge Center front page. Email/Teams delivery is not built — no mail or Teams integration exists yet, see 1.13)*

## 1.5 Internal AI agent 🟡 ← depends: 1.4

*Implementation plan and decisions: [`docs/AI-AGENT-PLAN.md`](AI-AGENT-PLAN.md) (single questions only for now; small model; answers stored with customer names scrubbed and prices never stored).*

- [x] `AiModule` + `POST /ai/ask`, SSE streaming — M *(`POST /ai/ask` and `POST /ai/ask/stream`, admin-only, off by default; the stream is verified over real HTTP and against the real model. The web app's streaming reader comes with the chat panel, phase 4)*
- [x] Approved SOPs in a cached system prompt (prompt caching) — M *(verified against the real model: about 99% of input tokens are served from OpenAI's prompt cache)*
- [ ] Rules: answer only from SOPs, always cite section link, never answer from a TODO — S *(enforced in code and unit-tested; `pnpm --filter api ai:eval` passes 13–15 of 15 cases per run on gpt-4o-mini — the failures move around run to run — so tick once a model passes reliably, several runs in a row)*
- [ ] Branch `region`, `phone`, `openingHours` columns + admin form, so `getBranch` reads the database (overlaps 0.8; don't duplicate) — S
- [ ] Tools: `getSpot`, `getProductPrice`, `getBranch` — M *(`getSpot` and `findProductPrices` are built and pass the real-model evaluation against a fixture catalogue, with a figure check that flags any euro amount no lookup supplied; `getBranch` waits for the branch columns above. Not yet checked end to end in the running app with a live spot)*
- [ ] Chat panel with clickable citations; thumbs up/down — M *(partly there: `knowledge/components/assistant-panel.tsx` exists and renders citations; no thumbs up/down found)*
- [ ] Question log + "unanswered questions" report — S *(the log is built: scrubbed question, status, citations, tokens, cost, 90-day retention; the admin report is phase 5)*
- [x] Per-user daily quota, cost log, throttling — S *(Redis limiter that fails closed: one open question, 5 a minute, 50 a day; exact-integer cost log; company-wide daily spend breaker; all verified against the real database and model)*
- [ ] Later: RAG (chunking + pgvector) behind a `KbRetriever` interface — L
- [ ] Mark all AI output as AI-generated *(the assistant was opened to all signed-in staff on 2026-10-01 with only the "Preview" badge; owner removed the "AI-generated" line from the panel on 2026-10-01; only the "Preview" badge in the panel header remains — decide whether that is enough before opening it to all staff)*

## 1.6 Inquiry hub + message templates 🟠 *(biggest daily time saving)* ← depends: 0.5, GDPR sign-off

- [ ] `Inquiry` (channel, customer, product, assigned broker, status new → quoted → won/lost, BC quote number) — M
- [ ] Phone quick-log form (< 10 s) — S
- [ ] Outlook via Microsoft Graph — L
- [ ] WhatsApp Business Platform (replaces WhatsApp Web) — L
- [ ] `MessageTemplate` with `{{customerName}} {{product}} {{sellPrice}} {{spot}}`; live price injection + "valid at HH:MM" — M (extends 0.5)
- [ ] Copy button + WhatsApp deep link — S
- [ ] AI draft: paste a customer email → reply with live prices (broker reviews) — M ← depends: 1.5 *(built into the assistant panel as the Email and WhatsApp modes, admin-only; the real-model evaluation passes its cases. Tick after real use on real emails; the inquiry-hub integration is the rest of this item)*
- [ ] RFQ turnaround timer, conversion rate per broker, time-saved tracking — M
- [ ] Smart sales suggestion / customer demand indicator (what customers are asking for) — M

## 1.7 Funds-landed alerts 🟠 ← depends: Open Banking approval

- [ ] Open Banking read-only feed (AIB, BoI) via GoCardless Bank Account Data / TrueLayer — L
- [ ] Match transfers to open quotes by reference + amount + payer name; flag third-party payers — M
- [ ] Alert the assigned broker: "funds landed, lock and hedge" — S
- [ ] Exceptions queue: partial, overpaid, unknown reference — M
- [ ] Payment is still recorded in BC by the broker

## 1.8 Hedge control 🟠 ← depends: 1.0 `[BC]`, 0.6 transactional audit log

- [ ] `Order` (lockedSpotPrice, lockedAt, metalId, weightGrams, premiumRate, hedgedAt, expectedDelivery, status PAID → HEDGED → COLLECTED) + migration — M
- [ ] Exposure dashboard `(currentSpot − lockedSpot) × weightOz`, live over SSE — M
- [ ] Daily reconciliation: paid orders in BC vs hedges placed; alert on unhedged paid orders — M
- [ ] Supplier cost comparison (API or manual) — S
- [ ] End-of-day exposure report — S

## 1.9 Audit and reconciliation hub 🟠 ← depends: 1.0 `[BC]`, 0.6 transactional audit log

- [ ] UI for quotes, invoices, hedged orders, collection status with advanced filters — L
- [ ] Manual export (Excel/CSV) + scheduled export of the current month (e.g. hourly) — M
- [ ] Discrepancy detection: balance mismatches, quotes not converted after payment, orders not hedged — L
- [ ] Refund/reversal as **reversal entries**, never edits — M

## 1.10 Client price alerts and limit orders 🟡

- [ ] Limit-order book (customer, product, target price, expiry) — M
- [ ] Spot watcher job (BullMQ) → alert broker when hit; "call back" list — M
- [ ] **Customer price alerts**: per-customer "alert to buy/sell at" values (default null), consent flag, automatic email when spot crosses — M ← depends: GDPR sign-off, email provider
- [ ] Alert emails double as marketing: include live price + quote link, unsubscribe link — S
- [ ] Limit-order SOP written — S
- [ ] Later: WhatsApp channel for alerts (via 1.6)

## 1.11 Collections board 🟡

- [ ] Today's + upcoming collections; "bag ready" checklist — M
- [ ] Google Calendar sync per branch — M
- [ ] Customer reminders via templates (email/WhatsApp) — S
- [ ] Signature + ID capture stays in BC

## 1.12 Inventory audits and forms 🟡 ← depends: 1.0 `[BC]`

- [ ] Monthly count sessions on iPad; barcode/serial scan for bars, quantity for coins — L
- [ ] Compare to BC inventory; discrepancy log with two-person sign-off — M
- [ ] Generic checklist/form module to replace other ad-hoc sheets — M
- [ ] Inventory intelligence: reserved stock (quotes), stock reconciliation, low-stock signals — M

## 1.13 Teams integration 🟡

- [ ] Webhook alerts: funds landed, unhedged orders, spot moves > X%, audit discrepancies — S
- [ ] Morning brief (spot, overnight moves, news, today's collections) — M ← depends: 1.3, 1.14
- [ ] Shift handover notes — S

## 1.14 News feed and market analysis agent 🟡

- [ ] RSS news feeds; `NewsItem` with dedupe; BullMQ job every 30–60 min — M
- [ ] News page filtered by metal, tagged by theme (central banks, inflation, supply, ETF flows, geopolitics), "new since you last looked" — M
- [ ] Reddit official API (r/Gold, r/Silverbugs) — check commercial-use terms — S
- [ ] Sentiment gauge **with sample size shown** — S
- [ ] Daily brief per metal (3–5 bullets, jargon-free on demand), trend vs 50/200 MA, talking points aligned to the market-questions SOP — M ← depends: 1.3
- [ ] Compliance review before anything becomes customer-facing; AI label on output — S

## 1.15 Zoho historic data 🟡 ← depends: 0.6, GDPR sign-off

- [ ] Check whether the BC contractor is already migrating Zoho — S
- [ ] Export via Zoho Books API/CSV → staging tables → product-name normalisation (reuse Raw GP fuzzy matching) — M
- [ ] Customer history view; feed to AI template drafts — M

## 1.16 Management dashboards and KPIs 🟡 ← depends: 1.0 `[BC]`, 1.6

- [ ] KPIs: inquiries, conversion, response time, margin, volume by broker/product/branch — L
- [ ] Margin leakage (sold below standard premium); quote analytics (most quoted, converting) — M
- [ ] Sales analytics, revenue breakdown, metal performance, staff performance — L
- [ ] Monthly export for management meetings — S
- [ ] Margin intelligence + smart price simulator — M

## 1.17 Compliance assistant 🟡 `[LEGAL]`

- [ ] Agree scope with the compliance owner — S
- [ ] AML checklist + log per transaction; linked cash-transaction flags — M
- [ ] Sanctions/PEP screening integration — M
- [ ] Record retention rules — S

## 1.18 Multi-branch rollout 🟠 ← depends: 0.6 SSO + audit log, 0.8

- [ ] Branch data, users, roles for Ireland, Scotland, UK — M
- [ ] Training per branch; onboarding SOP in the Knowledge Center — M
- [ ] Feedback channel + weekly bug triage — S
- [ ] Retire monthly tradesheets and ad-hoc sheets — S

---

# PHASE 2 — Customer site, eshop and scale-up

**Goal:** a separate but parallel, customer-facing web app (`apps/site`) that replaces merriongold.ie (WordPress), then adds tools, customer accounts/portfolio, and finally an automated eshop.
**Architecture:** React + NestJS surface alongside Goldilocks; shares `packages/shared-types` + pricing services; **separate customer auth**, separate public controller surface with caching + rate limiting; internal tools are never exposed on it. Staged launch: read-only → assisted checkout → automated checkout.

## 2.0 Prerequisites (gate) 🔴

- [ ] BC API **write** access (customers, sales orders, payments, draft POs) `[BC]`
- [ ] Legal: T&Cs, price-lock policy, cancellation / market-loss clause; EU 14-day withdrawal exemption for market-priced goods `[LEGAL]`
- [ ] Compliance: AML thresholds, source-of-funds, KYC rules `[LEGAL]`
- [ ] Vendors chosen: Open Banking (payment initiation + AIS), KYC/ID verification, sanctions/PEP
- [ ] Hedge platform API availability
- [ ] Unit economics per order (fees, KYC, insurance, shipping, hedge cost vs desk margin)
- [ ] Monorepo split agreed: `apps/web` (staff), `apps/site` (customer), `apps/api` (core), `apps/worker` (when triggered)
- [ ] Scaling-trigger items for anything customer-facing done: rate limiting, public caching, CDN, separate endpoints

## 2.1 Public site: catalogue, live prices, tools (read-only launch) 🟠

- [ ] Product pages: images, description, weight, purity, €/g — L
- [ ] Live price + refresh countdown; transparent breakdown (spot + premium + VAT + "buyback value today") — M
- [ ] Volume-tier display; availability states (in stock / supplier order / unavailable) — M
- [ ] ETA per product and per branch ("Collect in Cork tomorrow or Dublin Friday") — M
- [ ] Price charts on product pages and historic charts (from 1.3) — M
- [ ] **Public metal price widget** (embeddable) and live-price SEO pages — M
- [ ] **Customer calculators**: buy-by-budget, CGT/VAT, portfolio, converters (public subset of the internal tools) — M
- [ ] Trust pages (security, storage, certificates), reviews (Trustpilot) — M
- [ ] Multilingual: English + Spanish — M
- [ ] Admin CMS for product content; AI-drafted descriptions with human review — L
- [ ] "Request quote" button feeding the inquiry hub (1.6) — S
- [ ] Separate cached public price API + rate limiting — M
- [ ] Redirects + SEO migration plan; **retire the WordPress site** — M

## 2.2 Customer accounts and KYC 🟠 `[LEGAL]`

- [ ] Registration + login (separate auth from staff), bot protection, rate limits — M
- [ ] Digital ID verification with liveness; sanctions/PEP screening — L
- [ ] Customer risk scoring; source-of-funds step above threshold — M
- [ ] Customer created in BC via API — M
- [ ] GDPR self-service: data export and deletion request — M

## 2.3 Customer portal v1 (read + quotes) 🟡

Pulled earlier than the eshop so customers get value before checkout exists.

- [ ] View quotes, accept a quote, download quote/invoice PDFs (sourced from BC) — M
- [ ] Transaction tracker: Paid → Hedged → Allocated/Ordered → Ready → Collected — M
- [ ] Holdings history; portfolio dashboard: live valuation, P&L, CGT estimate — L
- [ ] Customer price alerts self-service (extends 1.10) — S

## 2.4 Cart and assisted checkout 🟡

Goal: prove demand before automating risk.

- [ ] Cart with live prices; buy-by-budget allocation; upsell nudge ("50g bar vs 5×10g saves €X") — M
- [ ] Checkout creates a formal **quote in BC via API**; quote PDF by email with unique payment reference — L
- [ ] Order cut-off times (paid before 14:00 = hedged/ordered same day) — S
- [ ] Brokers alerted to lock and hedge manually — S
- [ ] Abandoned-cart recovery at updated price — S
- [ ] **Checkout disabled when spot is stale or market closed** (or Weekend/Volatile mode applied) — S

## 2.5 Payment automation 🟡

- [ ] Bank feed matching to orders (reuse 1.7); exceptions queue (partial, overpaid, wrong ref, paid after expiry → requote/refund) — L
- [ ] Pay-by-bank (Open Banking payment initiation + SEPA Instant) default, 10-minute price lock — L
- [ ] Manual transfer path: lock at confirmation, pay in 24–48h, verified customers only, deposit/approval above threshold — M
- [ ] Automatic cancellation + market-loss charge for unpaid orders — M

## 2.6 Auto-hedge and BC write 🟡

- [ ] Hedge on confirmed payment; per-order and daily exposure limits; above limit → broker approval — L
- [ ] Kill switch; fallback pre-filled hedge ticket with one-click confirm — M
- [ ] Sales order + payment recorded in BC via API; idempotency keys + retry queue — L
- [ ] Nightly reconciliation: eshop orders vs BC vs hedges — M

## 2.7 Fulfilment automation and control tower 🟡

- [ ] Stock reservation at payment (not at cart); pick list with serials; serial scan confirms allocation (recorded in BC) — L
- [ ] Draft PO in BC for manager approval when stock is short; supplier selection (cheapest/fastest); daily-cut-off consolidation; ETA tracking + delay notifications — L
- [ ] "Ready for collection" only after bag verified; photo of the customer's bars with serials — M
- [ ] Operations control tower: all orders by status, SLA timers, stuck-order flags, exception queues (payment, hedge, stock, BC sync) — L
- [ ] Staff iPad app: collections, picking, audits — L

## 2.8 Collection and delivery 🟡

- [ ] Slot booking per branch with capacity limits; Google Calendar sync; reminders, reschedule, no-show handling — L
- [ ] QR collection pass (email + Apple/Google Wallet); desk scan opens order; ID + signature still in BC — M
- [ ] Delegated collection via authorisation link — S
- [ ] Insured delivery; vault storage option at checkout — M

## 2.9 Retention and account features ⚪→🟡

- [ ] Buyback portal: instant quote → insured shipping or drop-off booking → verification → payout — L
- [ ] Trade-in (swap coins for a bar); scrap gold buying module (assay-based) — L
- [ ] Recurring orders; gift orders; valuation certificates for insurance — M
- [ ] Referral programme (credit in grams); loyalty system — M
- [ ] Online limit orders (verified/prefunded accounts); reorder and price-drop nudges — M
- [ ] Customer prefunding/balance `[LEGAL]` — L

## 2.10 Pricing intelligence 🟡

- [ ] Competitor price monitor (daily scrape + alerts) — M
- [ ] Dynamic premiums from stock level/age, supplier cost, competitors; admin approval rules; analytics-based dynamic pricing — L
- [ ] Demand forecasting worker for stock and supplier orders — L

## 2.11 Compliance automation 🟡 `[LEGAL]`

- [ ] Automatic AML file per order (KYC, screening, payment match, source of funds) — L
- [ ] Ongoing monitoring; structuring detection (repeated orders under thresholds) — L
- [ ] Suspicious-activity report workflow for the compliance owner — M

## 2.12 Growth and conversion ⚪

- [ ] Checkout funnel analytics; feature flags (by branch/customer group); A/B tests — M
- [ ] CRM automation (anniversary valuations, reorder reminders) — M
- [ ] Live chat / callback booking for large orders — M
- [ ] AI sales assistant from approved content only, hands off to a broker — L

## 2.13 Scale-up: recurring revenue ⚪ `[LEGAL]`

- [ ] Gold savings plans (monthly direct debit → fractional grams → bar at threshold) — XL
- [ ] Allocated vault storage (extend bonded silver model) + vault dashboard — XL
- [ ] Gift cards in grams; child/wedding/christening savings — L
- [ ] Digital/fractional gold (regulatory review first) — XL

## 2.14 Scale-up: B2B and supply ⚪

- [ ] Business accounts (multi-user, approvals, company invoicing) — L
- [ ] Wholesale portal (jewellers, pawnbrokers, coin shops): tiered pricing, bulk orders — L
- [ ] Scrap and refining intake with trade accounts — L
- [ ] White-label API for advisers/wealth managers/banks — XL
- [ ] Automated hedging engine (net exposure across channels, batched) — XL
- [ ] Direct mint/refinery relationships; own-brand bars and coins — XL
- [ ] Export API for accounting integration — M

## 2.15 Scale-up: geographic expansion ⚪

- [ ] Spain launch: Spanish site, local payment methods, local support — XL
- [ ] EU VAT (OSS) handling; vault/bonded model per country — L
- [ ] Branches become showrooms + collection points — strategy

---

# Architecture target (how the monorepo grows)

```
apps/
  api/        core NestJS monolith: auth, users, pricing, products, trade, audit, inventory, inquiries, hedge, reporting
  web/        staff app (today's Goldilocks dashboard)
  site/       PHASE 2: public site + customer portal + eshop (separate auth, cached public API)
  worker/     only when triggered: price polling, scheduled reports, email, nightly reconciliation, log archival
packages/
  shared-types/   Zod schemas + pure pricing math (consumed from dist/)
  typescript-config/
```

- **Stay inside the API as modules:** inventory, reporting/KPIs, refund/reversal, audit, inquiries, hedge.
- **Separate frontends on the same API:** customer site, later a dedicated admin panel and a mobile/iPad app.
- **Separate services, in this order, only when needed:** worker → notification service (email/SMS/WhatsApp, retries, delivery tracking) → document generation (PDF/reports) → event bus (only with multiple systems / eshop / POS).
- **Third-party integrations use the `AuthProviderPort` pattern** (interface + DI token) when swapping is plausible: metals price API, Open Banking, KYC, hedge platform, notification provider.

# Scaling triggers (act only when they happen)

- [ ] More than one Railway replica → BullMQ for jobs, Redis-backed throttler, remove in-memory state; Redis pub/sub + SSE if push is wanted
- [ ] Other branches onboard → RBAC per role and branch, audit log review
- [ ] AI features live → per-user quotas, cost monitoring
- [ ] Anything customer-facing → real rate limiting, public response caching, CDN, separate endpoints from internal tools
- [ ] Nearing external API quota → longer TTL, stale-while-revalidate, higher plan
- [ ] p95 latency > ~500 ms or high DB CPU → profile queries → indexes → Redis caching → more instances
- [ ] Notifications/PDF/jobs starving API threads → extract worker / notification / document service

# Suggested sequencing (what to do next)

**Next 5 actions:** (1) CI on every PR + branch protection (0.10) → (2) `TradeService`/`PortfolioService` specs and the web test runner (0.10) → (3) throttler, Helmet and the dead `/auth/refresh` fix (0.6, 0.12) → (4) timeout/retry/breaker on the metal-price client (0.1) → (5) start the 1.0 prerequisite conversations (non-code, in parallel).

1. **Safety net first (🔴):** CI + branch protection + deploy gate (0.10) → web test runner, `TradeService`/`PortfolioService` and `DbBrowserService` specs (0.10, 0.12). Everything after this refactors a money system; without CI and tests it is not safe.
2. **Close defects and cheap exposure (🔴):** throttler, Helmet (0.6) → dead `/auth/refresh` and the two HTTP clients, fail-closed admin gating, Zod query schemas, vendor timeout/breaker (0.12, 0.1) → Sentry, staging, backup/restore, production Redis (0.7).
3. **Money you can trust (🔴):** rounding characterisation tests → one pricing engine in `shared-types` → `decimal.js` → transactional audit log (0.2, 0.6). The audit log gates 1.8 and 1.9.
4. **Market-data rework (🟠):** spot polling and the three-query split with client-side pricing, products route clean-up (0.13). Fold in the 0.3 resilience items (fallback marker, card retry, skeletons).
5. **Desk polish (🟠):** table polish (0.4) → multi-format copy and the template renderer (0.5) → monitoring panel (0.9) → remaining 0.10 docs. These can interleave with steps 3–4 when a stakeholder needs a visible win.
6. **Refactors (🟡, 0.14):** only when a feature needs the area or the code is changing anyway; quick wins any time.
7. **In parallel, non-code, start now:** every 1.0 prerequisite conversation (BC read access, GDPR sign-off, bank, hedge APIs). They gate most of Phase 1 and all of Phase 2.
8. **Then Phase 1:** historic spot (1.3, coordinate with the 0.13 history endpoint) → desk tools + price-lock log (1.1) → inquiry hub (1.6) → funds-landed + hedge control (1.7/1.8) → audit hub (1.9). **1.8 and 1.9 do not start before the transactional audit log.** A port (interface + DI token) is added for BC, Open Banking and the hedge platform when those start.
9. **Branch rollout (1.18)** once SSO, the multi-branch model and the audit log are live.
10. **Phase 2** only after 2.0 is closed; launch read-only (2.1) before accounts, assisted checkout, then automation. Before anything customer-facing: real rate limiting, public response caching and the 2.0 prerequisites.

# Icebox — ideas captured, unscheduled

Mapped to where they would land if promoted: multi-store support (0.8) · advanced inventory intelligence (1.12) · smart price simulator (1.16) · customer loyalty (2.9) · scrap gold module (2.9) · demand forecasting (2.10) · business KPI dashboard (1.16) · export API for accounting (2.14) · bulk importer (1.2) · public price widget (2.1) · dynamic pricing (2.10) · price freeze / price lock (1.1) · market event indicator (1.3) · metal correlation (1.3) · customer demand indicator (1.6). · template-page pruning (`apps/web` landing, settings, calendar, chat, tasks, dashboard-2, mail, users, faqs, errors, pricing and the old `admin/` scaffold: ≈ 12.9k lines vs ≈ 10.2k product lines) — **only on explicit request**; first check which routes are registered in `routes.tsx`, then drop dependencies only the template used · gold/silver and metal-ratio card variants (1.3) · persistence-boundary ports beyond BC/Open Banking/hedge (0.14 decision).
