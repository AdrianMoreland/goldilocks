import { type RoadmapScope, type RoadmapScopeRefresh } from '@goldilocks/shared-types';
import { type GithubPort } from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class RoadmapScopeService {
    private readonly prisma;
    private readonly audit;
    private readonly github;
    private readonly logger;
    constructor(prisma: PrismaService, audit: AuditLogService, github: GithubPort);
    enabled(): boolean;
    private target;
    private configured;
    get(): Promise<RoadmapScope>;
    refresh(actor: string): Promise<RoadmapScopeRefresh>;
    autoRefresh(actor: string): Promise<void>;
}
//# sourceMappingURL=roadmap-scope.service.d.ts.map