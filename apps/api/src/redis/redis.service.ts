import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name)

    private client: Redis | null = null
    private isConnected = false

    constructor(private readonly config: ConfigService) {}

    async onModuleInit() {
        const url = this.config.get<string>('REDIS_URL')

        if (!url) {
            this.logger.warn('REDIS_URL not set → running without Redis')
            return
        }

        this.client = new Redis(url, {
            maxRetriesPerRequest: 1,
            retryStrategy: (times) => {
                if (times > 3) {
                    this.logger.error('Redis retry limit reached')
                    return null // stop retrying
                }
                return Math.min(times * 100, 2000)
            },
        })

        this.client.on('connect', () => {
            this.isConnected = true
            this.logger.log('✅ Redis connected')
        })

        this.client.on('error', (err) => {
            this.isConnected = false
            this.logger.warn(`Redis error: ${err.message}`)
        })
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit()
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.client || !this.isConnected) return null

        try {
            const data = await this.client.get(key)
            return data ? JSON.parse(data) : null
        } catch (err) {
            this.logger.warn(`Redis GET failed: ${key}`)
            return null
        }
    }

    async set(key: string, value: any, ttl = 3600): Promise<void> {
        if (!this.client || !this.isConnected) return

        try {
            await this.client.set(key, JSON.stringify(value), 'EX', ttl)
        } catch (err) {
            this.logger.warn(`Redis SET failed: ${key}`)
        }
    }

    async del(...keys: string[]): Promise<void> {
        if (!this.client || !this.isConnected || keys.length === 0) return

        try {
            await this.client.del(...keys)
        } catch (err) {
            this.logger.warn(`Redis DEL failed: ${keys.join(', ')}`)
        }
    }

    /** Prepend to a list and trim it to `maxLength` — a capped, newest-first log. Returns false if Redis is unavailable. */
    async pushCapped(key: string, value: unknown, maxLength: number): Promise<boolean> {
        if (!this.client || !this.isConnected) return false

        try {
            await this.client.multi().lpush(key, JSON.stringify(value)).ltrim(key, 0, maxLength - 1).exec()
            return true
        } catch (err) {
            this.logger.warn(`Redis LPUSH failed: ${key}`)
            return false
        }
    }

    /** Newest-first slice of a list written by pushCapped, or null if Redis is unavailable. */
    async listRange<T>(key: string, count: number): Promise<T[] | null> {
        if (!this.client || !this.isConnected) return null

        try {
            const rows = await this.client.lrange(key, 0, count - 1)
            return rows.map((row) => JSON.parse(row) as T)
        } catch (err) {
            this.logger.warn(`Redis LRANGE failed: ${key}`)
            return null
        }
    }

    /** For GET /health — true once the client has connected, never set back by a missing REDIS_URL (there's simply no client to report on). */
    isHealthy(): boolean {
        return this.isConnected
    }

}