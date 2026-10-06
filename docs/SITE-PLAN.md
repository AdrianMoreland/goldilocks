# Public site plan (roadmap 2.1)

Replaces merriongold.ie (WordPress). Decisions are recorded in `docs/adr/0002-public-site-is-a-prerendered-app-with-shared-ui-package.md`; scope is roadmap section 2.1. Effort tags follow the roadmap (S/M/L).

## Decisions

| Topic | Decision |
|---|---|
| Location | New app `apps/site`; new package `packages/ui`; reuses `packages/shared-types`. Backend stays `apps/api` (NestJS). |
| Frontend | React Router v7 framework mode on Vite, prerendered at build. shadcn + Tailwind v4. |
| Prices | Fetched client-side from a public cached price API, polled with TanStack Query. |
| Content | In the repo: MDX for pages and blog, structured files (one per SKU) for product copy, behind a small content loader so a database can replace it later. |
| Languages | English at launch; all strings and routes i18n-ready; Spanish after launch. |
| Brand | Direction A, Heritage Vault (ivory, black and gold, Playfair Display headings, Inter body), chosen 2026-10-06. Token set and layout: `design/proposals/site-theme-directions.md`, `design/specs/store-a.json`. |
| Design | Figma for key templates only; other pages built in code from those patterns. |
| Launch | Staging subdomain, redirect map, one DNS switch, WordPress kept read-only for a few weeks. |
| Store | `/buy` is one store page: whole catalogue, live prices, filters (metal, type, weight, price, mint, availability, branch), sort (including price per gram), quantity input and Add to cart. Category URLs are filter presets of the same page. Product pages keep `/products/{slug}/`. |
| Checkout | Assisted, not automated (ADR 0003): the cart submits an **order request** (guest details, collection branch). A colleague reviews it in a staff Orders queue and emails a confirmed quote; the price locks when funds are received. Branch collection only. |
| Scope | All of 2.1 plus the assisted part of 2.4. Accounts, KYC, automated payment and hedging stay gated (2.2, 2.5, 2.6). |

## Site map

Full map, page specifications and open items: `docs/site-migration/sitemap.md`. Audit of the old site: `docs/site-migration/current-site-audit.md`.

Old-site summary:

Home, Locations (Cork, Blanchardstown, Burlington Road), Buy (gold, silver, platinum and palladium, copper) with product pages, Sell, Store (safe deposit, Merrion Vaults), VAT-free silver, Live price chart, Calculators, FAQ, Newsroom (top posts), About, Contact, Trust, legal pages.

## Phase A: Foundations (about 3 days)

1. Branch `feature/site-foundations` off `master`.
2. Create `packages/ui`: shadcn primitives only (button, card, dialog, tabs, accordion, input, badge, table, sheet, navigation-menu), token-driven, no app theme inside. Tailwind v4 needs an `@source` line in each app pointing at the package.
3. Point `apps/web` at `packages/ui` for the moved primitives; run `pnpm --filter web build` and `check-types` to prove nothing changed.
4. Scaffold `apps/site` (React Router v7 framework mode, prerender on). Add `components.json` with aliases to `packages/ui`.
5. Add `apps/site` to the Turbo pipeline; `pnpm dev` starts it on its own port.
6. Add `apps/site` and `packages/ui` to the roadmap 2.0 line "Monorepo split agreed" and tick it.

## Phase B: Content inventory and design (about 1 to 2 weeks, runs beside A)

1. Crawl merriongold.ie: list every URL with its traffic if available (Search Console). Output: a sheet of URL, keep/merge/drop, new path.
2. Pick top blog posts to port (by traffic and backlinks); archive the rest.
3. Rewrite copy: take company text from the old site, tighten it, put it in `apps/site/content/`.
4. Figma file, in order:
   1. Moodboards: 2 or 3 directions (colour, type, imagery, density). Pick one.
   2. Foundations: colour variables, type scale, spacing, radius, light/dark if wanted. Mirror them as CSS variables.
   3. Components: install a shadcn Figma kit; adapt it to the chosen direction. Name components as in `packages/ui`.
   4. Key templates, desktop and mobile: home, product page, price/calculator page, content page, locations page.
   5. Review with the owners; freeze.
5. Connect Figma to code: map components with Code Connect, then pull each template into code with the design-context tools.

## Phase C: Public API and order requests (about 2 to 3 weeks, before live prices and the store ship)

**C1. Public price and catalogue API**

1. New controller surface in `apps/api` under `/public/*`, marked public, separate from staff routes.
2. Endpoints: spot prices, the priced catalogue (sell price, price per gram, buyback value, availability, staleness and market mode), historic chart points. Read through `MarketDataService`, never the providers directly.
3. The catalogue endpoint returns every product in one response (about 54 rows); filtering, sorting and the price range are done in the browser so switching is instant.
4. Response schemas in `shared-types`; the site validates every response with them.
5. Cache with the existing cache-aside pattern; add `Cache-Control` headers so a CDN can absorb traffic.
6. Rate limit by client IP; CORS allows the site origin only.
7. Return only public fields: no staff margins, spreads or tool settings.
8. Jest specs for schema shape, rate limit and "no internal fields leak".

