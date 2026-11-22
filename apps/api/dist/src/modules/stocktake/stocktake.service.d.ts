import { type BcItemsResponse, type CreateDiscrepancyRequest, type CreateStocktakeRequest, type Discrepancy, type ImportJournalResult, type Stocktake, type StocktakeDetail, type StocktakeLine, type UpdateDiscrepancyRequest, type UpdateStocktakeLineRequest, type UpdateStocktakeRequest } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
type StocktakeRow = Prisma.StocktakeGetPayload<object>;
export declare class StocktakeService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    list(): Promise<Stocktake[]>;
    get(id: number): Promise<StocktakeDetail>;
    create(dto: CreateStocktakeRequest, actor: string): Promise<Stocktake>;
    update(id: number, dto: UpdateStocktakeRequest, actor: string): Promise<Stocktake>;
    finalise(id: number, actor: string): Promise<Stocktake>;
    importJournal(id: number, text: string, actor: string): Promise<ImportJournalResult>;
    updateLine(stocktakeId: number, lineId: number, dto: UpdateStocktakeLineRequest): Promise<StocktakeLine>;
    addDiscrepancy(stocktakeId: number, dto: CreateDiscrepancyRequest, actor: string): Promise<Discrepancy>;
    updateDiscrepancy(stocktakeId: number, discrepancyId: number, dto: UpdateDiscrepancyRequest): Promise<Discrepancy>;
    deleteDiscrepancy(stocktakeId: number, discrepancyId: number): Promise<void>;
    listBcItems(): Promise<BcItemsResponse>;
    linkBcItem(itemNo: string, productId: number | null, actor: string): Promise<void>;
    requireOpen(id: number): Promise<StocktakeRow>;
}
export {};
//# sourceMappingURL=stocktake.service.d.ts.map