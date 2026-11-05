import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';

const ACTOR = 'roadmap-schedule';

/**
 * 06:15 Dublin, before the 06:47 sync of the Backlog page. Always a safety-net pull (the webhook
 * normally has done it already); the push runs only when ROADMAP_DAILY_PUSH=true, default off.
 */
@Injectable()
export class RoadmapCron {
    private readonly logger = new Logger(RoadmapCron.name);

    constructor(
        private readonly pulls: RoadmapPullService,
        private readonly pushes: RoadmapPushService,
        private readonly inbox: RoadmapInboxService,
    ) {}

    @Cron('15 6 * * *', { timeZone: 'Europe/Dublin' })
    async daily() {
        await this.pulls.autoPull(ACTOR);
        await this.inbox.autoRefresh();
        if (process.env.ROADMAP_DAILY_PUSH !== 'true') return;
        try {
            const r = await this.pushes.push(ACTOR);
            this.logger.log(
                r.mode === 'push'
                    ? `Daily push: PR #${r.prNumber}`
                    : 'Daily push: nothing to send',
            );
        } catch (e) {
            this.logger.warn(
                `Daily push did not run: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }
}
