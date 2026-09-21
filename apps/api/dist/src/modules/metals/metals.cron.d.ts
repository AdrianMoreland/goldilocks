import { OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MetalsProvider } from "./metals.provider";
export declare class MetalsCron implements OnModuleInit {
    private metalsProvider;
    private readonly schedulerRegistry;
    private readonly logger;
    constructor(metalsProvider: MetalsProvider, schedulerRegistry: SchedulerRegistry);
    isPriceCronRunning(): boolean;
    setPriceCronEnabled(enabled: boolean): boolean;
    onModuleInit(): Promise<void>;
    updateMetals(): Promise<void>;
    dailyHistoricClose(): Promise<void>;
}
//# sourceMappingURL=metals.cron.d.ts.map