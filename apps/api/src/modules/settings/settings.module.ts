import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { NotificationsService } from './notifications.service';
import { SessionsService } from './sessions.service';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

/**
 * Global so the services that raise notifications (orders, the price feed, imports, people) can inject
 * NotificationsService without importing this module; they take it as an optional dependency.
 */
@Global()
@Module({
    imports: [PrismaModule, RedisModule, AuditLogModule, AuthModule],
    controllers: [SettingsController],
    providers: [SettingsService, SessionsService, NotificationsService],
    exports: [NotificationsService],
})
export class SettingsModule {}
