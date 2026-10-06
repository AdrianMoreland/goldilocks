import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AdminOverview } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ErrorLogService } from '../error-log/error-log.service';
import { DbBrowserService } from './db-browser.service';
import { RequestMetricsService } from '../request-metrics/request-metrics.service';
import { SystemHealthService } from './system-health.service';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Assembles the Overview tab's one payload, so the page makes a single request and every panel shows the same moment. */
@Injectable()
export class AdminOverviewService {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
        private readonly health: SystemHealthService,
        private readonly metrics: RequestMetricsService,
        private readonly db: DbBrowserService,
        private readonly errorLog: ErrorLogService,
    ) {}

    async build(): Promise<AdminOverview> {
        const since = new Date(Date.now() - DAY_MS);
        const [
            health,
            traffic,
            tables,
            databaseBytes,
            roles,
            activeUsers,
            errors,
        ] = await Promise.all([
            this.health.check(),
            this.metrics.getLastDay(),
            this.db.listTables(),
            this.db.databaseBytes(),
            this.prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
            this.prisma.user.count({ where: { lastLoginAt: { gte: since } } }),
            this.errorLog.getRecent(500),
        ]);

        const errorCounts = new Map<string, number>();
        for (const entry of errors.entries) {
            if (Date.parse(entry.at) < since.getTime()) continue;
            errorCounts.set(entry.kind, (errorCounts.get(entry.kind) ?? 0) + 1);
        }

        return {
            generatedAt: new Date().toISOString(),
            uptimeSeconds: Math.round(process.uptime()),
            nodeVersion: process.version,
            environment: this.config.get<string>('NODE_ENV', 'development'),
            aiEnabled: this.config.get<string>('AI_ENABLED') === 'true',
            health,
            metricsAvailable: traffic !== null,
            hours: traffic?.hours ?? [],
            topRoutes: traffic?.topRoutes ?? [],
            databaseBytes,
            tables: tables
                .map((t) => ({ name: t.name, bytes: t.bytes, rows: t.rows }))
                .sort((a, b) => b.bytes - a.bytes),
            usersByRole: roles.map((r) => ({
                role: r.role,
                count: r._count._all,
            })),
            activeUsers,
            errorsByKind: [...errorCounts.entries()].map(([kind, count]) => ({
                kind,
                count,
            })),
        };
    }
}
