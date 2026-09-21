import { RedisService } from '../../redis/redis.service';
export declare abstract class CacheAsideStore<TKey, TValue> {
    protected readonly redis: RedisService;
    protected readonly ttlSeconds: number;
    private readonly storeLogger;
    protected constructor(redis: RedisService, ttlSeconds: number);
    protected abstract cacheKey(key: TKey): string;
    protected abstract fetchFromSource(key: TKey): Promise<TValue | null>;
    protected isUsable(value: TValue): boolean;
    get(key: TKey): Promise<TValue | null>;
    set(key: TKey, value: TValue): Promise<void>;
}
//# sourceMappingURL=cache-aside-store.base.d.ts.map