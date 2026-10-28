import { Module } from '@nestjs/common';
import { StocktakeController } from './stocktake.controller';
import { StocktakeService } from './stocktake.service';
import { StocktakePhysicalController } from './stocktake-physical.controller';
import { StocktakePhysicalService } from './stocktake-physical.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [StocktakeController, StocktakePhysicalController],
    providers: [StocktakeService, StocktakePhysicalService],
})
export class StocktakeModule {}
