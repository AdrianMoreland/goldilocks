import { type Handover, type ReconcileResult, type SheetTask, type SheetTaskListQuery } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class SheetTasksService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    list(query: SheetTaskListQuery): Promise<SheetTask[]>;
    complete(id: number, actor: string): Promise<SheetTask>;
    reconcile(actor: string): Promise<ReconcileResult>;
    latestHandover(): Promise<Handover | null>;
    saveHandover(note: string, actor: string): Promise<Handover>;
}
//# sourceMappingURL=sheet-tasks.service.d.ts.map