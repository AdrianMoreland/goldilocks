import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { MetalsModule } from '../metals/metals.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RequestMetricsModule } from '../request-metrics/request-metrics.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { AdminController } from './admin.controller';
import { AdminOverviewService } from './admin-overview.service';
import { AppLogsService } from './app-logs.service';
import { ApiCatalogueService } from './api-catalogue.service';
import { DbBrowserService } from './db-browser.service';
import { SystemHealthService } from './system-health.service';

@Module({
    imports: [
        TerminusModule,
        AuthModule, // JwtAuthGuard / RolesGuard
        MetalsModule, // FetchAttemptService — last good price fetch
        PrismaModule,
        AuditLogModule,
        RequestMetricsModule,
        RedisModule,
    ],
    controllers: [AdminController],
    providers: [
        AdminOverviewService,
        ApiCatalogueService,
        AppLogsService,
        DbBrowserService,
        SystemHealthService,
    ],
})
export class AdminModule {}
