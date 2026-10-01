import { z } from 'zod';
import { MarketDataService } from '../../market-data/market-data.service';
import type { AiTool, AiToolContext } from './ai-tool.port';
declare const schema: z.ZodObject<{
    metal: z.ZodEnum<{
        GOLD: "GOLD";
        SILVER: "SILVER";
        PLATINUM: "PLATINUM";
        PALLADIUM: "PALLADIUM";
    }>;
}, z.core.$strip>;
export declare class GetSpotTool implements AiTool<z.infer<typeof schema>> {
    private readonly marketData;
    readonly name = "getSpot";
    readonly description = "Current spot price of one metal in EUR per troy ounce, as the dashboard is quoting it right now, with the time it was taken and whether it may be out of date. Use it when asked what gold, silver, platinum or palladium is trading at. Never state a spot price from memory.";
    readonly schema: z.ZodObject<{
        metal: z.ZodEnum<{
            GOLD: "GOLD";
            SILVER: "SILVER";
            PLATINUM: "PLATINUM";
            PALLADIUM: "PALLADIUM";
        }>;
    }, z.core.$strip>;
    constructor(marketData: MarketDataService);
    run(args: z.infer<typeof schema>, context: AiToolContext): Promise<unknown>;
}
export {};
//# sourceMappingURL=get-spot.tool.d.ts.map