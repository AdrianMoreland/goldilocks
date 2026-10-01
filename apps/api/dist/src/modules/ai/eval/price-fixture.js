"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIXTURE_SPOT = exports.FIXTURE_PRODUCTS = void 0;
exports.fixtureProduct = fixtureProduct;
exports.fixtureProductAt = fixtureProductAt;
exports.figure = figure;
exports.fixtureMarketData = fixtureMarketData;
const pricing_util_1 = require("../../../common/utils/pricing.util");
const SPOT = {
    GOLD: 3412.5,
    SILVER: 38.4,
    PLATINUM: 1040.1,
    PALLADIUM: 980,
};
const raw = (id, name, metalType, weight, spreadSell, spreadBuy, vatRate) => ({
    id,
    sku: `EVAL${id}`,
    name,
    metalType,
    weight,
    spreadSell,
    spreadBuy,
    vatRate,
    stock: 8,
    isActive: true,
    category: null,
    description: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
});
const RAW_PRODUCTS = [
    raw(1, '100g Gold Bar', 'GOLD', 100, 0.03, -0.02, 0),
    raw(2, '1oz Gold Bar', 'GOLD', 31.1035, 0.035, -0.02, 0),
    raw(3, '1oz Krugerrand', 'GOLD', 31.1035, 0.045, -0.03, 0),
    raw(4, '1oz Maple Leaf', 'GOLD', 31.1035, 0.045, -0.03, 0),
    raw(5, '100g Silver Bar', 'SILVER', 100, 0.08, -0.06, 0.23),
    raw(6, '1oz Britannia', 'SILVER', 31.1035, 0.15, -0.1, 0.23),
    raw(7, '1oz Platinum Bar', 'PLATINUM', 31.1035, 0.06, -0.04, 0.23),
];
exports.FIXTURE_PRODUCTS = RAW_PRODUCTS.map((p) => (0, pricing_util_1.calculateProductPrice)(p, SPOT));
function fixtureProduct(name, metal) {
    const found = exports.FIXTURE_PRODUCTS.find((p) => p.name === name && (!metal || p.metalType === metal));
    if (!found)
        throw new Error(`No fixture product "${name}"`);
    return found;
}
function fixtureProductAt(name, overrides) {
    const found = RAW_PRODUCTS.find((p) => p.name === name);
    if (!found)
        throw new Error(`No fixture product "${name}"`);
    return (0, pricing_util_1.calculateProductPrice)(found, { ...SPOT, ...overrides });
}
function figure(amount) {
    const digits = String(Math.trunc(amount));
    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '[,. ]?');
    return new RegExp(`(?<![\\d,.])${grouped}(?![\\d])`);
}
function fixtureMarketData(now = new Date()) {
    const takenAt = new Date(now.getTime() - 2 * 60_000).toISOString();
    return {
        getPricedCatalogue: (overrides = {}) => {
            const used = { ...SPOT, ...overrides };
            return Promise.resolve({
                products: RAW_PRODUCTS.map((p) => (0, pricing_util_1.calculateProductPrice)(p, used)),
                spots: Object.keys(SPOT).map((metalType) => ({
                    metalType,
                    usedEur: used[metalType],
                    liveEur: SPOT[metalType],
                    overridden: overrides[metalType] !== undefined,
                    timestamp: takenAt,
                    isFallback: false,
                })),
                degradedMetals: [],
            });
        },
    };
}
exports.FIXTURE_SPOT = SPOT;
//# sourceMappingURL=price-fixture.js.map