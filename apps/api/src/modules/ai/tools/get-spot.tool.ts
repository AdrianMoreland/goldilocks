import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { MetalTypeEnum } from '@goldilocks/shared-types';
import { MarketDataService } from '../../market-data/market-data.service';
import type { AiTool, AiToolContext } from './ai-tool.port';
import { describeSpot } from './spot-description';

const schema = z.object({
    metal: MetalTypeEnum.describe('The metal to read the spot price of.'),
});

/** "What is gold at?" — the spot price the dashboard is quoting from for one metal. */
@Injectable()
export class GetSpotTool implements AiTool<z.infer<typeof schema>> {
    readonly name = 'getSpot';
    readonly description =
        'Current spot price of one metal in EUR per troy ounce, as the dashboard is quoting it right now, with the time it was taken and whether it may be out of date. Use it when asked what gold, silver, platinum or palladium is trading at. Never state a spot price from memory.';
    readonly schema = schema;

    constructor(private readonly marketData: MarketDataService) {}

    async run(
        args: z.infer<typeof schema>,
        context: AiToolContext,
    ): Promise<unknown> {
        const { spots } = await this.marketData.getPricedCatalogue(
            context.spotOverrides,
        );
        const spot = spots.find((s) => s.metalType === args.metal);
        return spot
            ? describeSpot(spot, context.now)
            : { metal: args.metal, available: false };
    }
}
