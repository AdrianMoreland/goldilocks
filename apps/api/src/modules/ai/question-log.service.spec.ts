import { Logger } from '@nestjs/common';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    QuestionLogService,
    type QuestionLogEntry,
} from './question-log.service';

const ENTRY: QuestionLogEntry = {
    userId: 'u1',
    question: 'what does [customer] owe',
    mode: 'procedures',
    toolNames: [],
    status: 'answered',
    cached: false,
    retried: false,
    citations: ['pricing#vat'],
    model: 'gpt-4o-mini',
    corpusHash: 'abc',
    inputTokens: 7000,
    cachedInputTokens: 6000,
    outputTokens: 40,
    costMicros: 840,
    latencyMs: 1200,
};

function build() {
    const create = jest.fn(async (): Promise<{ id: number }> => ({ id: 7 }));
    const aggregate = jest.fn();
    const deleteMany = jest.fn(async () => ({ count: 3 }));
    const prisma = {
        aiQuestionLog: { create, aggregate, deleteMany },
    } as unknown as PrismaService;
    return {
        service: new QuestionLogService(prisma),
        create,
        aggregate,
        deleteMany,
    };
}

describe('QuestionLogService', () => {
    afterEach(() => jest.restoreAllMocks());

    it('writes the entry as given', async () => {
        const { service, create } = build();

        await expect(service.record(ENTRY)).resolves.toBe(7);

        expect(create).toHaveBeenCalledWith({
            data: ENTRY,
            select: { id: true },
        });
    });

    it('never throws when the write fails: an answer must still reach the user', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const { service, create } = build();
        create.mockRejectedValue(new Error('db down'));

        await expect(service.record(ENTRY)).resolves.toBeNull();
        expect(warn).toHaveBeenCalled();
    });

    it('sums spend since a point in time, and reads "nothing spent" as zero', async () => {
        const { service, aggregate } = build();
        const since = new Date('2026-10-01T00:00:00Z');

        aggregate.mockResolvedValueOnce({ _sum: { costMicros: 123_456 } });
        expect(await service.spentSince(since)).toBe(123_456);
        expect(aggregate).toHaveBeenCalledWith({
            _sum: { costMicros: true },
            where: { createdAt: { gte: since } },
        });

        aggregate.mockResolvedValueOnce({ _sum: { costMicros: null } });
        expect(await service.spentSince(since)).toBe(0);
    });

    it('does not guess "zero" when the database cannot be read: the budget breaker must see the failure', async () => {
        const { service, aggregate } = build();
        aggregate.mockRejectedValue(new Error('db down'));

        await expect(service.spentSince(new Date())).rejects.toThrow('db down');
    });

    it('purges rows older than the cutoff', async () => {
        const { service, deleteMany } = build();
        const cutoff = new Date('2026-07-01T00:00:00Z');

        expect(await service.purgeOlderThan(cutoff)).toBe(3);
        expect(deleteMany).toHaveBeenCalledWith({
            where: { createdAt: { lt: cutoff } },
        });
    });
});

describe('QuestionLogService.rate', () => {
    function withQuestion(found: { id: number } | null) {
        const upsert = jest.fn(async () => ({}));
        const prisma = {
            aiQuestionLog: { findFirst: jest.fn(async () => found) },
            aiFeedback: { upsert },
        } as unknown as PrismaService;
        return { service: new QuestionLogService(prisma), upsert, prisma };
    }

    it('saves one rating per person per answer', async () => {
        const { service, upsert } = withQuestion({ id: 7 });
        await expect(service.rate(7, 'u1', true)).resolves.toBe(true);
        expect(upsert).toHaveBeenCalledWith({
            where: { questionId_userId: { questionId: 7, userId: 'u1' } },
            create: { questionId: 7, userId: 'u1', helpful: true },
            update: { helpful: true },
        });
    });

    it("refuses to rate someone else's question (or one that does not exist)", async () => {
        const { service, upsert } = withQuestion(null);
        await expect(service.rate(7, 'u2', false)).resolves.toBe(false);
        expect(upsert).not.toHaveBeenCalled();
    });
});
