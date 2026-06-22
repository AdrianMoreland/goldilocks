import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
    imports: [ConfigModule, AuthModule],
    controllers: [InvoiceController],
    providers: [InvoiceService],
    exports: [InvoiceService],
})
export class InvoiceModule { }
