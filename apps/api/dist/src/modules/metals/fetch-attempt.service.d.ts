import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { FetchAttempt, FetchMetrics, FetchTrigger, MetalType } from '@goldilocks/shared-types';
import { CascadeMetricsService } from './cascade-metrics.service';
import { ErrorLogService } from '../error-log/error-log.service';
interface RecordAttemptInput {
    durationMs: number;
    success: boolean;
    errorMessage: string | null;
    metalsResolved: MetalType[];
    triggeredBy: FetchTrigger;
}
export declare class FetchAttemptService {
    private readonly prisma;
    private readonly cascadeMetrics;
    private readonly errorLog;
    constructor(prisma: PrismaService, cascadeMetrics: CascadeMetricsService, errorLog: ErrorLogService);
    record(entry: RecordAttemptInput): Promise<void>;
    getRecent(limit: number): Promise<FetchAttempt[]>;
    getMetrics(): Promise<FetchMetrics>;
    getLastSuccessfulAt(): Promise<string | null>;
    private toDto;
}
export {};
//# sourceMappingURL=fetch-attempt.service.d.ts.map