import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawProduct, normalizeProductName } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { toRawProduct } from '../../common/utils/prisma-mappers';
import { AuditLogService } from '../audit-log/audit-log.service';
import { describeProductChange } from './product-audit';
import { ProductCacheStore } from './product-cache.store';

/**
 * ProductsProvider — "give me product data."
 *
 * Knows: Redis, Prisma.
 * Does NOT know: spot prices, Metals, pricing calculations.
 */
@Injectable()
export class ProductsProvider {
    private readonly logger = new Logger(ProductsProvider.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly productCache: ProductCacheStore,
        private readonly audit: AuditLogService,
    ) {}

    /**
     * All products, cache-first.
     */

    async getAll(): Promise<RawProduct[]> {
        this.logger.log('Loading all products');
        return (await this.productCache.get('all'))!; // fetchFromSource always returns an array, never null
    }

    /** A live (not soft-deleted) product. */
    async getById(id: number): Promise<RawProduct | null> {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: null },
        });
        return product ? toRawProduct(product) : null;
    }

    /** Includes soft-deleted rows — the SKU column is unique across both. */
    async findBySku(
        sku: string,
    ): Promise<{ id: number; deletedAt: Date | null } | null> {
        return this.prisma.product.findFirst({
            where: { sku: { equals: sku, mode: 'insensitive' } },
            select: { id: true, deletedAt: true },
        });
    }

    async getDeleted(): Promise<(RawProduct & { deletedAt: string })[]> {
        const rows = await this.prisma.product.findMany({
            where: { deletedAt: { not: null } },
            orderBy: { deletedAt: 'desc' },
        });
        return rows.map((row) => ({
            ...toRawProduct(row),
            deletedAt: row.deletedAt!.toISOString(),
        }));
    }

    async getDeletedById(id: number): Promise<RawProduct | null> {
        const product = await this.prisma.product.findFirst({
            where: { id, deletedAt: { not: null } },
        });
        return product ? toRawProduct(product) : null;
    }

    async create(
        data: {
            sku: string;
            name: string;
            metalType: RawProduct['metalType'];
            weight: number;
            spreadSell: number;
            spreadBuy: number;
            vatRate: number;
            stock: number;
            category?: RawProduct['category'];
            description?: string;
        },
        actor: string,
    ): Promise<RawProduct> {
        const created = await this.prisma.$transaction(async (tx) => {
            const row = await tx.product.create({
                data: { ...data, name: normalizeProductName(data.name) },
            });
            await this.audit.record(
                actor,
                'product',
                `created ${row.sku} (${row.name})`,
                tx,
            );
            return row;
        });
        await this.refreshCache();
        return toRawProduct(created);
    }

    async update(
        id: number,
        data: Partial<RawProduct>,
        actor: string,
    ): Promise<RawProduct> {
        return this.change(id, actor, 'edited', {
            ...data,
            ...(data.name === undefined
                ? {}
                : { name: normalizeProductName(data.name) }),
        });
    }

    async softDelete(id: number, actor: string): Promise<RawProduct> {
        return this.change(id, actor, 'deleted', { deletedAt: new Date() });
    }

    async restore(id: number, actor: string): Promise<RawProduct> {
        return this.change(id, actor, 'restored', { deletedAt: null });
    }

    async updateStock(
        id: number,
        stock: number,
        actor: string,
    ): Promise<RawProduct> {
        return this.change(id, actor, 'edited', { stock });
    }

    /**
     * Updates a product and records the audit entry in one transaction, so a price or stock change
     * cannot exist without its entry. The cache is rebuilt after the commit, never from inside it,
     * so a rolled-back change cannot leave the cache holding values the database does not.
     */
    private async change(
        id: number,
        actor: string,
        verb: string,
        data: Prisma.ProductUpdateInput,
    ): Promise<RawProduct> {
        const after = await this.prisma.$transaction(async (tx) => {
            const previous = await tx.product.findUniqueOrThrow({
                where: { id },
            });
            const next = await tx.product.update({ where: { id }, data });
            const changes = describeProductChange(
                toRawProduct(previous),
                toRawProduct(next),
            );
            await this.audit.record(
                actor,
                'product',
                `${verb} ${next.sku}${changes ? `: ${changes}` : ''}`,
                tx,
            );
            return toRawProduct(next);
        });
        await this.refreshCache();
        return after;
    }

    private async refreshCache(): Promise<void> {
        const fresh = await this.prisma.product
            .findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
            })
            .then((rows) => rows.map(toRawProduct));
        await this.productCache.set('all', fresh);
    }
}
