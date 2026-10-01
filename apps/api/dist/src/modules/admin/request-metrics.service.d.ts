import type { NextFunction, Request, Response } from 'express';
import type { HourlyStats, RouteStats } from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';
export declare class RequestMetricsService {
    private readonly redis;
    constructor(redis: RedisService);
    middleware(): (req: Request, res: Response, next: NextFunction) => void;
    recordLogin(succeeded: boolean): void;
    getLastDay(): Promise<{
        hours: HourlyStats[];
        topRoutes: RouteStats[];
    } | null>;
}
//# sourceMappingURL=request-metrics.service.d.ts.map