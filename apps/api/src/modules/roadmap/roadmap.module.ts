import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { GithubModule } from '../../infrastructure/github/github.module';
import { RoadmapController } from './roadmap.controller';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapQueueService } from './roadmap-queue.service';
import { RoadmapQueueTokenController } from './roadmap-queue-token.controller';
import { ROADMAP_WRITER } from './roadmap-writer';
import { RoadmapScopeService } from './roadmap-scope.service';
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
    controllers: [
        RoadmapController,
        RoadmapWebhookController,
        RoadmapQueueTokenController,
    ],
    providers: [
        RoadmapService,
        RoadmapSyncService,
        RoadmapPullService,
        RoadmapPushService,
        RoadmapScopeService,
        RoadmapQueueService,
        { provide: ROADMAP_WRITER, useExisting: RoadmapQueueService },
        RoadmapInboxService,
        RoadmapCron,
    ],
})
export class RoadmapModule {}
