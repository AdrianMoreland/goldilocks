"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
exports.dublinToday = dublinToday;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../infrastructure/redis/redis.service");
const analytics_shape_1 = require("./analytics.shape");
const CACHE_TTL_SECONDS = 300;
const TZ = 'Europe/Dublin';
const METALS = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];
const FIRST_REAL_TRADE_DATE = '2000-01-01';
function dublinToday(now = new Date()) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(now);
}
const num = (v) => v === null || v === undefined ? null : Number(v);
function kpi(key, label, unit, value, previous, hint) {
    return {
        key,
        label,
        unit,
        value: num(value),
        previous: num(previous),
        ...(hint ? { hint } : {}),
    };
}
let AnalyticsService = class AnalyticsService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async cached(tab, preset, build) {
        const today = dublinToday();
        const key = `analytics:${tab}:${preset}:${today}`;
        const hit = await this.redis.get(key);
        if (hit)
            return hit;
        const result = await build((0, shared_types_1.resolveAnalyticsPeriod)(preset, today));
        await this.redis.set(key, result, CACHE_TTL_SECONDS);
        return result;
    }
    pricing(preset) {
        return this.cached('pricing', preset, async (period) => {
            const { current, previous } = period;
            const [closes, products, history, mode, prevCloses] = await Promise.all([
                this.prisma.$queryRaw `
                    SELECT ("recordedAt" AT TIME ZONE ${TZ})::date AS day, "metalType"::text AS metal,
                           ((array_agg("priceEur" ORDER BY "recordedAt" DESC))[1])::float8 AS close
                    FROM historic_spot_prices
                    WHERE ("recordedAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1, 2 ORDER BY 1`,
                this.prisma.product.findMany({
                    where: { isActive: true, deletedAt: null },
                    select: {
                        id: true,
                        name: true,
                        metalType: true,
                        category: true,
                        spreadSell: true,
                        spreadBuy: true,
                    },
                    orderBy: { name: 'asc' },
                }),
                this.prisma.$queryRaw `
                    SELECT day, "metalType"::text AS metal, avg("spreadSell")::float8 AS premium,
                           (SELECT min(day) FROM product_price_snapshots) AS first
                    FROM product_price_snapshots
                    WHERE day BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1, 2 ORDER BY 1`,
                this.prisma.marketModeState.findUnique({
                    where: { id: 1 },
                }),
                this.prisma.$queryRaw `
                    SELECT DISTINCT ON ("metalType") "metalType"::text AS metal, "priceEur"::float8 AS close
                    FROM historic_spot_prices
                    WHERE ("recordedAt" AT TIME ZONE ${TZ})::date <= ${previous.to}::date
                    ORDER BY "metalType", "recordedAt" DESC`,
            ]);
            const days = [
                ...new Set(closes.map((c) => c.day.toISOString().slice(0, 10))),
            ];
            const spot = days.map((day) => {
                const row = {
                    day,
                    GOLD: null,
                    SILVER: null,
                    PLATINUM: null,
                    PALLADIUM: null,
                };
                for (const c of closes)
                    if (c.day.toISOString().slice(0, 10) === day)
                        row[c.metal] = c.close;
                return row;
            });
            const change = METALS.flatMap((metal) => {
                const series = closes.filter((c) => c.metal === metal);
                if (series.length < 2)
                    return [];
                return [
                    {
                        metal,
                        start: series[0].close,
                        end: series[series.length - 1].close,
                    },
                ];
            });
            const notes = [];
            if (history.length === 0) {
                notes.push({
                    chart: 'premiumHistory',
                    text: 'Needs backend: premium history starts with the first daily price snapshot.',
                });
            }
            return {
                period,
                kpis: METALS.map((metal) => kpi(`spot.${metal}`, `${metal[0]}${metal.slice(1).toLowerCase()} €/oz`, 'eur', closes.filter((c) => c.metal === metal).at(-1)?.close ??
                    null, prevCloses.find((c) => c.metal === metal)?.close ??
                    null)),
                notes,
                spot,
                change,
                premiums: products.map((p) => ({
                    productId: p.id,
                    name: p.name,
                    metal: p.metalType,
                    category: p.category,
                    premium: Number(p.spreadSell),
                    buyback: Number(p.spreadBuy),
                })),
                premiumHistory: history.map((h) => ({
                    day: h.day.toISOString().slice(0, 10),
                    metal: h.metal,
                    premium: h.premium,
                })),
                snapshotSince: history[0]?.first
                    ? history[0].first.toISOString().slice(0, 10)
                    : null,
                marketMode: {
                    weekend: mode?.weekend ?? false,
                    volatile: mode?.volatile ?? false,
                    shortage: mode?.shortage ?? false,
                    updatedBy: mode?.updatedBy ?? null,
                    updatedAt: mode?.updatedAt.toISOString() ?? null,
                },
            };
        });
    }
    sales(preset) {
        return this.cached('sales', preset, async (period) => {
            const { current, previous } = period;
            const totals = (from, to) => this.prisma.$queryRaw `
                SELECT sum(profit)::float8 AS profit,
                       (sum(profit) FILTER (WHERE receipt > 0) / nullif(sum(receipt) FILTER (WHERE receipt > 0), 0))::float8 AS margin,
                       count(*)::int AS trades
                FROM trades WHERE state = 'INVOICED' AND date BETWEEN ${from}::date AND ${to}::date`;
            const [[cur], [prev], byMonth, byBranch, byDay, topProducts, hours, typos,] = await Promise.all([
                totals(current.from, current.to),
                totals(previous.from, previous.to),
                this.prisma.$queryRaw `
                    SELECT to_char(date, 'YYYY-MM') AS month,
                           coalesce(sum(profit) FILTER (WHERE metal = 'GOLD'), 0)::float8 AS "goldProfit",
                           coalesce(sum(profit) FILTER (WHERE metal = 'SILVER'), 0)::float8 AS "silverProfit",
                           (sum(profit) FILTER (WHERE receipt > 0) / nullif(sum(receipt) FILTER (WHERE receipt > 0), 0))::float8 AS margin,
                           count(*)::int AS trades
                    FROM trades WHERE state = 'INVOICED' AND date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT coalesce(b.name, sb.name, t."branchCode", 'No branch') AS label, coalesce(sum(t.profit), 0)::float8 AS value
                    FROM trades t LEFT JOIN branches b ON b.id = t."branchId"
                        LEFT JOIN live_stock_branches sb ON sb.code = t."branchCode"
                    WHERE t.state = 'INVOICED' AND t.date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT date AS day, coalesce(sum(profit), 0)::float8 AS value
                    FROM trades WHERE state = 'INVOICED' AND date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT coalesce(p.name, t."productText") AS product, count(*)::int AS trades,
                           coalesce(sum(t.qty), 0)::int AS qty, coalesce(sum(t.receipt), 0)::float8 AS revenue,
                           (sum(t.profit) FILTER (WHERE t.receipt > 0) / nullif(sum(t.receipt) FILTER (WHERE t.receipt > 0), 0))::float8 AS margin
                    FROM trades t LEFT JOIN products p ON p.id = t."productId"
                    WHERE t.state = 'INVOICED' AND t.date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY revenue DESC LIMIT 10`,
                this.prisma.$queryRaw `
                    SELECT extract(dow FROM "createdAt" AT TIME ZONE ${TZ})::int AS dow,
                           extract(hour FROM "createdAt" AT TIME ZONE ${TZ})::int AS hour, count(*)::int AS n
                    FROM trades WHERE date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1, 2`,
                this.prisma.$queryRaw `
                    SELECT count(*) FILTER (WHERE date < ${FIRST_REAL_TRADE_DATE}::date)::int AS n,
                           count(*) FILTER (WHERE state = 'INVOICED' AND "productId" IS NULL
                               AND date BETWEEN ${current.from}::date AND ${current.to}::date)::int AS unmatched
                    FROM trades`,
            ]);
            const notes = [];
            if (typos[0]?.n) {
                notes.push({
                    chart: 'byMonth',
                    text: `${typos[0].n} trade(s) on the tradesheet have an impossible date (before 2000), so they never appear in any period.`,
                });
            }
            if (typos[0]?.unmatched) {
                notes.push({
                    chart: 'topProducts',
                    text: `${typos[0].unmatched} invoiced trade(s) are not matched to a product yet and appear under the name typed on the sheet.`,
                });
            }
            if (byMonth.some((m) => m.month >= '2026-02' &&
                m.month <= '2026-06' &&
                m.silverProfit === 0)) {
                notes.push({
                    chart: 'byMonth',
                    text: 'Silver rows are missing from the tradesheet for February to June 2026.',
                });
            }
            return {
                period,
                kpis: [
                    kpi('profit', 'Gross profit', 'eur', cur?.profit, prev?.profit),
                    kpi('margin', 'Margin', 'pct', cur?.margin, prev?.margin, 'profit ÷ receipts, invoiced trades'),
                    kpi('trades', 'Invoiced trades', 'count', cur?.trades, prev?.trades),
                    kpi('perTrade', 'Profit per trade', 'eur', cur?.trades ? (cur.profit ?? 0) / cur.trades : null, prev?.trades ? (prev.profit ?? 0) / prev.trades : null),
                ],
                notes,
                byMonth,
                byBranch,
                byDay: byDay.map((d) => ({
                    day: d.day.toISOString().slice(0, 10),
                    value: d.value,
                })),
                topProducts,
                tradeHours: (0, analytics_shape_1.fillHeat)(hours),
            };
        });
    }
    orders(preset) {
        return this.cached('orders', preset, async (period) => {
            const { current, previous } = period;
            const quoteRate = (from, to) => this.prisma
                .$queryRaw `
                SELECT (count(*) FILTER (WHERE status = 'INVOICED')::float8 / nullif(count(*), 0)) AS rate, count(*)::int AS quotes
                FROM quotes WHERE date BETWEEN ${from}::date AND ${to}::date`;
            const [states, items, events, [qCur], [qPrev]] = await Promise.all([
                this.prisma.$queryRaw `
                    SELECT state::text AS label, count(*)::int AS value FROM trades
                    WHERE date BETWEEN ${current.from}::date AND ${current.to}::date GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT status::text AS label, count(*)::int AS value FROM customer_order_items GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT e."tradeId", t.reference, e.step::text AS step, e.at, t.collected
                    FROM order_events e JOIN trades t ON t.id = e."tradeId"
                    WHERE e.at >= ${previous.from}::date - interval '1 year'
                    ORDER BY e.at`,
                quoteRate(current.from, current.to),
                quoteRate(previous.from, previous.to),
            ]);
            const inPeriod = events.filter((e) => {
                const day = dublinToday(e.at);
                return day >= current.from && day <= current.to;
            });
            const { stepHours, flow } = (0, analytics_shape_1.stepTransitions)(inPeriod);
            const waiting = (0, analytics_shape_1.waitingByStep)(events.filter((e) => !e.collected), new Date());
            const notes = [];
            if (events.length < 50) {
                notes.push({
                    chart: 'stepHours',
                    text: `Step times are based on ${events.length} recorded steps so far; they firm up as more orders are tracked.`,
                });
            }
            return {
                period,
                kpis: [
                    kpi('quoteConversion', 'Quotes → invoiced', 'pct', qCur?.rate, qPrev?.rate, `${qCur?.quotes ?? 0} quotes`),
                    kpi('openOrders', 'Open orders', 'count', waiting.reduce((a, w) => a + w.orders.length, 0), null),
                    kpi('bagged', 'Items allocated', 'count', items
                        .filter((i) => i.label === 'BAGGED' ||
                        i.label === 'ALLOCATED')
                        .reduce((a, i) => a + i.value, 0), null, 'waiting for collection'),
                    kpi('orderedToArrived', 'Ordered → arrived', 'hours', stepHours.find((h) => h.from === 'ORDERED' && h.to === 'ARRIVED')?.hours ?? null, null, 'average'),
                ],
                notes,
                tradeStates: states,
                orderItemStatus: items,
                stepHours,
                flow,
                waiting,
            };
        });
    }
    inventory(preset) {
        return this.cached('inventory', preset, async (period) => {
            const { current } = period;
            const [byBranch, tree, low, moves, lineCount] = await Promise.all([
                this.prisma.$queryRaw `
                    SELECT b.name AS branch,
                           coalesce(sum(l.qty) FILTER (WHERE l.metal = 'GOLD'), 0)::int AS gold,
                           coalesce(sum(l.qty) FILTER (WHERE l.metal = 'SILVER'), 0)::int AS silver
                    FROM live_stock_branches b LEFT JOIN live_stock_lines l ON l."branchCode" = b.code
                    GROUP BY b.name ORDER BY b.name`,
                this.prisma.$queryRaw `
                    SELECT metal::text AS metal, family, sum(qty)::int AS qty FROM live_stock_lines
                    GROUP BY 1, 2 HAVING sum(qty) > 0 ORDER BY 3 DESC`,
                this.prisma.$queryRaw `
                    SELECT b.name AS branch, trim(l.family || ' ' || l.variant) AS product, l.qty,
                           coalesce(l."lowThreshold", 5) AS threshold
                    FROM live_stock_lines l JOIN live_stock_branches b ON b.code = l."branchCode"
                    WHERE l.qty <= coalesce(l."lowThreshold", 5) ORDER BY l.qty, b.name`,
                this.prisma.$queryRaw `
                    SELECT (at AT TIME ZONE ${TZ})::date AS day,
                           coalesce(sum(delta) FILTER (WHERE delta > 0), 0)::int AS "in",
                           coalesce(-sum(delta) FILTER (WHERE delta < 0), 0)::int AS "out",
                           (SELECT min(at) FROM live_stock_movements) AS first
                    FROM live_stock_movements
                    WHERE (at AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT count(*)::int AS n FROM live_stock_lines`,
            ]);
            const pieces = byBranch.reduce((a, b) => a + b.gold + b.silver, 0);
            const since = moves[0]?.first
                ? moves[0].first.toISOString().slice(0, 10)
                : null;
            const notes = [];
            if (since && since > current.from) {
                notes.push({
                    chart: 'movementsByDay',
                    text: `Stock movements are recorded from ${since}; earlier days have none.`,
                });
            }
            return {
                period,
                kpis: [
                    kpi('pieces', 'Pieces in stock', 'count', pieces, null, 'right now'),
                    kpi('lines', 'Lines tracked', 'count', lineCount[0]?.n ?? 0, null),
                    kpi('low', 'Low', 'count', low.filter((l) => l.qty > 0).length, null, 'at or under the line’s threshold'),
                    kpi('out', 'Out', 'count', low.filter((l) => l.qty <= 0).length, null),
                ],
                notes,
                byBranch,
                tree,
                low,
                movementsByDay: moves.map((m) => ({
                    day: m.day.toISOString().slice(0, 10),
                    in: m.in,
                    out: m.out,
                })),
                movementsSince: since,
            };
        });
    }
    customers(preset) {
        return this.cached('customers', preset, async (period) => {
            const { current, previous } = period;
            const totals = (from, to) => this.prisma.$queryRaw `
                SELECT sum(total)::float8 AS total, count(*)::int AS invoices FROM zoho_invoices
                WHERE status IS DISTINCT FROM 'Void' AND date BETWEEN ${from}::date AND ${to}::date`;
            const [[cur], [prev], byMonth, status, top, byDay, [last]] = await Promise.all([
                totals(current.from, current.to),
                totals(previous.from, previous.to),
                this.prisma.$queryRaw `
                    SELECT to_char(date, 'YYYY-MM') AS month, coalesce(sum(total), 0)::float8 AS total, count(*)::int AS invoices
                    FROM zoho_invoices WHERE status IS DISTINCT FROM 'Void' AND date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT coalesce(status, 'Unknown') AS label, count(*)::int AS value FROM zoho_invoices GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT c.name AS label, sum(i.total)::float8 AS value
                    FROM zoho_invoices i JOIN customers c ON c.id = i."customerId"
                    WHERE i.status IS DISTINCT FROM 'Void' AND i.date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY c.name ORDER BY 2 DESC LIMIT 8`,
                this.prisma.$queryRaw `
                    SELECT date AS day, sum(total)::float8 AS value FROM zoho_invoices
                    WHERE status IS DISTINCT FROM 'Void' AND date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT max(date) AS until, count(*) FILTER (WHERE status = 'Overdue')::int AS overdue FROM zoho_invoices`,
            ]);
            const until = last?.until
                ? last.until.toISOString().slice(0, 10)
                : null;
            const notes = [];
            if (until && until < current.to) {
                notes.push({
                    chart: 'byMonth',
                    text: `Invoices are imported from Zoho up to ${until}; later invoices are in Business Central and not imported yet.`,
                });
            }
            return {
                period,
                kpis: [
                    kpi('invoiced', 'Invoiced', 'eur', cur?.total, prev?.total),
                    kpi('invoices', 'Invoices', 'count', cur?.invoices, prev?.invoices),
                    kpi('average', 'Average invoice', 'eur', cur?.invoices ? (cur.total ?? 0) / cur.invoices : null, prev?.invoices
                        ? (prev.total ?? 0) / prev.invoices
                        : null),
                    kpi('overdue', 'Overdue', 'count', last?.overdue ?? 0, null, 'all time'),
                ],
                notes,
                byMonth,
                status,
                topCustomers: top,
                byDay: byDay.map((d) => ({
                    day: d.day.toISOString().slice(0, 10),
                    value: d.value,
                })),
                invoicesUntil: until,
            };
        });
    }
    chatbot(preset) {
        return this.cached('chatbot', preset, async (period) => {
            const { current, previous } = period;
            const totals = (from, to) => this.prisma.$queryRaw `
                SELECT count(*)::int AS questions,
                       (count(*) FILTER (WHERE status = 'answered')::float8 / nullif(count(*), 0)) AS answered,
                       (avg("latencyMs") FILTER (WHERE status = 'answered') / 1000)::float8 AS seconds,
                       (sum("costMicros") / 1e6)::float8 AS cost
                FROM ai_question_logs WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${from}::date AND ${to}::date`;
            const [[cur], [prev], byDay, outcome, byMode, latency, hours, [fb], recent,] = await Promise.all([
                totals(current.from, current.to),
                totals(previous.from, previous.to),
                this.prisma.$queryRaw `
                    SELECT ("createdAt" AT TIME ZONE ${TZ})::date AS day, count(*)::int AS value FROM ai_question_logs
                    WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.$queryRaw `
                    SELECT status AS label, count(*)::int AS value FROM ai_question_logs
                    WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT mode AS label, count(*)::int AS value FROM ai_question_logs
                    WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT mode AS label, (avg("latencyMs") / 1000)::float8 AS value FROM ai_question_logs
                    WHERE status = 'answered' AND ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 2 DESC`,
                this.prisma.$queryRaw `
                    SELECT extract(dow FROM "createdAt" AT TIME ZONE ${TZ})::int AS dow,
                           extract(hour FROM "createdAt" AT TIME ZONE ${TZ})::int AS hour, count(*)::int AS n
                    FROM ai_question_logs
                    WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1, 2`,
                this.prisma.$queryRaw `
                    SELECT count(*) FILTER (WHERE helpful)::int AS helpful, count(*) FILTER (WHERE NOT helpful)::int AS "notHelpful",
                           (SELECT min("createdAt") FROM ai_feedback) AS since
                    FROM ai_feedback
                    WHERE ("createdAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date`,
                this.prisma.aiQuestionLog.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 8,
                    select: {
                        createdAt: true,
                        question: true,
                        mode: true,
                        status: true,
                        latencyMs: true,
                    },
                }),
            ]);
            const notes = [];
            if (!fb?.since) {
                notes.push({
                    chart: 'feedback',
                    text: 'Needs backend: thumbs up or down are counted from the day the buttons go live.',
                });
            }
            return {
                period,
                kpis: [
                    kpi('questions', 'Questions', 'count', cur?.questions, prev?.questions),
                    kpi('answered', 'Answered', 'pct', cur?.answered, prev?.answered),
                    kpi('seconds', 'Average answer time', 'seconds', cur?.seconds, prev?.seconds),
                    kpi('cost', 'Cost', 'eur', cur?.cost, prev?.cost, 'model usage, USD billed ≈ EUR'),
                ],
                notes,
                byDay: byDay.map((d) => ({
                    day: d.day.toISOString().slice(0, 10),
                    value: d.value,
                })),
                outcome,
                byMode,
                latencyByMode: latency,
                hours: (0, analytics_shape_1.fillHeat)(hours),
                feedback: {
                    helpful: fb?.helpful ?? 0,
                    notHelpful: fb?.notHelpful ?? 0,
                    since: fb?.since
                        ? fb.since.toISOString().slice(0, 10)
                        : null,
                },
                recent: recent.map((r) => ({
                    at: r.createdAt.toISOString(),
                    text: r.mode === 'procedures'
                        ? r.question
                        : `${r.mode === 'email' ? 'Email' : 'WhatsApp'} reply request, ${r.question.length} characters`,
                    status: r.status,
                    seconds: Math.round(r.latencyMs / 100) / 10,
                })),
            };
        });
    }
    ops(preset) {
        return this.cached('ops', preset, async (period) => {
            const { current, previous } = period;
            const feed = (from, to) => this.prisma.$queryRaw `
                SELECT (count(*) FILTER (WHERE success)::float8 / nullif(count(*), 0)) AS rate,
                       avg("durationMs") FILTER (WHERE success)::float8 AS ms,
                       count(*) FILTER (WHERE NOT success)::int AS failed
                FROM fetch_attempts WHERE ("attemptedAt" AT TIME ZONE ${TZ})::date BETWEEN ${from}::date AND ${to}::date`;
            const imports = (from, to) => this.prisma.$queryRaw `
                SELECT count(*)::int AS n FROM import_batches
                WHERE ("importedAt" AT TIME ZONE ${TZ})::date BETWEEN ${from}::date AND ${to}::date`;
            const [[cur], [prev], failures, byDay, recent, byKind, [iCur], [iPrev],] = await Promise.all([
                feed(current.from, current.to),
                feed(previous.from, previous.to),
                this.prisma.$queryRaw `
                    SELECT extract(dow FROM "attemptedAt" AT TIME ZONE ${TZ})::int AS dow,
                           extract(hour FROM "attemptedAt" AT TIME ZONE ${TZ})::int AS hour, count(*)::int AS n
                    FROM fetch_attempts WHERE NOT success
                      AND ("attemptedAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1, 2`,
                this.prisma.$queryRaw `
                    SELECT ("attemptedAt" AT TIME ZONE ${TZ})::date AS day,
                           count(*) FILTER (WHERE success)::int AS ok, count(*) FILTER (WHERE NOT success)::int AS failed
                    FROM fetch_attempts
                    WHERE ("attemptedAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 1`,
                this.prisma.importBatch.findMany({
                    orderBy: { importedAt: 'desc' },
                    take: 8,
                    select: {
                        importedAt: true,
                        kind: true,
                        fileName: true,
                        importedBy: true,
                        status: true,
                    },
                }),
                this.prisma.$queryRaw `
                    SELECT kind AS label, count(*)::int AS value FROM import_batches
                    WHERE ("importedAt" AT TIME ZONE ${TZ})::date BETWEEN ${current.from}::date AND ${current.to}::date
                    GROUP BY 1 ORDER BY 2 DESC`,
                imports(current.from, current.to),
                imports(previous.from, previous.to),
            ]);
            const heat = (0, analytics_shape_1.fillHeat)(failures);
            const total = heat.reduce((a, c) => a + c.value, 0);
            const overnight = heat
                .filter((c) => c.hour < 2)
                .reduce((a, c) => a + c.value, 0);
            const notes = [];
            if (total > 0 && overnight / total > 0.5) {
                notes.push({
                    chart: 'feedFailures',
                    text: `${overnight} of ${total} failed fetches were between 00:00 and 02:00: the price feed's nightly gap, not an outage.`,
                });
            }
            return {
                period,
                kpis: [
                    kpi('feedRate', 'Price feed success', 'pct', cur?.rate, prev?.rate),
                    kpi('feedMs', 'Average fetch', 'ms', cur?.ms, prev?.ms),
                    kpi('feedFailed', 'Failed fetches', 'count', cur?.failed, prev?.failed),
                    kpi('imports', 'Imports', 'count', iCur?.n, iPrev?.n),
                ],
                notes,
                feedFailures: heat,
                feedByDay: byDay.map((d) => ({
                    day: d.day.toISOString().slice(0, 10),
                    ok: d.ok,
                    failed: d.failed,
                })),
                imports: recent.map((r) => ({
                    at: r.importedAt.toISOString(),
                    kind: r.kind,
                    file: r.fileName,
                    by: r.importedBy,
                    status: r.status,
                })),
                importsByKind: byKind,
            };
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map