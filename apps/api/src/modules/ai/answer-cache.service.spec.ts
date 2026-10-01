import { Logger } from '@nestjs/common';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AnswerCacheService } from './answer-cache.service';

const NOW = new Date('2026-10-01T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const CITATIONS = [
    { slug: 'pricing', anchor: 'vat', title: 'Pricing', heading: 'VAT' },
];

function build() {
    const findUnique = jest.fn();
    const update = jest.fn(async () => undefined);
    const upsert = jest.fn(async () => undefined);
    const deleteMany = jest.fn(async () => ({ count: 4 }));
    const prisma = {
        aiAnswerCache: { findUnique, update, upsert, deleteMany },
    } as unknown as PrismaService;
    return {
        service: new AnswerCacheService(prisma),
        findUnique,
        update,
        upsert,
        deleteMany,
    };
}

const row = (overrides: Record<string, unknown> = {}) => ({
    id: 9,
    answer: 'Yes [[pricing#vat]].',
    status: 'answered',
    citations: CITATIONS,
    model: 'gpt-4o-mini',
    expiresAt: new Date(NOW.getTime() + DAY),
    ...overrides,
});

describe('AnswerCacheService', () => {
    afterEach(() => jest.restoreAllMocks());

    it('returns a live entry and counts the hit', async () => {
        const { service, findUnique, update } = build();
        findUnique.mockResolvedValue(row());

        const hit = await service.get('vat on silver', 'abc', NOW);

        expect(findUnique).toHaveBeenCalledWith({
            where: {
                questionKey_corpusHash: {
                    questionKey: 'vat on silver',
                    corpusHash: 'abc',
                },
            },
        });
        expect(hit).toEqual({
            answer: 'Yes [[pricing#vat]].',
            status: 'answered',
            citations: CITATIONS,
            model: 'gpt-4o-mini',
        });
        expect(update).toHaveBeenCalledWith({
            where: { id: 9 },
            data: { hits: { increment: 1 } },
        });
    });

    it('treats a missing or expired entry as a miss', async () => {
        const { service, findUnique, update } = build();

        findUnique.mockResolvedValueOnce(null);
        expect(await service.get('k', 'h', NOW)).toBeNull();

        findUnique.mockResolvedValueOnce(
            row({ expiresAt: new Date(NOW.getTime() - 1) }),
        );
        expect(await service.get('k', 'h', NOW)).toBeNull();
        expect(update).not.toHaveBeenCalled();
    });

    it('degrades to a miss, not an error, when the database fails', async () => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(
            () => undefined,
        );
        const { service, findUnique } = build();
        findUnique.mockRejectedValue(new Error('db down'));

        expect(await service.get('k', 'h', NOW)).toBeNull();
    });

    it('stores an answer with an expiry and resets its hit count when it replaces an older one', async () => {
        const { service, upsert } = build();

        await service.put(
            'k',
            'h',
            {
                answer: 'A',
                status: 'answered',
                citations: CITATIONS,
                model: 'm',
            },
            7,
            NOW,
        );

        const args = (
            upsert.mock.calls[0] as unknown as [
                {
                    create: {
                        expiresAt: Date;
                        questionKey: string;
                        corpusHash: string;
                    };
                    update: { hits: number };
                },
            ]
        )[0];
        expect(args.create).toMatchObject({
            questionKey: 'k',
            corpusHash: 'h',
        });
        expect(args.create.expiresAt.getTime()).toBe(NOW.getTime() + 7 * DAY);
        expect(args.update.hits).toBe(0);
    });

    it('never throws from put when the database fails', async () => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(
            () => undefined,
        );
        const { service, upsert } = build();
        upsert.mockRejectedValue(new Error('db down'));

        await expect(
            service.put(
                'k',
                'h',
                {
                    answer: 'A',
                    status: 'answered',
                    citations: [],
                    model: 'm',
                },
                7,
            ),
        ).resolves.toBeUndefined();
    });

    it('purges entries that have expired', async () => {
        const { service, deleteMany } = build();

        expect(await service.purgeExpired(NOW)).toBe(4);
        expect(deleteMany).toHaveBeenCalledWith({
            where: { expiresAt: { lt: NOW } },
        });
    });
});
