import { Module } from '@nestjs/common';
import { LiveStockController } from './live-stock.controller';
import { LiveStockService } from './live-stock.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule],
    controllers: [LiveStockController],
    providers: [LiveStockService],
})
export class LiveStockModule {}
