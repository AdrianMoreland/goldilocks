import type { BcItemsResponse, Discrepancy, ImportJournalResult, Stocktake, StocktakeDetail, StocktakeLine } from '@goldilocks/shared-types';
import { StocktakeService } from './stocktake.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { CreateDiscrepancyRequestDto, CreateStocktakeRequestDto, ImportJournalRequestDto, LinkBcItemRequestDto, UpdateDiscrepancyRequestDto, UpdateStocktakeLineRequestDto, UpdateStocktakeRequestDto } from '../../common/dto/dtos';
export declare class StocktakeController {
    private readonly service;
    constructor(service: StocktakeService);
    list(): Promise<Stocktake[]>;
    listBcItems(): Promise<BcItemsResponse>;
    linkBcItem(itemNo: string, body: LinkBcItemRequestDto, req: RequestWithUser): Promise<void>;
    create(body: CreateStocktakeRequestDto, req: RequestWithUser): Promise<Stocktake>;
    get(id: number): Promise<StocktakeDetail>;
    update(id: number, body: UpdateStocktakeRequestDto, req: RequestWithUser): Promise<Stocktake>;
    finalise(id: number, req: RequestWithUser): Promise<Stocktake>;
    importJournal(id: number, body: ImportJournalRequestDto, req: RequestWithUser): Promise<ImportJournalResult>;
    updateLine(id: number, lineId: number, body: UpdateStocktakeLineRequestDto): Promise<StocktakeLine>;
    addDiscrepancy(id: number, body: CreateDiscrepancyRequestDto, req: RequestWithUser): Promise<Discrepancy>;
    updateDiscrepancy(id: number, discrepancyId: number, body: UpdateDiscrepancyRequestDto): Promise<Discrepancy>;
    deleteDiscrepancy(id: number, discrepancyId: number): Promise<void>;
}
//# sourceMappingURL=stocktake.controller.d.ts.map