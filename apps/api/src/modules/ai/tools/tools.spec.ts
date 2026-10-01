import { Logger } from '@nestjs/common';
import { z } from 'zod';
import type { MetalType, Product } from '@goldilocks/shared-types';
import type {
    MarketDataService,
    PricedCatalogue,
    QuotedSpot,
} from '../../market-data/market-data.service';
import type { AiTool, AiToolContext } from './ai-tool.port';
import { FindProductPricesTool } from './find-product-prices.tool';
import { GetSpotTool } from './get-spot.tool';
import { ToolRegistry } from './tool.registry';

const NOW = new Date('2026-10-01T10:05:00.000Z');
const CONTEXT: AiToolContext = { spotOverrides: {}, now: NOW };

const product = (
    id: number,
    name: string,
    metalType: MetalType,
    weight: number,
    priceSell: number,
    priceBuy: number,
    stock = 8,
): Product =>
    ({
        id,
        sku: `SKU${id}`,
        name,
        metalType,
        weight,
        priceSell,
        priceSellVatExcl: priceSell,
        priceBuy,
        vatRate: 0,
        stock,
        isActive: true,
    }) as Product;

const spot = (
    metalType: MetalType,
    usedEur: number,
    extra: Partial<QuotedSpot> = {},
): QuotedSpot => ({
    metalType,
    usedEur,
    liveEur: usedEur,
    overridden: false,
    timestamp: '2026-10-01T10:00:00.000Z',
    isFallback: false,
    ...extra,
});

function catalogue(overrides: Partial<PricedCatalogue> = {}): PricedCatalogue {
    return {
        products: [
            product(1, '100g Gold Bar', 'GOLD', 100, 10_120, 9_780, 8),
            product(2, '1oz Krugerrand', 'GOLD', 31.1035, 3_320, 3_090, 0),
            product(3, '100g Silver Bar', 'SILVER', 100, 135, 110),
        ],
        spots: [spot('GOLD', 3000), spot('SILVER', 35)],
        degradedMetals: [],
        ...overrides,
    };
}

function marketData(result: PricedCatalogue = catalogue()) {
    const getPricedCatalogue = jest.fn(async () => result);
    return {
        service: { getPricedCatalogue } as unknown as MarketDataService,
        getPricedCatalogue,
    };
}

describe('findProductPrices', () => {
    it('returns the table prices as finished figures: price (customer pays) and buyback (we pay)', async () => {
        const { service } = marketData();
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '100g gold bar' }),
            CONTEXT,
        )) as Record<string, unknown>;

        expect(result).toMatchObject({
            matchCount: 1,
            quantity: 1,
            products: [
                {
                    name: '100g Gold Bar',
                    metal: 'GOLD',
                    weightGrams: 100,
                    price: 10_120,
                    buyback: 9_780,
                    inStock: true,
                },
            ],
        });
        expect(result.products).toEqual([
            expect.not.objectContaining({
                totalPrice: expect.anything() as unknown,
            }),
        ]);
    });

    it('works out totals itself for a quantity, so the model never multiplies', async () => {
        const { service } = marketData();
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '100g gold bar', quantity: 3 }),
            CONTEXT,
        )) as { products: { totalPrice: number; totalBuyback: number }[] };

        expect(result.products[0]).toMatchObject({
            totalPrice: 30_360,
            totalBuyback: 29_340,
        });
    });

    it('reports availability as a yes/no, never the stock count', async () => {
        const { service } = marketData();
        const tool = new FindProductPricesTool(service);

        const result = await tool.run(
            tool.schema.parse({ query: 'gold krugerrand' }),
            CONTEXT,
        );

        expect(JSON.stringify(result)).toContain('"inStock":false');
        expect(JSON.stringify(result)).not.toMatch(/"stock"/);
    });

    it('quotes from the manual spot when the staff member set one, and says so', async () => {
        const { service, getPricedCatalogue } = marketData(
            catalogue({
                spots: [
                    spot('GOLD', 3100, { overridden: true, liveEur: 3000 }),
                    spot('SILVER', 35),
                ],
            }),
        );
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '100g gold bar' }),
            { spotOverrides: { GOLD: 3100 }, now: NOW },
        )) as { spot: { source: string; eurPerTroyOunce: number }[] };

        expect(getPricedCatalogue).toHaveBeenCalledWith({ GOLD: 3100 });
        expect(result.spot).toEqual([
            expect.objectContaining({
                source: 'manual',
                eurPerTroyOunce: 3100,
            }),
        ]);
    });

    it('says plainly when nothing matches, and tells the model not to guess', async () => {
        const { service } = marketData();
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '500g gold bar' }),
            CONTEXT,
        )) as { matchCount: number; note: string };

        expect(result.matchCount).toBe(0);
        expect(result.note).toMatch(/do not guess/i);
    });

    it('flags several matches so the reply lists them or asks', async () => {
        const { service } = marketData(
            catalogue({
                products: [
                    product(1, '1oz Krugerrand', 'GOLD', 31.1035, 3_320, 3_090),
                    product(2, '1oz Maple Leaf', 'GOLD', 31.1035, 3_330, 3_095),
                ],
            }),
        );
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '1oz gold coin' }),
            CONTEXT,
        )) as { matchCount: number; note: string };

        expect(result.matchCount).toBe(2);
        expect(result.note).toMatch(/several/i);
    });

    it('marks a spot that may be out of date', async () => {
        const { service } = marketData(
            catalogue({
                spots: [
                    spot('GOLD', 3000, {
                        timestamp: '2026-10-01T09:00:00.000Z',
                    }),
                    spot('SILVER', 35),
                ],
            }),
        );
        const tool = new FindProductPricesTool(service);

        const result = (await tool.run(
            tool.schema.parse({ query: '100g gold bar' }),
            CONTEXT,
        )) as { spot: { mayBeOutOfDate: boolean; ageMinutes: number }[] };

        expect(result.spot[0]).toMatchObject({
            mayBeOutOfDate: true,
            ageMinutes: 65,
        });
    });
});

