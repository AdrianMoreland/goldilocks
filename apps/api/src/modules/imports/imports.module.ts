import { Module } from '@nestjs/common';
import { BcAwaitingController, ImportsController } from './imports.controller';
import { BcAwaitingImportService } from './bc-awaiting-import.service';
import { WorkbookImportService } from './workbook-import.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { ReviewModule } from '../review/review.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule, ReviewModule],
    controllers: [ImportsController, BcAwaitingController],
    providers: [WorkbookImportService, BcAwaitingImportService],
})
export class ImportsModule {}
