import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
    GRAMS_PER_TROY_OUNCE,
    ProfitAnalysisRequest,
    ProfitAnalysisResponse,
    PortfolioBuildRequest,
    PortfolioBuildResponse,
    PortfolioCandidateProduct,
    computeCurrentBuybackValue,
    computeProfit,
    computeRequiredSpotForTarget,
    solveMissingPurchaseField,
    buildPortfolioStrategies,
} from '@goldilocks/shared-types';
import { ProductsProvider } from '../products/products.provider';
import { MetalsProvider } from '../metals/metals.provider';
import { calculateProductPrice, ZERO_SPOT_MAP } from '../../common/utils/pricing.util';

/**
 * PortfolioService — P/L subtab (profit analysis) and the Builder subtab.
 * Scenario is pure client-side arithmetic (no server round trip needed).
 *
 * Builder is a straight port of the Apps Script tool's Api.Portfolio.gs:
 * price every in-stock product of the requested metal, classify bar vs.
 * coin by name, and hand the candidates to buildPortfolioStrategies (the
 * ported PortfolioMath.gs) to build/score the three strategies.
 */
@Injectable()
export class PortfolioService {
    constructor(
        private readonly productsProvider: ProductsProvider,
        private readonly metalsProvider: MetalsProvider,
    ) {}

    async calculateProfitAnalysis(request: ProfitAnalysisRequest): Promise<ProfitAnalysisResponse> {
        const product = await this.productsProvider.getById(request.productId);

        if (!product) {
            throw new NotFoundException(`Product ${request.productId} not found.`);
        }
        if (product.metalType !== request.metalType) {
            throw new BadRequestException(`${product.name} is not a ${request.metalType} product.`);
        }

        const productMultiplier = product.weight / GRAMS_PER_TROY_OUNCE;

        let solved;
        try {
            solved = solveMissingPurchaseField(
                request.missingField,
                request.purchaseSpot,
                request.purchasePremium,
                request.purchasePrice,
                productMultiplier,
            );
        } catch (err) {
            throw new BadRequestException(err instanceof Error ? err.message : 'Invalid purchase inputs.');
        }

        const currentBuybackValue = computeCurrentBuybackValue(
            request.currentSpot,
            request.currentDiscount,
            productMultiplier,
        );
        const { profit, profitPercent } = computeProfit(currentBuybackValue, solved.purchasePrice);
        const { requiredSpot, requiredPrice, targetReturn } = computeRequiredSpotForTarget(
            solved.purchasePrice,
            request.targetProfit,
            productMultiplier,
            request.currentDiscount,
        );

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

    async buildPortfolio(request: PortfolioBuildRequest): Promise<PortfolioBuildResponse> {
        const [spot, rawProducts] = await Promise.all([
            this.metalsProvider.getLatest(request.metalType),
            this.productsProvider.getAll(),
        ]);
        if (!spot) {
            throw new NotFoundException(`No spot price available for ${request.metalType}.`);
        }

        const spotMap = { ...ZERO_SPOT_MAP, [request.metalType]: spot.priceEur };

        const priorityProduct = request.priorityProductId
            ? rawProducts.find((p) => p.id === request.priorityProductId)
            : undefined;

        const candidates: PortfolioCandidateProduct[] = rawProducts
            .filter((p) => p.metalType === request.metalType && p.stock > 0)
            .map((p) => {
                const priced = calculateProductPrice(p, spotMap);
                return {
                    id: priced.id,
                    product: priced.name,
                    weight: priced.weight,
                    sellPrice: priced.priceSell,
                    premium: priced.spreadSell * 100,
                    type: /bar/i.test(priced.name) ? 'bar' : 'coin',
                } satisfies PortfolioCandidateProduct;
            });

        let results;
        try {
            results = buildPortfolioStrategies(
                candidates,
                request.budget,
                request.productType,
                priorityProduct?.name ?? '',
                request.priorityStrength,
            );
        } catch (err) {
            throw new BadRequestException(err instanceof Error ? err.message : 'Unable to build a portfolio.');
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
}
