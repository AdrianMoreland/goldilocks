import { Module } from '@nestjs/common';
import {
    CustomersController,
    InvoicesController,
} from './customer-records.controller';
import { CustomerRecordsService } from './customer-records.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [CustomersController, InvoicesController],
    providers: [CustomerRecordsService],
})
export class CustomerRecordsModule {}
