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

    async get(key: TKey): Promise<TValue | null> {
        const redisKey = this.cacheKey(key);
        const cached = await this.redis.get<TValue>(redisKey);

        if (cached !== null) {
            this.storeLogger.debug(`Cache hit for "${redisKey}"`);
            return cached;
        }

        this.storeLogger.debug(`Cache miss for "${redisKey}", querying source…`);
        const fresh = await this.fetchFromSource(key);

        if (fresh === null) {
            this.storeLogger.warn(`No data found at source for "${redisKey}"`);
            return null;
        }

        await this.set(key, fresh);
        return fresh;
    }

    async set(key: TKey, value: TValue): Promise<void> {
        const redisKey = this.cacheKey(key);
        await this.redis.set(redisKey, value, this.ttlSeconds);
        this.storeLogger.debug(`Cached "${redisKey}" (TTL ${this.ttlSeconds}s)`);
    }
}