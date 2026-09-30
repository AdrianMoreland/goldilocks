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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const products_provider_1 = require("../products/products.provider");
const metals_provider_1 = require("../metals/metals.provider");
const pricing_util_1 = require("../../common/utils/pricing.util");
let PortfolioService = class PortfolioService {
    productsProvider;
    metalsProvider;
    constructor(productsProvider, metalsProvider) {
        this.productsProvider = productsProvider;
        this.metalsProvider = metalsProvider;
    }
    async calculateProfitAnalysis(request) {
        const product = await this.productsProvider.getById(request.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Product ${request.productId} not found.`);
        }
        if (product.metalType !== request.metalType) {
            throw new common_1.BadRequestException(`${product.name} is not a ${request.metalType} product.`);
        }
        const productMultiplier = product.weight / shared_types_1.GRAMS_PER_TROY_OUNCE;
        let solved;
        try {
            solved = (0, shared_types_1.solveMissingPurchaseField)(request.missingField, request.purchaseSpot, request.purchasePremium, request.purchasePrice, productMultiplier);
        }
        catch (err) {
            throw new common_1.BadRequestException(err instanceof Error ? err.message : 'Invalid purchase inputs.');
        }
        const currentBuybackValue = (0, shared_types_1.computeCurrentBuybackValue)(request.currentSpot, request.currentDiscount, productMultiplier);
        const { profit, profitPercent } = (0, shared_types_1.computeProfit)(currentBuybackValue, solved.purchasePrice);
        const { requiredSpot, requiredPrice, targetReturn } = (0, shared_types_1.computeRequiredSpotForTarget)(solved.purchasePrice, request.targetProfit, productMultiplier, request.currentDiscount);
        return {
            product: product.name,
            productMultiplier,
            purchaseSpot: solved.purchaseSpot,
            purchasePremium: solved.purchasePremium,
            purchasePrice: solved.purchasePrice,
            currentSpot: request.currentSpot,
            currentDiscount: request.currentDiscount,
            currentBuybackValue,
            profit,
            profitPercent,
            requiredSpot,
            requiredPrice,
            targetProfit: request.targetProfit,
            targetReturn,
        };
    }
    async buildPortfolio(request) {
        const [spot, rawProducts] = await Promise.all([
            this.metalsProvider.getLatest(request.metalType),
            this.productsProvider.getAll(),
        ]);
        if (!spot) {
            throw new common_1.NotFoundException(`No spot price available for ${request.metalType}.`);
        }
        const spotMap = { ...pricing_util_1.ZERO_SPOT_MAP, [request.metalType]: request.customSpot && request.customSpot > 0 ? request.customSpot : spot.priceEur };
        const priorityProduct = request.priorityProductId
            ? rawProducts.find((p) => p.id === request.priorityProductId)
            : undefined;
        const candidates = rawProducts
            .filter((p) => p.metalType === request.metalType && p.stock > 0)
            .map((p) => {
            const priced = (0, pricing_util_1.calculateProductPrice)(p, spotMap);
            return {
                id: priced.id,
                product: priced.name,
                weight: priced.weight,
                sellPrice: priced.priceSell,
                premium: priced.spreadSell * 100,
                type: /bar/i.test(priced.name) ? 'bar' : 'coin',
            };
        });
        let results;
        try {
            results = (0, shared_types_1.buildPortfolioStrategies)(candidates, request.budget, request.productType, priorityProduct?.name ?? '', request.priorityStrength);
        }
        catch (err) {
            throw new common_1.BadRequestException(err instanceof Error ? err.message : 'Unable to build a portfolio.');
        }
        return {
            metalType: request.metalType,
            budget: request.budget,
            productType: request.productType,
            priorityProductId: priorityProduct?.id ?? null,
            priorityStrength: request.priorityStrength,
            results: results.map(({ strategy, result }) => ({ strategy, ...result })),
        };
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_provider_1.ProductsProvider,
        metals_provider_1.MetalsProvider])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map