import { MeltCalculatorRequest, MeltCalculatorResponse, MetalType, TradeCartRequest, TradeCartResponse, TradeBootstrapResponse } from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { ProductsProvider } from '../products/products.provider';
export declare class TradeService {
    private readonly metalsProvider;
    private readonly productsProvider;
    constructor(metalsProvider: MetalsProvider, productsProvider: ProductsProvider);
    getBootstrap(metalType: MetalType): Promise<TradeBootstrapResponse>;
    calculateCart(request: TradeCartRequest): Promise<TradeCartResponse>;
    calculateMelt(request: MeltCalculatorRequest): Promise<MeltCalculatorResponse>;
    private validatePercent;
}
//# sourceMappingURL=trade.service.d.ts.map