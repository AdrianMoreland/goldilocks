import { type ShippedNotCollectedRow, type ShippedNotCollectedTasksResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class ShippedNotCollectedService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    list(): Promise<ShippedNotCollectedRow[]>;
    createTasks(actor: string): Promise<ShippedNotCollectedTasksResult>;
}
//# sourceMappingURL=shipped-not-collected.service.d.ts.map