import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { Branch, CreateBranchRequest } from '@goldilocks/shared-types';
export declare class BranchesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    getAll(): Promise<Branch[]>;
    create(dto: CreateBranchRequest, actorEmail: string): Promise<Branch>;
}
//# sourceMappingURL=branches.service.d.ts.map