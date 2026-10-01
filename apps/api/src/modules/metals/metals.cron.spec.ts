import { SchedulerRegistry } from '@nestjs/schedule';
import { MetalsCron } from './metals.cron';
import type { MetalsProvider } from './metals.provider';
import type { HistoricSpotService } from './historic-spot.service';

const DAY_MS = 24 * 60 * 60 * 1000;

function build(overrides: Partial<Record<string, jest.Mock>> = {}) {
    const provider = {
        getLatestHistoricDate: jest.fn().mockResolvedValue(null),
        seedHistoricPrices: jest.fn().mockResolvedValue(undefined),
        refreshAll: jest
            .fn()
            .mockResolvedValue({ prices: [], degradedMetals: [] }),
        fetchAndStoreHistoricClose: jest.fn(),
        ...overrides,
    };
    // Backfill calls live on HistoricSpotService; refreshAll on MetalsProvider.
    const historic = provider as unknown as HistoricSpotService;
    const job = { isActive: true, start: jest.fn(), stop: jest.fn() };
    const registry = {
        getCronJob: jest.fn().mockReturnValue(job),
    } as unknown as SchedulerRegistry;
    const cron = new MetalsCron(
        provider as unknown as MetalsProvider,
        historic,
        registry,
    );
    return { cron, provider, job };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

describe('MetalsCron startup backfill', () => {
    it('does not block startup while the backfill is still running', () => {
        const { cron } = build({
            seedHistoricPrices: jest.fn(() => new Promise(() => undefined)),
        });
        // Returns synchronously even though the seed call never settles.
        expect(cron.onModuleInit()).toBeUndefined();
    });

    it('does not throw out of the lifecycle hook when the vendor call fails', async () => {
        const { cron, provider } = build({
            seedHistoricPrices: jest
                .fn()
                .mockRejectedValue(new Error('quota exceeded')),
        });
        expect(() => cron.onModuleInit()).not.toThrow();
        await flush();
        expect(provider.seedHistoricPrices).toHaveBeenCalledTimes(1);
    });

    it('does not throw when even the staleness lookup fails', async () => {
        const { cron } = build({
            getLatestHistoricDate: jest
                .fn()
                .mockRejectedValue(new Error('db down')),
        });
        expect(() => cron.onModuleInit()).not.toThrow();
        await flush();
    });

    it('seeds when there is no history or it is stale, and skips when it is fresh', async () => {
        const empty = build();
        empty.cron.onModuleInit();
        await flush();
        expect(empty.provider.seedHistoricPrices).toHaveBeenCalledTimes(1);

        const stale = build({
            getLatestHistoricDate: jest
                .fn()
                .mockResolvedValue(new Date(Date.now() - 3 * DAY_MS)),
        });
        stale.cron.onModuleInit();
        await flush();
        expect(stale.provider.seedHistoricPrices).toHaveBeenCalledTimes(1);

        const fresh = build({
            getLatestHistoricDate: jest
                .fn()
                .mockResolvedValue(new Date(Date.now() - DAY_MS / 2)),
        });
        fresh.cron.onModuleInit();
        await flush();
        expect(fresh.provider.seedHistoricPrices).not.toHaveBeenCalled();
    });
});

describe('MetalsCron pause/resume', () => {
    it('waits for job.stop() to finish before reporting the new state', async () => {
        const { cron, job } = build();
        let resolveStop!: () => void;
        job.stop.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveStop = () => {
                        job.isActive = false;
                        resolve();
                    };
                }),
        );

        const pending = cron.setPriceCronEnabled(false);
        let settled = false;
        void pending.then(() => (settled = true));
        await flush();
        expect(settled).toBe(false);

        resolveStop();
        await expect(pending).resolves.toBe(false);
    });

    it('starts the job when enabled', async () => {
        const { cron, job } = build();
        await cron.setPriceCronEnabled(true);
        expect(job.start).toHaveBeenCalled();
    });
});
