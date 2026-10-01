import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { FetchAttemptService } from './fetch-attempt.service';
import { FetchAttemptResponseDto, FetchMetricsResponseDto, RawSpotPriceResponseDto } from '../../common/dto/dtos';
export declare class MetalsController {
    private readonly metalsProvider;
    private readonly metalsCron;
    private readonly fetchAttempts;
    constructor(metalsProvider: MetalsProvider, metalsCron: MetalsCron, fetchAttempts: FetchAttemptService);
    refresh(): Promise<RawSpotPriceResponseDto[]>;
    getCronStatus(): {
        running: boolean;
    };
    toggleCron(): Promise<{
        running: boolean;
    }>;
    clearCache(): Promise<{
        message: string;
    }>;
    retryMetal(metalParam: string): Promise<RawSpotPriceResponseDto>;
    getFetchLog(limit?: string): Promise<FetchAttemptResponseDto[]>;
    getFetchMetrics(): Promise<FetchMetricsResponseDto>;
}
//# sourceMappingURL=metals.controller.d.ts.map