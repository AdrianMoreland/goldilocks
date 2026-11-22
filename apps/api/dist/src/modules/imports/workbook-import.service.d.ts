import { type ImportBatchSummary, type WorkbookChunkRequest, type WorkbookChunkResult } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { LinkRulesService } from '../review/link-rules.service';
import { ProductNamesService } from '../review/product-names.service';
import { CustomerOrdersService } from '../customer-orders/customer-orders.service';
type Db = Prisma.TransactionClient | PrismaService;
export declare class WorkbookImportService {
    private readonly prisma;
    private readonly audit;
    private readonly rules;
    private readonly orders;
    private readonly names;
    constructor(prisma: PrismaService, audit: AuditLogService, rules: LinkRulesService, orders: CustomerOrdersService, names: ProductNamesService);
    preview(dto: WorkbookChunkRequest): Promise<WorkbookChunkResult>;
    commit(dto: WorkbookChunkRequest, actor: string): Promise<WorkbookChunkResult>;
    recentBatches(limit?: number): Promise<ImportBatchSummary[]>;
    loadChunk(dto: WorkbookChunkRequest, db: Db, actor: string, dry: boolean): Promise<WorkbookChunkResult>;
    private validate;
    private openBatch;
    private closeBatch;
    private delegate;
    private lookupIds;
    private resolveParents;
    private saveAliases;
    private saveZohoProducts;
    private upsertDirect;
    private ensureStocktakes;
    private stamp;
    private flagMissing;
    private saveSafeItems;
    private annotateTrades;
    private upsertQuotes;
    private annotateLots;
    private upsertLinks;
}
export {};
//# sourceMappingURL=workbook-import.service.d.ts.map