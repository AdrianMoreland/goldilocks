import { type ClientErrorReport, type ErrorLogEntry, type ErrorLogKind, type ErrorLogSeverity } from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';
export interface RecordErrorInput {
    severity?: ErrorLogSeverity;
    kind: ErrorLogKind;
    message: string;
    detail?: string | null;
    statusCode?: number | null;
    method?: string | null;
    path?: string | null;
    code?: string | null;
    error?: unknown;
    user?: string | null;
    userAgent?: string | null;
    reference?: string;
}
export declare class ErrorLogService {
    private readonly redis;
    private readonly logger;
    private readonly memory;
    constructor(redis: RedisService);
    record(input: RecordErrorInput): Promise<string>;
    recordClientReports(reports: ClientErrorReport[], user: string | null, userAgent: string | null): Promise<void>;
    getRecent(limit: number): Promise<{
        entries: ErrorLogEntry[];
        persisted: boolean;
    }>;
    clear(): Promise<void>;
    private store;
}
//# sourceMappingURL=error-log.service.d.ts.map