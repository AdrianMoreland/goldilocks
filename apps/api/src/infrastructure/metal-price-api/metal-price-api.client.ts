import metalpriceapi from 'metalpriceapi-ts';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetalPriceApiClient {

    private readonly api: metalpriceapi;

    private readonly metals = [
        'XAU',
        'XAG',
        'XPT',
        'XPD'
    ];

    private readonly timeframeCurrencies = [
        'GBP',
        'XAU',
        'XAG',
        'XPT',
        'XPD',
    ];

    constructor(config: ConfigService) {
        // main.ts's validateEnv() already fails fast at boot if this is
        // missing, so no need to re-check it here.
        this.api = new metalpriceapi(config.get<string>('METALPRICE_API_KEY')!);
    }


    /**
     * Get current metal prices
     */
    async livePrices(): Promise<LiveResponse> {
        const { data } = await this.api.fetchLive(
            'EUR',
            ['GBP', ...this.metals]
        );

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
            'troy_oz'
        );

        return data;
    }

    /**
     * Get OHLC (Open High Low Close)
     */
    async ohlcPrices(
        date: string,
        currency: string = 'EUR',
        metal: string = 'XAU'
    ): Promise<OHLCResponse> {
        const { data } = await this.api.ohlc(
            currency,
            metal,
            date,
            'troy_oz'
        );

        return data;
    }

    /**
     * Get historical metal prices for a specific date
     */
    async historicalPrices(
        date: string,
        currency: string = 'EUR'
    ): Promise<HistoricalResponse> {
        const { data } = await this.api.fetchHistorical(
            date,
            currency,
            this.metals,
            'troy_oz'
        );

        return data;
    }



    /**
     * Get available symbols
     */
    async symbols(): Promise<SymbolsResponse> {
        const { data } = await this.api.fetchSymbols();

        return data;
    }

    /**
     * Get hourly metal prices
     */
    async hourlyPrices(
        startDate: string,
        endDate: string,
        currency: string = 'EUR',
        metal: string = 'XAU'
    ): Promise<HourlyResponse> {
        const { data } = await this.api.hourly(
            currency,
            metal,
            'troy_oz',
            startDate,
            endDate
        );

        return data;
    }





    /**
     * Convert currencies/metals
     */
    async convert(
        from: string,
        to: string,
        amount: number,
        date?: string
    ): Promise<ConvertResponse> {
        const { data } = await this.api.convert(
            from,
            to,
            amount,
            date,
            'troy_oz'
        );

        return data;
    }



    /**
     * Get historical prices for ONE metal and ONE currency.
     *
     * Free plan limitation:
     * timeframe only supports one symbol at a time.
     */
    async timeframePrice(
        startDate: string,
        endDate: string,
        currency: string,
        metal: string,
    ): Promise<TimeframeResponse> {

        const { data } = await this.api.timeframe(
            startDate,
            endDate,
            currency,
            [metal],
            'troy_oz',
        );

        return data;
    }


    /**
     * Get price changes between dates
     */
    async priceChange(
        startDate: string,
        endDate: string,
        currency: string = 'EUR'
    ): Promise<ChangeResponse> {
        const { data } = await this.api.change(
            startDate,
            endDate,
            currency,
            this.metals
        );

        return data;
    }


    /**
     * Convert gold carat values
     */
    async carat(
        currency: string = 'EUR',
        metal: string = 'XAU',
        date?: string
    ): Promise<CaratResponse> {
        const { data } = await this.api.carat(
            currency,
            metal,
            date
        );

        return data;
    }


    /**
     * API usage information
     */
    async usage(): Promise<UsageResponse> {
        const { data } = await this.api.usage();

        return data;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Response types — now actually attached to the methods above, instead of
// sitting unused at the bottom of the file. MetalsProvider relies on these
// (response.success, response.rates) being correctly typed, not `any`.
// ─────────────────────────────────────────────────────────────────────────────

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
    query: { from: string; to: string; amount: number };
    info: { quote: number; timestamp: number };
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