/**
 * Turns token counts into money, in whole micro-dollars (1 USD = 1,000,000)
 * so the sums the spend breaker adds up are exact integers, never floats.
 *
 * Prices are USD per million tokens. Read from OpenAI's pricing page on
 * 2026-09-30 for the first three; gpt-4.1-mini is from memory of the list
 * price. They change, so re-check them before each budget review (see
 * docs/AI-AGENT-PLAN.md §8), or override with AI_PRICE_PER_MILLION.
 */
export interface ModelPrice {
    input: number;
    cachedInput: number;
    output: number;
}

const PRICES: Record<string, ModelPrice> = {
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
    'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.4 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10 },
    'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10 },
};

/**
 * Used for a model that isn't in the table. Deliberately the dearest known
 * price: a budget breaker that under-counts an unknown model would let spend
 * run past the limit, while over-counting only pauses the assistant early.
 */
const UNKNOWN_MODEL_PRICE: ModelPrice = PRICES['gpt-4o'];

export interface TokenUsage {
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
}

/** Vendors report dated snapshots ("gpt-4o-mini-2024-07-18"); the price is that of the family. */
export function priceFor(model: string, override?: ModelPrice): ModelPrice {
    if (override) return override;
    if (PRICES[model]) return PRICES[model];
    const family = Object.keys(PRICES)
        .sort((a, b) => b.length - a.length)
        .find((name) => model.startsWith(`${name}-`));
    return family ? PRICES[family] : UNKNOWN_MODEL_PRICE;
}

export function isKnownModel(model: string): boolean {
    return (
        Boolean(PRICES[model]) ||
        Object.keys(PRICES).some((name) => model.startsWith(`${name}-`))
    );
}

/** Rounded up: a fraction of a micro-dollar is never reported as free. */
export function costMicros(
    model: string,
    usage: TokenUsage,
    override?: ModelPrice,
): number {
    const price = priceFor(model, override);
    const cached = Math.min(usage.cachedInputTokens, usage.inputTokens);
    const uncached = usage.inputTokens - cached;
    // USD per million tokens equals micro-dollars per token.
    return Math.ceil(
        uncached * price.input +
            cached * price.cachedInput +
            usage.outputTokens * price.output,
    );
}

export function usdToMicros(usd: number): number {
    return Math.round(usd * 1_000_000);
}
