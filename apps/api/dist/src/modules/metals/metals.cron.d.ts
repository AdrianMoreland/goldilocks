import { OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MetalsProvider } from './metals.provider';
import { HistoricSpotService } from './historic-spot.service';
export declare class MetalsCron implements OnModuleInit {
    private metalsProvider;
    private readonly historicSpots;
    private readonly schedulerRegistry;
    private readonly logger;
    constructor(metalsProvider: MetalsProvider, historicSpots: HistoricSpotService, schedulerRegistry: SchedulerRegistry);
    isPriceCronRunning(): boolean;
    setPriceCronEnabled(enabled: boolean): Promise<boolean>;
    onModuleInit(): void;
    private backfillHistoricIfStale;
    updateMetals(): Promise<void>;
    dailyHistoricClose(): Promise<void>;
}
//# sourceMappingURL=metals.cron.d.ts.map