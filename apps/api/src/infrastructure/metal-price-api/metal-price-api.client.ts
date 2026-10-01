import metalpriceapi from 'metalpriceapi-ts';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * metalpriceapi.com SDK wrapper — exactly the calls MetalPriceApiPort
 * declares. The SDK offers more (hourly, convert, carat, usage…); add a
 * method here together with its port entry when something actually needs it.
 */
@Injectable()
export class MetalPriceApiClient {
    private readonly api: metalpriceapi;

    private readonly metals = ['XAU', 'XAG', 'XPT', 'XPD'];

    constructor(config: ConfigService) {
        // main.ts's validateEnv() already fails fast at boot if this is
        // missing, so no need to re-check it here.
        this.api = new metalpriceapi(config.get<string>('METALPRICE_API_KEY')!);
    }

    /**
     * Get current metal prices
     */
    async livePrices(): Promise<LiveResponse> {
        const { data } = await this.api.fetchLive('EUR', [
            'GBP',
            ...this.metals,
        ]);

        return data;
    }

    /**
     * Get prices between two dates
     */
    async timeframePrices(
        startDate: string,
        endDate: string,
        currency: string = 'EUR',
    ): Promise<TimeframeResponse> {
        const { data } = await this.api.timeframe(
            startDate,
            endDate,
            currency,
            this.metals,
            'troy_oz',
        );

        return data;
    }

    /**
     * Get OHLC (Open High Low Close)
     */
    async ohlcPrices(
        date: string,
        currency: string = 'EUR',
        metal: string = 'XAU',
    ): Promise<OHLCResponse> {
        const { data } = await this.api.ohlc(currency, metal, date, 'troy_oz');

        return data;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Response types — MetalsProvider relies on these (response.success,
// response.rates) being correctly typed, not `any`.
// ─────────────────────────────────────────────────────────────────────────────

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
