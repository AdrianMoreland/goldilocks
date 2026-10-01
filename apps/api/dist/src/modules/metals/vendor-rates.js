"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsableRate = isUsableRate;
exports.vendorAsOf = vendorAsOf;
exports.mapLiveRates = mapLiveRates;
exports.mapTimeframeRecords = mapTimeframeRecords;
const pricing_util_1 = require("../../common/utils/pricing.util");
const METAL_SYMBOLS = Object.entries(pricing_util_1.SYMBOL_MAP);
function isUsableRate(rate) {
    return rate !== undefined && rate.eur > 0;
}
function vendorAsOf(vendorSeconds, now = Date.now()) {
    const vendorMs = Number(vendorSeconds) * 1000;
    return Number.isFinite(vendorMs) && vendorMs > 0 && vendorMs <= now
        ? new Date(vendorMs)
        : new Date(now);
}
function mapLiveRates(rates, onMissing) {
    const mapped = {};
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
function mapTimeframeRecords(eurByDate, gbpByDate) {
    const records = [];
    for (const [date, eurRates] of Object.entries(eurByDate)) {
        const gbpRates = gbpByDate[date];
        if (!gbpRates)
            continue;
        for (const [metalType, symbol] of METAL_SYMBOLS) {
            const eurRate = eurRates[symbol];
            const gbpRate = gbpRates[symbol];
            if (eurRate == null || gbpRate == null)
                continue;
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
//# sourceMappingURL=vendor-rates.js.map