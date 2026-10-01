import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { MetalTypeEnum } from '@goldilocks/shared-types';
import { MarketDataService } from '../../market-data/market-data.service';
import type { AiTool, AiToolContext } from './ai-tool.port';
import { matchProducts } from './product-matcher';
import { describeSpot } from './spot-description';

const schema = z.object({
    query: z
        .string()
        .trim()
        .min(1)
        .max(80)
        .describe(
            'Which product, in the customer\'s words, e.g. "100g gold bar", "1oz Krugerrand", "silver coins".',
        ),
    metal: MetalTypeEnum.optional().describe(
        'The metal, if the customer named one and the query does not.',
    ),
    quantity: z
        .number()
        .int()
        .min(1)
        .max(1000)
        .default(1)
        .describe(
            'How many the customer wants. Totals are worked out for you.',
        ),
});

/**
 * Prices of catalogue products, exactly as the dashboard's product table shows
 * them. The model is given finished figures (per unit and, for a quantity,
 * totals) and must quote them as they are.
 */
@Injectable()
export class FindProductPricesTool implements AiTool<z.infer<typeof schema>> {
    readonly name = 'findProductPrices';
    readonly description =
        'Looks up what products cost right now: "price" is what the customer pays us (VAT included), "buyback" is what we pay the customer. Figures are those shown in the dashboard product table, from the current spot. Always use this for any price; never work out or remember a price yourself. Returns every matching product, so a vague request returns several.';
    readonly schema = schema;

    constructor(private readonly marketData: MarketDataService) {}

    async run(
        args: z.infer<typeof schema>,
        context: AiToolContext,
    ): Promise<unknown> {
        const { products, spots } = await this.marketData.getPricedCatalogue(
            context.spotOverrides,
        );
        const { products: matches, ambiguous } = matchProducts(
            products,
            args.query,
            args.metal,
        );

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
                .map((s) => describeSpot(s, context.now)),
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
}
