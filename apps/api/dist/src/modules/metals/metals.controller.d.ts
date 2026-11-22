import { type MetalType } from '@goldilocks/shared-types';
import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { FetchAttemptService } from './fetch-attempt.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { FetchAttemptResponseDto, FetchLogQueryDto, FetchMetricsResponseDto, RawSpotPriceResponseDto } from '../../common/dto/dtos';
export declare class MetalsController {
    private readonly metalsProvider;
    private readonly metalsCron;
    private readonly fetchAttempts;
    private readonly audit;
    constructor(metalsProvider: MetalsProvider, metalsCron: MetalsCron, fetchAttempts: FetchAttemptService, audit: AuditLogService);
    refresh(): Promise<RawSpotPriceResponseDto[]>;
    getCronStatus(): {
        running: boolean;
    };
    toggleCron(request: RequestWithUser): Promise<{
        running: boolean;
    }>;
    clearCache(): Promise<{
        message: string;
    }>;
    retryMetal(metal: MetalType): Promise<RawSpotPriceResponseDto>;
    getFetchLog({ limit }: FetchLogQueryDto): Promise<FetchAttemptResponseDto[]>;
    getFetchMetrics(): Promise<FetchMetricsResponseDto>;
}
//# sourceMappingURL=metals.controller.d.ts.map