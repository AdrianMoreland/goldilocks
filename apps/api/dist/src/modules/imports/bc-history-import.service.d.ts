import { type BcHistoryRequest, type BcHistoryResult } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
export declare class BcHistoryImportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    preview(dto: BcHistoryRequest): Promise<BcHistoryResult>;
    commit(dto: BcHistoryRequest, actor: string): Promise<BcHistoryResult>;
    private run;
    private customers;
    private tradesByReference;
    private zohoInvoices;
    private upsert;
    private planEvents;
    private applyEvents;
}
//# sourceMappingURL=bc-history-import.service.d.ts.map