import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { MetalType, RawSpotPrice } from '@goldilocks/shared-types';
import { CacheAsideStore } from '../../common/cache/cache-aside-store.base';
import { toRawMetalSpotPrice } from '../../common/utils/pricing.util';

const SPOT_CACHE_TTL_SECONDS = 3600;

@Injectable()
export class SpotPriceCacheStore extends CacheAsideStore<
    MetalType,
    RawSpotPrice
> {
    constructor(
        redis: RedisService,
        private readonly prisma: PrismaService,
    ) {
        super(redis, SPOT_CACHE_TTL_SECONDS);
    }

    protected cacheKey(metal: MetalType): string {
        return `metal:${metal}`;
    }

    protected async fetchFromSource(
        metal: MetalType,
    ): Promise<RawSpotPrice | null> {
        const row = await this.prisma.metalSpotPrice.findFirst({
            where: { metalType: metal },
            orderBy: { timestamp: 'desc' },
        });
        return row ? toRawMetalSpotPrice(row) : null;
    }

    // A price of exactly 0 is never real market data — it's what an
    // upstream API failure looked like before it got persisted. Treating it
    // as "unusable" (rather than "present") means get() skips a poisoned
    // cache entry and re-queries the DB instead of serving 0.00 for up to
    // a full TTL, and never re-caches a 0 it reads back from the DB either.
    protected isUsable(value: RawSpotPrice): boolean {
        return value.priceEur > 0;
    }

    /** Cache-only read, no DB fallback — for callers implementing their own multi-tier cascade (see MetalsProvider). */
    async getCachedOnly(metal: MetalType): Promise<RawSpotPrice | null> {
        return this.redis.get<RawSpotPrice>(this.cacheKey(metal));
    }

    /** DB-only read, bypassing the cache entirely — for callers implementing their own multi-tier cascade. */
    async getFromDbOnly(metal: MetalType): Promise<RawSpotPrice | null> {
        return this.fetchFromSource(metal);
    }

    /** Admin "Clear price cache" action — forces the next read of every metal back to the DB/API instead of whatever's cached. */
    async clearAll(metals: readonly MetalType[]): Promise<void> {
        await this.redis.del(...metals.map((m) => this.cacheKey(m)));
    }
}
