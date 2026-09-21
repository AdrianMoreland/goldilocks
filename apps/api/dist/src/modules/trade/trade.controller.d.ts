import { MetalType } from '@goldilocks/shared-types';
import { TradeService } from './trade.service';
import { MeltCalculatorRequestDto, MeltCalculatorResponseDto, TradeBootstrapResponseDto, TradeCartRequestDto, TradeCartResponseDto } from '../../common/dto/dtos';
export declare class TradeController {
    private readonly tradeService;
    constructor(tradeService: TradeService);
    getBootstrap(metal: MetalType): Promise<TradeBootstrapResponseDto>;
    calculateCart(body: TradeCartRequestDto): Promise<TradeCartResponseDto>;
    calculateMelt(body: MeltCalculatorRequestDto): Promise<MeltCalculatorResponseDto>;
}
//# sourceMappingURL=trade.controller.d.ts.map