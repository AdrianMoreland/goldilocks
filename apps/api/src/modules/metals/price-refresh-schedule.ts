import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

/** Name of the price-refresh job registered with SchedulerRegistry by MetalsCron. */
export const PRICE_REFRESH_JOB = 'updateMetals';

/**
 * Whether the price-refresh cron is running right now. A separate class so
 * MetalsProvider can ask without depending on MetalsCron (which depends on it).
 */
@Injectable()
export class PriceRefreshSchedule {
    constructor(private readonly registry: SchedulerRegistry) {}

    isRunning(): boolean {
        try {
            return this.registry.getCronJob(PRICE_REFRESH_JOB).isActive;
        } catch {
            // Not registered (yet): no job is running.
            return false;
        }
    }
}