describe('getSpot', () => {
    it('reports the spot, when it was taken (Irish time) and whether it is fresh', async () => {
        const { service } = marketData();
        const tool = new GetSpotTool(service);

        const result = await tool.run({ metal: 'GOLD' }, CONTEXT);

        expect(result).toEqual({
            metal: 'GOLD',
            available: true,
            eurPerTroyOunce: 3000,
            source: 'live',
            asOfIrishTime: '01 Oct, 11:00',
            ageMinutes: 5,
            mayBeOutOfDate: false,
        });
    });

    it('treats a fallback price as possibly out of date, and an unavailable metal as unavailable', async () => {
        const { service } = marketData(
            catalogue({
                spots: [
                    spot('GOLD', 3000, { isFallback: true }),
                    spot('SILVER', 0, { timestamp: null }),
                ],
            }),
        );
        const tool = new GetSpotTool(service);

        expect(await tool.run({ metal: 'GOLD' }, CONTEXT)).toMatchObject({
            mayBeOutOfDate: true,
        });
        expect(await tool.run({ metal: 'SILVER' }, CONTEXT)).toMatchObject({
            available: false,
            asOfIrishTime: null,
        });
    });
});

describe('ToolRegistry', () => {
    afterEach(() => jest.restoreAllMocks());

    const make = (...tools: AiTool[]) => new ToolRegistry(tools);
    const call = (name: string, args: unknown) => ({
        id: 'call_1',
        name,
        arguments: typeof args === 'string' ? args : JSON.stringify(args),
    });

    const registry = () => {
        const { service } = marketData();
        return make(
            new GetSpotTool(service),
            new FindProductPricesTool(service),
        );
    };

    it('offers the tools in a stable order, with JSON-schema parameters and no optional field marked required', () => {
        const specs = registry().specs();

        expect(specs.map((s) => s.name)).toEqual([
            'findProductPrices',
            'getSpot',
        ]);
        const find = specs[0].parameters as {
            properties: Record<string, unknown>;
            required: string[];
            $schema?: string;
        };
        expect(Object.keys(find.properties)).toEqual([
            'query',
            'metal',
            'quantity',
        ]);
        expect(find.required).toEqual(['query']);
        expect(find.$schema).toBeUndefined();
        expect(JSON.stringify(registry().specs())).toBe(
            JSON.stringify(registry().specs()),
        );
    });

    it('runs a valid call and returns its result as JSON', async () => {
        const outcome = await registry().execute(
            call('getSpot', { metal: 'GOLD' }),
            CONTEXT,
        );

        expect(outcome.ok).toBe(true);
        expect(JSON.parse(outcome.content)).toMatchObject({
            metal: 'GOLD',
            eurPerTroyOunce: 3000,
        });
    });

    it.each([
        ['an unknown tool', call('deleteEverything', {})],
        ['arguments that are not JSON', call('getSpot', '{not json')],
        [
            'arguments that fail validation',
            call('getSpot', { metal: 'COPPER' }),
        ],
        ['a missing required argument', call('findProductPrices', {})],
    ])(
        'answers %s with an error the model can relay, never a throw',
        async (_label, toolCall) => {
            const outcome = await registry().execute(toolCall, CONTEXT);

            expect(outcome.ok).toBe(false);
            expect(JSON.parse(outcome.content)).toHaveProperty('error');
        },
    );

    it('does not leak the cause of a failing lookup to the model', async () => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(
            () => undefined,
        );
        const failing: AiTool = {
            name: 'boom',
            description: 'always fails',
            schema: z.object({}),
            run: () =>
                Promise.reject(
                    new Error('connection string postgres://secret'),
                ),
        };

        const outcome = await make(failing).execute(call('boom', {}), CONTEXT);

        expect(outcome.ok).toBe(false);
        expect(outcome.content).not.toContain('secret');
        expect(outcome.content).toMatch(/do not guess/i);
    });

    it('refuses to flood the prompt with an oversized result', async () => {
        const huge: AiTool = {
            name: 'huge',
            description: 'returns too much',
            schema: z.object({}),
            run: () => Promise.resolve({ blob: 'x'.repeat(10_000) }),
        };

        const outcome = await make(huge).execute(call('huge', {}), CONTEXT);

        expect(outcome.content.length).toBeLessThan(500);
        expect(outcome.content).toMatch(/too large/);
    });
});
