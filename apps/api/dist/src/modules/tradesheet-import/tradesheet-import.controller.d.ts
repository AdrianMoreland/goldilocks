import type { TradesheetImportPlan, TradesheetImportResult } from '@goldilocks/shared-types';
import { TradesheetImportService } from './tradesheet-import.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { TradesheetImportRequestDto } from '../../common/dto/dtos';
export declare class TradesheetImportController {
    private readonly service;
    constructor(service: TradesheetImportService);
    preview(body: TradesheetImportRequestDto): Promise<TradesheetImportPlan>;
    commit(body: TradesheetImportRequestDto, req: RequestWithUser): Promise<TradesheetImportResult>;
}
//# sourceMappingURL=tradesheet-import.controller.d.ts.map