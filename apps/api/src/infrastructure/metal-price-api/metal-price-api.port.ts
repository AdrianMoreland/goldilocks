import type {
    LiveResponse,
    OHLCResponse,
    TimeframeResponse,
} from './metal-price-api.client';

/**
 * Abstraction over the metals-price vendor — MetalsProvider depends on this,
 * never on MetalPriceApiClient directly, so the vendor can be swapped (one
 * new class + one binding change, see metal-price-api.module.ts) or faked in
 * tests without touching MetalsProvider. Scoped to only the three calls
 * MetalsProvider actually makes; the full vendor SDK surface stays on
 * MetalPriceApiClient. Mirrors AuthProviderPort's shape (see docs/ENGINEERING.md §15).
 */
export interface MetalPriceApiPort {
    livePrices(): Promise<LiveResponse>;
    timeframePrices(
        startDate: string,
        endDate: string,
        currency?: string,
    ): Promise<TimeframeResponse>;
    ohlcPrices(
        date: string,
        currency?: string,
        metal?: string,
    ): Promise<OHLCResponse>;
}

export const METAL_PRICE_API = Symbol('METAL_PRICE_API');
