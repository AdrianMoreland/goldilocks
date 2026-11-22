"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkRulesService = exports.RULED_LINK_TYPES = void 0;
const common_1 = require("@nestjs/common");
const link_rules_1 = require("./link-rules");
exports.RULED_LINK_TYPES = ['trade_lot', 'invoice_line_trade'];
const BATCH = 500;
const RULE_ACTOR = 'rule';
const keysOf = (links, side) => [
    ...new Set(links.map((l) => l[side])),
];
let LinkRulesService = class LinkRulesService {
    async judge(db, links) {
        const out = new Map();
        const saleLots = links.filter((l) => l.linkType === 'trade_lot');
        if (saleLots.length) {
            const [trades, lots] = await Promise.all([
                db.trade.findMany({
                    where: { sourceKey: { in: keysOf(saleLots, 'fromKey') } },
                    select: {
                        sourceKey: true,
                        qty: true,
                        productKey: true,
                        productId: true,
                        productText: true,
                    },
                }),
                db.purchaseLot.findMany({
                    where: { sourceKey: { in: keysOf(saleLots, 'toKey') } },
                    select: {
                        sourceKey: true,
                        qty: true,
                        allocatedQty: true,
                        productKey: true,
                        productId: true,
                        productText: true,
                    },
                }),
            ]);
            const tradeBy = new Map(trades.map((t) => [t.sourceKey, t]));
            const lotBy = new Map(lots.map((l) => [l.sourceKey, l]));
            for (const l of saleLots)
                out.set(l.id, (0, link_rules_1.judgeSaleLot)(tradeBy.get(l.fromKey) ?? null, lotBy.get(l.toKey) ?? null));
        }
        const lineTrades = links.filter((l) => l.linkType === 'invoice_line_trade');
        if (lineTrades.length) {
            const [lines, trades] = await Promise.all([
                db.zohoInvoiceLine.findMany({
                    where: { sourceKey: { in: keysOf(lineTrades, 'fromKey') } },
                    select: { sourceKey: true, qty: true, itemName: true },
                }),
                db.trade.findMany({
                    where: { sourceKey: { in: keysOf(lineTrades, 'toKey') } },
                    select: {
                        sourceKey: true,
                        qty: true,
                        productKey: true,
                        productId: true,
                        productText: true,
                    },
                }),
            ]);
            const lineBy = new Map(lines.map((l) => [
                l.sourceKey,
                {
                    qty: l.qty === null ? null : Number(l.qty),
                    itemName: l.itemName,
                },
            ]));
            const tradeBy = new Map(trades.map((t) => [t.sourceKey, t]));
            const missing = keysOf(lineTrades, 'toKey').filter((k) => !tradeBy.has(k));
            if (missing.length) {
                const quotes = await db.quote.findMany({
                    where: { sourceKey: { in: missing } },
                    select: { sourceKey: true, qty: true, productText: true },
                });
                for (const q of quotes)
                    tradeBy.set(q.sourceKey, {
                        qty: q.qty === null ? null : Number(q.qty),
                        productKey: null,
                        productText: q.productText,
                    });
            }
            for (const l of lineTrades)
                out.set(l.id, (0, link_rules_1.judgeLineTrade)(lineBy.get(l.fromKey) ?? null, tradeBy.get(l.toKey) ?? null));
        }
        return out;
    }
    async settle(db) {
        const result = {
            confirmed: 0,
            asked: 0,
            overAllocated: 0,
            quotesInvoiced: 0,
        };
        let after = 0;
        for (;;) {
            const batch = await db.entityLink.findMany({
                where: {
                    status: 'PENDING',
                    confidence: 'PROBABLE',
                    linkType: { in: [...exports.RULED_LINK_TYPES] },
                    id: { gt: after },
                },
                orderBy: { id: 'asc' },
                take: BATCH,
                select: {
                    id: true,
                    linkType: true,
                    fromKey: true,
                    toKey: true,
                },
            });
            if (batch.length === 0)
                break;
            after = batch[batch.length - 1].id;
            const verdicts = await this.judge(db, batch);
            const confirm = [];
            for (const l of batch) {
                const v = verdicts.get(l.id);
                if (v?.verdict === 'CONFIRM')
                    confirm.push(l.id);
                else if (v?.verdict === 'SEPARATE')
                    result.overAllocated++;
                else
                    result.asked++;
            }
            if (confirm.length) {
                await db.entityLink.updateMany({
                    where: { id: { in: confirm }, status: 'PENDING' },
                    data: {
                        status: 'CONFIRMED',
                        confirmedBy: RULE_ACTOR,
                        confirmedAt: new Date(),
                    },
                });
                result.confirmed += confirm.length;
                const quoteKeys = batch
                    .filter((l) => l.linkType === 'invoice_line_trade' &&
                    confirm.includes(l.id))
                    .map((l) => l.toKey);
                if (quoteKeys.length) {
                    const done = await db.quote.updateMany({
                        where: { sourceKey: { in: quoteKeys }, status: 'OPEN' },
                        data: { status: 'INVOICED' },
                    });
                    result.quotesInvoiced += done.count;
                }
            }
        }
        return result;
    }
};
exports.LinkRulesService = LinkRulesService;
exports.LinkRulesService = LinkRulesService = __decorate([
    (0, common_1.Injectable)()
], LinkRulesService);
//# sourceMappingURL=link-rules.service.js.map