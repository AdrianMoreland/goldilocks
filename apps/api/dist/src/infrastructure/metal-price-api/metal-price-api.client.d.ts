import { ConfigService } from '@nestjs/config';
export declare class MetalPriceApiClient {
    private readonly api;
    private readonly metals;
    private readonly timeframeCurrencies;
    constructor(config: ConfigService);
    livePrices(): Promise<LiveResponse>;
    timeframePrices(startDate: string, endDate: string, currency?: string): Promise<TimeframeResponse>;
    ohlcPrices(date: string, currency?: string, metal?: string): Promise<OHLCResponse>;
    historicalPrices(date: string, currency?: string): Promise<HistoricalResponse>;
    symbols(): Promise<SymbolsResponse>;
    hourlyPrices(startDate: string, endDate: string, currency?: string, metal?: string): Promise<HourlyResponse>;
    convert(from: string, to: string, amount: number, date?: string): Promise<ConvertResponse>;
    timeframePrice(startDate: string, endDate: string, currency: string, metal: string): Promise<TimeframeResponse>;
    priceChange(startDate: string, endDate: string, currency?: string): Promise<ChangeResponse>;
    carat(currency?: string, metal?: string, date?: string): Promise<CaratResponse>;
    usage(): Promise<UsageResponse>;
}
export interface SymbolsResponse {
    success: boolean;
    symbols: Record<string, string>;
}
export interface LiveResponse {
    success: boolean;
    base: string;
    timestamp: number;
    rates: Record<string, number>;
}
export interface HistoricalResponse {
    success: boolean;
    base: string;
    timestamp: number;
    rates: Record<string, number>;
}
export interface HourlyEntry {
    timestamp: number;
    rates: Record<string, number>;
}
export interface HourlyResponse {
    success: boolean;
    base: string;
    start_date: string;
    end_date: string;
    rates: HourlyEntry[];
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
export interface ConvertResponse {
    success: boolean;
    query: {
        from: string;
        to: string;
        amount: number;
    };
    info: {
        quote: number;
        timestamp: number;
    };
    result: number;
}
export interface TimeframeResponse {
    success: boolean;
    base: string;
    start_date: string;
    end_date: string;
    rates: Record<string, Record<string, number>>;
}
export interface ChangeData {
    start_rate: number;
    end_rate: number;
    change: number;
    change_pct: number;
}
export interface ChangeResponse {
    success: boolean;
    base: string;
    start_date: string;
    end_date: string;
    rates: Record<string, ChangeData>;
}
export interface CaratResponse {
    success: boolean;
    base: string;
    timestamp: number;
    data: Record<string, number>;
}
export interface UsageResponse {
    success: boolean;
    result: {
        plan: string;
        used: number;
        total: number;
        remaining: number;
    };
}
//# sourceMappingURL=metal-price-api.client.d.ts.map