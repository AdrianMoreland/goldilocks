# Goldilocks Super Roadmap

Single source of truth for what to build and in what order. Merges three earlier roadmaps and idea lists. Paste-ready for Notion (nested `- [ ]` checklists).

**Last consolidated:** 2026-09-30 · statuses re-checked against the code 2026-10-01

## How to read this

- **Phases:** `0` = harden/polish the current internal app · `1` = new internal features + branch rollout · `2` = separate, parallel customer site + eshop + scale-up.
- **Priority:** 🔴 P0 do now / blocks other work · 🟠 P1 high value, next · 🟡 P2 planned · ⚪ P3 idea / icebox.
- **Effort:** S (≤ 1 day) · M (2–5 days) · L (1+ week) · XL (multi-week, needs a plan first).
- **`← depends: X`** = do not start before X. **`[BC]`** = needs Business Central access. **`[LEGAL]`** = needs a legal/compliance decision first.
- `[x]` = done as of the consolidation date (taken from the source roadmaps + git history). **Verify in code before claiming something is done or missing** — this file can lag the repo.
- Work inside a phase in numeric order unless a dependency says otherwise. Do not start Phase 2 build work before its 2.0 prerequisites are closed.

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
- [ ] Timeout, retry and circuit breaker in `MarketDataModule` — M
- [ ] Central config validation: Zod-parse `process.env` at boot — S *(partly there: `main.ts` fails fast on a list of required variables, but it is not a Zod schema and does not check formats)*
- [ ] Remove dead code/unused deps, resolve TODO/FIXME — S

## 0.2 Money correctness 🔴

