import {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

// One atomic step, so a crash between INCR and EXPIRE can never leave a counter that never expires.
const INCREMENT_SCRIPT = `local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return count`;

// Decrement, but never below zero: a release after the key has already expired must not leave a negative count.
const DECREMENT_SCRIPT = `local count = tonumber(redis.call('GET', KEYS[1]))
if count and count > 0 then return redis.call('DECR', KEYS[1]) end
return 0`;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    private client: Redis | null = null;
    private isConnected = false;

    constructor(private readonly config: ConfigService) {}

    onModuleInit() {
        const url = this.config.get<string>('REDIS_URL');

        if (!url) {
            this.logger.warn('REDIS_URL not set → running without Redis');
            return;
        }

        this.client = new Redis(url, {
            maxRetriesPerRequest: 1,
            // Never return null: that puts ioredis in its terminal "end" state,
            // so a brief outage would switch the caches off until the process
            // restarted. Keep retrying with a capped backoff; meanwhile
            // isConnected=false makes every call a cheap no-op / cache miss.
            retryStrategy: (times) => Math.min(times * 200, 5000),
        });

        // "ready" (not "connect") is when commands can actually be issued.
        this.client.on('ready', () => {
            this.isConnected = true;
            this.logger.log('✅ Redis connected');
        });

        this.client.on('close', () => {
            this.isConnected = false;
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            this.logger.warn(`Redis error: ${err.message}`);
        });
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.client || !this.isConnected) return null;

        try {
            const data = await this.client.get(key);
            return data ? (JSON.parse(data) as T) : null;
        } catch (err) {
            this.logger.warn(`Redis GET failed: ${key}`);
            return null;
        }
    }

    async set(key: string, value: any, ttl = 3600): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            await this.client.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (err) {
            this.logger.warn(`Redis SET failed: ${key}`);
        }
    }

    async del(...keys: string[]): Promise<void> {
        if (!this.client || !this.isConnected || keys.length === 0) return;

        try {
            await this.client.del(...keys);
        } catch (err) {
            this.logger.warn(`Redis DEL failed: ${keys.join(', ')}`);
        }
    }

    /**
     * Adds one to a counter and, when it is first created, gives it an expiry.
     * Returns the new count, or null when Redis is unavailable — callers that
     * enforce a limit must treat null as "refuse", not "allow".
     */
    async increment(key: string, ttlSeconds: number): Promise<number | null> {
        if (!this.client || !this.isConnected) return null;

        try {
            return Number(
                await this.client.eval(INCREMENT_SCRIPT, 1, key, ttlSeconds),
            );
        } catch (err) {
            this.logger.warn(`Redis INCR failed: ${key}`);
            return null;
        }
    }

    /** Takes one off a counter made by increment(), never going below zero. */
    async decrement(key: string): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            await this.client.eval(DECREMENT_SCRIPT, 1, key);
        } catch (err) {
            this.logger.warn(`Redis DECR failed: ${key}`);
        }
    }

    /** Prepend to a list and trim it to `maxLength` — a capped, newest-first log. Returns false if Redis is unavailable. */
    async pushCapped(
        key: string,
        value: unknown,
        maxLength: number,
    ): Promise<boolean> {
        if (!this.client || !this.isConnected) return false;

        try {
            await this.client
                .multi()
                .lpush(key, JSON.stringify(value))
                .ltrim(key, 0, maxLength - 1)
                .exec();
            return true;
        } catch (err) {
            this.logger.warn(`Redis LPUSH failed: ${key}`);
            return false;
        }
    }

    /** Newest-first slice of a list written by pushCapped, or null if Redis is unavailable. */
    async listRange<T>(key: string, count: number): Promise<T[] | null> {
        if (!this.client || !this.isConnected) return null;

        try {
            const rows = await this.client.lrange(key, 0, count - 1);
            return rows.map((row) => JSON.parse(row) as T);
        } catch (err) {
            this.logger.warn(`Redis LRANGE failed: ${key}`);
            return null;
        }
    }

    /**
     * Adds to several hash fields in one round trip and (re)sets the key's
     * expiry — the building block for hourly traffic buckets. Fire-and-forget
     * by design: a metrics write must never fail the request it describes.
     */
    async hashIncrementMany(
        key: string,
        fields: Record<string, number>,
        ttlSeconds: number,
    ): Promise<void> {
        if (!this.client || !this.isConnected) return;

        try {
            const tx = this.client.multi();
            for (const [field, by] of Object.entries(fields)) {
                tx.hincrbyfloat(key, field, by);
            }
            await tx.expire(key, ttlSeconds).exec();
        } catch {
            this.logger.warn(`Redis HINCRBY failed: ${key}`);
        }
    }

    /** Every field of a hash as numbers, or null when Redis is unavailable (an absent key is an empty object). */
    async hashGetAllNumbers(
        key: string,
    ): Promise<Record<string, number> | null> {
        if (!this.client || !this.isConnected) return null;

        try {
            const raw = await this.client.hgetall(key);
            return Object.fromEntries(
                Object.entries(raw).map(([field, value]) => [
                    field,
                    Number(value),
                ]),
            );
        } catch {
            this.logger.warn(`Redis HGETALL failed: ${key}`);
            return null;
        }
    }

    /** For GET /health — true once the client has connected, never set back by a missing REDIS_URL (there's simply no client to report on). */
    isHealthy(): boolean {
        return this.isConnected;
    }
}
