import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { RawProduct } from '@goldilocks/shared-types';
import { toRawProduct } from '../../common/utils/pricing.util';
import {CacheAsideStore} from "../../common/cache/cache-aside-store.base";

const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCTS_CACHE_TTL_SECONDS = 300;

@Injectable()
export class ProductCacheStore extends CacheAsideStore<'all', RawProduct[]> {
    constructor(redis: RedisService, private readonly prisma: PrismaService) {
        super(redis, PRODUCTS_CACHE_TTL_SECONDS);
    }

    protected cacheKey(): string {
        return PRODUCTS_CACHE_KEY;
    }

    protected async fetchFromSource(): Promise<RawProduct[]> {
        const products = await this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return products.map(toRawProduct);
    }
}