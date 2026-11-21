/**
 * Turns token counts into money, in whole micro-dollars (1 USD = 1,000,000)
 * so the sums the spend breaker adds up are exact integers, never floats.
 *
 * Prices are USD per million tokens. The OpenAI rows were read from OpenAI's
 * pricing page on 2026-09-30 (gpt-4.1-mini from memory of the list price);
 * the Claude rows from Anthropic's pricing page on 2026-11-20 (standard
 * global routing, 5-minute cache writes). They change, so re-check them
 * before each budget review (see docs/AI-AGENT-PLAN.md §8), or override with
 * AI_PRICE_PER_MILLION.
 */
export interface ModelPrice {
    input: number;
    /** Input tokens read from the prompt cache. */
    cachedInput: number;
    /** Input tokens written to the prompt cache; the normal input price when the vendor charges nothing extra. */
    cacheWrite?: number;
    output: number;
    /** Some models charge more for every token once the prompt is longer than a threshold. */
    longPrompt?: { overInputTokens: number; price: ModelPrice };
}

const HAIKU_5_5: ModelPrice = {
    input: 0.1,
    cachedInput: 0.01,
    cacheWrite: 0.125,
    output: 0.5,
    longPrompt: {
        overInputTokens: 100_000,
        price: {
            input: 0.5,
            cachedInput: 0.05,
            cacheWrite: 0.625,
            output: 2.5,
        },
    },
};

const PRICES: Record<string, ModelPrice> = {
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
    'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.4 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10 },
    'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10 },
    'claude-haiku-5-5': HAIKU_5_5,
    'claude-sonnet-5-5': {
        input: 2,
        cachedInput: 0.1,
        cacheWrite: 2.5,
        output: 10,
    },
    'claude-opus-5-5': {
        input: 4,
        cachedInput: 0.2,
        cacheWrite: 5,
        output: 20,
    },
};

/**
 * Used for a model that isn't in the table. Deliberately the dearest known
 * price: a budget breaker that under-counts an unknown model would let spend
 * run past the limit, while over-counting only pauses the assistant early.
 */
const UNKNOWN_MODEL_PRICE: ModelPrice = PRICES['claude-opus-5-5'];

export interface TokenUsage {
    /** All input tokens, including those read from or written to the cache. */
    inputTokens: number;
    cachedInputTokens: number;
    cacheWriteInputTokens?: number;
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
    let price = priceFor(model, override);
    if (
        price.longPrompt &&
        usage.inputTokens > price.longPrompt.overInputTokens
    ) {
        price = price.longPrompt.price;
    }
    const cached = Math.min(usage.cachedInputTokens, usage.inputTokens);
    const written = Math.min(
        usage.cacheWriteInputTokens ?? 0,
        usage.inputTokens - cached,
    );
    const uncached = usage.inputTokens - cached - written;
    // USD per million tokens equals micro-dollars per token.
    return Math.ceil(
        uncached * price.input +
            cached * price.cachedInput +
            // Not given (an AI_PRICE_PER_MILLION override, say): assume the usual 1.25x, so writes are never under-counted.
            written * (price.cacheWrite ?? price.input * 1.25) +
            usage.outputTokens * price.output,
    );
}

export function usdToMicros(usd: number): number {
    return Math.round(usd * 1_000_000);
}
