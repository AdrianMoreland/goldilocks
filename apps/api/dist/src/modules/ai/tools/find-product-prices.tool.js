"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProductPricesTool = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const shared_types_1 = require("@goldilocks/shared-types");
const market_data_service_1 = require("../../market-data/market-data.service");
const product_matcher_1 = require("./product-matcher");
const spot_description_1 = require("./spot-description");
const schema = zod_1.z.object({
    query: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(80)
        .describe('Which product, in the customer\'s words, e.g. "100g gold bar", "1oz Krugerrand", "silver coins".'),
    metal: shared_types_1.MetalTypeEnum.optional().describe('The metal, if the customer named one and the query does not.'),
    quantity: zod_1.z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(1)
        .describe('How many the customer wants. Totals are worked out for you.'),
});
let FindProductPricesTool = class FindProductPricesTool {
    marketData;
    name = 'findProductPrices';
    description = 'Looks up what products cost right now: "price" is what the customer pays us (VAT included), "buyback" is what we pay the customer. Figures are those shown in the dashboard product table, from the current spot. Always use this for any price; never work out or remember a price yourself. Returns every matching product, so a vague request returns several.';
    schema = schema;
    constructor(marketData) {
        this.marketData = marketData;
    }
    async run(args, context) {
        const { products, spots } = await this.marketData.getPricedCatalogue(context.spotOverrides);
        const { products: matches, ambiguous } = (0, product_matcher_1.matchProducts)(products, args.query, args.metal);
        if (matches.length === 0) {
            return {
                matchCount: 0,
                note: 'No product matches that. Do not guess a price: tell the staff member, and ask what product or weight the customer means.',
            };
        }
        const metals = [...new Set(matches.map((p) => p.metalType))];
        return {
            matchCount: matches.length,
            ...(ambiguous
                ? {
                    note: 'Several products fit. List the relevant ones with their prices, or ask which the customer means.',
                }
                : {}),
            quantity: args.quantity,
            spot: spots
                .filter((s) => metals.includes(s.metalType))
                .map((s) => (0, spot_description_1.describeSpot)(s, context.now)),
            products: matches.map((p) => ({
                name: p.name,
                metal: p.metalType,
                weightGrams: p.weight,
                price: p.priceSell,
                priceExVat: p.priceSellVatExcl,
                vatRatePercent: Math.round(p.vatRate * 10_000) / 100,
                buyback: p.priceBuy,
                inStock: p.stock > 0,
                ...(args.quantity > 1
                    ? {
                        totalPrice: p.priceSell * args.quantity,
                        totalBuyback: p.priceBuy * args.quantity,
                    }
                    : {}),
            })),
        };
    }
};
exports.FindProductPricesTool = FindProductPricesTool;
exports.FindProductPricesTool = FindProductPricesTool = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [market_data_service_1.MarketDataService])
], FindProductPricesTool);
//# sourceMappingURL=find-product-prices.tool.js.map