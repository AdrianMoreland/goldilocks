import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name)

    private client: Redis | null = null
    private isConnected = false

    async onModuleInit() {
        const url = process.env.REDIS_URL

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

}