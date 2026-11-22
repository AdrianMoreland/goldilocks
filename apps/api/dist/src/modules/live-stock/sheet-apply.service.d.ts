import { type ApplyRow, type LineCandidate, type PriorApplication, type ResolveSheetApplicationRequest, type SheetApplyItem, type SheetApplyPreview, type SheetApplyResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { AuthenticatedUser } from '../auth/auth.service';
import { LiveStockService } from './live-stock.service';
interface Gathered {
    rows: (ApplyRow & {
        reference: string;
    })[];
    priors: Map<string, PriorApplication & {
        branchCode: string;
    }>;
    cutovers: Map<string, string | null>;
    lines: LineCandidate[];
    lineBranch: Map<number, {
        branchCode: string;
        metal: string;
    }>;
}
export declare class SheetApplyService {
    private readonly prisma;
    private readonly stock;
    private readonly audit;
    constructor(prisma: PrismaService, stock: LiveStockService, audit: AuditLogService);
    private gather;
    private candidatesFor;
    private opt;
    private toItem;
    private plans;
    preview(user: AuthenticatedUser): Promise<SheetApplyPreview>;
    pending(user: AuthenticatedUser, gathered?: Gathered): Promise<SheetApplyItem[]>;
    apply(user: AuthenticatedUser): Promise<SheetApplyResult>;
    private park;
    resolve(user: AuthenticatedUser, applicationId: number, dto: ResolveSheetApplicationRequest): Promise<{
        status: string;
    }>;
    private assertAdmin;
}
export {};
//# sourceMappingURL=sheet-apply.service.d.ts.map