import type { AdminLogEntry, LogLevel } from '@goldilocks/shared-types';
export interface LogQuery {
    limit: number;
    level: LogLevel;
    q?: string;
}
export declare class AppLogsService {
    search({ limit, level, q }: LogQuery): {
        entries: AdminLogEntry[];
        capacity: number;
    };
}
//# sourceMappingURL=app-logs.service.d.ts.map