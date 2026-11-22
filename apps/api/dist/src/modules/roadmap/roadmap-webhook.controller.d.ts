import { type RawBodyRequest } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { RoadmapInboxService } from './roadmap-inbox.service';
import { RoadmapPullService } from './roadmap-pull.service';
export declare class RoadmapWebhookController {
    private readonly pulls;
    private readonly inbox;
    private readonly config;
    private readonly logger;
    constructor(pulls: RoadmapPullService, inbox: RoadmapInboxService, config: ConfigService);
    handle(req: RawBodyRequest<Request>, signature: string | undefined, event: string | undefined): {
        ok: boolean;
        accepted?: undefined;
        ignored?: undefined;
    } | {
        accepted: boolean;
        ok?: undefined;
        ignored?: undefined;
    } | {
        ignored: boolean;
        ok?: undefined;
        accepted?: undefined;
    };
}
//# sourceMappingURL=roadmap-webhook.controller.d.ts.map