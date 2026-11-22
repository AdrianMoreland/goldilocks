"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planLotAllocation = planLotAllocation;
exports.soldMismatch = soldMismatch;
function planLotAllocation(lotQty, sales) {
    const ordered = [...sales].sort((a, b) => {
        const da = a.date?.getTime() ?? Number.POSITIVE_INFINITY;
        const db = b.date?.getTime() ?? Number.POSITIVE_INFINITY;
        return da - db || a.id - b.id;
    });
    let allocatedQty = 0;
    let next = 1;
    const ranges = [];
    const withoutQty = [];
    for (const s of ordered) {
        if (s.qty === null || s.qty <= 0) {
            withoutQty.push(s.id);
            continue;
        }
        allocatedQty += s.qty;
        if (lotQty === null)
            continue;
        const last = Math.min(next + s.qty - 1, lotQty);
        if (last >= next)
            ranges.push({ tradeId: s.id, fromSeq: next, toSeq: last });
        next += s.qty;
    }
    return {
        allocatedQty,
        overBy: lotQty === null ? 0 : Math.max(0, allocatedQty - lotQty),
        ranges,
        withoutQty,
    };
}
function soldMismatch(lot, allocatedQty) {
    if (lot.qty === null)
        return false;
    return (lot.commentSoldQty ?? 0) !== allocatedQty;
}
//# sourceMappingURL=tradesheet-allocation.js.map