import { BadRequestException, Injectable } from '@nestjs/common';
import {
    AliasesQuerySchema,
    matchProductName,
    type AliasRow,
    type AliasTarget,
    type AliasesResponse,
    type MatchCatalogue,
    type NameSuggestionAcceptResult,
    type NameSuggestionDecisionResult,
    type NameSuggestionTarget,
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

/** A person's decision, or a rule's, is the only thing a scan may write over: never a person's. */
const SCAN_MAY_WRITE = {
    OR: [{ decidedBy: null }, { decidedBy: 'RULE' }],
} satisfies Prisma.ProductAliasWhereInput;

/** Ids per write statement. */
const WRITE_CHUNK = 1000;
/** More distinct states than this: one parameterised UPDATE ... FROM unnest per chunk instead of one updateMany per state. */
const MAX_GROUPS = 100;

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
        const where: Prisma.ProductAliasWhereInput = { ...SCAN_MAY_WRITE };
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
        if (!dryRun) await this.write(db, writes);
        return result;
    }

    /**
     * Writes the planned states in a few statements, not one per row (the database is ~140 ms away). Names with the
     * same target state are written together; names with their own text (reason, question) mostly differ, so if that
     * still leaves many states, one UPDATE ... FROM unnest writes a chunk at once. Every write is guarded in its
     * WHERE: a name a person decided since it was read (a decision made during a rescan) is never overwritten.
     */
    private async write(
        db: Db,
        writes: { id: number; data: Settled }[],
    ): Promise<void> {
        if (writes.length === 0) return;
        const groups = new Map<string, { data: Settled; ids: number[] }>();
        for (const w of writes) {
            const key = JSON.stringify(w.data);
            const g = groups.get(key);
            if (g) g.ids.push(w.id);
            else groups.set(key, { data: w.data, ids: [w.id] });
        }
        if (groups.size <= MAX_GROUPS) {
            for (const g of groups.values())
                for (let i = 0; i < g.ids.length; i += WRITE_CHUNK)
                    await db.productAlias.updateMany({
                        where: {
                            id: { in: g.ids.slice(i, i + WRITE_CHUNK) },
                            ...SCAN_MAY_WRITE,
                        },
                        data: g.data,
                    });
            return;
        }
        for (let i = 0; i < writes.length; i += WRITE_CHUNK) {
            const c = writes.slice(i, i + WRITE_CHUNK);
            const col = <T>(f: (s: Settled) => T) => c.map((w) => f(w.data));
            await db.$executeRaw`
                UPDATE product_aliases AS a SET
                    "productId" = v.pid,
                    "salesProductId" = v.sid,
                    "noProduct" = v.np,
                    "decidedBy" = v.decided::"AliasDecider",
                    "suggestedProductId" = v.spid,
                    "suggestedSalesProductId" = v.ssid,
                    "suggestedNoProduct" = v.snp,
                    "confidence" = v.conf::"MatchConfidence",
                    "reason" = v.reason,
                    "question" = v.question,
                    "catalogueGap" = v.gap
                FROM unnest(
                    ${c.map((w) => w.id)}::int[],
                    ${col((d) => d.productId ?? null)}::int[],
                    ${col((d) => d.salesProductId ?? null)}::int[],
                    ${col((d) => !!d.noProduct)}::boolean[],
                    ${col((d) => d.decidedBy ?? null)}::text[],
                    ${col((d) => d.suggestedProductId ?? null)}::int[],
                    ${col((d) => d.suggestedSalesProductId ?? null)}::int[],
                    ${col((d) => !!d.suggestedNoProduct)}::boolean[],
                    ${col((d) => d.confidence ?? null)}::text[],
                    ${col((d) => d.reason ?? null)}::text[],
                    ${col((d) => d.question ?? null)}::text[],
                    ${col((d) => !!d.catalogueGap)}::boolean[]
                ) AS v(id, pid, sid, np, decided, spid, ssid, snp, conf, reason, question, gap)
                WHERE a.id = v.id AND (a."decidedBy" IS NULL OR a."decidedBy" = 'RULE')`;
        }
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
     * Adds the names a source met that were not saved yet (an existing name is left as it is). Settling them is a
     * separate step (`settleAndRecord`), so a caller can do it after its own transaction commits.
     */
    async registerNames(
        names: {
            alias: string;
            uses: number;
            metalHint: 'GOLD' | 'SILVER' | null;
        }[],
        source: string,
        db: Db,
    ): Promise<void> {
        if (names.length === 0) return;
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
    }

    /** The Rescan button. A dry run only counts. */
    async rescan(dryRun: boolean, actor: string): Promise<SettleNamesResult> {
        if (dryRun) return this.settle('all', { dryRun: true });
        return this.prisma.$transaction(
            (tx) => this.settleAndRecord('all', actor, tx, 'rescan'),
            { timeout: 300_000, maxWait: 10_000 },
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

    /**
     * Takes suggestions as a person's own decisions. A name is accepted only if it is still undecided and its stored
     * suggestion still equals the one the person saw (`expected`); anything else is skipped and counted.
     */
    async accept(
        items: { id: number; expected: NameSuggestionTarget }[],
        actor: string,
    ): Promise<NameSuggestionAcceptResult> {
        const byId = new Map(items.map((i) => [i.id, i.expected]));
        // Group by the suggestion, so each group is one guarded statement.
        const groups = new Map<
            string,
            { expected: NameSuggestionTarget; ids: number[] }
        >();
        for (const [id, expected] of byId) {
            const key = JSON.stringify([
                expected.productId ?? null,
                expected.salesProductId ?? null,
                expected.noProduct ?? false,
            ]);
            const g = groups.get(key);
            if (g) g.ids.push(id);
            else groups.set(key, { expected, ids: [id] });
        }
        return this.prisma.$transaction(
            async (tx) => {
                const done: number[] = [];
                for (const g of groups.values()) {
                    for (let i = 0; i < g.ids.length; i += WRITE_CHUNK) {
                        const ids = g.ids.slice(i, i + WRITE_CHUNK);
                        const where = {
                            id: { in: ids },
                            decidedBy: null,
                            suggestedProductId: g.expected.productId ?? null,
                            suggestedSalesProductId:
                                g.expected.salesProductId ?? null,
                            suggestedNoProduct: g.expected.noProduct === true,
                        } satisfies Prisma.ProductAliasWhereInput;
                        // Read which ids still match, so the audit line can name the ones changed.
                        const hit = await tx.productAlias.findMany({
                            where,
                            select: { id: true },
                        });
                        if (hit.length === 0) continue;
                        const matched = hit.map((h) => h.id);
                        await tx.productAlias.updateMany({
                            where: { ...where, id: { in: matched } },
                            data: {
                                productId: g.expected.productId ?? null,
                                salesProductId:
                                    g.expected.salesProductId ?? null,
                                noProduct: g.expected.noProduct === true,
                                decidedBy: 'PERSON',
                                suggestedProductId: null,
                                suggestedSalesProductId: null,
                                suggestedNoProduct: false,
                                question: null,
                            },
                        });
                        done.push(...matched);
                    }
                }
                await this.audit.record(
                    actor,
                    'name-suggestion-accept',
                    `${done.length} of ${byId.size} accepted: ids ${done.join(',') || 'none'}`,
                    tx,
                );
                return {
                    accepted: done.length,
                    skipped: byId.size - done.length,
                };
            },
            { timeout: 120_000, maxWait: 10_000 },
        );
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
