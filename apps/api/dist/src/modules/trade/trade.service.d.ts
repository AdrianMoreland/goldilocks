import { MeltCalculatorRequest, MeltCalculatorResponse, MetalType, TradeCartRequest, TradeCartResponse, TradeBootstrapResponse } from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { ProductsService } from '../products/products.service';
export declare class TradeService {
    private readonly metalsProvider;
    private readonly productsService;
    constructor(metalsProvider: MetalsProvider, productsService: ProductsService);
    getBootstrap(metalType: MetalType): Promise<TradeBootstrapResponse>;
    calculateCart(request: TradeCartRequest): Promise<TradeCartResponse>;
    calculateMelt(request: MeltCalculatorRequest): Promise<MeltCalculatorResponse>;
    private validatePercent;
}
//# sourceMappingURL=trade.service.d.ts.map