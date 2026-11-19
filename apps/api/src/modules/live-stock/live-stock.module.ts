import { Module } from '@nestjs/common';
import { LiveStockController } from './live-stock.controller';
import { LiveStockService } from './live-stock.service';
import { SheetApplyController } from './sheet-apply.controller';
import { SheetApplyService } from './sheet-apply.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule],
    controllers: [LiveStockController, SheetApplyController],
    providers: [LiveStockService, SheetApplyService],
})
export class LiveStockModule {}
