"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HISTORIC_OLD_STEP_DAYS = exports.HISTORIC_DAILY_DAYS = exports.HISTORIC_LOOKBACK_DAYS = exports.SYMBOL_MAP = exports.ALL_METALS = exports.ZERO_SPOT_MAP = exports.mergeMetalPrices = exports.calculateProductPrice = void 0;
exports.thinOldHistory = thinOldHistory;
exports.enrichSpotPrices = enrichSpotPrices;
var shared_types_1 = require("@goldilocks/shared-types");
Object.defineProperty(exports, "calculateProductPrice", { enumerable: true, get: function () { return shared_types_1.calculateProductPrice; } });
Object.defineProperty(exports, "mergeMetalPrices", { enumerable: true, get: function () { return shared_types_1.mergeMetalPrices; } });
exports.ZERO_SPOT_MAP = {
    GOLD: 0,
    SILVER: 0,
    PLATINUM: 0,
    PALLADIUM: 0,
};
exports.ALL_METALS = [
    'GOLD',
    'SILVER',
    'PLATINUM',
    'PALLADIUM',
];
exports.SYMBOL_MAP = {
    GOLD: 'XAU',
    SILVER: 'XAG',
    PLATINUM: 'XPT',
    PALLADIUM: 'XPD',
};
exports.HISTORIC_LOOKBACK_DAYS = 5 * 365 + 1;
exports.HISTORIC_DAILY_DAYS = 365;
exports.HISTORIC_OLD_STEP_DAYS = 7;
function thinOldHistory(rows, now = new Date()) {
    const dayMs = 24 * 60 * 60 * 1000;
    const cutoff = now.getTime() - exports.HISTORIC_DAILY_DAYS * dayMs;
    return rows.filter((row) => row.recordedAt.getTime() >= cutoff ||
        Math.floor(row.recordedAt.getTime() / dayMs) %
            exports.HISTORIC_OLD_STEP_DAYS ===
            0);
}
function enrichSpotPrices(spotPrices, historicMap) {
    return spotPrices.map((spot) => {
        const previousEntry = historicMap.get(spot.metalType);
        const previousClose = previousEntry?.priceEur ?? 0;
        const change = spot.priceEur - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;
        return {
            ...spot,
            previousClose,
            change,
            changePercent,
        };
    });
}
//# sourceMappingURL=pricing.util.js.map