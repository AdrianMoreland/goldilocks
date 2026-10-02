import { Injectable } from '@nestjs/common';
import type { AdminLogEntry, LogLevel } from '@goldilocks/shared-types';
import { logBuffer } from './log-buffer';

const LEVEL_ORDER: LogLevel[] = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
];

export interface LogQuery {
    limit: number;
    level: LogLevel;
    q?: string;
}

/** Reads the in-memory pino buffer for the admin console's Logs tab. */
@Injectable()
export class AppLogsService {
    search({ limit, level, q }: LogQuery): {
        entries: AdminLogEntry[];
        capacity: number;
    } {
        const min = LEVEL_ORDER.indexOf(level);
        const term = q?.trim().toLowerCase();

        const entries = logBuffer
            .recent(logBuffer.capacity)
            .filter((e) => LEVEL_ORDER.indexOf(e.level) >= min)
            .filter(
                (e) =>
                    !term ||
                    [e.message, e.context, e.url, e.method].some((v) =>
                        v?.toLowerCase().includes(term),
                    ),
            )
            .slice(0, limit);
        return { entries, capacity: logBuffer.capacity };
    }
}
