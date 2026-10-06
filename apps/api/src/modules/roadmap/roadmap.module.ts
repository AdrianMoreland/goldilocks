import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';

@Module({
    imports: [
        AuthModule, // JwtAuthGuard / RolesGuard
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [RoadmapController],
    providers: [RoadmapService],
})
export class RoadmapModule {}
