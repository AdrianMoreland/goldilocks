# Goldilocks charts plan and handoff

22 Nov 2026 · Adrian Moreland · Live doc: https://claude.ai/artifact/JrDtrcHPSCxaWwSVQLFuWZ

## Plan: which charts stay

Every chart on main today (c2ab593, 22 Nov) is sorted into one of three groups below, and six new charts join category 1. Several existing charts merge into one toggled chart instead of being cut. Charts are listed by where they will live after the move, not where they sit today.

### 1 · Definitely in the app

| Chart | Type | Lives in | What changes |
| --- | --- | --- | --- |
| Spot price history | Area chart; Selected metal in €/oz, or All Metals as % change | Pricing dashboard | Add a **1D** range built from the ~5-minute points in metal_spot_prices. Keep the hide/show toggle (the existing chart-visible preference). |
| Metal card sparklines (new on Pricing) | 30-day sparkline, same as the Price board's | Pricing dashboard metal cards | Shown **only while the big chart is hidden**: the toggle swaps big chart ↔ card sparklines. Reuse sparkPath from board-model.ts. |
| Daily spot move (new, from v10) | Diverging calendar heatmap: rise vs fall, darker = bigger move | Analytics | Metal picker. Periods: Current month, Year to date, Last 12 months. Built from the daily closes. |
| Money by month (new, merges 3) | Columns, one measure at a time via a toggle: Profit (stacked by metal), Invoiced, Receipts, Costs | Analytics | **Branch filter** (replaces Gross profit by branch). Timeframe toggle: By month, or By day for the current month. Replaces Gross profit by month and Invoiced by month. |
| Money flow (new) | Sankey | Analytics | Money in (customer payments) flowing to costs, VAT, profit and the rest. Nodes still to define (open question). |
| Profit / Invoiced per day (merges 2) | Calendar heatmap with a Profit ↔ Invoiced toggle | Analytics | One card instead of two. |
| Trades by state | Donut (type may change, see candidates) | Analytics | None yet. |
| Orders by status (Customer order items by status) | Ranked bars | Analytics | None. |
| What the stock is made of | Treemap | Analytics | None. |
| Goods held for customers, by age (new) | Bars by age: 0–7, 8–30, 31–90, 90+ days | Analytics | Paid, not collected: Trade.collected / collectedOn and CustomerOrderItem. |
| Quote to invoice (new) | Line, % of quotes converted per month | Analytics | Quote.status and convertedTradeId. |
| Revenue by product (from v10) | Treemap ↔ list toggle | Analytics | Clicking a tile shows that product's list figures (trades, qty, receipts, margin). Replaces the Top products table. |
| Questions per day | Columns | Assistant · Usage | Periods: Current month, Year to date, Custom. |
| Outcome | Donut | Assistant · Usage | None. |
| What it is used for + Answer time by use | Ranked bars, two side by side in one card | Assistant · Usage | One card instead of two. |
| When people ask | Weekday × hour heatmap | Assistant · Usage | None. |
| Helpful? | Big number | Assistant · Usage | None. |
| Recent questions | List (not a chart) | Assistant · Usage | None. |
| Token usage (new) | Stacked columns per day: input, cached input, output tokens; cost as a KPI | Assistant · Usage | From AiQuestionLog: inputTokens, cachedInputTokens, outputTokens, costMicros. |
| Failed price-feed fetches (merges 2) | Heatmap with two modes: weekday × hour (last several weeks, as now) and per day (calendar, last 12 months) | Admin · Ops | The per-day mode replaces the Failed fetches per day columns. |
| Imports by kind | Ranked bars, with the Recent imports list | Admin · Ops | None. |
| API requests, last 24 hours | Stacked columns (ok, client errors, server errors) | Admin overview | As is. |
| Sign-ins, last 24 hours | Stacked columns | Admin overview | As is. |
| Database storage | Ranked bars | Admin overview | As is (plus the Busiest endpoints table). |

Not discussed, assumed kept as they are: Price board sparklines, Orders step dots, Stocktake progress ring, the go/no-go ring on Rules, the Project hub diagrams.

### 2 · Candidates (decide later)

