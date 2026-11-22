import { type AddBarRequest, type AddCoinRequest, type CarryForwardResult, type ImportPhysicalResult, type PhysicalRegister, type StocktakeBar, type StocktakeCoin, type UpdateBarRequest, type UpdateCoinRequest } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { StocktakeService } from './stocktake.service';
type BarRow = Prisma.StocktakeBarGetPayload<object>;
type CoinRow = Prisma.StocktakeCoinGetPayload<object>;
export declare class StocktakePhysicalService {
    private readonly prisma;
    private readonly audit;
    private readonly stocktakes;
    constructor(prisma: PrismaService, audit: AuditLogService, stocktakes: StocktakeService);
    getRegister(stocktakeId: number): Promise<PhysicalRegister>;
    importBars(stocktakeId: number, metal: BarRow['metal'], text: string, actor: string): Promise<ImportPhysicalResult>;
    addBar(stocktakeId: number, dto: AddBarRequest): Promise<StocktakeBar>;
    updateBar(stocktakeId: number, barId: number, dto: UpdateBarRequest): Promise<StocktakeBar>;
    deleteBar(stocktakeId: number, barId: number): Promise<void>;
    importCoins(stocktakeId: number, metal: CoinRow['metal'], text: string, actor: string): Promise<ImportPhysicalResult>;
    addCoin(stocktakeId: number, dto: AddCoinRequest): Promise<StocktakeCoin>;
    updateCoin(stocktakeId: number, coinId: number, dto: UpdateCoinRequest): Promise<StocktakeCoin>;
    carryForward(stocktakeId: number, fromId: number | undefined, actor: string): Promise<CarryForwardResult>;
    private exists;
    private requireBar;
    private withDuplicateFlag;
}
export {};
//# sourceMappingURL=stocktake-physical.service.d.ts.map