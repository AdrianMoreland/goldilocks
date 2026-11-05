import { Module } from '@nestjs/common';
import {
    HandoverController,
    OrdersController,
    SheetTasksController,
} from './orders.controller';
import { OrdersService } from './orders.service';
import { SheetTasksService } from './sheet-tasks.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule],
    controllers: [OrdersController, SheetTasksController, HandoverController],
    providers: [OrdersService, SheetTasksService],
})
export class OrdersModule {}
