import { MarketDataService } from './market-data.service';
import { MarketDataResponseDto, ProductResponseDto } from '../../common/dto/dtos';
import { MetalType } from "@goldilocks/shared-types";
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    getMarketData(): Promise<MarketDataResponseDto>;
    recalculate(overrides: Partial<Record<MetalType, number>>): Promise<ProductResponseDto[]>;
    refresh(): Promise<MarketDataResponseDto>;
    debugHistoricClose(date?: string): Promise<{
        success: boolean;
        date: string;
    }>;
    seedHistory(): Promise<void>;
}
//# sourceMappingURL=market-data.controller.d.ts.map