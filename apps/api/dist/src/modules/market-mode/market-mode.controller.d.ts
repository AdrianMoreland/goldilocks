import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { UpdateMarketModeRequestDto } from '../../common/dto/dtos';
import { MarketModeService } from './market-mode.service';
import type { MarketModeState } from '@goldilocks/shared-types';
export declare class MarketModeController {
    private readonly service;
    constructor(service: MarketModeService);
    get(): Promise<MarketModeState>;
    set(body: UpdateMarketModeRequestDto, req: RequestWithUser): Promise<MarketModeState>;
}
//# sourceMappingURL=market-mode.controller.d.ts.map