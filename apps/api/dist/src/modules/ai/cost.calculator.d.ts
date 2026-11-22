export interface ModelPrice {
    input: number;
    cachedInput: number;
    cacheWrite?: number;
    output: number;
    longPrompt?: {
        overInputTokens: number;
        price: ModelPrice;
    };
}
export interface TokenUsage {
    inputTokens: number;
    cachedInputTokens: number;
    cacheWriteInputTokens?: number;
    outputTokens: number;
}
export declare function priceFor(model: string, override?: ModelPrice): ModelPrice;
export declare function isKnownModel(model: string): boolean;
export declare function costMicros(model: string, usage: TokenUsage, override?: ModelPrice): number;
export declare function usdToMicros(usd: number): number;
//# sourceMappingURL=cost.calculator.d.ts.map