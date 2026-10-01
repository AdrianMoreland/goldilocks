"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPOT_STALE_AFTER_MS = void 0;
exports.describeSpot = describeSpot;
exports.SPOT_STALE_AFTER_MS = 15 * 60 * 1000;
function irishTime(iso) {
    return new Date(iso).toLocaleString('en-IE', {
        timeZone: 'Europe/Dublin',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}
function describeSpot(spot, now) {
    const available = spot.usedEur > 0;
    const ageMs = spot.timestamp === null
        ? null
        : now.getTime() - new Date(spot.timestamp).getTime();
    return {
        metal: spot.metalType,
        available,
        eurPerTroyOunce: spot.usedEur,
        source: spot.overridden ? 'manual' : 'live',
        asOfIrishTime: spot.timestamp ? irishTime(spot.timestamp) : null,
        ageMinutes: ageMs === null ? null : Math.max(0, Math.round(ageMs / 60_000)),
        mayBeOutOfDate: !spot.overridden &&
            (spot.isFallback || ageMs === null || ageMs > exports.SPOT_STALE_AFTER_MS),
    };
}
//# sourceMappingURL=spot-description.js.map