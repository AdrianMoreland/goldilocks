import { Module } from '@nestjs/common';
import {
    BcAwaitingController,
    BcHistoryController,
    ImportsController,
    ItemTraceController,
} from './imports.controller';
import { BcHistoryImportService } from './bc-history-import.service';
import { ItemTraceService } from './item-trace.service';
import { BcAwaitingImportService } from './bc-awaiting-import.service';
import { WorkbookImportService } from './workbook-import.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { CustomerOrdersModule } from '../customer-orders/customer-orders.module';
import { ReviewModule } from '../review/review.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        AuditLogModule,
        ReviewModule,
        CustomerOrdersModule,
    ],
    controllers: [
        ImportsController,
        BcAwaitingController,
        BcHistoryController,
        ItemTraceController,
    ],
    providers: [
        WorkbookImportService,
        BcAwaitingImportService,
        BcHistoryImportService,
        ItemTraceService,
    ],
})
export class ImportsModule {}
