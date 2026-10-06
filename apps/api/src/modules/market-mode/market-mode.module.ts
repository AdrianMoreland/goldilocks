import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { MarketModeController } from './market-mode.controller';
import { MarketModeService } from './market-mode.service';

@Module({
    imports: [
        AuthModule, // JwtAuthGuard / RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [MarketModeController],
    providers: [MarketModeService],
})
export class MarketModeModule {}
