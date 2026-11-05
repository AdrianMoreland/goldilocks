import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { WorkbookImportService } from './workbook-import.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule],
    controllers: [ImportsController],
    providers: [WorkbookImportService],
})
export class ImportsModule {}
