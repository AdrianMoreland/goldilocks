import { Injectable } from '@nestjs/common';
import type {
    BcSalesProductsApplyRequest,
    BcSalesProductsApplyResult,
    BcSalesProductsPreview,
} from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { planBcSalesProducts } from './bc-sales-products';

type Db = PrismaService | Prisma.TransactionClient;

/** Makes specific products from the Business Central item list: a preview first, then the ones that are ready. */
@Injectable()
export class BcSalesProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    private async plan(db: Db): Promise<BcSalesProductsPreview> {
        const [items, catalogue] = await Promise.all([
            db.bcItem.findMany({
                orderBy: { itemNo: 'asc' },
                select: {
                    itemNo: true,
                    description: true,
                    productId: true,
                    salesProductId: true,
                },
            }),
            db.product.findMany({
                where: { deletedAt: null },
                select: { id: true, sku: true, name: true, metalType: true },
            }),
        ]);
        return planBcSalesProducts(items, catalogue);
    }

    preview(): Promise<BcSalesProductsPreview> {
        return this.plan(this.prisma);
    }

    /** Creates the ready rows (or the chosen ones among them) and links the items. Safe to run again. */
    async apply(
        body: BcSalesProductsApplyRequest,
        actor: string,
    ): Promise<BcSalesProductsApplyResult> {
        return this.prisma.$transaction(async (tx) => {
            // Worked out again inside the transaction, so only rows that are ready now are created.
            const { rows } = await this.plan(tx);
            const chosen = body.itemNos?.length ? new Set(body.itemNos) : null;
            const picked = rows.filter((r) => !chosen || chosen.has(r.itemNo));
            const ready = picked.filter((r) => r.action === 'CREATE');

            const existing = ready.length
                ? await tx.salesProduct.findMany({
                      where: { name: { in: ready.map((r) => r.name) } },
                      select: { id: true, name: true },
                  })
                : [];
            const byName = new Map(existing.map((p) => [p.name, p.id]));

            let created = 0;
            let linked = 0;
            for (const r of ready) {
                let id = byName.get(r.name);
                if (id === undefined) {
                    const p = await tx.salesProduct.create({
                        data: {
                            name: r.name,
                            metal: r.metal ?? 'GOLD',
                            genericNorm: r.genericNorm,
                            refinery: r.refinery,
                            pricingProductId: r.pricingProductId,
                            active: true,
                        },
                        select: { id: true },
                    });
                    id = p.id;
                    byName.set(r.name, id);
                    created++;
                } else linked++;
                await tx.bcItem.update({
                    where: { itemNo: r.itemNo },
                    data: { salesProductId: id },
                });
            }
            const skipped = picked.filter((r) => r.action === 'SKIP').length;
            if (created + linked > 0)
                await this.audit.record(
                    actor,
                    'sales-products-from-bc',
                    `${created} specific products created, ${linked} items linked to existing ones`,
                    tx,
                );
            return { created, linked, skipped };
        });
    }
}
