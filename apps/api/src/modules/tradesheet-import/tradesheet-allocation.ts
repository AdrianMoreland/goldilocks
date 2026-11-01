/**
 * Which items of a purchase lot each sale took. The sale names its lot in CPTY; the lot's own "N sold" comment
 * is only a check. Pure: the service loads the rows and writes what this returns.
 */

export interface AllocationSale {
    id: number;
    qty: number | null;
    date: Date | null;
}

export interface UnitRange {
    tradeId: number;
    /** Stock rows fromSeq..toSeq of the lot (1-based, inclusive). */
    fromSeq: number;
    toSeq: number;
}

export interface LotAllocation {
    /** What the sales say they took, even when that is more than the lot holds. */
    allocatedQty: number;
    /** Items the sales took beyond what was bought. */
    overBy: number;
    /** Stock rows to mark as sold, per sale. Never past the lot's quantity. */
    ranges: UnitRange[];
    /** Sales that name this lot but have no usable quantity. */
    withoutQty: number[];
}

/**
 * Hands the lot's items to its sales in date order (then row id), so the same sheet always gives the same answer.
 * A sale with no quantity cannot take items and is reported back. A lot with no known quantity cannot be
 * over-allocated, and gets no stock rows assigned.
 */
export function planLotAllocation(
    lotQty: number | null,
    sales: AllocationSale[],
): LotAllocation {
    const ordered = [...sales].sort((a, b) => {
        const da = a.date?.getTime() ?? Number.POSITIVE_INFINITY;
        const db = b.date?.getTime() ?? Number.POSITIVE_INFINITY;
        return da - db || a.id - b.id;
    });

    let allocatedQty = 0;
    let next = 1;
    const ranges: UnitRange[] = [];
    const withoutQty: number[] = [];
    for (const s of ordered) {
        if (s.qty === null || s.qty <= 0) {
            withoutQty.push(s.id);
            continue;
        }
        allocatedQty += s.qty;
        if (lotQty === null) continue;
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

/**
 * True when the lot's comment and its sales disagree about how much was sold. "ALL SOLD" counts as the whole lot.
 * A lot with no comment says nothing, so it disagrees only if sales took something.
 */
export function soldMismatch(
    lot: { qty: number | null; commentSoldQty: number | null },
    allocatedQty: number,
): boolean {
    if (lot.qty === null) return false;
    return (lot.commentSoldQty ?? 0) !== allocatedQty;
}
