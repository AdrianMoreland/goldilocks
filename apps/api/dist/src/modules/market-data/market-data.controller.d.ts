import { MarketDataService } from './market-data.service';
import { BackfillHistoryQueryDto, HistoricCloseQueryDto, MarketDataResponseDto, ProductResponseDto, SpotStatusResponseDto, RecalculateOverridesDto } from '../../common/dto/dtos';
export declare class MarketDataController {
    private readonly marketDataService;
    constructor(marketDataService: MarketDataService);
    getMarketData(): Promise<MarketDataResponseDto>;
    getSpotStatus(): Promise<SpotStatusResponseDto>;
    recalculate(overrides: RecalculateOverridesDto): Promise<ProductResponseDto[]>;
    refresh(): Promise<MarketDataResponseDto>;
    debugHistoricClose({ date }: HistoricCloseQueryDto): Promise<{
        success: boolean;
        date: string;
    }>;
    backfillHistory({ years }: BackfillHistoryQueryDto): Promise<import("../metals/historic-spot.service").BackfillWindowReport[]>;
    seedHistory(): Promise<void>;
}
//# sourceMappingURL=market-data.controller.d.ts.map