import { Injectable } from '@nestjs/common';
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

const METRICS_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Persists and queries FetchAttempt rows — one per call to the external
 * metal-price vendor API. Backs the admin System Status panel's "last N
 * attempts" log and its success-rate/latency metrics.
 */
@Injectable()
export class FetchAttemptService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cascadeMetrics: CascadeMetricsService,
        private readonly errorLog: ErrorLogService,
    ) {}

    async record(entry: RecordAttemptInput): Promise<void> {
        // A failed vendor call also goes to the error log, so the Admin
        // panel's single log answers "why are prices stale?" too. Recorded
        // before the DB write: if the database is what's failing, the
        // vendor failure still gets logged.
        if (!entry.success) {
            await this.errorLog.record({
                severity: 'warning',
                kind: 'external-api',
                message: `Spot price fetch failed (${entry.triggeredBy})`,
                detail: `${entry.errorMessage ?? 'No error message'} — after ${entry.durationMs} ms; resolved: ${entry.metalsResolved.join(', ') || 'none'}`,
            });
        }
        await this.prisma.fetchAttempt.create({ data: entry });
    }

    async getRecent(limit: number): Promise<FetchAttempt[]> {
        const rows = await this.prisma.fetchAttempt.findMany({
            orderBy: { attemptedAt: 'desc' },
            take: limit,
        });

        return rows.map((row) => this.toDto(row));
    }

    async getMetrics(): Promise<FetchMetrics> {
        const since = new Date(Date.now() - METRICS_WINDOW_MS);
        const attempts = await this.prisma.fetchAttempt.findMany({ where: { attemptedAt: { gte: since } } });

        const total = attempts.length;
        const failureCount = attempts.filter((a) => !a.success).length;
        const avgLatencyMs = total > 0 ? attempts.reduce((sum, a) => sum + a.durationMs, 0) / total : 0;

        return {
            successRate24h: total > 0 ? (total - failureCount) / total : 1,
            totalAttempts24h: total,
            failureCount24h: failureCount,
            avgLatencyMs: Math.round(avgLatencyMs),
            cacheHitRatio: this.cascadeMetrics.getCacheHitRatio(),
        };
    }

    async getLastSuccessfulAt(): Promise<string | null> {
        const row = await this.prisma.fetchAttempt.findFirst({
            where: { success: true },
            orderBy: { attemptedAt: 'desc' },
        });

        return row ? row.attemptedAt.toISOString() : null;
    }

    private toDto(row: {
        id: bigint;
        attemptedAt: Date;
        durationMs: number;
        success: boolean;
        errorMessage: string | null;
        metalsResolved: MetalType[];
        triggeredBy: FetchTrigger;
    }): FetchAttempt {
        return {
            id: row.id.toString(),
            attemptedAt: row.attemptedAt.toISOString(),
            durationMs: row.durationMs,
            success: row.success,
            errorMessage: row.errorMessage,
            metalsResolved: row.metalsResolved,
            triggeredBy: row.triggeredBy,
        };
    }
}
