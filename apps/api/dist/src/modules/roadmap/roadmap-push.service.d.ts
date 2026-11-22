import { type RoadmapPushRequest, type RoadmapPushResult } from '@goldilocks/shared-types';
import { type GithubPort } from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapService } from './roadmap.service';
export declare const PUSH_BRANCH = "roadmap-sync/app";
export declare class RoadmapPushService {
    private readonly prisma;
    private readonly audit;
    private readonly roadmap;
    private readonly github;
    private busy;
    constructor(prisma: PrismaService, audit: AuditLogService, roadmap: RoadmapService, github: GithubPort);
    push(actor: string, options?: RoadmapPushRequest): Promise<RoadmapPushResult>;
    private run;
    private readMaster;
    private prBody;
}
//# sourceMappingURL=roadmap-push.service.d.ts.map