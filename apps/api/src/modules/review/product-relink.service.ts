import { Injectable } from '@nestjs/common';
import {
    bcItemNoFromSku,
    RELINK_TABLES,
    type MetalType,
    type RelinkRequest,
    type RelinkResult,
    type RelinkTable,
    type RowResolverData,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import {
    groupChanges,
    planRelink,
    type ChangeGroup,
    type RelinkLookups,
    type RelinkPlan,
    type RelinkRow,
    type RelinkSpec,
} from './product-relink';

/** Ids per write, so one statement stays small. */
const CHUNK = 1000;

const STOCK_METAL: Record<string, MetalType | null> = {
    GOLD: 'GOLD',
    SILVER: 'SILVER',
    PGM: null,
};

/** A Zoho product's metal column ("Gold", "silver", ...), else the Zoho convention: gold unless the name says silver. */
function zohoMetal(text: string | null): MetalType {
    const m = String(text ?? '').toUpperCase();
    if (m.includes('SILVER')) return 'SILVER';
    if (m.includes('PLATINUM')) return 'PLATINUM';
    if (m.includes('PALLADIUM')) return 'PALLADIUM';
    return 'GOLD';
}

interface Loaded {
    spec: RelinkSpec;
    rows: RelinkRow[];
}

/**
 * Relink: gives rows imported before a product name was settled their product, from the same data and rules a
 * tradesheet import uses (current name decisions, catalogue, BC items, the row's own text, refinery and metal).
 *
 * Fill only touches empty fields. Correction (opt-in) only follows a person's decision for the name. A product is
 * never cleared, and a name settled as "not a product" is only reported.
 *
 * Allocation of sales to purchase lots is untouched by a relink: it runs on the next tradesheet import.
 * Audit lines carry counts only.
 */
@Injectable()
export class ProductRelinkService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    private async resolverData(): Promise<{
        full: RowResolverData;
        person: RowResolverData;
        lookups: RelinkLookups;
        bc: Map<
            string,
            { productId: number | null; salesProductId: number | null }
        >;
    }> {
        const [catalogue, aliases, sales, bcItems, refineryAliases] =
            await Promise.all([
                this.prisma.product.findMany({
                    where: { deletedAt: null },
                    orderBy: { id: 'asc' },
                    select: { id: true, sku: true, metalType: true },
                }),
                this.prisma.productAlias.findMany({
                    orderBy: { id: 'asc' },
                    select: {
                        alias: true,
                        productId: true,
                        salesProductId: true,
                        noProduct: true,
                        decidedBy: true,
                        metalHint: true,
                    },
                }),
                this.prisma.salesProduct.findMany({
                    orderBy: { id: 'asc' },
                    select: {
                        id: true,
                        metal: true,
                        name: true,
                        genericNorm: true,
                        refinery: true,
                        pricingProductId: true,
                    },
                }),
                this.prisma.bcItem.findMany({
                    select: {
                        itemNo: true,
                        productId: true,
                        salesProductId: true,
                    },
                }),
                this.prisma.refineryAlias.findMany({
                    select: { alias: true, refinery: true },
                }),
            ]);
        const bc = new Map(bcItems.map((b) => [b.itemNo, b]));
        const decisions = aliases.map((a) => ({
            key: a.alias,
            productId: a.productId,
            salesProductId: a.salesProductId,
            noProduct: a.noProduct,
            decidedBy: a.decidedBy,
            metalHint: a.metalHint,
        }));
        const full: RowResolverData = {
            catalogue,
            salesProducts: sales,
            bcItems: new Map(
                bcItems
                    .filter((b) => b.salesProductId !== null)
                    .map((b) => [b.itemNo, b.salesProductId as number]),
            ),
            decisions,
            refineryAliases,
        };
        // Only a person's decisions, no BC items: what a correction may follow.
        const person: RowResolverData = {
            ...full,
            bcItems: undefined,
            decisions: decisions.filter((d) => d.decidedBy === 'PERSON'),
        };
        return {
            full,
            person,
            bc,
            lookups: {
                pricingMetal: new Map(
                    catalogue.map((c) => [c.id, c.metalType as string]),
                ),
                salesMetal: new Map(sales.map((s) => [s.id, s.metal])),
            },
        };
    }

    /** Only id, text, refinery, metal and the product fields: a few selects, resolved in memory. */
    private async load(
        table: RelinkTable,
        bc: Map<
            string,
            { productId: number | null; salesProductId: number | null }
        >,
    ): Promise<Loaded> {
        switch (table) {
            case 'trades': {
                const rows = await this.prisma.trade.findMany({
                    select: {
                        id: true,
                        productText: true,
                        refinery: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: r.refinery,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: r.productId,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'purchase_lots': {
                const rows = await this.prisma.purchaseLot.findMany({
                    select: {
                        id: true,
                        productText: true,
                        refinery: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: r.refinery,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: r.productId,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'zoho_invoice_lines': {
                const rows = await this.prisma.zohoInvoiceLine.findMany({
                    select: {
                        id: true,
                        itemName: true,
                        refinery: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: false },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.itemName,
                        refinery: r.refinery,
                        metal: zohoMetal(null),
                        productId: null,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
            case 'zoho_products': {
                const rows = await this.prisma.zohoProduct.findMany({
                    select: {
                        id: true,
                        sku: true,
                        itemName: true,
                        metal: true,
                        productId: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: true },
                    rows: rows.map((r) => {
                        const no = bcItemNoFromSku(r.sku);
                        const item = no ? bc.get(no) : undefined;
                        return {
                            id: r.id,
                            text: r.itemName,
                            refinery: null,
                            metal: zohoMetal(r.metal),
                            productId: r.productId,
                            salesProductId: r.salesProductId,
                            bcItemNo: item ? no : null,
                            bc: item
                                ? {
                                      productId: item.productId,
                                      salesProductId: item.salesProductId,
                                  }
                                : null,
                        };
                    }),
                };
            }
            case 'quotes': {
                const rows = await this.prisma.quote.findMany({
                    select: {
                        id: true,
                        productText: true,
                        metal: true,
                        salesProductId: true,
                    },
                });
                return {
                    spec: { hasProductId: false },
                    rows: rows.map((r) => ({
                        id: r.id,
                        text: r.productText,
                        refinery: null,
                        metal: STOCK_METAL[r.metal] ?? null,
                        productId: null,
                        salesProductId: r.salesProductId,
                    })),
                };
            }
        }
    }

    /**
     * One guarded update per group of rows with the same change: each changed column must still hold the value the
     * plan saw (null for a fill), so a row someone changed in the meantime is left as it is.
     */
    private async write(
        tx: Pick<
            PrismaService,
            | 'trade'
            | 'purchaseLot'
            | 'zohoInvoiceLine'
            | 'zohoProduct'
            | 'quote'
        >,
        table: RelinkTable,
        groups: ChangeGroup[],
    ): Promise<number> {
        let written = 0;
        for (const g of groups) {
            const guard: {
                productId?: number | null;
                salesProductId?: number | null;
            } = {};
            const data: { productId?: number; salesProductId?: number } = {};
            if (g.change.productId) {
                guard.productId = g.change.productId[0];
                data.productId = g.change.productId[1];
            }
            if (g.change.salesProductId) {
                guard.salesProductId = g.change.salesProductId[0];
                data.salesProductId = g.change.salesProductId[1];
            }
            for (let i = 0; i < g.ids.length; i += CHUNK) {
                const args = {
                    where: { id: { in: g.ids.slice(i, i + CHUNK) }, ...guard },
                    data,
                };
                const r =
                    table === 'trades'
                        ? await tx.trade.updateMany(args)
                        : table === 'purchase_lots'
                          ? await tx.purchaseLot.updateMany(args)
                          : table === 'zoho_invoice_lines'
                            ? await tx.zohoInvoiceLine.updateMany(args)
                            : table === 'zoho_products'
                              ? await tx.zohoProduct.updateMany(args)
                              : await tx.quote.updateMany(args);
                written += r.count;
            }
        }
        return written;
    }

    async relink(body: RelinkRequest, actor: string): Promise<RelinkResult> {
        const { dryRun, correct } = body;
        const { full, person, lookups, bc } = await this.resolverData();
        const plans = new Map<RelinkTable, RelinkPlan>();
        for (const table of RELINK_TABLES) {
            const { spec, rows } = await this.load(table, bc);
            plans.set(
                table,
                planRelink(rows, spec, full, person, lookups, correct),
            );
        }
        const written = new Map<RelinkTable, number>();
        if (!dryRun) {
            // One transaction for the whole apply. Nothing here touches allocation of sales to lots: that runs on
            // the next tradesheet import.
            await this.prisma.$transaction(
                async (tx) => {
                    for (const table of RELINK_TABLES) {
                        const plan = plans.get(table)!;
                        written.set(
                            table,
                            await this.write(
                                tx,
                                table,
                                groupChanges(plan.changes),
                            ),
                        );
                    }
                    await this.audit.record(
                        actor,
                        'product-relink',
                        `correct ${correct ? 'on' : 'off'}; ` +
                            RELINK_TABLES.map((t) => {
                                const c = plans.get(t)!.counts;
                                return `${t} fill ${c.fill} correct ${correct ? c.correct : 0} written ${written.get(t)}`;
                            }).join('; '),
                        tx,
                    );
                },
                { timeout: 300_000, maxWait: 10_000 },
            );
        }
        const out = (t: RelinkTable) => ({
            ...plans.get(t)!.counts,
            written: written.get(t) ?? 0,
        });
        return {
            dryRun,
            correct,
            tables: {
                trades: out('trades'),
                purchase_lots: out('purchase_lots'),
                zoho_invoice_lines: out('zoho_invoice_lines'),
                zoho_products: out('zoho_products'),
                quotes: out('quotes'),
            },
        };
    }
}