| Chart | Type now | Lives in now | Note |
| --- | --- | --- | --- |
| Spot with period average | Line | Analytics · Pricing | Overlaps the dashboard chart; worth keeping only for the average line. |
| Average price premium over time | Multi-line | Analytics · Pricing | The only view of premium drift. |
| Product premiums (top 12) | Ranked bars | Analytics · Pricing | Could become each premium as a dot on its 90-day range. |
| Margin by month | Line | Analytics · Sales | Could become a fifth measure in Money by month. |
| Pieces by branch | Grouped columns | Analytics · Inventory | |
| Stock movements per day | Columns, in and out side by side | Analytics · Inventory | Diverging bars would show the net better. |
| Where open orders are waiting | Badge chips | Analytics · Orders | Not a chart; could move to the Orders page. |
| Average time per step | Ranked bars | Analytics · Orders | |
| Top customers | Ranked bars | Analytics · Customers | |
| Invoice status | Donut | Analytics · Customers | Could be replaced by Overdue invoices by age. |
| When trades are written | Weekday × hour heatmap | Analytics · Sales | Only useful for rotas. |
| Trades by state, as a 100% bar | (type change) | Analytics | Keep the chart, change the shape. |
| Open unhedged position by metal (new) | Bullet bar per metal | — | Needs the hedging rule confirmed. |
| Stock cover (new) | Bullet bar per stock row | — | Pieces against the low mark, plus days left. |
| Overdue invoices by age (new) | Bars by age bucket | — | Would replace Invoice status. |

### 3 · Unnecessary

| Chart | Type | Lives in now | Why |
| --- | --- | --- | --- |
| How orders move between steps | Flow (StepFlow) | Analytics · Orders | Every order follows the same path, so it draws a straight band. |
| Change over the period | Slope chart | Analytics · Pricing | The KPI row and All Metals % mode already show it. |
| Template dashboard: revenue breakdown, sales chart, customer insights, top products | Recharts, made-up data | /dashboard-2 | Starter-kit leftover, still routed. Delete the route and folder (and the /chat template page). |

Replaced by merged charts in category 1: Gross profit by month, Gross profit by branch, Invoiced by month (→ Money by month), Profit per day and Invoiced per day (→ one toggled calendar), Failed fetches per day (→ feed failures heatmap, per-day mode), Top products table (→ Revenue by product list).

## Where things move

Three pages change: a new Assistant page, an Ops tab in Admin, and Analytics shrinks from seven tabs to three.

| Page | Today | After |
| --- | --- | --- |
| Pricing dashboard | Big spot chart, hideable | Big chart (with 1D) **or** a sparkline in each metal card, one toggle |
| Assistant (new, /assistant) | The assistant lives in a dock, the pricing tools panel and the Knowledge panel; /chat is a template with fake data | Two tabs: **Chat**, a full AI conversation page as in v10 (Procedures, Email reply, WhatsApp reply; citations; live price lookups), and **Usage**, the chatbot charts (admin only, permission analytics.chatbot) |
| Admin | Overview: requests, sign-ins, storage, busiest endpoints | Overview as is, plus an **Ops** tab: feed-failure heatmap (two modes), imports by kind, recent imports |
| Analytics | 7 tabs: Pricing, Sales & margin, Orders, Inventory, Customers & invoices, Chatbot, Ops | 3 tabs (names to confirm): **Market** (daily spot move, plus pricing candidates), **Money** (money by month, money flow, profit/invoiced calendar, revenue by product, quote to invoice), **Stock & orders** (trades by state, orders by status, goods held by age, stock make-up) |

The docks stay for quick questions; the Assistant page is where longer conversations and the usage figures live. Candidate charts stay in their current Analytics tab until decided, regrouped into the three new tabs.

## Handoff

Next session builds the **Goldilocks Redesign Final** artifact: a faithful copy of today's deployed UI, then changed step by step to this plan until Adrian approves it for implementation. Nothing is coded in the repo until then.

### How we work

