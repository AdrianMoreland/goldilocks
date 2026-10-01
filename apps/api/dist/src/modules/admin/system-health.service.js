"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemHealthService = void 0;
const node_perf_hooks_1 = require("node:perf_hooks");
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const fetch_attempt_service_1 = require("../metals/fetch-attempt.service");
const HEAP_LIMIT_BYTES = 1024 * 1024 * 1024;
const PRICE_FEED_DEGRADED_AFTER_MIN = 30;
const PRICE_FEED_DOWN_AFTER_MIN = 180;
const EVENT_LOOP_DEGRADED_MS = 200;
const mb = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;
let SystemHealthService = class SystemHealthService {
    health;
    indicators;
    memory;
    prisma;
    redis;
    fetchAttempts;
    eventLoop = (0, node_perf_hooks_1.monitorEventLoopDelay)({ resolution: 20 });
    constructor(health, indicators, memory, prisma, redis, fetchAttempts) {
        this.health = health;
        this.indicators = indicators;
        this.memory = memory;
        this.prisma = prisma;
        this.redis = redis;
        this.fetchAttempts = fetchAttempts;
        this.eventLoop.enable();
    }
    async check() {
        const result = await this.health
            .check([
            () => this.database(),
            () => this.redisCheck(),
            () => this.memory.checkHeap('memory', HEAP_LIMIT_BYTES),
            () => this.priceFeed(),
        ])
            .catch((error) => {
            const response = error.getResponse?.();
            if (response?.details)
                return response;
            throw error;
        });
        const details = (result.details ?? {});
        const status = (key) => (details[key]?.level ??
            details[key]?.status ??
            'down');
        const reason = (key, fallback) => details[key]?.message ?? fallback;
        const heapBytes = process.memoryUsage().heapUsed;
        const rssBytes = process.memoryUsage().rss;
        const loopMs = Math.round(this.eventLoop.percentile(99) / 1e6);
        this.eventLoop.reset();
        return [
            {
                key: 'database',
                label: 'Database',
                status: status('database'),
                detail: status('database') === 'up'
                    ? `Responding in ${details.database?.ms ?? '<1'} ms`
                    : reason('database', 'Unreachable'),
            },
            {
                key: 'redis',
                label: 'Redis cache',
                status: status('redis'),
                detail: status('redis') === 'up'
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
    async database() {
        const session = this.indicators.check('database');
        const startedAt = Date.now();
        try {
            await Promise.race([
                this.prisma.$queryRaw `SELECT 1`,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out after 3 s')), 3000)),
            ]);
            return session.up({ ms: Date.now() - startedAt });
        }
        catch (error) {
            return session.down({
                message: error instanceof Error ? error.message : 'Unreachable',
            });
        }
    }
    redisCheck() {
        const session = this.indicators.check('redis');
        return this.redis.isHealthy()
            ? session.up()
            : session.down({ message: 'Not connected' });
    }
    async priceFeed() {
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
};
exports.SystemHealthService = SystemHealthService;
exports.SystemHealthService = SystemHealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.HealthIndicatorService,
        terminus_1.MemoryHealthIndicator,
        prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        fetch_attempt_service_1.FetchAttemptService])
], SystemHealthService);
//# sourceMappingURL=system-health.service.js.map