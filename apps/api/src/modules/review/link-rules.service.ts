import { Injectable } from '@nestjs/common';
import type { SettleResult } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    judgeLineTrade,
    judgeSaleLot,
    type LineEnd,
    type LotEnd,
    type SaleEnd,
    type Verdict,
} from './link-rules';

type Db = Prisma.TransactionClient | PrismaService;
interface PendingLink {
    id: number;
    linkType: string;
    fromKey: string;
    toKey: string;
}

/** Link types the rules have a view on. The others stay with a person. */
export const RULED_LINK_TYPES = ['trade_lot', 'invoice_line_trade'] as const;
const BATCH = 500;
const RULE_ACTOR = 'rule';

const keysOf = (links: PendingLink[], side: 'fromKey' | 'toKey') => [
    ...new Set(links.map((l) => l[side])),
];

/**
 * Settles pending links that make sense, so people only see the ones that do not. A sale whose CPTY names a purchase
 * line of the same product is confirmed without asking; one that names a different product is asked about; and a
 * purchase line with more sold than bought is left for its own review. Decisions are recorded as made by "rule".
 */
@Injectable()
export class LinkRulesService {
    /** The verdict for each link, by link id. Links of a type the rules do not cover are absent from the map. */
    async judge(db: Db, links: PendingLink[]): Promise<Map<number, Verdict>> {
        const out = new Map<number, Verdict>();

        const saleLots = links.filter((l) => l.linkType === 'trade_lot');
        if (saleLots.length) {
            const [trades, lots] = await Promise.all([
                db.trade.findMany({
                    where: { sourceKey: { in: keysOf(saleLots, 'fromKey') } },
                    select: {
                        sourceKey: true,
                        qty: true,
                        productKey: true,
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
                        productText: true,
                    },
                }),
            ]);
            const tradeBy = new Map<string, SaleEnd>(
                trades.map((t) => [t.sourceKey!, t]),
            );
            const lotBy = new Map<string, LotEnd>(
                lots.map((l) => [l.sourceKey!, l]),
            );
            for (const l of saleLots)
                out.set(
                    l.id,
                    judgeSaleLot(
                        tradeBy.get(l.fromKey) ?? null,
                        lotBy.get(l.toKey) ?? null,
                    ),
                );
        }

        const lineTrades = links.filter(
            (l) => l.linkType === 'invoice_line_trade',
        );
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
                        productText: true,
                    },
                }),
            ]);
            const lineBy = new Map<string, LineEnd>(
                lines.map((l) => [
                    l.sourceKey,
                    {
                        qty: l.qty === null ? null : Number(l.qty),
                        itemName: l.itemName,
                    },
                ]),
            );
            const tradeBy = new Map<string, SaleEnd>(
                trades.map((t) => [t.sourceKey!, t]),
            );
            // A sale the tradesheet still calls a quote: the Zoho invoice shows it happened, so judge it as the sale it is.
            const missing = keysOf(lineTrades, 'toKey').filter(
                (k) => !tradeBy.has(k),
            );
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
                out.set(
                    l.id,
                    judgeLineTrade(
                        lineBy.get(l.fromKey) ?? null,
                        tradeBy.get(l.toKey) ?? null,
                    ),
                );
        }
        return out;
    }

    /** Confirms every pending link of a ruled type that makes sense. Safe to run again: it only touches pending ones. */
    async settle(db: Db): Promise<SettleResult> {
        const result: SettleResult = {
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
                    linkType: { in: [...RULED_LINK_TYPES] },
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
            if (batch.length === 0) break;
            after = batch[batch.length - 1].id;
            const verdicts = await this.judge(db, batch);
            const confirm: number[] = [];
            for (const l of batch) {
                const v = verdicts.get(l.id);
                if (v?.verdict === 'CONFIRM') confirm.push(l.id);
                else if (v?.verdict === 'SEPARATE') result.overAllocated++;
                else result.asked++;
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
                // An invoiced sale the sheet still lists as a quote: the quote is now invoiced.
                const quoteKeys = batch
                    .filter(
                        (l) =>
                            l.linkType === 'invoice_line_trade' &&
                            confirm.includes(l.id),
                    )
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
}
