import { MarketDataService } from './market-data.service';
import { HistoricCloseQueryDto, MarketDataResponseDto, ProductResponseDto, RecalculateOverridesDto } from '../../common/dto/dtos';
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    getMarketData(): Promise<MarketDataResponseDto>;
    recalculate(overrides: RecalculateOverridesDto): Promise<ProductResponseDto[]>;
    refresh(): Promise<MarketDataResponseDto>;
    debugHistoricClose({ date }: HistoricCloseQueryDto): Promise<{
        success: boolean;
        date: string;
    }>;
    backfillHistory(years?: string): Promise<import("../metals/historic-spot.service").BackfillWindowReport[]>;
    seedHistory(): Promise<void>;
}
//# sourceMappingURL=market-data.controller.d.ts.map