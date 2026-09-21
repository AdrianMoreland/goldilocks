import { Logger } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';

export abstract class CacheAsideStore<TKey, TValue> {
    private readonly storeLogger = new Logger(this.constructor.name);

    protected constructor(
        protected readonly redis: RedisService,
        protected readonly ttlSeconds: number,
    ) {}

    protected abstract cacheKey(key: TKey): string;
    protected abstract fetchFromSource(key: TKey): Promise<TValue | null>;

    /**
     * Whether a value is good enough to serve/cache as-is. Defaults to
     * "anything non-null" — override when a technically-present value can
     * still be garbage (e.g. a spot price of exactly 0 from an upstream
     * failure that got persisted before this check existed). An unusable
     * cached value is treated like a miss (falls through to fetchFromSource)
     * and an unusable fresh value is still returned (so callers have
     * something to show) but is deliberately never written back to the
     * cache, so it can't keep re-poisoning reads until it expires.
     */
    protected isUsable(value: TValue): boolean {
        return true;
    }

    async get(key: TKey): Promise<TValue | null> {
        const redisKey = this.cacheKey(key);
        const cached = await this.redis.get<TValue>(redisKey);

        if (cached !== null && this.isUsable(cached)) {
            this.storeLogger.debug(`Cache hit for "${redisKey}"`);
            return cached;
        }

        if (cached !== null) {
            this.storeLogger.warn(`Cached value for "${redisKey}" is unusable — querying source instead`);
        } else {
            this.storeLogger.debug(`Cache miss for "${redisKey}", querying source…`);
        }

        const fresh = await this.fetchFromSource(key);

        if (fresh === null) {
            this.storeLogger.warn(`No data found at source for "${redisKey}"`);
            return null;
        }

        if (this.isUsable(fresh)) {
            await this.set(key, fresh);
        } else {
            this.storeLogger.warn(`Source value for "${redisKey}" is unusable — not caching it`);
        }

        return fresh;
    }

    async set(key: TKey, value: TValue): Promise<void> {
        const redisKey = this.cacheKey(key);
        await this.redis.set(redisKey, value, this.ttlSeconds);
        this.storeLogger.debug(`Cached "${redisKey}" (TTL ${this.ttlSeconds}s)`);
    }
}