import { Module } from '@nestjs/common';
import { StocktakeController } from './stocktake.controller';
import { StocktakeService } from './stocktake.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [StocktakeController],
    providers: [StocktakeService],
})
export class StocktakeModule {}