**C2. Order requests**

1. Prisma models: `OrderRequest` (customer name, email, phone, collection branch, note, status, price-lock timestamp, spot-move threshold at submit) and `OrderRequestItem` (product, quantity, indicative unit price snapshot as `Decimal`, spot and premium snapshot). Statuses: new, in review, quote sent, funds received, ready, collected, cancelled, expired.
2. Public `POST /public/order-requests`: validate with a shared Zod schema; recompute every price on the server (never trust the cart's prices); reject unknown products, quantities over the limit, a stale spot (per the open item); bot protection plus a stricter rate limit.
3. Email through a port (interface plus DI token, like auth): acknowledgement to the customer, alert to the desk. The provider is chosen later (open item).
4. Staff endpoints (admin and sales roles): list, view with items repriced live, change status, flag requests whose total moved beyond the threshold, send the confirmed quote from a template.
5. Audit every status change (who, what, old and new, when).
6. Manager setting for the spot-move threshold.
7. Jest specs: server-side repricing, quantity limits, status transitions, role access, a request with a tampered price.

**C3. Staff Orders queue** (in `apps/web`, inside the existing dashboard, following its design rules)

1. List with filters by status and branch; detail view with items, live reprice, difference since submit, customer details.
2. Actions: mark in review, send confirmed quote (email preview first), mark funds received (this sets the price lock), ready, collected, cancel.
3. Visible flag when the spot has moved beyond the threshold; a one-click copy of the customer's number for the repricing call.
4. Desk alert counter on the dashboard.

Both C1 and C2 need the owners' confirmation of the open items in `sitemap.md` section 10.

## Phase D: Build the site (about 5 to 6 weeks)

1. Shell: header with live ticker and cart, footer, cookie banner, 404.
2. Content pages from MDX (about, VAT-free silver, FAQ, trust, legal, contact, how to buy).
3. **Store (`/buy`)**: filter panel and sheet, sort, card and table views, quantity input and Add to cart, product side panel, preset URLs, prerendered list, stale-price and closed-market states.
4. **Product pages** at `/products/{slug}/`: breakdown, volume tiers, availability, buyback value, Add to cart.
5. **Cart** (kept in the browser, prices refreshed, "not locked until funds are received" banner), **Checkout** (details, branch, consent, bot protection) and the Sent page.
6. Price pages and charts (reuse chart code via `packages/ui`).
7. Customer calculators: buy by budget, CGT and VAT, converters. Move the pure math into `shared-types` if it is not there yet; never copy it.
8. SEO: per-route metadata, canonical URLs, sitemap, robots, structured data (organisation, local business per branch, product with offer, FAQ).
9. i18n scaffolding: string keys and a locale segment, English only filled in.
10. Accessibility pass (keyboard, contrast, labels, quantity input and filters by keyboard) and Lighthouse budget.
11. Product data: one structured file per SKU generated from the catalogue, then hand-edited copy and images.
12. Branches section including the UK and Spain pages once the owners supply details.
13. Tests: web tests for the cart and checkout (the web app has none yet), plus an end-to-end run on staging: add three of an item, place a request, see it in the queue, send the quote.

## Phase E: Launch (about 1 week)

1. Deploy a second static service on Railway, staging subdomain; put a CDN in front.
2. Redirect map from the crawl: every old URL gets a 301 to its new page or a sensible parent.
3. Test: redirect list, sitemap, link previews, mobile, price outage behaviour, rate limit, and a real order request end to end (customer email, desk alert, queue, confirmed quote email, funds received).
4. Soft review with staff and owners on staging.
5. Lower DNS TTL a day ahead; switch DNS; keep WordPress read-only.
6. Submit sitemap in Search Console; watch errors and rankings for 4 weeks.
7. Retire WordPress; tick roadmap 2.1 items as they finish.

## Order and gates

- A before D. B runs beside A. C1 must finish before any live price goes out; C2 and C3 before the cart goes out.
- Legal: the terms must carry the "prices not locked until funds are received" clause before the store launches.
- Not in scope until the 2.0 gate closes: accounts, KYC, automated payment, hedging, writing quotes to Business Central.

## Open items

The order, branch and stock questions are in `docs/site-migration/sitemap.md` section 10 and the audit's section 7.4. Plan-level ones:

- Which Figma kit and library to start from.
- Whether Search Console data is available for the redirect map.
- Email provider and the sending domain (SPF, DKIM) for order emails.
- When Spanish starts after launch.

Rough total: 10 to 12 weeks with one developer (A 3 days, B 1 to 2 weeks beside A, C 2 to 3 weeks, D 5 to 6 weeks, E 1 week), assuming the owners answer the open items before C2 starts.
