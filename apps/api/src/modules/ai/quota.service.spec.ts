import { HttpException, ServiceUnavailableException } from '@nestjs/common';
import type { RedisService } from '../../redis/redis.service';
import type { AiSettings } from './ai.settings';
import { QuotaService } from './quota.service';

/** An in-memory stand-in for the two counter operations, so limits can be exercised for real. */
function fakeRedis(available = true) {
    const counts = new Map<string, number>();
    const redis = {
        increment: jest.fn(async (key: string) => {
            if (!available) return null;
            const next = (counts.get(key) ?? 0) + 1;
            counts.set(key, next);
            return next;
        }),
        decrement: jest.fn(async (key: string) => {
            const current = counts.get(key) ?? 0;
            if (current > 0) counts.set(key, current - 1);
        }),
    };
    return { redis: redis as unknown as RedisService, counts };
}

const settings = (overrides: Partial<AiSettings> = {}) =>
    ({
        perMinuteLimit: 3,
        dailyQuotaPerUser: 5,
        ...overrides,
    }) as AiSettings;

const NOW = new Date('2026-09-30T12:00:00Z');

async function expectStatus(promise: Promise<unknown>, status: number) {
    const error = await promise.then(
        () => null,
        (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(HttpException);
    expect((error as HttpException).getStatus()).toBe(status);
    return (error as HttpException).message;
}

describe('QuotaService.acquire', () => {
    it('lets a question through and frees the slot when released', async () => {
        const { redis, counts } = fakeRedis();
        const quota = new QuotaService(redis, settings());

        const slot = await quota.acquire('u1', NOW);
        expect(counts.get('ai:open:u1')).toBe(1);

        await slot.release();
        await slot.release(); // a second release is harmless
        expect(counts.get('ai:open:u1')).toBe(0);
    });

    it('allows only one open question per user, but not per company', async () => {
        const { redis } = fakeRedis();
        const quota = new QuotaService(redis, settings());

        await quota.acquire('u1', NOW);
        const message = await expectStatus(quota.acquire('u1', NOW), 429);
        expect(message).toMatch(/already have a question/i);

        await expect(quota.acquire('u2', NOW)).resolves.toBeDefined();
    });

    it('does not let a refused request keep the slot it briefly took', async () => {
        const { redis, counts } = fakeRedis();
        const quota = new QuotaService(redis, settings({ perMinuteLimit: 1 }));

        await (await quota.acquire('u1', NOW)).release();
        await quota.acquire('u1', NOW).catch(() => undefined);
        await expectStatus(quota.acquire('u1', NOW), 429);

        await Promise.resolve();
        expect(counts.get('ai:open:u1')).toBe(0);
    });

    it('enforces the per-minute rate and starts fresh the next minute', async () => {
        const { redis } = fakeRedis();
        const quota = new QuotaService(redis, settings({ perMinuteLimit: 2 }));

        for (let i = 0; i < 2; i++)
            await (await quota.acquire('u1', NOW)).release();
        const message = await expectStatus(quota.acquire('u1', NOW), 429);
        expect(message).toMatch(/2 questions a minute/);

        const later = new Date(NOW.getTime() + 61_000);
        await expect(quota.acquire('u1', later)).resolves.toBeDefined();
    });

    it('enforces the daily allowance and starts fresh the next day', async () => {
        const { redis } = fakeRedis();
        const quota = new QuotaService(
            redis,
            settings({ perMinuteLimit: 100, dailyQuotaPerUser: 2 }),
        );

        for (let i = 0; i < 2; i++)
            await (await quota.acquire('u1', NOW)).release();
        const message = await expectStatus(quota.acquire('u1', NOW), 429);
        expect(message).toMatch(/today's 2 questions/);

        const tomorrow = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);
        await expect(quota.acquire('u1', tomorrow)).resolves.toBeDefined();
    });

    it('fails closed: refuses, rather than runs unmetered, when Redis is unavailable', async () => {
        const { redis } = fakeRedis(false);
        const quota = new QuotaService(redis, settings());

        const error = await quota.acquire('u1', NOW).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ServiceUnavailableException);
    });
});
