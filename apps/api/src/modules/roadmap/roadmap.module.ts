import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { GithubModule } from '../../infrastructure/github/github.module';
import { RoadmapController } from './roadmap.controller';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapCron } from './roadmap.cron';
import { RoadmapWebhookController } from './roadmap-webhook.controller';
import { RoadmapService } from './roadmap.service';
import { RoadmapSyncService } from './roadmap-sync.service';

@Module({
    imports: [
        AuthModule, // JwtAuthGuard / RolesGuard
        PrismaModule,
        AuditLogModule,
        GithubModule,
    ],
    controllers: [RoadmapController, RoadmapWebhookController],
    providers: [
        RoadmapService,
        RoadmapSyncService,
        RoadmapPullService,
        RoadmapPushService,
        RoadmapCron,
    ],
})
export class RoadmapModule {}
