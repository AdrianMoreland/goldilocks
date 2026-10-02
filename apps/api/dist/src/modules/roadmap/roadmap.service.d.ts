import { type RoadmapDocument, type RoadmapEditRequest } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../admin/audit-log.service';
export declare class RoadmapService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    private toDocument;
    get(): Promise<RoadmapDocument>;
    edit(request: RoadmapEditRequest, actor: {
        email: string;
    }): Promise<RoadmapDocument>;
}
//# sourceMappingURL=roadmap.service.d.ts.map