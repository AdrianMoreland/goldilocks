"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceFor = priceFor;
exports.isKnownModel = isKnownModel;
exports.costMicros = costMicros;
exports.usdToMicros = usdToMicros;
const HAIKU_5_5 = {
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
const PRICES = {
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
const UNKNOWN_MODEL_PRICE = PRICES['claude-opus-5-5'];
function priceFor(model, override) {
    if (override)
        return override;
    if (PRICES[model])
        return PRICES[model];
    const family = Object.keys(PRICES)
        .sort((a, b) => b.length - a.length)
        .find((name) => model.startsWith(`${name}-`));
    return family ? PRICES[family] : UNKNOWN_MODEL_PRICE;
}
function isKnownModel(model) {
    return (Boolean(PRICES[model]) ||
        Object.keys(PRICES).some((name) => model.startsWith(`${name}-`)));
}
function costMicros(model, usage, override) {
    let price = priceFor(model, override);
    if (price.longPrompt &&
        usage.inputTokens > price.longPrompt.overInputTokens) {
        price = price.longPrompt.price;
    }
    const cached = Math.min(usage.cachedInputTokens, usage.inputTokens);
    const written = Math.min(usage.cacheWriteInputTokens ?? 0, usage.inputTokens - cached);
    const uncached = usage.inputTokens - cached - written;
    return Math.ceil(uncached * price.input +
        cached * price.cachedInput +
        written * (price.cacheWrite ?? price.input * 1.25) +
        usage.outputTokens * price.output);
}
function usdToMicros(usd) {
    return Math.round(usd * 1_000_000);
}
//# sourceMappingURL=cost.calculator.js.map