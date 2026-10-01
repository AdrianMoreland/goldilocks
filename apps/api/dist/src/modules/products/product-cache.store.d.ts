import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { RawProduct } from '@goldilocks/shared-types';
import { CacheAsideStore } from '../../common/cache/cache-aside-store.base';
export declare class ProductCacheStore extends CacheAsideStore<'all', RawProduct[]> {
    private readonly prisma;
    constructor(redis: RedisService, prisma: PrismaService);
    protected cacheKey(): string;
    protected fetchFromSource(): Promise<RawProduct[]>;
}
//# sourceMappingURL=product-cache.store.d.ts.map