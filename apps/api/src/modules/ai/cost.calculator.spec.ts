import {
    costMicros,
    isKnownModel,
    priceFor,
    usdToMicros,
} from './cost.calculator';

describe('costMicros', () => {
    it('prices uncached, cached and output tokens separately, in whole micro-dollars', () => {
        // gpt-4o-mini: 0.15 in / 0.075 cached / 0.60 out per million tokens.
        const micros = costMicros('gpt-4o-mini', {
            inputTokens: 7000,
            cachedInputTokens: 6000,
            outputTokens: 400,
        });

        // 1000*0.15 + 6000*0.075 + 400*0.6 = 150 + 450 + 240
        expect(micros).toBe(840);
        expect(Number.isInteger(micros)).toBe(true);
    });

    it('rounds a fraction up rather than reporting it as free', () => {
        expect(
            costMicros('gpt-5-nano', {
                inputTokens: 1,
                cachedInputTokens: 0,
                outputTokens: 0,
            }),
        ).toBe(1);
    });

    it('never counts more cached tokens than input tokens', () => {
        expect(
            costMicros('gpt-4o-mini', {
                inputTokens: 100,
                cachedInputTokens: 5000,
                outputTokens: 0,
            }),
        ).toBe(Math.ceil(100 * 0.075));
    });

    it('treats a dated snapshot as its model family', () => {
        expect(priceFor('gpt-4o-mini-2024-07-18')).toEqual(
            priceFor('gpt-4o-mini'),
        );
        expect(isKnownModel('gpt-4o-mini-2024-07-18')).toBe(true);
    });

    it('prices an unknown model at the dearest known rate so the budget errs on the safe side', () => {
        expect(isKnownModel('some-future-model')).toBe(false);
        expect(priceFor('some-future-model')).toEqual(
            priceFor('claude-opus-5-5'),
        );
    });

    it('lets a configured price override the table', () => {
        const override = { input: 1, cachedInput: 1, output: 1 };
        expect(
            costMicros(
                'gpt-4o-mini',
                { inputTokens: 10, cachedInputTokens: 0, outputTokens: 10 },
                override,
            ),
        ).toBe(20);
    });
});

describe('costMicros for Claude Haiku 5.5', () => {
    it('prices a typical answer with known token counts: cache reads, cache writes, fresh input and output', () => {
        // 0.10 in / 0.01 cache read / 0.125 cache write / 0.50 out per million tokens.
        const micros = costMicros('claude-haiku-5-5', {
            inputTokens: 8000,
            cachedInputTokens: 6000,
            cacheWriteInputTokens: 1500,
            outputTokens: 900,
        });
        // 500*0.10 + 6000*0.01 + 1500*0.125 + 900*0.5 = 50 + 60 + 187.5 + 450
        expect(micros).toBe(748);
    });

    it('is a known model, so it is never charged at the unknown-model rate', () => {
        expect(isKnownModel('claude-haiku-5-5')).toBe(true);
    });

    it('switches every rate to the long-prompt card above 100,000 input tokens', () => {
        const micros = costMicros('claude-haiku-5-5', {
            inputTokens: 200_000,
            cachedInputTokens: 0,
            outputTokens: 1000,
        });
        // 200000*0.5 + 1000*2.5
        expect(micros).toBe(102_500);
    });

    it('never prices an unknown model at $0', () => {
        expect(
            costMicros('claude-something-new', {
                inputTokens: 1000,
                cachedInputTokens: 0,
                outputTokens: 100,
            }),
        ).toBeGreaterThan(0);
    });
});

describe('usdToMicros', () => {
    it('converts a dollar budget to whole micro-dollars', () => {
        expect(usdToMicros(2)).toBe(2_000_000);
        expect(usdToMicros(0.0000015)).toBe(2);
    });
});
