import { type AliasSeenIn, type AliasUsageMetal, type AliasUsageSource } from '@goldilocks/shared-types';
export interface UsageGroup {
    source: AliasUsageSource;
    metal: AliasUsageMetal | null;
    name: string;
    refinery: string | null;
    resolved: boolean;
    count: number;
}
export interface AliasUsage {
    seenIn: AliasSeenIn[];
    perMetal: {
        metal: AliasUsageMetal;
        unresolved: number;
    }[] | null;
    settledPerRow: boolean;
}
export declare function splitAlias(alias: string): {
    name: string;
    refinery: string | null;
};
export declare function rowAliasKey(text: string, refinery: string | null | undefined): string;
export type UsageIndex = Map<string, UsageGroup[]>;
export declare function buildUsageIndex(groups: UsageGroup[]): UsageIndex;
export declare function usageOf(alias: string, index: UsageIndex): AliasUsage;
//# sourceMappingURL=product-name-usage.d.ts.map