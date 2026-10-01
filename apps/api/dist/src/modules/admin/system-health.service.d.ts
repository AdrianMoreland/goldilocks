import { HealthCheckService, HealthIndicatorService, MemoryHealthIndicator } from '@nestjs/terminus';
import type { HealthItem } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { FetchAttemptService } from '../metals/fetch-attempt.service';
export declare class SystemHealthService {
    private readonly health;
    private readonly indicators;
    private readonly memory;
    private readonly prisma;
    private readonly redis;
    private readonly fetchAttempts;
    private readonly eventLoop;
    constructor(health: HealthCheckService, indicators: HealthIndicatorService, memory: MemoryHealthIndicator, prisma: PrismaService, redis: RedisService, fetchAttempts: FetchAttemptService);
    check(): Promise<HealthItem[]>;
    private database;
    private redisCheck;
    private priceFeed;
}
//# sourceMappingURL=system-health.service.d.ts.map