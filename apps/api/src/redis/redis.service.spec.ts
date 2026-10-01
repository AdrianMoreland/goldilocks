import { EventEmitter } from 'node:events';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

type RetryStrategy = (times: number) => number | null;

const created: {
    options: { retryStrategy: RetryStrategy };
    client: EventEmitter & {
        get: jest.Mock;
        quit: jest.Mock;
        eval: jest.Mock;
    };
}[] = [];

jest.mock('ioredis', () => ({
    __esModule: true,
    default: jest
        .fn()
        .mockImplementation(
            (_url: string, options: { retryStrategy: RetryStrategy }) => {
                const client = Object.assign(new EventEmitter(), {
                    get: jest
                        .fn()
                        .mockResolvedValue(JSON.stringify({ hello: 'world' })),
                    quit: jest.fn().mockResolvedValue('OK'),
                    eval: jest.fn().mockResolvedValue(3),
                });
                created.push({ options, client });
                return client;
            },
        ),
}));

describe('RedisService connection handling', () => {
    let service: RedisService;

    beforeEach(() => {
        created.length = 0;
        const config = {
            get: jest.fn().mockReturnValue('redis://example:6379'),
        } as unknown as ConfigService;
        service = new RedisService(config);
        service.onModuleInit();
    });

    it('never gives up retrying, so a short outage cannot disable the cache until restart', () => {
        const { retryStrategy } = created[0].options;
        for (const attempt of [1, 3, 4, 10, 100, 10_000]) {
            const delay = retryStrategy(attempt);
            expect(typeof delay).toBe('number');
            expect(delay).toBeGreaterThan(0);
            expect(delay).toBeLessThanOrEqual(5000);
        }
    });

    it('serves from Redis only while the connection is ready, and recovers after a drop', async () => {
        const { client } = created[0];
        expect(service.isHealthy()).toBe(false);
        expect(await service.get('k')).toBeNull();
        expect(client.get).not.toHaveBeenCalled();

        client.emit('ready');
        expect(service.isHealthy()).toBe(true);
        expect(await service.get('k')).toEqual({ hello: 'world' });

        client.emit('close');
        expect(service.isHealthy()).toBe(false);
        expect(await service.get('k')).toBeNull();

        client.emit('ready'); // ioredis reconnected on its own
        expect(service.isHealthy()).toBe(true);
        expect(await service.get('k')).toEqual({ hello: 'world' });
    });

    it('marks itself unhealthy on an error event', () => {
        const { client } = created[0];
        client.emit('ready');
        client.emit('error', new Error('ECONNRESET'));
        expect(service.isHealthy()).toBe(false);
    });
});

describe('RedisService counters', () => {
    let service: RedisService;
    let client: (typeof created)[number]['client'];

    beforeEach(() => {
        created.length = 0;
        service = new RedisService({
            get: jest.fn().mockReturnValue('redis://example:6379'),
        } as unknown as ConfigService);
        service.onModuleInit();
        client = created[0].client;
    });

    it('returns null, so a limiter can refuse, while Redis is not connected', async () => {
        expect(await service.increment('k', 60)).toBeNull();
        await service.decrement('k');
        expect(client.eval).not.toHaveBeenCalled();
    });

    it('increments atomically with an expiry and returns the count', async () => {
        client.emit('ready');

        expect(await service.increment('k', 60)).toBe(3);
        expect(client.eval).toHaveBeenCalledWith(
            expect.stringContaining('INCR'),
            1,
            'k',
            60,
        );
    });

    it('returns null, not a throw, when the command fails', async () => {
        client.emit('ready');
        client.eval.mockRejectedValueOnce(new Error('boom'));

        expect(await service.increment('k', 60)).toBeNull();
    });

    it('decrements through a script that cannot go below zero', async () => {
        client.emit('ready');

        await service.decrement('k');

        expect(client.eval).toHaveBeenCalledWith(
            expect.stringContaining('count > 0'),
            1,
            'k',
        );
    });
});
