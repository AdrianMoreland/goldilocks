import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard on the admin edit and approval routes
        PrismaModule,
        AuditLogModule,
    ],
    controllers: [KnowledgeController],
    providers: [KnowledgeService],
    // The importer script builds the service directly (see prisma/import-sops.ts).
    exports: [KnowledgeService],
})
export class KnowledgeModule {}