1. Build Redesign Final as a pixel-perfect, fully navigable replica of the whole deployed app, with real data (pages below).
2. Grill session: settle every open question and candidate with Adrian, then write the change plan against the replica (this doc's plan, turned into tasks per page).
3. Edit the artifact until Adrian is happy, then implement in the repo.

### Requirements for Redesign Final

- **Pages in scope:** every page in the deployed sidebar and its tabs, sheets and dialogs (Pricing with tools panel and metal cards, Price board, Inventory, Orders, Customer orders, Stocktake, Import, Customers, Invoices, SOP, Analytics with all 7 tabs, Rules, Admin, Project, Settings), fully navigable, plus an empty slot for the new Assistant page.
- **Exact look:** same Sonar tokens, sidebar, header, cards, charts and spacing as main at c2ab593. Read the real components rather than guessing; compare against screenshots of the live app where possible.
- **Charts drawn as the app draws them:** Recharts area chart on Pricing; the hand-made SVG kit in apps/web/src/app/analytics/components/charts.tsx (TimeLine, Columns, RankedBars, Donut, Slope, TreeMap, WeekHourHeatmap, CalendarHeatmap, StepFlow); Recharts bars on Admin.
- **Works on Adrian's iPhone:** one self-contained HTML file. Separate files loaded in iframes do not load in the iOS app (learned in the Master Redesign).
- **Data:** real data read from the database where the session can (Supabase MCP, read-only): the full product catalogue with premiums and discounts, branches, stock, spot prices and spot history, trades, orders and invoice figures. Customer and staff names and contact details are swapped for made-up ones. Where the database cannot be reached, use the repo's seed and import fixtures, and say so.
- **Light and dark**, phone, iPad and desktop widths.
- **Toggle to show Before / After** per page once changes start, so each change can be compared.

### Artifacts to use

| Artifact | Use it for |
| --- | --- |
| [Goldilocks Chart Review](https://claude.ai/artifact/BFLL4exDciM9hThNf9xkxA) | The ranked chart audit behind this plan, with alternatives per chart |
| [Goldilocks v10](https://claude.ai/artifact/E6mr5PHnnqWVNsb9y3vR29) | The Assistant page design, the daily spot move calendar (moveCalendar), Revenue by product treemap, Sankey (sankey) |
| [Goldilocks Build Scope](https://claude.ai/artifact/3AFRZNdCJJk1HaQGT2N62v) | Admin (People, Roles & permissions) and Settings as built in #180 |
| [Goldilocks Master Redesign](https://claude.ai/artifact/MWTbSf13WTy81L13jJs18o) | Browse every recent design per screen; do not edit |
| [Goldilocks Redesigns](https://claude.ai/artifact/PxF9eX6wGH5Y6Qx9fvojCd) | Sparkline-in-card and folded-chart patterns (Dashboard A and B) |
| [Goldilocks Design Roast](https://claude.ai/artifact/WrFiGkVbinBAsSh3E8gyci) | Known UI problems per page |
| [Merrion Gold Sonar](https://claude.ai/artifact/LVbPgnodho9Ga4YkhdFYwa) | The Sonar design system |

### Code to read (AdrianMoreland/goldilocks, main c2ab593)

- Pricing chart: apps/web/src/app/dashboard/components/chart-area-interactive.tsx; page layout and chart toggle: apps/web/src/app/dashboard/page.tsx; metal cards: dashboard/components/section-cards.tsx
- Sparklines: apps/web/src/app/board/board-model.ts (sparkPath) and board/page.tsx
- Analytics: apps/web/src/app/analytics/page.tsx, tabs/*.tsx, components/charts.tsx, components/kit.tsx, components/colors.ts; API: apps/api/src/modules/analytics/
- Admin charts: apps/web/src/app/admin/components/overview/traffic-panels.tsx
- Assistant today: apps/web/src/contexts/docks-context.tsx, app/knowledge/components/assistant-panel.tsx, dashboard/components/pricing-tools/pricing-tools-panel.tsx, api/ai.api.ts
- Navigation and routes: apps/web/src/config/nav.ts, config/routes.tsx (dashboard-2 and chat are template routes)
- Data: apps/api/prisma/schema.prisma — MetalSpotPrice (intraday), HistoricSpotPrice, Trade (profit, receipt, cost, vatDue, netHedging, state, collected), Quote, ZohoInvoice, ZohoPayment, CustomerOrderItem, LiveStockMovement, FetchAttempt, AiQuestionLog (tokens, costMicros), AiFeedback

### Open questions

- **Receipts:** the tradesheet's receipt column, or Zoho payments received? They differ in timing.
- **Money flow nodes:** which flows? Suggested: customer payments → cost of metal, VAT due, gross profit; profit → by metal or branch. Hedging in or out?
- **Analytics tab names and permissions:** Market / Money / Stock & orders, and which existing permission keys open each merged tab.
- **Goods held by age:** count from the trade date or from the payment date?
- **Assistant Usage tab:** admins only, or managers too?
- **Chart toggle default** on Pricing for new users: chart or sparklines?

Next-session prompt: [CHARTS-NEXT-SESSION-PROMPT.md](CHARTS-NEXT-SESSION-PROMPT.md)
