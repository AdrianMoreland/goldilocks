import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawProduct, normalizeProductName } from '@goldilocks/shared-types';
import { toRawProduct } from '../../common/utils/pricing.util';
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

    async create(data: {
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
    }): Promise<RawProduct> {
        const created = await this.prisma.product.create({
            data: { ...data, name: normalizeProductName(data.name) },
        });
        await this.refreshCache();
        return toRawProduct(created);
    }

    async update(id: number, data: Partial<RawProduct>): Promise<RawProduct> {
        const updated = await this.prisma.product.update({
            where: { id },
            data:
                data.name === undefined
                    ? data
                    : { ...data, name: normalizeProductName(data.name) },
        });
        await this.refreshCache();
        return toRawProduct(updated);
    }

    async softDelete(id: number): Promise<RawProduct> {
        const deleted = await this.prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.refreshCache();
        return toRawProduct(deleted);
    }

    async restore(id: number): Promise<RawProduct> {
        const restored = await this.prisma.product.update({
            where: { id },
            data: { deletedAt: null },
        });
        await this.refreshCache();
        return toRawProduct(restored);
    }

    async updateStock(id: number, stock: number): Promise<RawProduct> {
        const updated = await this.prisma.product.update({
            where: { id },
            data: { stock },
        });
        await this.refreshCache();
        return toRawProduct(updated);
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
