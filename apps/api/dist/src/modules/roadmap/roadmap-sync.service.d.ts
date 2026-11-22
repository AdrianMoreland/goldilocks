import { type RoadmapSyncStatus } from '@goldilocks/shared-types';
import { type GithubPort } from '../../infrastructure/github/github.port';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RoadmapService } from './roadmap.service';
export declare class RoadmapSyncService {
    private readonly roadmap;
    private readonly prisma;
    private readonly github;
    private readonly logger;
    constructor(roadmap: RoadmapService, prisma: PrismaService, github: GithubPort);
    status(): Promise<RoadmapSyncStatus>;
}
//# sourceMappingURL=roadmap-sync.service.d.ts.map