import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RawProduct } from '@goldilocks/shared-types';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ProductCacheStore } from './product-cache.store';
export declare class ProductsProvider {
    private readonly prisma;
    private readonly productCache;
    private readonly audit;
    private readonly logger;
    constructor(prisma: PrismaService, productCache: ProductCacheStore, audit: AuditLogService);
    getAll(): Promise<RawProduct[]>;
    getById(id: number): Promise<RawProduct | null>;
    getByIds(ids: number[]): Promise<RawProduct[]>;
    findBySku(sku: string): Promise<{
        id: number;
        deletedAt: Date | null;
    } | null>;
    getDeleted(): Promise<(RawProduct & {
        deletedAt: string;
    })[]>;
    getDeletedById(id: number): Promise<RawProduct | null>;
    create(data: {
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
    }, actor: string): Promise<RawProduct>;
    update(id: number, data: Partial<RawProduct>, actor: string, expectedUpdatedAt?: string): Promise<RawProduct>;
    softDelete(id: number, actor: string): Promise<RawProduct>;
    restore(id: number, actor: string): Promise<RawProduct>;
    updateStock(id: number, stock: number, actor: string): Promise<RawProduct>;
    private change;
    private refreshCache;
}
//# sourceMappingURL=products.provider.d.ts.map