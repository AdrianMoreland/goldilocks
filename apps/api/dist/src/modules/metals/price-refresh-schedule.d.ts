import { SchedulerRegistry } from '@nestjs/schedule';
export declare const PRICE_REFRESH_JOB = "updateMetals";
export declare class PriceRefreshSchedule {
    private readonly registry;
    constructor(registry: SchedulerRegistry);
    isRunning(): boolean;
}
//# sourceMappingURL=price-refresh-schedule.d.ts.map