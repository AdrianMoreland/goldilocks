import {
    isUsableRate,
    mapLiveRates,
    mapTimeframeRecords,
    vendorAsOf,
} from './vendor-rates';

describe('isUsableRate', () => {
    it.each([
        [undefined, false],
        [{ eur: 0, gbp: 0 }, false],
        [{ eur: -1, gbp: -1 }, false],
        [{ eur: 2000, gbp: 1600 }, true],
    ])('%j -> %s', (rate, expected) => {
        expect(isUsableRate(rate)).toBe(expected);
    });
});

describe('vendorAsOf', () => {
    const now = Date.parse('2026-09-30T12:00:00Z');

    it('uses a vendor timestamp in the past (unix seconds)', () => {
        expect(vendorAsOf(1_750_000_000, now).getTime()).toBe(
            1_750_000_000_000,
        );
    });

    it.each([undefined, null, 'soon', 0, -5, NaN, now / 1000 + 3600])(
        'falls back to now for %s',
        (bad) => {
            expect(vendorAsOf(bad, now).getTime()).toBe(now);
        },
    );
});

describe('mapLiveRates', () => {
    it('inverts each metal rate and converts GBP via the EUR→GBP rate', () => {
        const rates = mapLiveRates({
            GBP: 0.8,
            XAU: 1 / 2000,
            XAG: 1 / 25,
            XPT: 1 / 1000,
            XPD: 1 / 1500,
        });
        expect(rates.GOLD!.eur).toBeCloseTo(2000);
        expect(rates.GOLD!.gbp).toBeCloseTo(1600);
        expect(rates.SILVER!.eur).toBeCloseTo(25);
    });

    it('omits (never zero-fills) a metal the vendor did not return and reports it', () => {
        const missing: string[] = [];
        const rates = mapLiveRates({ GBP: 0.8, XAU: 0.0005 }, (metal) =>
            missing.push(metal),
        );
        expect(Object.keys(rates)).toEqual(['GOLD']);
        expect(missing.sort()).toEqual(['PALLADIUM', 'PLATINUM', 'SILVER']);
    });

    it('treats a zero rate as missing rather than dividing by zero', () => {
        expect(mapLiveRates({ GBP: 0.8, XAU: 0 }).GOLD).toBeUndefined();
    });
});

describe('mapTimeframeRecords', () => {
    it('joins EUR and GBP per day and metal, skipping anything missing from either side', () => {
        const eur = {
            '2026-09-01': { XAU: 0.0005, XAG: 0.04 },
            '2026-09-02': { XAU: 0.0005 },
        };
        const gbp = { '2026-09-01': { XAU: 0.000625 } };

        const records = mapTimeframeRecords(eur, gbp);

        expect(records).toHaveLength(1);
        expect(records[0]).toMatchObject({ metalType: 'GOLD' });
        expect(records[0].priceEur).toBeCloseTo(2000);
        expect(records[0].priceGbp).toBeCloseTo(1600);
        expect(records[0].recordedAt.toISOString()).toBe(
            '2026-09-01T00:00:00.000Z',
        );
    });
});
