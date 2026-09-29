import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import {
    createErrorReference,
    type ClientErrorReport,
    type ErrorLogEntry,
    type ErrorLogKind,
    type ErrorLogSeverity,
} from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';

const REDIS_KEY = 'error-log:entries';
const MAX_ENTRIES = 500;
const MAX_STACK = 4000;

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

/**
 * The Admin panel's error log. Entries go to a capped Redis list (newest
 * first) *and* an in-memory ring buffer: if Redis itself is the thing that's
 * down, the log still has something to show for this process.
 */
@Injectable()
export class ErrorLogService {
    private readonly logger = new Logger(ErrorLogService.name);
    private readonly memory: ErrorLogEntry[] = [];

    constructor(private readonly redis: RedisService) {}

    /** Records a server-side failure and returns its reference for the response body. */
    async record(input: RecordErrorInput): Promise<string> {
        const reference = input.reference ?? createErrorReference();
        const error = input.error instanceof Error ? input.error : null;
        const entry: ErrorLogEntry = {
            id: randomUUID(),
            reference,
            at: new Date().toISOString(),
            source: 'server',
            severity: input.severity ?? 'error',
            kind: input.kind,
            message: input.message,
            detail: input.detail ?? (error && error.message !== input.message ? error.message : null),
            statusCode: input.statusCode ?? null,
            method: input.method ?? null,
            path: input.path ?? null,
            code: input.code ?? null,
            stack: error?.stack?.slice(0, MAX_STACK) ?? null,
            user: input.user ?? null,
            userAgent: input.userAgent ?? null,
        };
        await this.store(entry);
        this.logger.error(`[${reference}] ${entry.kind}: ${entry.message}${entry.detail ? ` — ${entry.detail}` : ''}`);
        return reference;
    }

    /** Stores failures the web app reported about itself (network drops, bad responses, crashes). */
    async recordClientReports(reports: ClientErrorReport[], user: string | null, userAgent: string | null): Promise<void> {
        for (const report of reports) {
            await this.store({
                id: randomUUID(),
                reference: report.reference,
                at: report.occurredAt,
                source: 'client',
                severity: report.severity,
                kind: report.kind,
                message: report.message,
                detail: report.detail ?? null,
                statusCode: report.statusCode ?? null,
                method: report.method ?? null,
                path: report.path ?? null,
                code: null,
                stack: report.stack ?? null,
                user,
                userAgent,
            });
        }
    }

    async getRecent(limit: number): Promise<{ entries: ErrorLogEntry[]; persisted: boolean }> {
        const fromRedis = await this.redis.listRange<ErrorLogEntry>(REDIS_KEY, limit);
        if (fromRedis) return { entries: fromRedis, persisted: true };
        return { entries: this.memory.slice(0, limit), persisted: false };
    }

    async clear(): Promise<void> {
        this.memory.length = 0;
        await this.redis.del(REDIS_KEY);
    }

    private async store(entry: ErrorLogEntry): Promise<void> {
        this.memory.unshift(entry);
        if (this.memory.length > MAX_ENTRIES) this.memory.length = MAX_ENTRIES;
        await this.redis.pushCapped(REDIS_KEY, entry, MAX_ENTRIES);
    }
}
