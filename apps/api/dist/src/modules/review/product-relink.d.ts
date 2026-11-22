import { type MetalType, type RelinkTableResult, type RowResolverData } from '@goldilocks/shared-types';
export interface RelinkRow {
    id: number;
    text: string;
    refinery: string | null;
    metal: MetalType | null;
    productId: number | null;
    salesProductId: number | null;
    bcItemNo?: string | null;
    bc?: {
        productId: number | null;
        salesProductId: number | null;
    } | null;
}
export interface RelinkSpec {
    hasProductId: boolean;
}
export interface RowChange {
    productId?: [number | null, number];
    salesProductId?: [number | null, number];
}
export type RelinkCounts = Omit<RelinkTableResult, 'written'>;
export interface RelinkPlan {
    counts: RelinkCounts;
    changes: {
        id: number;
        change: RowChange;
    }[];
}
export interface RelinkLookups {
    pricingMetal: ReadonlyMap<number, string>;
    salesMetal: ReadonlyMap<number, string | null>;
}
export declare function planRelink(rows: readonly RelinkRow[], spec: RelinkSpec, full: RowResolverData, person: RowResolverData, lookups: RelinkLookups, correct: boolean): RelinkPlan;
export interface ChangeGroup {
    change: RowChange;
    ids: number[];
}
export declare function groupChanges(plan: RelinkPlan['changes']): ChangeGroup[];
//# sourceMappingURL=product-relink.d.ts.map