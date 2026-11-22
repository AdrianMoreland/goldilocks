import { type ImportSource, type ParsedPurchase, type ParsedSale, type PlanRowStatus, type RowResolveMethod, type RowResolverData, type TabKind, type TabPlan, type TradesheetImportPlan, type TradesheetTab } from '@goldilocks/shared-types';
export type PlanMetal = 'GOLD' | 'SILVER';
export interface ExistingTrade {
    id: number;
    referenceKey: string;
    occurrence: number;
    fingerprint: string;
    missingFromImport: boolean;
    sourceMonth: string;
    sourceTab: string;
    client: string;
    qty: number | null;
    productText: string;
    cptyRaw: string | null;
    state: string;
    collected: boolean;
    cost: number | null;
    receipt: number | null;
    notes: string | null;
    lotKey: string | null;
    productKey: string | null;
    productId: number | null;
    issues: string[];
}
export interface ExistingLot {
    id: number;
    referenceKey: string;
    occurrence: number;
    fingerprint: string;
    missingFromImport: boolean;
    sourceMonth: string;
    sourceTab: string;
    client: string;
    qty: number | null;
    productText: string;
    pricePaid: number | null;
    hedgedAt: number | null;
    commentsRaw: string | null;
    productKey: string | null;
    productId: number | null;
    issues: string[];
}
interface Keyed {
    referenceKey: string;
    occurrence: number;
    metal: PlanMetal;
    productKey: string | null;
    productId: number | null;
    how: RowResolveMethod | null;
    issues: string[];
    duplicate: boolean;
}
export interface ParsedSaleRow extends Keyed {
    parsed: ParsedSale;
    qty: number | null;
}
export interface ParsedLotRow extends Keyed {
    parsed: ParsedPurchase;
    qty: number | null;
}
export interface ParsedTab {
    name: string;
    kind: TabKind | null;
    problems: string[];
    metal: PlanMetal | null;
    sales: ParsedSaleRow[];
    lots: ParsedLotRow[];
}
export declare function parseTab(tab: TradesheetTab, products: RowResolverData, source?: ImportSource): ParsedTab;
export interface PlannedSale extends ParsedSaleRow {
    status: PlanRowStatus;
    changedFields: string[];
    existing: ExistingTrade | null;
}
export interface PlannedLot extends ParsedLotRow {
    status: PlanRowStatus;
    changedFields: string[];
    existing: ExistingLot | null;
}
export interface TabReconciliation {
    name: string;
    kind: TabKind | null;
    problems: string[];
    sales: PlannedSale[];
    lots: PlannedLot[];
    missingTradeIds: number[];
    missingLotIds: number[];
}
export declare function reconcileTab(parsed: ParsedTab, sheetMonth: string, existingTrades: ExistingTrade[], existingLots: ExistingLot[]): TabReconciliation;
export declare function needsProductRefresh(r: PlannedSale | PlannedLot): boolean;
export declare function summariseTab(rec: TabReconciliation): TabPlan;
export declare function summarise(fileName: string, sheetMonth: string, recs: TabReconciliation[], warnings?: string[]): TradesheetImportPlan;
export {};
//# sourceMappingURL=tradesheet-import.plan.d.ts.map