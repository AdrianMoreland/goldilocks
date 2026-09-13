import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
    MeltCalculatorRequest,
    MeltCalculatorResponse,
    MELT_CATEGORIES,
    MetalType,
    TradeCartRequest,
    TradeCartResponse,
    TradeCartLine,
    TradeBootstrapResponse,
    TRADE_METAL_SLIDER_BOUNDS,
    TradeTransactionType,
    computeMeltValue,
    computeTransactionPrice,
    GRAMS_PER_TROY_OUNCE,
} from '@goldilocks/shared-types';
import { MetalsProvider } from '../metals/metals.provider';
import { ProductsProvider } from '../products/products.provider';

/**
 * TradeService — buy/sell cart pricing + the melt/scrap calculator.
 *
 * Ported from the Merrion Gold Apps Script tool's Api.Trade.gs / Api.Melt.gs,
 * with PricingMath.gs/MeltMath.gs lifted verbatim into
 * @goldilocks/shared-types (computeTransactionPrice / computeMeltValue).
 *
 * Unlike the spreadsheet version, there's no per-row "productSpot" snapshot
 * to scale a live spot against — every product here is priced live from
 * (spot / troy-ounce) * weight, so the original's computeAdjustedProductSpot
 * step is unnecessary and intentionally not ported.
 */
@Injectable()
export class TradeService {
    constructor(
        private readonly metalsProvider: MetalsProvider,
        private readonly productsProvider: ProductsProvider,
    ) {}

    async getBootstrap(metalType: MetalType): Promise<TradeBootstrapResponse> {
        const [spot, allProducts] = await Promise.all([
            this.metalsProvider.getLatest(metalType),
            this.productsProvider.getAll(),
        ]);

        if (!spot) {
            throw new NotFoundException(`No spot price available for ${metalType}.`);
        }

        const bounds = TRADE_METAL_SLIDER_BOUNDS[metalType];

        const products = allProducts
            .filter((p) => p.metalType === metalType)
            .map((p) => ({
                id: p.id,
                sku: p.sku,
                name: p.name,
                weight: p.weight,
                metalType: p.metalType,
                premiumPct: p.spreadSell * 100,
                // spreadBuy is stored signed (negative = below spot); the
                // discount % here — like Apps Script's own 0-99.99 discount
                // input — is always a positive magnitude.
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

    async calculateCart(request: TradeCartRequest): Promise<TradeCartResponse> {
        const { metalType, transactionType, customSpot, items } = request;

        const masterSpot = await this.metalsProvider.getLatest(metalType);
        if (!masterSpot) {
            throw new NotFoundException(`No spot price available for ${metalType}.`);
        }

        const spot = customSpot && customSpot > 0 ? customSpot : masterSpot.priceEur;
        const spotPerGram = spot / GRAMS_PER_TROY_OUNCE;

        let totalWeight = 0;
        let totalPrice = 0;
        const lines: TradeCartLine[] = [];

        for (const item of items) {
            const product = await this.productsProvider.getById(item.productId);

            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found.`);
            }
            if (product.metalType !== metalType) {
                throw new BadRequestException(`${product.name} is not a ${metalType} product.`);
            }

            const percent = this.validatePercent(transactionType, item.percent);
            const quantity = Math.max(1, Math.floor(item.quantity) || 1);

            const basePrice = spotPerGram * product.weight;
            const unitPrice = computeTransactionPrice(basePrice, transactionType, percent);
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
        }

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

    async calculateMelt(request: MeltCalculatorRequest): Promise<MeltCalculatorResponse> {
        const category = MELT_CATEGORIES[request.category];

        const spot = await this.metalsProvider.getLatest(category.metal);
        if (!spot) {
            throw new NotFoundException(`No spot price available for ${category.metal}.`);
        }

        const spotPerGram = spot.priceEur / GRAMS_PER_TROY_OUNCE;
        const meltValue = computeMeltValue(spotPerGram, category.meltFactor, category.purity, request.weight);

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

    private validatePercent(transactionType: TradeTransactionType, value: number): number {
        if (transactionType === 'buying') {
            if (!Number.isFinite(value) || value < 0) {
                throw new BadRequestException('Please enter a valid premium.');
            }
            return value;
        }

        if (!Number.isFinite(value) || value < 0 || value >= 100) {
            throw new BadRequestException('Please enter a valid discount between 0% and 99.99%.');
        }
        return value;
    }
}
