import { type AddLiveStockBarRequest, type AdjustLiveStockRequest, type CreateLiveStockLineRequest, type LinkLiveStockBranchRequest, type LiveBaselinePreview, type LiveBaselineRequest, type LiveBaselineResult, type LiveStockBoard, type LiveStockBoardQuery, type LiveStockBranch, type LiveStockBranchesResponse, type LiveStockMovement, type SetLiveStockBarStatusRequest, type TransferLiveStockRequest, type ProductStockLevel } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import type { AuthenticatedUser } from '../auth/auth.service';
type Tx = Prisma.TransactionClient;
type Source = 'MANUAL' | 'IMPORT' | 'SHEET_SALE' | 'SHEET_PURCHASE' | 'TRANSFER' | 'UNDO';
interface MoveMeta {
    source: Source;
    reference?: string | null;
    reason?: string | null;
    note?: string | null;
    actor: string;
    reversesId?: number | null;
}
export declare class LiveStockService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditLogService);
    canEditBranch(user: AuthenticatedUser, _branch: {
        branchId: number | null;
    }): boolean;
    assertCanEdit(user: AuthenticatedUser, branchCode: string): Promise<void>;
    private toBranch;
    branches(user: AuthenticatedUser): Promise<LiveStockBranchesResponse>;
    productLevels(): Promise<ProductStockLevel[]>;
    board(user: AuthenticatedUser, query: LiveStockBoardQuery): Promise<LiveStockBoard>;
    history(lineId: number, limit?: number): Promise<LiveStockMovement[]>;
    move(tx: Tx, lineId: number, delta: number, meta: MoveMeta): Promise<{
        id: number;
        qtyAfter: number;
    }>;
    lineOrThrow(tx: Tx | PrismaService, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        kind: import("../../../prisma/generated/enums").LiveStockKind;
        metal: import("../../../prisma/generated/enums").StockMetal;
        refinery: string;
        details: string | null;
        branchCode: string;
        qty: number;
        family: string;
        variant: string;
        lowThreshold: number | null;
        unassigned: number;
    }>;
    adjust(user: AuthenticatedUser, lineId: number, dto: AdjustLiveStockRequest): Promise<{
        qty: number;
        movementId: number;
    }>;
    createLine(user: AuthenticatedUser, dto: CreateLiveStockLineRequest): Promise<{
        id: number;
    }>;
    addBar(user: AuthenticatedUser, lineId: number, dto: AddLiveStockBarRequest): Promise<{
        id: number;
        qty: number;
    }>;
    setBarStatus(user: AuthenticatedUser, barId: number, dto: SetLiveStockBarStatusRequest): Promise<{
        qty: number;
    }>;
    transfer(user: AuthenticatedUser, lineId: number, dto: TransferLiveStockRequest): Promise<{
        fromQty: number;
        toQty: number;
    }>;
    undo(user: AuthenticatedUser, movementId: number): Promise<{
        qty: number;
    }>;
    setThreshold(user: AuthenticatedUser, lineId: number, lowThreshold: number | null): Promise<void>;
    linkBranch(user: AuthenticatedUser, code: string, dto: LinkLiveStockBranchRequest): Promise<LiveStockBranch>;
    private diff;
    previewBaseline(user: AuthenticatedUser, dto: LiveBaselineRequest): Promise<LiveBaselinePreview>;
    private assertAdmin;
    commitBaseline(user: AuthenticatedUser, dto: LiveBaselineRequest): Promise<LiveBaselineResult>;
}
export {};
//# sourceMappingURL=live-stock.service.d.ts.map