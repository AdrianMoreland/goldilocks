import type { AuditEntry } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class AuditLogService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    record(actor: string, action: string, detail: string, tx?: Prisma.TransactionClient): Promise<void>;
    getRecent(limit: number): Promise<{
        entries: AuditEntry[];
        persisted: boolean;
    }>;
}
//# sourceMappingURL=audit-log.service.d.ts.map