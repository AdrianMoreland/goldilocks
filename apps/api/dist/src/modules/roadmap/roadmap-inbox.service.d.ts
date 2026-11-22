import type { RoadmapInbox, RoadmapInboxItem, RoadmapInboxPromote, RoadmapInboxRefresh } from '@goldilocks/shared-types';
import { type GithubPort } from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { RoadmapService } from './roadmap.service';
export declare const INBOX_LABEL = "roadmap";
export declare function kindOf(labels: string[], body: string): string | null;
export declare class RoadmapInboxService {
    private readonly prisma;
    private readonly audit;
    private readonly roadmap;
    private readonly github;
    private readonly logger;
    private refreshing;
    constructor(prisma: PrismaService, audit: AuditLogService, roadmap: RoadmapService, github: GithubPort);
    list(): Promise<RoadmapInbox>;
    refresh(): Promise<RoadmapInboxRefresh>;
    autoRefresh(): Promise<RoadmapInboxRefresh | null>;
    private doRefresh;
    promote(id: number, input: RoadmapInboxPromote, actor: string): Promise<RoadmapInboxItem>;
    dismiss(id: number, actor: string): Promise<RoadmapInboxItem>;
    private mustBeNew;
    private finish;
}
//# sourceMappingURL=roadmap-inbox.service.d.ts.map