import { Module } from '@nestjs/common';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { RequestMetricsService } from './request-metrics.service';

/** Hourly traffic and login counters. Written by the request middleware and the login route, read by the admin console. */
@Module({
    imports: [RedisModule],
    providers: [RequestMetricsService],
    exports: [RequestMetricsService],
})
export class RequestMetricsModule {}
