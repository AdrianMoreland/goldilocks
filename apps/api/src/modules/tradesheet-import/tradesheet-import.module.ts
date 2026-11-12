import { Module } from '@nestjs/common';
import { TradesheetImportController } from './tradesheet-import.controller';
import { TradesheetImportService } from './tradesheet-import.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { ReviewModule } from '../review/review.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
        AuditLogModule,
        ReviewModule,
    ],
    controllers: [TradesheetImportController],
    providers: [TradesheetImportService],
})
export class TradesheetImportModule {}
