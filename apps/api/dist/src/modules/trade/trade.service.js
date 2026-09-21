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
exports.TradeService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@goldilocks/shared-types");
const metals_provider_1 = require("../metals/metals.provider");
const products_provider_1 = require("../products/products.provider");
let TradeService = class TradeService {
    metalsProvider;
    productsProvider;
    constructor(metalsProvider, productsProvider) {
        this.metalsProvider = metalsProvider;
        this.productsProvider = productsProvider;
    }
    async getBootstrap(metalType) {
        const [spot, allProducts] = await Promise.all([
            this.metalsProvider.getLatest(metalType),
            this.productsProvider.getAll(),
        ]);
        if (!spot) {
            throw new common_1.NotFoundException(`No spot price available for ${metalType}.`);
        }
        const bounds = shared_types_1.TRADE_METAL_SLIDER_BOUNDS[metalType];
        const products = allProducts
            .filter((p) => p.metalType === metalType)
            .map((p) => ({
            id: p.id,
            sku: p.sku,
            name: p.name,
            weight: p.weight,
            metalType: p.metalType,
            premiumPct: p.spreadSell * 100,
            discountPct: Math.abs(p.spreadBuy) * 100,
        }));
        return {
            metalType,
            spot: spot.priceEur,
            minSpot: bounds.min,
            maxSpot: bounds.max,
            products,
        };
    }
    async calculateCart(request) {
        const { metalType, transactionType, customSpot, items } = request;
        const masterSpot = await this.metalsProvider.getLatest(metalType);
        if (!masterSpot) {
            throw new common_1.NotFoundException(`No spot price available for ${metalType}.`);
        }
        const spot = customSpot && customSpot > 0 ? customSpot : masterSpot.priceEur;
        const spotPerGram = spot / shared_types_1.GRAMS_PER_TROY_OUNCE;
        const products = await Promise.all(items.map((item) => this.productsProvider.getById(item.productId)));
        let totalWeight = 0;
        let totalPrice = 0;
        const lines = [];
        items.forEach((item, index) => {
            const product = products[index];
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found.`);
            }
            if (product.metalType !== metalType) {
                throw new common_1.BadRequestException(`${product.name} is not a ${metalType} product.`);
            }
            const percent = this.validatePercent(transactionType, item.percent);
            const quantity = Math.max(1, Math.floor(item.quantity) || 1);
            const basePrice = spotPerGram * product.weight;
            const unitPrice = (0, shared_types_1.computeTransactionPrice)(basePrice, transactionType, percent);
            const lineTotal = unitPrice * quantity;
            const lineWeight = product.weight * quantity;
            totalWeight += lineWeight;
            totalPrice += lineTotal;
            lines.push({
                productId: product.id,
                product: product.name,
                sku: product.sku,
                weight: product.weight,
                quantity,
                percent,
                unitPrice,
                lineTotal,
            });
        });
        return {
            metalType,
            transactionType,
            spot,
            lines,
            totalWeight,
            averagePerGram: totalWeight > 0 ? totalPrice / totalWeight : 0,
            totalPrice,
        };
    }
    async calculateMelt(request) {
        const category = shared_types_1.MELT_CATEGORIES[request.category];
        const spot = await this.metalsProvider.getLatest(category.metal);
        if (!spot) {
            throw new common_1.NotFoundException(`No spot price available for ${category.metal}.`);
        }
        const spotPerGram = spot.priceEur / shared_types_1.GRAMS_PER_TROY_OUNCE;
        const meltValue = (0, shared_types_1.computeMeltValue)(spotPerGram, category.meltFactor, category.purity, request.weight);
        return {
            category: request.category,
            metal: category.metal,
            spot: spot.priceEur,
            spotPerGram,
            meltFactor: category.meltFactor,
            purity: category.purity,
            weight: request.weight,
            meltValue,
        };
    }
    validatePercent(transactionType, value) {
        if (transactionType === 'buying') {
            if (!Number.isFinite(value) || value < 0) {
                throw new common_1.BadRequestException('Please enter a valid premium.');
            }
            return value;
        }
        if (!Number.isFinite(value) || value < 0 || value >= 100) {
            throw new common_1.BadRequestException('Please enter a valid discount between 0% and 99.99%.');
        }
        return value;
    }
};
exports.TradeService = TradeService;
exports.TradeService = TradeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metals_provider_1.MetalsProvider,
        products_provider_1.ProductsProvider])
], TradeService);
//# sourceMappingURL=trade.service.js.map