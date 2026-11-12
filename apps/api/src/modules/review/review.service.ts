import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    normaliseRefinery,
    ReviewLinksQuerySchema,
    ReviewPageQuerySchema,
    type CreateSalesProductRequest,
    type DuplicatesResponse,
    type LinkDecisionRequest,
    type LinkDecisionResult,
    type MapAliasRequest,
    type OverAllocatedResponse,
    type SettleResult,
    type PricingProductOption,
    type ReviewLinksQuery,
    type ReviewLinksResponse,
    type ReviewPageQuery,
    type ReviewSummary,
    type SalesProduct,
    type UnresolvedLotsResponse,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { LinkRulesService } from './link-rules.service';

/** A name nobody has settled yet: no specific product, no pricing product, not marked as a non-product. */
const UNSETTLED_ALIAS = {
    salesProductId: null,
    productId: null,
    noProduct: false,
} satisfies Prisma.ProductAliasWhereInput;

type End = { table: string; label: string; detail: string | null };

const day = (d: unknown): string | null =>
    d instanceof Date ? d.toISOString().slice(0, 10) : null;
const num = (v: unknown): number | null =>
    v === null || v === undefined ? null : Number(v);
const join = (...parts: (string | number | null | undefined)[]): string =>
    parts.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');

/**
 * What the import could not settle by itself, for an admin to decide. A decision is stored on the link or the alias;
 * it never rewrites a trade, lot or invoice. Customer names appear only in the detail line of a row, admin only.
 */
