import { monitorEventLoopDelay } from 'node:perf_hooks';
import { Injectable } from '@nestjs/common';
import {
    HealthCheckService,
    HealthIndicatorService,
    MemoryHealthIndicator,
    type HealthCheckResult,
} from '@nestjs/terminus';
import type { HealthItem, HealthStatus } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { FetchAttemptService } from '../metals/fetch-attempt.service';

const HEAP_LIMIT_BYTES = 1024 * 1024 * 1024;
// The price cron runs every 10 minutes: three missed runs is worth a nudge, a few hours is an outage.
const PRICE_FEED_DEGRADED_AFTER_MIN = 30;
const PRICE_FEED_DOWN_AFTER_MIN = 180;
const EVENT_LOOP_DEGRADED_MS = 200;

const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`;

/**
 * The admin console's health checks, run through Terminus so each one is a
 * timed, isolated indicator (one failing check never hides the others).
 * Deliberately separate from the public GET /health, which uptime monitors
 * hit and which must not change behaviour.
 */
@Injectable()
export class SystemHealthService {
    private readonly eventLoop = monitorEventLoopDelay({ resolution: 20 });

    constructor(
        private readonly health: HealthCheckService,
        private readonly indicators: HealthIndicatorService,
        private readonly memory: MemoryHealthIndicator,
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly fetchAttempts: FetchAttemptService,
    ) {
        this.eventLoop.enable();
    }

    async check(): Promise<HealthItem[]> {
        const result = await this.health
            .check([
                () => this.database(),
                () => this.redisCheck(),
                () => this.memory.checkHeap('memory', HEAP_LIMIT_BYTES),
                () => this.priceFeed(),
            ])
            .catch((error: { getResponse?: () => HealthCheckResult }) => {
                // Terminus throws a 503 when any indicator is down; the per-check detail is in the response.
                const response = error.getResponse?.();
                if (response?.details) return response;
                throw error;
            });

        const details = (result.details ?? {}) as Record<
            string,
            { status?: string; level?: string; message?: string; ms?: number }
        >;
        // Terminus 11 has only up/down, so "up but impaired" travels as `level`.
        const status = (key: string): HealthStatus =>
            (details[key]?.level ??
                details[key]?.status ??
                'down') as HealthStatus;
        const reason = (key: string, fallback: string) =>
            details[key]?.message ?? fallback;

        const heapBytes = process.memoryUsage().heapUsed;
        const rssBytes = process.memoryUsage().rss;
        const loopMs = Math.round(this.eventLoop.percentile(99) / 1e6);
        this.eventLoop.reset();

        return [
            {
                key: 'database',
                label: 'Database',
                status: status('database'),
                detail:
                    status('database') === 'up'
                        ? `Responding in ${details.database?.ms ?? '<1'} ms`
                        : reason('database', 'Unreachable'),
            },
            {
                key: 'redis',
                label: 'Redis cache',
                status: status('redis'),
                detail:
                    status('redis') === 'up'
                        ? 'Connected'
                        : `${reason('redis', 'Not connected')}: caching and request history are paused`,
            },
            {
                key: 'priceFeed',
                label: 'Price feed',
                status: status('priceFeed'),
                detail: reason('priceFeed', 'No successful fetch recorded'),
            },
            {
                key: 'memory',
                label: 'Memory',
                status: status('memory'),
                detail: `${mb(heapBytes)} heap, ${mb(rssBytes)} resident`,
            },
            {
                key: 'eventLoop',
                label: 'Event loop',
                status: loopMs > EVENT_LOOP_DEGRADED_MS ? 'degraded' : 'up',
                detail: `Worst-case delay ${loopMs} ms`,
            },
        ];
    }

    private async database() {
        const session = this.indicators.check('database');
        const startedAt = Date.now();
        try {
            await Promise.race([
                this.prisma.$queryRaw`SELECT 1`,
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error('Timed out after 3 s')),
                        3000,
                    ),
                ),
            ]);
            return session.up({ ms: Date.now() - startedAt });
        } catch (error) {
            return session.down({
                message: error instanceof Error ? error.message : 'Unreachable',
            });
        }
    }

    private redisCheck() {
        const session = this.indicators.check('redis');
        return this.redis.isHealthy()
            ? session.up()
            : session.down({ message: 'Not connected' });
    }

    private async priceFeed() {
        const session = this.indicators.check('priceFeed');
        const lastAt = await this.fetchAttempts
            .getLastSuccessfulAt()
            .catch(() => null);
        if (!lastAt) {
            return session.down({ message: 'No successful fetch recorded' });
        }

        const minutes = Math.round((Date.now() - Date.parse(lastAt)) / 60_000);
        const message = `Last good fetch ${minutes} min ago`;
        if (minutes >= PRICE_FEED_DOWN_AFTER_MIN) {
            return session.down({ message });
        }
        return session.up({
            message,
            level: minutes >= PRICE_FEED_DEGRADED_AFTER_MIN ? 'degraded' : 'up',
        });
    }
}
