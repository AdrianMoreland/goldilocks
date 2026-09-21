import { Module } from '@nestjs/common';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
    imports: [
        AuthModule,   // needed by JwtAuthGuard/RolesGuard
        PrismaModule,
    ],
    controllers: [BranchesController],
    providers: [BranchesService],
})
export class BranchesModule {}
