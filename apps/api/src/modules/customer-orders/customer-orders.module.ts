import { Module } from '@nestjs/common';
import { CustomerOrdersController } from './customer-orders.controller';
import { CustomerOrdersService } from './customer-orders.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [CustomerOrdersController],
    providers: [CustomerOrdersService],
})
export class CustomerOrdersModule {}
