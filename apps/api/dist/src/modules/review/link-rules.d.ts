export type Verdict = {
    verdict: 'CONFIRM';
} | {
    verdict: 'ASK';
    reason: string;
} | {
    verdict: 'SEPARATE';
    reason: string;
};
export interface SaleEnd {
    qty: number | null;
    productKey: string | null;
    productId?: number | null;
    productText: string;
}
export interface LotEnd extends SaleEnd {
    allocatedQty: number;
}
export interface LineEnd {
    qty: number | null;
    itemName: string;
}
export declare function productTokens(text: string): Set<string>;
export declare function sameProduct(a: {
    productKey: string | null;
    productId?: number | null;
    text: string;
}, b: {
    productKey: string | null;
    productId?: number | null;
    text: string;
}): boolean;
export declare function judgeSaleLot(sale: SaleEnd | null, lot: LotEnd | null): Verdict;
export declare function judgeLineTrade(line: LineEnd | null, trade: SaleEnd | null): Verdict;
//# sourceMappingURL=link-rules.d.ts.map