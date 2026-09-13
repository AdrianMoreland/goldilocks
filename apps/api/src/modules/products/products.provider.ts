import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {RawProduct} from "@goldilocks/shared-types";
import {toRawProduct} from "../../common/utils/pricing.util";
import {ProductCacheStore} from "./product-cache.store";


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

    async getById(id: number): Promise<RawProduct | null> {
        const product = await this.prisma.product.findUnique({ where: { id } });
        return product ? toRawProduct(product) : null;
    }

    async findBySku(sku: string): Promise<{ id: number } | null> {
        return this.prisma.product.findFirst({
            where: { sku: { equals: sku, mode: 'insensitive' } },
            select: { id: true },
        });
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
        description?: string;
    }): Promise<RawProduct> {
        const created = await this.prisma.product.create({ data });
        await this.refreshCache();
        return toRawProduct(created);
    }

    async update(id: number, data: Partial<RawProduct>): Promise<RawProduct> {
        const updated = await this.prisma.product.update({ where: { id }, data });
        await this.refreshCache();
        return toRawProduct(updated);
    }

    async delete(id: number): Promise<RawProduct> {
        const deleted = await this.prisma.product.delete({ where: { id } });
        await this.refreshCache();
        return toRawProduct(deleted);
    }

    async updateStock(id: number, stock: number): Promise<RawProduct> {
        const updated = await this.prisma.product.update({ where: { id }, data: { stock } });
        await this.refreshCache();
        return toRawProduct(updated);
    }

    private async refreshCache(): Promise<void> {
        const fresh = await this.prisma.product
            .findMany({ orderBy: { createdAt: 'desc' } })
            .then((rows) => rows.map(toRawProduct));
        await this.productCache.set('all', fresh);
    }


 /*   async getAll(): Promise<RawProduct[]> {
        const cached = await this.redis.get<RawProduct[]>(PRODUCTS_CACHE_KEY);
        if (cached) {
            return cached;
        }

        const rows = await this.fetchAllFromDb();
        await this.redis.set(PRODUCTS_CACHE_KEY, rows, PRODUCTS_CACHE_TTL_SECONDS);
        return rows;
    }

    async getById(id: number): Promise<RawProduct | null> {
        const product =
            await this.prisma.product.findUnique({
                where: { id },
            });

        return product
            ? toRawProduct(product)
            : null;
    }

    async findBySku(sku: string): Promise<{ id: number } | null> {
        return this.prisma.product.findFirst({
            where: { sku: { equals: sku, mode: 'insensitive' } },
            select: { id: true },
        });
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
        description?: string;
    }): Promise<RawProduct> {
        const created = await this.prisma.product.create({ data });
        await this.refreshCache();
        return toRawProduct(created);
    }

    async update(id: number, data: Partial<RawProduct>): Promise<RawProduct> {
        const updated = await this.prisma.product.update({ where: { id }, data });
        await this.refreshCache();
        return toRawProduct(updated);
    }

    async delete(id: number): Promise<RawProduct> {
        const deleted = await this.prisma.product.delete({
            where: { id },
        });
        await this.refreshCache();
        return toRawProduct(deleted);
    }

    async updateStock(id: number, stock: number): Promise<RawProduct> {
        const updated = await this.prisma.product.update({
            where: { id },
            data: { stock },
        });
        await this.refreshCache();
        return toRawProduct(updated);
    }

    private async fetchAllFromDb(): Promise<RawProduct[]> {
        this.logger.debug('Reading products from DB…');

        const products = await this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return products.map(toRawProduct);
    }

    /!**
     * Mutations invalidate the cache by writing fresh data straight back in,
     * rather than requiring a separate `del` on RedisService.
     *!/
    private async refreshCache(): Promise<void> {
        const fresh = await this.fetchAllFromDb();
        await this.redis.set(PRODUCTS_CACHE_KEY, fresh, PRODUCTS_CACHE_TTL_SECONDS);
    }*/
}