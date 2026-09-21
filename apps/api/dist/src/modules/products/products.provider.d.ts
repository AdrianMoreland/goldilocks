import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawProduct } from "@goldilocks/shared-types";
import { ProductCacheStore } from "./product-cache.store";
export declare class ProductsProvider {
    private readonly prisma;
    private readonly productCache;
    private readonly logger;
    constructor(prisma: PrismaService, productCache: ProductCacheStore);
    getAll(): Promise<RawProduct[]>;
    getById(id: number): Promise<RawProduct | null>;
    findBySku(sku: string): Promise<{
        id: number;
    } | null>;
    create(data: {
        sku: string;
        name: string;
        metalType: RawProduct['metalType'];
        weight: number;
        spreadSell: number;
        spreadBuy: number;
        vatRate: number;
        stock: number;
        description?: string;
    }): Promise<RawProduct>;
    update(id: number, data: Partial<RawProduct>): Promise<RawProduct>;
    delete(id: number): Promise<RawProduct>;
    updateStock(id: number, stock: number): Promise<RawProduct>;
    private refreshCache;
}
//# sourceMappingURL=products.provider.d.ts.map