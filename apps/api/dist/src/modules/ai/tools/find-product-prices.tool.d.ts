import { z } from 'zod';
import { MarketDataService } from '../../market-data/market-data.service';
import type { AiTool, AiToolContext } from './ai-tool.port';
declare const schema: z.ZodObject<{
    query: z.ZodString;
    metal: z.ZodOptional<z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>>;
    quantity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare class FindProductPricesTool implements AiTool<z.infer<typeof schema>> {
    private readonly marketData;
    readonly name = "findProductPrices";
    readonly description = "Looks up what products cost right now: \"price\" is what the customer pays us (VAT included), \"buyback\" is what we pay the customer. Figures are those shown in the dashboard product table, from the current spot. Always use this for any price; never work out or remember a price yourself. Returns every matching product, so a vague request returns several.";
    readonly schema: z.ZodObject<{
        query: z.ZodString;
        metal: z.ZodOptional<z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>>;
        quantity: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    constructor(marketData: MarketDataService);
    run(args: z.infer<typeof schema>, context: AiToolContext): Promise<unknown>;
}
export {};
//# sourceMappingURL=find-product-prices.tool.d.ts.map