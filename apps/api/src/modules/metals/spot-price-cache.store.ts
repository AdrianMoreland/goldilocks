import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { MetalType, RawSpotPrice } from '@goldilocks/shared-types';
import {CacheAsideStore} from "../../common/cache/cache-aside-store.base";
import {toRawMetalSpotPrice} from "../../common/utils/pricing.util";

const SPOT_CACHE_TTL_SECONDS = 3600;

@Injectable()
export class SpotPriceCacheStore extends CacheAsideStore<MetalType, RawSpotPrice> {
    constructor(redis: RedisService, private readonly prisma: PrismaService) {
        super(redis, SPOT_CACHE_TTL_SECONDS);
    }

    protected cacheKey(metal: MetalType): string {
        return `metal:${metal}`;
    }

    protected async fetchFromSource(metal: MetalType): Promise<RawSpotPrice | null> {
        const row = await this.prisma.metalSpotPrice.findFirst({
            where: { metalType: metal },
            orderBy: { timestamp: 'desc' },
        });
        return row ? toRawMetalSpotPrice(row) : null;
    }
}