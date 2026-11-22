import { type RelinkRequest, type RelinkResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class ProductRelinkService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    private resolverData;
    private load;
    private write;
    relink(body: RelinkRequest, actor: string): Promise<RelinkResult>;
}
//# sourceMappingURL=product-relink.service.d.ts.map