import { HistoricSpotService } from './historic-spot.service';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { MetalPriceApiPort } from '../../infrastructure/metal-price-api/metal-price-api.port';

function build() {
    const prisma = {
        historicSpotPrice: {
            count: jest.fn().mockResolvedValue(0),
            createMany: jest.fn().mockResolvedValue({ count: 0 }),
            findFirst: jest.fn(),
            findMany: jest.fn().mockResolvedValue([]),
        },
    };
    const api = {
        timeframePrices: jest.fn(),
        ohlcPrices: jest.fn(),
        livePrices: jest.fn(),
    };
    const service = new HistoricSpotService(
        prisma as unknown as PrismaService,
        api satisfies MetalPriceApiPort,
    );
    return { service, prisma, api };
}

describe('HistoricSpotService.seedHistoricPrices', () => {
    it('inverts vendor rates and inserts with skipDuplicates', async () => {
        const { service, prisma, api } = build();
        api.timeframePrices.mockImplementation(
            async (_s: string, _e: string, currency: string) => ({
                success: true,
                rates: {
                    '2026-09-01': {
                        XAU: currency === 'EUR' ? 1 / 2000 : 1 / 1600,
                        XAG: 0.04,
                        XPT: 0.001,
                        XPD: 0.0007,
                    },
                },
            }),
        );

        await service.seedHistoricPrices();

        const { data, skipDuplicates } =
            prisma.historicSpotPrice.createMany.mock.calls[0][0];
        expect(skipDuplicates).toBe(true);
        expect(data).toHaveLength(4);
        const gold = data.find(
            (r: { metalType: string }) => r.metalType === 'GOLD',
        );
        expect(gold.priceEur).toBeCloseTo(2000);
        expect(gold.priceGbp).toBeCloseTo(1600);
    });

    it('writes nothing when the vendor reports failure', async () => {
        const { service, prisma, api } = build();
        api.timeframePrices.mockResolvedValue({ success: false, rates: {} });

        await service.seedHistoricPrices();

        expect(prisma.historicSpotPrice.createMany).not.toHaveBeenCalled();
    });

    it('skips a day that is missing from the GBP response', async () => {
        const { service, prisma, api } = build();
        api.timeframePrices.mockImplementation(
            async (_s: string, _e: string, currency: string) => ({
                success: true,
                rates:
                    currency === 'EUR'
                        ? {
                              '2026-09-01': {
                                  XAU: 0.0005,
                                  XAG: 0.04,
                                  XPT: 0.001,
                                  XPD: 0.0007,
                              },
                          }
                        : {},
            }),
        );

        await service.seedHistoricPrices();

        expect(prisma.historicSpotPrice.createMany).not.toHaveBeenCalled();
    });
});

describe('HistoricSpotService.fetchAndStoreHistoricClose', () => {
    it('does nothing when the day is already complete', async () => {
        const { service, prisma, api } = build();
        prisma.historicSpotPrice.count.mockResolvedValue(4);

        await service.fetchAndStoreHistoricClose('2026-09-01');

        expect(api.ohlcPrices).not.toHaveBeenCalled();
        expect(prisma.historicSpotPrice.createMany).not.toHaveBeenCalled();
    });

    it('stores the inverted close for each metal it could fetch', async () => {
        const { service, prisma, api } = build();
        api.ohlcPrices.mockImplementation(
            async (_d: string, currency: string, symbol: string) =>
                symbol === 'XPD'
                    ? { success: false }
                    : {
                          success: true,
                          rate: {
                              close: currency === 'EUR' ? 1 / 2000 : 1 / 1600,
                          },
                      },
        );

        await service.fetchAndStoreHistoricClose('2026-09-01');

        const { data } = prisma.historicSpotPrice.createMany.mock.calls[0][0];
        expect(data).toHaveLength(3);
        expect(
            data.find((r: { metalType: string }) => r.metalType === 'GOLD')
                .priceEur,
        ).toBeCloseTo(2000);
    });
});

describe('HistoricSpotService.getLatestHistoricDate', () => {
    it('returns the newest recordedAt, or null for an empty table', async () => {
        const { service, prisma } = build();
        const date = new Date('2026-09-01T00:00:00Z');
        prisma.historicSpotPrice.findFirst
            .mockResolvedValueOnce({ recordedAt: date })
            .mockResolvedValueOnce(null);

        await expect(service.getLatestHistoricDate()).resolves.toBe(date);
        await expect(service.getLatestHistoricDate()).resolves.toBeNull();
    });
});
