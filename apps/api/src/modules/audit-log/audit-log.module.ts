import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogService } from './audit-log.service';

/** Who-changed-what trail, written by every module that edits data. Import it where needed; it is not global. */
@Module({
    imports: [PrismaModule],
    providers: [AuditLogService],
    exports: [AuditLogService],
})
export class AuditLogModule {}
