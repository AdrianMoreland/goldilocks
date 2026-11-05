import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [InventoryController],
    providers: [InventoryService],
})
export class InventoryModule {}
