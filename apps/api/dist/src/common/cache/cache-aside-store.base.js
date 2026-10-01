"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheAsideStore = void 0;
const common_1 = require("@nestjs/common");
class CacheAsideStore {
    redis;
    ttlSeconds;
    storeLogger = new common_1.Logger(this.constructor.name);
    constructor(redis, ttlSeconds) {
        this.redis = redis;
        this.ttlSeconds = ttlSeconds;
    }
    isUsable(_value) {
        return true;
    }
    async get(key) {
        const redisKey = this.cacheKey(key);
        const cached = await this.redis.get(redisKey);
        if (cached !== null && this.isUsable(cached)) {
            this.storeLogger.debug(`Cache hit for "${redisKey}"`);
            return cached;
        }
        if (cached !== null) {
            this.storeLogger.warn(`Cached value for "${redisKey}" is unusable — querying source instead`);
        }
        else {
            this.storeLogger.debug(`Cache miss for "${redisKey}", querying source…`);
        }
        const fresh = await this.fetchFromSource(key);
        if (fresh === null) {
            this.storeLogger.warn(`No data found at source for "${redisKey}"`);
            return null;
        }
        if (this.isUsable(fresh)) {
            await this.set(key, fresh);
        }
        else {
            this.storeLogger.warn(`Source value for "${redisKey}" is unusable — not caching it`);
        }
        return fresh;
    }
    async set(key, value) {
        const redisKey = this.cacheKey(key);
        await this.redis.set(redisKey, value, this.ttlSeconds);
        this.storeLogger.debug(`Cached "${redisKey}" (TTL ${this.ttlSeconds}s)`);
    }
}
exports.CacheAsideStore = CacheAsideStore;
//# sourceMappingURL=cache-aside-store.base.js.map