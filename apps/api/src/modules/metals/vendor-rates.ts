import type { MetalType } from '@goldilocks/shared-types';
import {
    SYMBOL_MAP,
    type HistoricSpotRecord,
} from '../../common/utils/pricing.util';

export interface MetalRate {
    eur: number;
    gbp: number;
}

/** Only the metals the vendor actually gave a rate for — never zero-filled (see MetalsProvider.fetchFromExternalApi). */
export type MetalRates = Partial<Record<MetalType, MetalRate>>;

const METAL_SYMBOLS = Object.entries(SYMBOL_MAP) as [MetalType, string][];

/**
 * The one definition of "a price we are willing to store and show": a zero
 * is what an upstream failure looked like once it got persisted, so it is
 * never usable (same rule as SpotPriceCacheStore.isUsable).
 */
export function isUsableRate(rate: MetalRate | undefined): rate is MetalRate {
    return rate !== undefined && rate.eur > 0;
}

/**
 * When the vendor says the rates were struck. Vendor timestamps are unix
 * seconds; anything missing or not in the past is replaced by `now` so a bad
 * value can't make a price look brand new.
 */
export function vendorAsOf(
    vendorSeconds: unknown,
    now: number = Date.now(),
): Date {
    const vendorMs = Number(vendorSeconds) * 1000;
    return Number.isFinite(vendorMs) && vendorMs > 0 && vendorMs <= now
        ? new Date(vendorMs)
        : new Date(now);
}

/**
 * Vendor quotes "units of metal per 1 EUR", so the EUR price per ounce is
 * the inverse; GBP is the EUR price times the EUR→GBP rate.
 */
export function mapLiveRates(
    rates: Record<string, number>,
    onMissing?: (metal: MetalType, symbol: string) => void,
): MetalRates {
    const mapped: MetalRates = {};
    const gbpRate = rates.GBP ?? 0;

    for (const [metal, symbol] of METAL_SYMBOLS) {
        const raw = rates[symbol];
        if (!raw) {
            onMissing?.(metal, symbol);
            continue;
        }
        const eur = 1 / raw;
        mapped[metal] = { eur, gbp: eur * gbpRate };
    }

    return mapped;
}

/** Joins the EUR and GBP timeframe responses day by day, skipping any day/metal missing from either. */
export function mapTimeframeRecords(
    eurByDate: Record<string, Record<string, number>>,
    gbpByDate: Record<string, Record<string, number>>,
): HistoricSpotRecord[] {
    const records: HistoricSpotRecord[] = [];

    for (const [date, eurRates] of Object.entries(eurByDate)) {
        const gbpRates = gbpByDate[date];
        if (!gbpRates) continue;

        for (const [metalType, symbol] of METAL_SYMBOLS) {
            const eurRate = eurRates[symbol];
            const gbpRate = gbpRates[symbol];
            if (eurRate == null || gbpRate == null) continue;

            records.push({
                metalType,
                priceEur: 1 / Number(eurRate),
                priceGbp: 1 / Number(gbpRate),
                recordedAt: new Date(date),
            });
        }
    }

    return records;
}
