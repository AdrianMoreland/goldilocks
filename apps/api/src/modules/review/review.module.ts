import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { LinkRulesService } from './link-rules.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [AuthModule, PrismaModule, AuditLogModule],
    controllers: [ReviewController],
    providers: [ReviewService, LinkRulesService],
    exports: [LinkRulesService],
})
export class ReviewModule {}
