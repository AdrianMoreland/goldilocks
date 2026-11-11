import { BadRequestException, Injectable } from '@nestjs/common';
import {
    AliasesQuerySchema,
    matchProductName,
    type AliasRow,
    type AliasTarget,
    type AliasesResponse,
    type MatchCatalogue,
    type NameSuggestionDecisionResult,
    type ProductMatch,
    type SettleNamesResult,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

type Db = Prisma.TransactionClient | PrismaService;
type AliasRecord = Prisma.ProductAliasGetPayload<object>;

/** Which names a scan looks at. A person's own decisions are never in scope, whatever is asked. */
export type NameScope = 'all' | { ids: number[] } | { aliases: string[] };

/** The reason stored on a name whose suggestion a person turned down: a later scan leaves it alone. */
export const REJECTED_REASON = 'suggestion turned down';

/** A name nobody has settled: not decided by a person and not by a rule. */
const WAITING = {
    decidedBy: null,
    salesProductId: null,
    productId: null,
    noProduct: false,
} satisfies Prisma.ProductAliasWhereInput;

type Target =
    | { productId: number }
    | { salesProductId: number }
    | { noProduct: true };

/** The state a name is meant to be in after a scan: the columns the scan owns, nothing else. */
type Settled = Pick<
    Prisma.ProductAliasUncheckedUpdateInput,
    | 'productId'
    | 'salesProductId'
    | 'noProduct'
    | 'decidedBy'
    | 'suggestedProductId'
    | 'suggestedSalesProductId'
    | 'suggestedNoProduct'
    | 'confidence'
    | 'reason'
    | 'question'
    | 'catalogueGap'
>;

function targetOf(m: ProductMatch): Target | null {
    if (m.outcome === 'PRICING' && m.productId !== undefined)
        return { productId: m.productId };
    if (m.outcome === 'SPECIFIC' && m.salesProductId !== undefined)
        return { salesProductId: Number(m.salesProductId) };
    if (m.outcome === 'NOT_A_PRODUCT') return { noProduct: true };
    return null;
}

/** What the engine's answer means for one name. */
export function settledState(m: ProductMatch): {
    tier: 'certain' | 'likely' | 'unclear';
    state: Settled;
} {
    const target = targetOf(m);
    const certain = target !== null && m.confidence === 'CERTAIN';
    const tier = certain
        ? 'certain'
        : m.confidence === 'LIKELY' && target
          ? 'likely'
          : 'unclear';
    const productId = target && 'productId' in target ? target.productId : null;
    const salesProductId =
        target && 'salesProductId' in target ? target.salesProductId : null;
    const noProduct = !!target && 'noProduct' in target;
    return {
        tier,
        state: {
            productId: certain ? productId : null,
            salesProductId: certain ? salesProductId : null,
            noProduct: certain ? noProduct : false,
            decidedBy: certain ? 'RULE' : null,
            suggestedProductId: certain ? null : productId,
            suggestedSalesProductId: certain ? null : salesProductId,
            suggestedNoProduct: certain ? false : noProduct,
            confidence:
                tier === 'certain'
                    ? 'CERTAIN'
                    : tier === 'likely'
                      ? 'LIKELY'
                      : 'UNCLEAR',
            reason: m.reason,
            question: certain ? null : (m.question ?? null),
            catalogueGap: !!m.catalogueGap,
        },
    };
}

const differs = (row: AliasRecord, state: Settled): boolean =>
    (Object.keys(state) as (keyof Settled)[]).some(
        (k) => (row as unknown as Record<string, unknown>)[k] !== state[k],
    );

/**
 * Product names that settle themselves. `settle` runs the matching engine over the names nobody has decided and
 * applies what is CERTAIN (by rule, undoable), stores a suggestion for what is LIKELY and a reason for what is
 * UNCLEAR. A person's decision is never touched. Audit entries carry counts and ids, never names.
 */
@Injectable()
export class ProductNamesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    private async catalogue(db: Db): Promise<MatchCatalogue> {
        const [pricing, specific] = await Promise.all([
            // Inactive rows count: they exist so a name has somewhere to settle to.
            db.product.findMany({
                where: { deletedAt: null },
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    metalType: true,
                    category: true,
                },
                orderBy: { id: 'asc' },
            }),
            db.salesProduct.findMany({
                select: {
                    id: true,
                    name: true,
                    metal: true,
                    refinery: true,
                    genericNorm: true,
                    pricingProductId: true,
                },
                orderBy: { id: 'asc' },
            }),
        ]);
        return {
            pricing: pricing.map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                metal: p.metalType,
                category: p.category,
            })),
            specific,
        };
    }

    /**
     * Runs the rules over the names in `scope`. With `dryRun` nothing is written and the counts say what a real
     * scan would do. A name whose suggestion was turned down stays as it is unless a rule now settles it.
     */
    async settle(
        scope: NameScope,
        opts: { dryRun?: boolean; db?: Db } = {},
    ): Promise<SettleNamesResult> {
        const db = opts.db ?? this.prisma;
        const dryRun = opts.dryRun ?? false;
        const where: Prisma.ProductAliasWhereInput = {
            OR: [{ decidedBy: null }, { decidedBy: 'RULE' }],
        };
        if (scope !== 'all') {
            if ('ids' in scope) where.id = { in: scope.ids };
            else where.alias = { in: scope.aliases };
        }
        const result: SettleNamesResult = {
            dryRun,
            certain: 0,
            likely: 0,
            unclear: 0,
            unchanged: 0,
        };
        const rows = await db.productAlias.findMany({ where });
        if (rows.length === 0) return result;
        const cat = await this.catalogue(db);

        const writes: { id: number; data: Settled }[] = [];
        for (const row of rows) {
            const m = matchProductName(
                {
                    text: row.alias,
                    refinery: row.refinery,
                    metal: row.metalHint,
                    sources: row.sources,
                },
                cat,
            );
            const { tier, state } = settledState(m);
            result[tier]++;
            const turnedDown =
                row.decidedBy === null && row.reason === REJECTED_REASON;
            if ((turnedDown && tier !== 'certain') || !differs(row, state)) {
                result.unchanged++;
                continue;
            }
            writes.push({ id: row.id, data: state });
        }
        if (!dryRun) {
            for (const w of writes)
                await db.productAlias.update({
                    where: { id: w.id },
                    data: w.data,
                });
        }
        return result;
    }

    /** Settles the names a scope names and writes one audit line (counts only). */
    async settleAndRecord(
        scope: NameScope,
        actor: string,
        db: Db,
        label: string,
    ): Promise<SettleNamesResult> {
        const r = await this.settle(scope, { db });
        await this.audit.record(
            actor,
            'product-names-settle',
            `${label}: ${r.certain} settled by rule, ${r.likely} to confirm, ${r.unclear} to decide, ${r.unchanged} unchanged`,
            db,
        );
        return r;
    }

    /**
     * Adds the names a source met that were not saved yet (an existing name is left as it is), then settles just
     * those. Used by the tradesheet import, so a name it could not place reaches the queue with a suggestion.
     */
    async registerAndSettle(
        names: {
            alias: string;
            uses: number;
            metalHint: 'GOLD' | 'SILVER' | null;
        }[],
        source: string,
        actor: string,
        db: Prisma.TransactionClient,
        label: string,
    ): Promise<SettleNamesResult> {
        if (names.length === 0)
            return {
                dryRun: false,
                certain: 0,
                likely: 0,
                unclear: 0,
                unchanged: 0,
            };
        await db.productAlias.createMany({
            data: names.map((n) => ({
                alias: n.alias,
                productKey: n.alias,
                uses: n.uses,
                sources: source,
                metalHint: n.metalHint,
            })),
            skipDuplicates: true,
        });
        return this.settleAndRecord(
            { aliases: names.map((n) => n.alias) },
            actor,
            db,
            label,
        );
    }

    /** The Rescan button. A dry run only counts. */
    async rescan(dryRun: boolean, actor: string): Promise<SettleNamesResult> {
        if (dryRun) return this.settle('all', { dryRun: true });
        return this.prisma.$transaction(
            (tx) => this.settleAndRecord('all', actor, tx, 'rescan'),
            { timeout: 120_000, maxWait: 10_000 },
        );
    }

    // --- the queue ---------------------------------------------------------------------------

    /** Names to confirm, to decide and settled by rule, for the review tab. */
    async list(rawQuery: Record<string, unknown>): Promise<AliasesResponse> {
        const parsed = AliasesQuerySchema.safeParse(rawQuery);
        if (!parsed.success) throw new BadRequestException('Invalid query.');
        const { view, limit, offset } = parsed.data;

        const toConfirm: Prisma.ProductAliasWhereInput = {
            ...WAITING,
            confidence: 'LIKELY',
        };
        const toDecide: Prisma.ProductAliasWhereInput = {
            ...WAITING,
            OR: [{ confidence: { not: 'LIKELY' } }, { confidence: null }],
        };
        const settled: Prisma.ProductAliasWhereInput = { decidedBy: 'RULE' };
        const where: Prisma.ProductAliasWhereInput =
            view === 'confirm'
                ? toConfirm
                : view === 'decide'
                  ? toDecide
                  : view === 'settled'
                    ? settled
                    : WAITING;

        const [confirmCount, decideCount, settledCount, total, rows] =
            await Promise.all([
                this.prisma.productAlias.count({ where: toConfirm }),
                this.prisma.productAlias.count({ where: toDecide }),
                this.prisma.productAlias.count({ where: settled }),
                this.prisma.productAlias.count({ where }),
                this.prisma.productAlias.findMany({
                    where,
                    // Suggestions first, then the most used names.
                    orderBy: [{ uses: 'desc' }, { alias: 'asc' }],
                    skip: offset,
                    take: limit,
                }),
            ]);
        const names = await this.targetNames(rows);
        return {
            total,
            counts: {
                settledByRule: settledCount,
                toConfirm: confirmCount,
                toDecide: decideCount,
            },
            rows: rows.map((a) => this.toRow(a, names)),
        };
    }

    private async targetNames(rows: AliasRecord[]) {
        const productIds = new Set<number>();
        const salesIds = new Set<number>();
        for (const a of rows) {
            for (const id of [a.productId, a.suggestedProductId])
                if (id !== null) productIds.add(id);
            for (const id of [a.salesProductId, a.suggestedSalesProductId])
                if (id !== null) salesIds.add(id);
        }
        const [products, sales] = await Promise.all([
            productIds.size
                ? this.prisma.product.findMany({
                      where: { id: { in: [...productIds] } },
                      select: { id: true, name: true },
                  })
                : Promise.resolve([] as { id: number; name: string }[]),
            salesIds.size
                ? this.prisma.salesProduct.findMany({
                      where: { id: { in: [...salesIds] } },
                      select: { id: true, name: true },
                  })
                : Promise.resolve([] as { id: number; name: string }[]),
        ]);
        return {
            product: new Map(products.map((p) => [p.id, p.name])),
            sales: new Map(sales.map((p) => [p.id, p.name])),
        };
    }

    private toRow(
        a: AliasRecord,
        names: Awaited<ReturnType<ProductNamesService['targetNames']>>,
    ): AliasRow {
        const pick = (
            productId: number | null,
            salesProductId: number | null,
            noProduct: boolean,
        ): AliasTarget | null => {
            if (salesProductId !== null)
                return {
                    kind: 'SPECIFIC',
                    id: salesProductId,
                    name: names.sales.get(salesProductId) ?? 'Unknown product',
                };
            if (productId !== null)
                return {
                    kind: 'PRICING',
                    id: productId,
                    name: names.product.get(productId) ?? 'Unknown product',
                };
            if (noProduct)
                return {
                    kind: 'NOT_A_PRODUCT',
                    id: null,
                    name: 'Not a product',
                };
            return null;
        };
        return {
            id: a.id,
            alias: a.alias,
            uses: a.uses,
            refinery: a.refinery,
            sources: a.sources,
            confidence: a.confidence,
            reason: a.reason,
            question: a.question,
            catalogueGap: a.catalogueGap,
            decidedBy: a.decidedBy,
            suggestion: pick(
                a.suggestedProductId,
                a.suggestedSalesProductId,
                a.suggestedNoProduct,
            ),
            settledTo: pick(a.productId, a.salesProductId, a.noProduct),
        };
    }

    // --- accept and reject -------------------------------------------------------------------

    private hasSuggestion = (a: AliasRecord): boolean =>
        a.suggestedProductId !== null ||
        a.suggestedSalesProductId !== null ||
        a.suggestedNoProduct;

    /** Takes the suggestions as a person's own decisions. Names a person already decided, or without one, are skipped. */
    async accept(
        ids: number[],
        actor: string,
    ): Promise<NameSuggestionDecisionResult> {
        const unique = [...new Set(ids)];
        return this.prisma.$transaction(async (tx) => {
            const rows = await tx.productAlias.findMany({
                where: { id: { in: unique } },
            });
            const done: number[] = [];
            for (const a of rows) {
                if (a.decidedBy === 'PERSON' || !this.hasSuggestion(a))
                    continue;
                await tx.productAlias.update({
                    where: { id: a.id },
                    data: {
                        productId: a.suggestedProductId,
                        salesProductId: a.suggestedSalesProductId,
                        noProduct: a.suggestedNoProduct,
                        decidedBy: 'PERSON',
                        suggestedProductId: null,
                        suggestedSalesProductId: null,
                        suggestedNoProduct: false,
                        question: null,
                    },
                });
                done.push(a.id);
            }
            await this.audit.record(
                actor,
                'name-suggestion-accept',
                `${done.length} of ${unique.length} accepted: ids ${done.join(',') || 'none'}`,
                tx,
            );
            return { done: done.length, skipped: unique.length - done.length };
        });
    }

    /** Turns suggestions down: each name stays in the queue as UNCLEAR, undecided, and a rescan will not bring the suggestion back. */
    async reject(
        ids: number[],
        actor: string,
    ): Promise<NameSuggestionDecisionResult> {
        const unique = [...new Set(ids)];
        return this.prisma.$transaction(async (tx) => {
            const rows = await tx.productAlias.findMany({
                where: { id: { in: unique }, decidedBy: null },
            });
            const done = rows.filter(this.hasSuggestion).map((a) => a.id);
            if (done.length)
                await tx.productAlias.updateMany({
                    where: { id: { in: done } },
                    data: {
                        suggestedProductId: null,
                        suggestedSalesProductId: null,
                        suggestedNoProduct: false,
                        question: null,
                        confidence: 'UNCLEAR',
                        reason: REJECTED_REASON,
                    },
                });
            await this.audit.record(
                actor,
                'name-suggestion-reject',
                `${done.length} of ${unique.length} turned down: ids ${done.join(',') || 'none'}`,
                tx,
            );
            return { done: done.length, skipped: unique.length - done.length };
        });
    }
}
