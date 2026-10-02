import { Global, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { MetalsModule } from '../metals/metals.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';
import { AdminController } from './admin.controller';
import { AdminOverviewService } from './admin-overview.service';
import { AppLogsService } from './app-logs.service';
import { ApiCatalogueService } from './api-catalogue.service';
import { AuditLogService } from './audit-log.service';
import { DbBrowserService } from './db-browser.service';
import { RequestMetricsService } from './request-metrics.service';
import { SystemHealthService } from './system-health.service';

/** Global only so main.ts and the auth controller can reach the metrics and catalogue without importing the whole console. */
@Global()
@Module({
    imports: [
        TerminusModule,
        AuthModule, // JwtAuthGuard / RolesGuard
        MetalsModule, // FetchAttemptService — last good price fetch
        PrismaModule,
        RedisModule,
    ],
    controllers: [AdminController],
    providers: [
        AdminOverviewService,
        ApiCatalogueService,
        AppLogsService,
        AuditLogService,
        DbBrowserService,
        RequestMetricsService,
        SystemHealthService,
    ],
    // AuditLogService is injected by MarketModeService; main.ts reaches ApiCatalogueService through app.get().
    exports: [RequestMetricsService, AuditLogService],
})
export class AdminModule {}
