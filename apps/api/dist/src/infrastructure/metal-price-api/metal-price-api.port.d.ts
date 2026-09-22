import type { LiveResponse, OHLCResponse, TimeframeResponse } from './metal-price-api.client';
export interface MetalPriceApiPort {
    livePrices(): Promise<LiveResponse>;
    timeframePrices(startDate: string, endDate: string, currency?: string): Promise<TimeframeResponse>;
    ohlcPrices(date: string, currency?: string, metal?: string): Promise<OHLCResponse>;
}
export declare const METAL_PRICE_API: unique symbol;
//# sourceMappingURL=metal-price-api.port.d.ts.map