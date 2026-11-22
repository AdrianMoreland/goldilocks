import type { BcAwaitingResult, BcHistoryResult, ItemTrace, ShippedNotCollectedRow, ShippedNotCollectedTasksResult, ImportBatchSummary, WorkbookChunkResult } from '@goldilocks/shared-types';
import { WorkbookImportService } from './workbook-import.service';
import { BcAwaitingImportService } from './bc-awaiting-import.service';
import { BcHistoryImportService } from './bc-history-import.service';
import { ItemTraceService } from './item-trace.service';
import { ShippedNotCollectedService } from './shipped-not-collected.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { BcAwaitingRequestDto, BcHistoryRequestDto, ItemTraceQueryDto, WorkbookChunkRequestDto } from '../../common/dto/dtos';
export declare class ImportsController {
    private readonly workbook;
    constructor(workbook: WorkbookImportService);
    batches(): Promise<ImportBatchSummary[]>;
    preview(body: WorkbookChunkRequestDto): Promise<WorkbookChunkResult>;
    commit(body: WorkbookChunkRequestDto, req: RequestWithUser): Promise<WorkbookChunkResult>;
}
export declare class BcAwaitingController {
    private readonly bc;
    constructor(bc: BcAwaitingImportService);
    preview(body: BcAwaitingRequestDto): Promise<BcAwaitingResult>;
    commit(body: BcAwaitingRequestDto, req: RequestWithUser): Promise<BcAwaitingResult>;
}
export declare class BcHistoryController {
    private readonly bc;
    private readonly shipped;
    constructor(bc: BcHistoryImportService, shipped: ShippedNotCollectedService);
    shippedNotCollected(): Promise<ShippedNotCollectedRow[]>;
    shippedNotCollectedTasks(req: RequestWithUser): Promise<ShippedNotCollectedTasksResult>;
    preview(body: BcHistoryRequestDto): Promise<BcHistoryResult>;
    commit(body: BcHistoryRequestDto, req: RequestWithUser): Promise<BcHistoryResult>;
}
export declare class ItemTraceController {
    private readonly trace;
    constructor(trace: ItemTraceService);
    get({ serial }: ItemTraceQueryDto): Promise<ItemTrace>;
}
//# sourceMappingURL=imports.controller.d.ts.map