"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceFor = priceFor;
exports.isKnownModel = isKnownModel;
exports.costMicros = costMicros;
exports.usdToMicros = usdToMicros;
const PRICES = {
    'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
    'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
    'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.4 },
    'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10 },
    'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10 },
};
const UNKNOWN_MODEL_PRICE = PRICES['gpt-4o'];
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
    const price = priceFor(model, override);
    const cached = Math.min(usage.cachedInputTokens, usage.inputTokens);
    const uncached = usage.inputTokens - cached;
    return Math.ceil(uncached * price.input +
        cached * price.cachedInput +
        usage.outputTokens * price.output);
}
function usdToMicros(usd) {
    return Math.round(usd * 1_000_000);
}
//# sourceMappingURL=cost.calculator.js.map