@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
        private readonly rules: LinkRulesService,
    ) {}

    private linkQuery(query: Record<string, unknown>): ReviewLinksQuery {
        const parsed = ReviewLinksQuerySchema.safeParse(query);
        if (!parsed.success) throw new BadRequestException('Invalid query.');
        return parsed.data;
    }

    private pageQuery(query: Record<string, unknown>): ReviewPageQuery {
        const parsed = ReviewPageQuerySchema.safeParse(query);
        if (!parsed.success) throw new BadRequestException('Invalid query.');
        return parsed.data;
    }

    // --- summary ---------------------------------------------------------------------------------

    /** Pending trade-to-lot links on a purchase line with more sold than bought belong to Too many sales, not here. */
    private async notOverSold(): Promise<Prisma.EntityLinkWhereInput> {
        const keys = (await this.overAllocatedLots())
            .map((l) => l.sourceKey)
            .filter((k): k is string => k !== null);
        return keys.length
            ? { NOT: { linkType: 'trade_lot', toKey: { in: keys } } }
            : {};
    }

    async summary(): Promise<ReviewSummary> {
        const hide = await this.notOverSold();
        const [byType, unresolvedLots, duplicates, aliases, overAllocated] =
            await Promise.all([
                this.prisma.entityLink.groupBy({
                    by: ['linkType'],
                    where: { status: 'PENDING', ...hide },
                    _count: { _all: true },
                }),
                this.prisma.trade.count({ where: this.unresolvedWhere() }),
                this.prisma.trade.count({ where: this.duplicateWhere() }),
                this.prisma.productAlias.count({ where: UNSETTLED_ALIAS }),
                this.overAllocatedLots().then((l) => l.length),
            ]);
        return {
            links: Object.fromEntries(
                byType.map((g) => [g.linkType, g._count._all]),
            ),
            unresolvedLots,
            duplicates,
            aliases,
            overAllocated,
        };
    }

    // --- links -----------------------------------------------------------------------------------

    async links(
        rawQuery: Record<string, unknown>,
    ): Promise<ReviewLinksResponse> {
        const { type, limit, offset } = this.linkQuery(rawQuery);
        const hide = await this.notOverSold();
        const where: Prisma.EntityLinkWhereInput = {
            ...hide,
            status: 'PENDING',
            ...(type ? { linkType: type } : {}),
        };
        const [total, rows] = await Promise.all([
            this.prisma.entityLink.count({ where }),
            this.prisma.entityLink.findMany({
                where,
                orderBy: { id: 'asc' },
                skip: offset,
                take: limit,
            }),
        ]);

        const wanted = new Map<string, Set<string>>();
        const want = (table: string, key: string) =>
            (wanted.get(table) ?? wanted.set(table, new Set()).get(table)!).add(
                key,
            );
        for (const r of rows) {
            want(r.fromTable, r.fromKey);
            want(r.toTable, r.toKey);
        }
        const described = new Map<string, End>();
        for (const [table, keys] of wanted) {
            for (const [key, end] of await this.describe(table, [...keys]))
                described.set(`${table}\u0001${key}`, end);
        }
        const end = (table: string, key: string): End =>
            described.get(`${table}\u0001${key}`) ?? {
                table,
                label: key,
                detail: null,
            };

        const verdicts = await this.rules.judge(this.prisma, rows);
        const whyOf = (id: number): string | null => {
            const v = verdicts.get(id);
            if (!v) return null;
            return v.verdict === 'CONFIRM'
                ? 'Looks right; the rules have not settled it yet.'
                : v.reason;
        };

        return {
            total,
            rows: rows.map((r) => ({
                id: r.id,
                why: whyOf(r.id),
                linkType: r.linkType,
                confidence: r.confidence,
                method: r.method,
                note: r.note,
                from: end(r.fromTable, r.fromKey),
                to: end(r.toTable, r.toKey),
            })),
        };
    }

    /** A recognisable line for each imported row a link points at. Unknown tables fall back to the key. */
    private async describe(
        table: string,
        keys: string[],
    ): Promise<Map<string, End>> {
        const out = new Map<string, End>();
        const put = (key: string, label: string, detail: string | null) =>
            out.set(key, { table, label, detail });
        const by = { sourceKey: { in: keys } };

        if (table === 'trades') {
            for (const t of await this.prisma.trade.findMany({ where: by })) {
                put(
                    t.sourceKey!,
                    join(
                        t.reference,
                        t.qty !== null ? `${t.qty} ×` : null,
                        t.productText,
                    ),
                    join(day(t.date), t.client),
                );
            }
            // A sale the sheet still lists as a quote (an invoice shows it happened).
            const quoteKeys = keys.filter((k) => !out.has(k));
            if (quoteKeys.length) {
                for (const q of await this.prisma.quote.findMany({
                    where: { sourceKey: { in: quoteKeys } },
                    include: { customer: true },
                })) {
                    put(
                        q.sourceKey,
                        join(
                            q.reference,
                            num(q.qty) !== null ? `${num(q.qty)} ×` : null,
                            q.productText,
                            'quote only on the sheet',
                        ),
                        join(day(q.date), q.customer?.name),
                    );
                }
            }
        } else if (table === 'purchase_lots') {
            for (const l of await this.prisma.purchaseLot.findMany({
                where: by,
            })) {
                put(
                    l.sourceKey!,
                    join(
                        l.reference,
                        l.qty !== null ? `${l.qty} ×` : null,
                        l.productText,
                    ),
                    join(day(l.received), l.client),
                );
            }
        } else if (table === 'invoice_lines') {
            for (const l of await this.prisma.zohoInvoiceLine.findMany({
                where: by,
                include: { customer: true },
            })) {
                put(
                    l.sourceKey,
                    join(
                        num(l.qty) !== null ? `${num(l.qty)} ×` : null,
                        l.itemName,
                        l.refinery,
                    ),
                    join(day(l.date), l.customer?.name),
                );
            }
        } else if (table === 'bc_sales_orders') {
            for (const o of await this.prisma.bcSalesOrder.findMany({
                where: by,
                include: { customer: true },
            })) {
                put(
                    o.sourceKey,
                    join(o.extDocNo, o.sourceKey),
                    join(
                        day(o.docDate),
                        num(o.amount) !== null ? `€${num(o.amount)}` : null,
                        o.customer?.name,
                    ),
                );
            }
        } else if (table === 'supplier_invoices') {
            for (const s of await this.prisma.supplierInvoice.findMany({
                where: by,
            }))
                put(s.sourceKey, join(s.supplier, s.number), day(s.lastDate));
        } else if (table === 'stock_bars') {
            for (const b of await this.prisma.stocktakeBar.findMany({
                where: by,
            }))
                put(
                    b.sourceKey!,
                    join(b.weightLabel, b.refinery, b.serial),
                    b.locationCode,
                );
        } else if (table === 'line_serials') {
            for (const s of await this.prisma.lineSerial.findMany({
                where: by,
            }))
                put(s.sourceKey, join(s.refinery, s.serial), null);
        } else if (table === 'bc_tracking_entries') {
            for (const e of await this.prisma.bcTrackingEntry.findMany({
                where: by,
            }))
                put(e.sourceKey, join(e.itemNo, e.serialNo), e.locationCode);
        }
        return out;
    }

    /** Confirms every pending link that makes sense (same product, quantity agrees, nothing over-sold). */
    async settle(actor: string): Promise<SettleResult> {
        return this.prisma.$transaction(async (tx) => {
            const res = await this.rules.settle(tx);
            await this.audit.record(
                actor,
                'review-settle',
                `${res.confirmed} confirmed by rule, ${res.asked} left to ask, ${res.overAllocated} over-allocated`,
                tx,
            );
            return res;
        });
    }

    // --- purchase lines with more sold than bought ----------------------------------------------

    /** Lots whose sales add up to more than was bought. Compared in memory: a lot count is in the hundreds. */
    private async overAllocatedLots() {
        const lots = await this.prisma.purchaseLot.findMany({
            where: { allocatedQty: { gt: 0 }, missingFromImport: false },
        });
        return lots.filter((l) => l.qty !== null && l.allocatedQty > l.qty);
    }

    async overAllocated(
        rawQuery: Record<string, unknown>,
    ): Promise<OverAllocatedResponse> {
        const { limit, offset } = this.pageQuery(rawQuery);
        const lots = (await this.overAllocatedLots()).sort(
            (a, b) => b.allocatedQty - b.qty! - (a.allocatedQty - a.qty!),
        );
        const page = lots.slice(offset, offset + limit);
        const sales = await this.prisma.trade.findMany({
            where: {
                lotId: { in: page.map((l) => l.id) },
                missingFromImport: false,
            },
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
        });
        return {
            total: lots.length,
            rows: page.map((l) => ({
                lotId: l.id,
                reference: l.reference,
                productText: l.productText,
                received: day(l.received),
                bought: l.qty!,
                sold: l.allocatedQty,
                sales: sales
                    .filter((t) => t.lotId === l.id)
                    .slice(0, 20)
                    .map((t) => ({
                        tradeId: t.id,
                        reference: t.reference,
                        date: day(t.date),
                        qty: t.qty,
                    })),
            })),
        };
    }

    /** Pending links only; a link someone has already decided is left alone. */
    async decide(
        body: LinkDecisionRequest,
        actor: string,
    ): Promise<LinkDecisionResult> {
        return this.prisma.$transaction(async (tx) => {
            const res = await tx.entityLink.updateMany({
                where: { id: { in: body.ids }, status: 'PENDING' },
                data: {
                    status: body.decision,
                    confirmedBy: actor,
                    confirmedAt: new Date(),
                },
            });
            await this.audit.record(
                actor,
                'review-links',
                `${res.count} link${res.count === 1 ? '' : 's'} ${body.decision.toLowerCase()}`,
                tx,
            );
            return { updated: res.count };
        });
    }

    // --- unresolved purchase lines and duplicate references --------------------------------------

    private unresolvedWhere(): Prisma.TradeWhereInput {
        return {
            cptyKind: 'LOT_REF',
            lotKey: { not: null },
            lotId: null,
            missingFromImport: false,
        };
    }

    private duplicateWhere(): Prisma.TradeWhereInput {
        return { occurrence: { gt: 1 }, missingFromImport: false };
    }

    async unresolvedLots(
        rawQuery: Record<string, unknown>,
    ): Promise<UnresolvedLotsResponse> {
        const { limit, offset } = this.pageQuery(rawQuery);
        const where = this.unresolvedWhere();
        const [total, rows] = await Promise.all([
            this.prisma.trade.count({ where }),
            this.prisma.trade.findMany({
                where,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                skip: offset,
                take: limit,
            }),
        ]);
        return {
            total,
            rows: rows.map((t) => ({
                tradeId: t.id,
                reference: t.reference,
                date: day(t.date),
                qty: t.qty,
                productText: t.productText,
                lotKey: t.lotKey ?? '',
                branchCode: t.branchCode,
            })),
        };
    }

    async duplicates(
        rawQuery: Record<string, unknown>,
    ): Promise<DuplicatesResponse> {
        const { limit, offset } = this.pageQuery(rawQuery);
        const where = this.duplicateWhere();
        const [total, rows] = await Promise.all([
            this.prisma.trade.count({ where }),
            this.prisma.trade.findMany({
                where,
                orderBy: [{ date: 'desc' }, { id: 'desc' }],
                skip: offset,
                take: limit,
            }),
        ]);
        return {
            total,
            rows: rows.map((t) => ({
                tradeId: t.id,
                reference: t.reference,
                occurrence: t.occurrence,
                date: day(t.date),
                qty: t.qty,
                productText: t.productText,
                branchCode: t.branchCode,
            })),
        };
    }

    // --- product aliases ---------------------------------------------------------------------------

    async salesProducts(): Promise<SalesProduct[]> {
        const rows = await this.prisma.salesProduct.findMany({
            orderBy: { name: 'asc' },
            include: { pricingProduct: true },
        });
        return rows.map((p) => ({
            id: p.id,
            name: p.name,
            metal: p.metal,
            genericNorm: p.genericNorm,
            refinery: p.refinery,
            pricingProductId: p.pricingProductId,
            pricingProductName: p.pricingProduct?.name ?? null,
        }));
    }

    /** The reduced catalogue behind the price table, for tying a sales product to one. */
    async pricingProducts(): Promise<PricingProductOption[]> {
        const rows = await this.prisma.product.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, metalType: true },
            orderBy: { name: 'asc' },
        });
        return rows.map((p) => ({
            id: p.id,
            name: p.name,
            metalType: p.metalType,
        }));
    }

    async createSalesProduct(
        body: CreateSalesProductRequest,
        actor: string,
    ): Promise<SalesProduct> {
        if (body.pricingProductId) {
            const pricing = await this.prisma.product.findUnique({
                where: { id: body.pricingProductId },
            });
            if (!pricing)
                throw new BadRequestException(
                    `Pricing product ${body.pricingProductId} not found.`,
                );
        }
        const clash = await this.prisma.salesProduct.findUnique({
            where: { name: body.name },
        });
        if (clash)
            throw new ConflictException(
                'A sales product with that name already exists.',
            );
        const created = await this.prisma.$transaction(async (tx) => {
            const p = await tx.salesProduct.create({
                data: {
                    name: body.name,
                    metal: body.metal,
                    genericNorm: body.genericNorm,
                    refinery: normaliseRefinery(body.refinery),
                    pricingProductId: body.pricingProductId ?? null,
                },
                include: { pricingProduct: true },
            });
            await this.audit.record(
                actor,
                'sales-product-create',
                `sales product ${p.id} created`,
                tx,
            );
            return p;
        });
        return {
            id: created.id,
            name: created.name,
            metal: created.metal,
            genericNorm: created.genericNorm,
            refinery: created.refinery,
            pricingProductId: created.pricingProductId,
            pricingProductName: created.pricingProduct?.name ?? null,
        };
    }

    async mapAlias(
        id: number,
        body: MapAliasRequest,
        actor: string,
    ): Promise<{ id: number }> {
        const alias = await this.prisma.productAlias.findUnique({
            where: { id },
        });
        if (!alias) throw new NotFoundException(`Alias ${id} not found.`);
        const chosen = [
            body.salesProductId,
            body.productId,
            body.noProduct,
        ].filter((v) => v !== undefined);
        if (chosen.length !== 1)
            throw new BadRequestException(
                'Choose exactly one of a sales product, a pricing product or not a product.',
            );

        let data: Prisma.ProductAliasUncheckedUpdateInput;
        let what: string;
        if (body.salesProductId !== undefined) {
            const product = await this.prisma.salesProduct.findUnique({
                where: { id: body.salesProductId },
            });
            if (!product)
                throw new BadRequestException(
                    `Sales product ${body.salesProductId} not found.`,
                );
            data = {
                salesProductId: product.id,
                productId: null,
                noProduct: false,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
                refinery: alias.refinery ?? normaliseRefinery(product.refinery),
            };
            what = `sales product ${product.id}`;
        } else if (body.productId !== undefined) {
            const product = await this.prisma.product.findUnique({
                where: { id: body.productId },
            });
            if (!product)
                throw new BadRequestException(
                    `Pricing product ${body.productId} not found.`,
                );
            data = {
                productId: product.id,
                salesProductId: null,
                noProduct: false,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
            };
            what = `pricing product ${product.id}`;
        } else {
            data = {
                noProduct: true,
                salesProductId: null,
                productId: null,
                decidedBy: 'PERSON',
                suggestedProductId: null,
                suggestedSalesProductId: null,
                suggestedNoProduct: false,
                question: null,
            };
            what = 'not a product';
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.productAlias.update({ where: { id }, data });
            await this.audit.record(
                actor,
                'alias-map',
                `alias ${id} mapped to ${what}`,
                tx,
            );
        });
        return { id };
    }
}
