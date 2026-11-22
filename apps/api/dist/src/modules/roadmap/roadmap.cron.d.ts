import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
import { RoadmapPushService } from './roadmap-push.service';
import { RoadmapScopeService } from './roadmap-scope.service';
export declare class RoadmapCron {
    private readonly pulls;
    private readonly pushes;
    private readonly inbox;
    private readonly scope;
    private readonly logger;
    constructor(pulls: RoadmapPullService, pushes: RoadmapPushService, inbox: RoadmapInboxService, scope: RoadmapScopeService);
    daily(): Promise<void>;
}
//# sourceMappingURL=roadmap.cron.d.ts.map