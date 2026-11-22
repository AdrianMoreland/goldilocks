import { OnApplicationBootstrap } from '@nestjs/common';
import { type RoadmapPullRequest, type RoadmapPullResult } from '@goldilocks/shared-types';
import { type GithubPort } from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapService } from './roadmap.service';
export declare class RoadmapPullService implements OnApplicationBootstrap {
    private readonly prisma;
    private readonly audit;
    private readonly roadmap;
    private readonly github;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditLogService, roadmap: RoadmapService, github: GithubPort);
    onApplicationBootstrap(): void;
    pull(actor: string, options?: RoadmapPullRequest): Promise<RoadmapPullResult>;
    autoPull(actor: string): Promise<RoadmapPullResult | null>;
    private run;
    private readMaster;
    private adopt;
    private merge;
    private saveState;
    private raced;
}
//# sourceMappingURL=roadmap-pull.service.d.ts.map