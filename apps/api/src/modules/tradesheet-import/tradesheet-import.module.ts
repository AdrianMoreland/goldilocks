import { Module } from '@nestjs/common';
import { TradesheetImportController } from './tradesheet-import.controller';
import { TradesheetImportService } from './tradesheet-import.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [TradesheetImportController],
    providers: [TradesheetImportService],
})
export class TradesheetImportModule {}
