import { ConfigService } from '@nestjs/config';
import type { AdminOverview } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AiSettings } from '../ai/ai.settings';
import { QuestionLogService } from '../ai/question-log.service';
import { ErrorLogService } from '../error-log/error-log.service';
import { DbBrowserService } from './db-browser.service';
import { RequestMetricsService } from '../request-metrics/request-metrics.service';
import { SystemHealthService } from './system-health.service';
export declare class AdminOverviewService {
    private readonly config;
    private readonly prisma;
    private readonly health;
    private readonly metrics;
    private readonly db;
    private readonly errorLog;
    private readonly aiSettings;
    private readonly questionLog;
    constructor(config: ConfigService, prisma: PrismaService, health: SystemHealthService, metrics: RequestMetricsService, db: DbBrowserService, errorLog: ErrorLogService, aiSettings: AiSettings, questionLog: QuestionLogService);
    private aiSpend;
    build(): Promise<AdminOverview>;
}
//# sourceMappingURL=admin-overview.service.d.ts.map