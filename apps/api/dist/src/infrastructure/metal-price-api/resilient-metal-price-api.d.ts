import { MetalPriceApiClient } from './metal-price-api.client';
import type { LiveResponse, OHLCResponse, TimeframeResponse } from './metal-price-api.client';
import type { MetalPriceApiPort } from './metal-price-api.port';
export declare class ResilientMetalPriceApi implements MetalPriceApiPort {
    private readonly client;
    private readonly logger;
    private readonly breaker;
    constructor(client: MetalPriceApiClient);
    livePrices(): Promise<LiveResponse>;
    timeframePrices(startDate: string, endDate: string, currency?: string): Promise<TimeframeResponse>;
    ohlcPrices(date: string, currency?: string, metal?: string): Promise<OHLCResponse>;
    private guard;
}
//# sourceMappingURL=resilient-metal-price-api.d.ts.map