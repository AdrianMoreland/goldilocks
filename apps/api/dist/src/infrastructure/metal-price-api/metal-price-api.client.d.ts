import { ConfigService } from '@nestjs/config';
export declare class MetalPriceApiClient {
    private readonly api;
    private readonly metals;
    constructor(config: ConfigService);
    livePrices(): Promise<LiveResponse>;
    timeframePrices(startDate: string, endDate: string, currency?: string): Promise<TimeframeResponse>;
    ohlcPrices(date: string, currency?: string, metal?: string): Promise<OHLCResponse>;
}
export interface LiveResponse {
    success: boolean;
    base: string;
    timestamp: number;
    rates: Record<string, number>;
}
export interface OHLCRate {
    open: number;
    high: number;
    low: number;
    close: number;
}
export interface OHLCResponse {
    success: boolean;
    base: string;
    quote: string;
    timestamp: number;
    rate: OHLCRate;
}
export interface TimeframeResponse {
    success: boolean;
    base: string;
    start_date: string;
    end_date: string;
    rates: Record<string, Record<string, number>>;
}
//# sourceMappingURL=metal-price-api.client.d.ts.map