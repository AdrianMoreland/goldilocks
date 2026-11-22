import { type LiveBaselinePreview, type LiveBaselineResult, type LiveStockBoard, type LiveStockBranch, type LiveStockBranchesResponse, type LiveStockMovement, type ProductStockLevel } from '@goldilocks/shared-types';
import { LiveStockService } from './live-stock.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AddLiveStockBarRequestDto, AdjustLiveStockRequestDto, CreateLiveStockLineRequestDto, LinkLiveStockBranchRequestDto, LiveBaselineRequestDto, LowThresholdRequestDto, SetLiveStockBarStatusRequestDto, TransferLiveStockRequestDto } from '../../common/dto/dtos';
export declare class LiveStockController {
    private readonly service;
    constructor(service: LiveStockService);
    branches(req: RequestWithUser): Promise<LiveStockBranchesResponse>;
    productLevels(): Promise<ProductStockLevel[]>;
    board(req: RequestWithUser, query: Record<string, string>): Promise<LiveStockBoard>;
    history(id: number): Promise<LiveStockMovement[]>;
    createLine(req: RequestWithUser, body: CreateLiveStockLineRequestDto): Promise<{
        id: number;
    }>;
    adjust(req: RequestWithUser, id: number, body: AdjustLiveStockRequestDto): Promise<{
        qty: number;
        movementId: number;
    }>;
    transfer(req: RequestWithUser, id: number, body: TransferLiveStockRequestDto): Promise<{
        fromQty: number;
        toQty: number;
    }>;
    threshold(req: RequestWithUser, id: number, body: LowThresholdRequestDto): Promise<void>;
    addBar(req: RequestWithUser, id: number, body: AddLiveStockBarRequestDto): Promise<{
        id: number;
        qty: number;
    }>;
    barStatus(req: RequestWithUser, id: number, body: SetLiveStockBarStatusRequestDto): Promise<{
        qty: number;
    }>;
    undo(req: RequestWithUser, id: number): Promise<{
        qty: number;
    }>;
    link(req: RequestWithUser, code: string, body: LinkLiveStockBranchRequestDto): Promise<LiveStockBranch>;
    previewBaseline(req: RequestWithUser, body: LiveBaselineRequestDto): Promise<LiveBaselinePreview>;
    commitBaseline(req: RequestWithUser, body: LiveBaselineRequestDto): Promise<LiveBaselineResult>;
}
//# sourceMappingURL=live-stock.controller.d.ts.map