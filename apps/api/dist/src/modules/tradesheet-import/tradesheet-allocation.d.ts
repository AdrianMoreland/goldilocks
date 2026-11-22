export interface AllocationSale {
    id: number;
    qty: number | null;
    date: Date | null;
}
export interface UnitRange {
    tradeId: number;
    fromSeq: number;
    toSeq: number;
}
export interface LotAllocation {
    allocatedQty: number;
    overBy: number;
    ranges: UnitRange[];
    withoutQty: number[];
}
export declare function planLotAllocation(lotQty: number | null, sales: AllocationSale[]): LotAllocation;
export declare function soldMismatch(lot: {
    qty: number | null;
    commentSoldQty: number | null;
}, allocatedQty: number): boolean;
//# sourceMappingURL=tradesheet-allocation.d.ts.map