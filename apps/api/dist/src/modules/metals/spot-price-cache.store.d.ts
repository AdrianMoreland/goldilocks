import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { MetalType, RawSpotPrice } from '@goldilocks/shared-types';
import { CacheAsideStore } from '../../common/cache/cache-aside-store.base';
export declare class SpotPriceCacheStore extends CacheAsideStore<MetalType, RawSpotPrice> {
    private readonly prisma;
    constructor(redis: RedisService, prisma: PrismaService);
    protected cacheKey(metal: MetalType): string;
    protected fetchFromSource(metal: MetalType): Promise<RawSpotPrice | null>;
    protected isUsable(value: RawSpotPrice): boolean;
    getCachedOnly(metal: MetalType): Promise<RawSpotPrice | null>;
    getFromDbOnly(metal: MetalType): Promise<RawSpotPrice | null>;
    clearAll(metals: readonly MetalType[]): Promise<void>;
}
//# sourceMappingURL=spot-price-cache.store.d.ts.map