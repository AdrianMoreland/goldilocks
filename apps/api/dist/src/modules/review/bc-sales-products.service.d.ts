import { type BcSalesProductsApplyRequest, type BcSalesProductsApplyResult, type BcSalesProductsPreview } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class BcSalesProductsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    private plan;
    preview(): Promise<BcSalesProductsPreview>;
    apply(body: BcSalesProductsApplyRequest, actor: string): Promise<BcSalesProductsApplyResult>;
    private applyIn;
}
//# sourceMappingURL=bc-sales-products.service.d.ts.map