- [ ] `decimal.js` in all pricing services (`calcSellPrice`, `calcBuyPrice`, tools); round only at output — M
- [ ] Prisma `Decimal` for **all** money fields (audit remaining `Float`s) — M
- [ ] Snapshot full pricing context on any committed price (spot, premium, discount, VAT, FX, totals) — M
- [ ] Consistent number formatting (€, thousands separators, decimals) across cards, table and copy output — S
- [x] Test coverage: `calcSellPrice`, `calcBuyPrice`, VAT/gold-exemption/discount edge cases — S *(Jest, not Vitest: `pricing-math.spec.ts`, `pricing.util.spec.ts`; the ported tools' math is covered by the portfolio/trade specs. 471 API tests plus the shared-types specs pass)*

## 0.3 Data freshness and feed resilience 🟠

- [x] Per-metal "last updated" + source badge (Redis / DB / live API)
- [x] Staleness threshold banner ("Prices may be outdated — last fetched N min ago")
- [x] Fresh / stale / failed state per card
- [x] Countdown to next scheduled fetch
- [x] "Stale since HH:MM" badge
- [x] Admin cron control (pause/resume) and fetch-time toast
- [x] Admin error log / system status panel (first version)
- [ ] Distinct toast on fetch **failure** (vs. stale data) — S
- [ ] Explicit "serving last-known-good" fallback indicator — S
- [ ] Retry button per failed metal fetch — S
- [ ] SSE connection indicator (live / reconnecting / disconnected) — M
- [ ] SSE auto-reconnect with backoff + heartbeats — M
- [ ] Loading skeletons + empty states for cards, chart, table — S
- [ ] Customer-facing display mode: fullscreen, hides premiums/margins, sell prices only — M

## 0.4 Table and UX polish 🟠

- [x] Keyboard shortcuts (Esc closes dialogs, arrow-key row nav, `/` focuses search)
- [x] Table filters and column customization
- [ ] Sticky header + sticky first column (mobile included) — S
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
  - [ ] Email: template with `{greeting}`, `{items}`, `{validity}`, `{signature}` — M
  - [ ] WhatsApp: plain text, one line per product, `*bold*` — S
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
- [ ] `@nestjs/throttler` on auth endpoints (Redis-backed once multi-instance) — S
- [x] CORS from `FRONTEND_URL` env, not hardcoded — S
- [ ] Helmet security headers — S
- [ ] Secrets only in Railway env; `.env.example` current; rotate anything ever committed; root `.gitignore` check — S
- [ ] **Audit log** for premium, product, settings and role changes (who, what, old → new, when) + admin UI — M *(started: edits made in the admin Database tab are logged with the admin's email in Redis, capped at 500 and without old → new values. Product, premium and role changes through the normal screens are not logged yet)*
- [ ] Per-user admin trail (no blanket admin flag) — part of the audit log
- [ ] Supabase RLS reviewed — S
- [ ] Google Drive permission cleanup: ID scans and customer data out of shared folders — S
- [ ] Dependency audit (`pnpm audit`, Renovate/Dependabot) — S

## 0.7 Reliability and scalability baseline 🟠

- [ ] Move the 10-min price fetch to a BullMQ repeatable job — M
- [ ] SSE fan-out through Redis pub/sub — M
- [ ] Remove shared in-memory state (multi-instance safe) — M
- [x] Pino structured logging + request IDs; log cache hit/miss, DB fallback, external call + duration — S *(`nestjs-pino`: JSON in production, request lines with duration, secrets redacted, an in-memory tail in the admin Logs tab. Request IDs are generated but not yet written to the log line)*
- [ ] Sentry on API and web; breadcrumbs on the pricing cascade — S
- [x] `/health` (`@nestjs/terminus`): DB, Redis, MetalsAPI, last successful fetch — S *(public `/health` for uptime monitors; the admin Overview runs the same checks through Terminus, plus memory and event-loop lag)*
- [ ] Railway metrics + crash/restart/uptime alerts — S
- [ ] Prisma migration workflow (no manual DB changes) — S
- [ ] Database backup + **tested** restore — S
- [ ] Staging environment on Railway — M
- [ ] Redis deployment for production (local `127.0.0.1` will not work on Railway) — S

## 0.8 Multi-branch data model 🟠

- [ ] `Branch` table: address, phone, opening hours — S
- [ ] `branchId` + `currency` on products, prices, orders — M
- [ ] VAT rules table (per country and metal) instead of hardcoded logic — M
- [ ] Spot per currency (EUR, GBP) — M
- [ ] RBAC per role **and** branch — M

## 0.9 Health and monitoring panel (admin) 🟡

Four sections, ordered by "is the app lying to me right now?". Builds on the 0.3 status panel. Backing tables: `FetchLog` and `HealthCheck`.

- [x] `FetchLog` (timestamp, trigger, metal, source, status, durationMs, httpStatus, error, priceReturned) — M *(built as `FetchAttempt`: trigger, duration, success, error, metals resolved; one row per vendor call)*
- [ ] `HealthCheck` (timestamp, dependency, ok, latencyMs, detail) — S
- [ ] **Live status:** per-metal age/source/dot, next-fetch countdown, pause state, SSE state + reconnect count, overall banner (good / degraded / failed) — M
- [ ] **Dependency health:** Postgres latency + pool use, Redis latency/hit ratio/TTLs, MetalsAPI latency + status, **quota used vs plan + projected monthly**, process uptime + commit SHA + env — M
- [ ] **Fetch history table:** last 50–100 attempts, filter by metal/outcome, expandable failure snippet, per-row retry, CSV export, summary (success rate 24h/7d, avg + p95 latency, longest gap) — M
- [ ] **Data sanity:** sudden-move flag (optionally reject), gold/silver ratio band, zero/null/stale-timestamp rejection, **currency check (EUR not USD)**, market-open-aware staleness — M
- [ ] Config snapshot (read-only, key masked) and actions row (force refresh, clear Redis, run health check, download diagnostics JSON) — S
- [ ] Usage analytics: most-viewed metals, most-copied products, copy-format usage, active sessions (management pitch evidence) — M
- [x] Metrics widget: fetch success rate 24h, avg latency, cache hit ratio — S

## 0.10 Testing, CI and docs 🟠

- [ ] Vitest: pricing utils (see 0.2), repository cascade (Redis → Prisma → API), ported tools — M
- [ ] Frontend component tests with MSW — M
- [ ] One e2e smoke test (load → select → copy) — M
- [ ] CI (GitHub Actions + Turborepo): lint, typecheck, test on PR — S
- [ ] Strict TypeScript and consistent ESLint/Prettier — S
- [ ] README (what / setup / scripts / env vars) — S
- [ ] Architecture doc (module map, data flow, pricing formulas, SSE flow) — M
- [ ] Swagger complete + grouped — S
- [ ] ADRs (SSE over WS, no response envelope, runtime-derived prices, BC as source of truth) — S
- [ ] Desk user guide with screenshots — M
- [ ] CHANGELOG + semver tags — S
- [ ] Management one-pager (time saved per quote, error reduction, fetch success rate) — M

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
- [ ] Bulk product importer — M
- [ ] Role tiers enforced in UI (sales can log quotes but not edit premiums) — S

## 1.3 Historic spot and market analytics 🟠 *(quick win; feeds charts, AI, customer site)*

- [ ] `SpotPriceDaily` (metalId, date, open/high/low/close, currency), index `(metalId, date)` — S
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
- [ ] Chat panel with clickable citations; thumbs up/down — M
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

## 1.8 Hedge control 🟠 ← depends: 1.0 `[BC]`

- [ ] `Order` (lockedSpotPrice, lockedAt, metalId, weightGrams, premiumRate, hedgedAt, expectedDelivery, status PAID → HEDGED → COLLECTED) + migration — M
- [ ] Exposure dashboard `(currentSpot − lockedSpot) × weightOz`, live over SSE — M
- [ ] Daily reconciliation: paid orders in BC vs hedges placed; alert on unhedged paid orders — M
- [ ] Supplier cost comparison (API or manual) — S
- [ ] End-of-day exposure report — S

## 1.9 Audit and reconciliation hub 🟠 ← depends: 1.0 `[BC]`, 0.6 audit log

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

## 1.18 Multi-branch rollout 🟠

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

- [ ] More than one Railway replica → Redis pub/sub for SSE, BullMQ for jobs, Redis-backed throttler
- [ ] Other branches onboard → RBAC per role and branch, audit log review
- [ ] AI features live → per-user quotas, cost monitoring
- [ ] Anything customer-facing → real rate limiting, public response caching, CDN, separate endpoints from internal tools
- [ ] Nearing external API quota → longer TTL, stale-while-revalidate, higher plan
- [ ] p95 latency > ~500 ms or high DB CPU → profile queries → indexes → Redis caching → more instances
- [ ] Notifications/PDF/jobs starving API threads → extract worker / notification / document service

# Suggested sequencing (what to do next)

1. **Now (Phase 0 quick wins):** Vitest for pricing math (0.2) → `decimal.js` migration → table polish (0.4) → multi-format copy (0.5) → audit log + route-guard pass (0.6) → Sentry/Pino/`/health` (0.7).
2. **In parallel, non-code:** start every 1.0 prerequisite conversation (BC read access, GDPR sign-off, bank, hedge APIs) — they gate most of Phase 1 and all of Phase 2.
3. **Then:** historic spot (1.3) → desk tools + price-lock log (1.1) → inquiry hub (1.6) → funds-landed + hedge control (1.7/1.8) → audit hub (1.9).
4. **Branch rollout (1.18)** once SSO, multi-branch model and audit log are live.
5. **Phase 2** only after 2.0 is closed; launch read-only (2.1) before accounts, assisted checkout, then automation.

# Icebox — ideas captured, unscheduled

Mapped to where they would land if promoted: multi-store support (0.8) · advanced inventory intelligence (1.12) · smart price simulator (1.16) · customer loyalty (2.9) · scrap gold module (2.9) · demand forecasting (2.10) · business KPI dashboard (1.16) · export API for accounting (2.14) · bulk importer (1.2) · public price widget (2.1) · dynamic pricing (2.10) · price freeze / price lock (1.1) · market event indicator (1.3) · metal correlation (1.3) · customer demand indicator (1.6).
