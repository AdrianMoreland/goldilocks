export interface ToolFacts {
    numbers: number[];
    mayBeOutOfDate: boolean;
    asOfIrishTime: string | null;
    usedCustomSpot: boolean;
    liveAsOfIrishTime: string | null;
}
export declare function collectFacts(results: readonly unknown[]): ToolFacts;
export declare function describeSpotNote(facts: ToolFacts): {
    tone: 'custom' | 'stale' | 'healthy';
    message: string;
} | null;
//# sourceMappingURL=tool-facts.d.ts.map