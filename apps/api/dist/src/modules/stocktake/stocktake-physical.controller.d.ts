import type { CarryForwardResult, ImportPhysicalResult, PhysicalRegister, StocktakeBar, StocktakeCoin } from '@goldilocks/shared-types';
import { StocktakePhysicalService } from './stocktake-physical.service';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { AddBarRequestDto, AddCoinRequestDto, CarryForwardRequestDto, ImportPhysicalRequestDto, UpdateBarRequestDto, UpdateCoinRequestDto } from '../../common/dto/dtos';
export declare class StocktakePhysicalController {
    private readonly service;
    constructor(service: StocktakePhysicalService);
    register(id: number): Promise<PhysicalRegister>;
    carryForward(id: number, body: CarryForwardRequestDto, req: RequestWithUser): Promise<CarryForwardResult>;
    importBars(id: number, body: ImportPhysicalRequestDto, req: RequestWithUser): Promise<ImportPhysicalResult>;
    addBar(id: number, body: AddBarRequestDto): Promise<StocktakeBar>;
    updateBar(id: number, barId: number, body: UpdateBarRequestDto): Promise<StocktakeBar>;
    deleteBar(id: number, barId: number): Promise<void>;
    importCoins(id: number, body: ImportPhysicalRequestDto, req: RequestWithUser): Promise<ImportPhysicalResult>;
    addCoin(id: number, body: AddCoinRequestDto): Promise<StocktakeCoin>;
    updateCoin(id: number, coinId: number, body: UpdateCoinRequestDto): Promise<StocktakeCoin>;
}
//# sourceMappingURL=stocktake-physical.controller.d.ts.map