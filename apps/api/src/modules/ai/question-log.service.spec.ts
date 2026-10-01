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
    const create = jest.fn(async () => undefined);
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

        await service.record(ENTRY);

        expect(create).toHaveBeenCalledWith({ data: ENTRY });
    });

    it('never throws when the write fails: an answer must still reach the user', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const { service, create } = build();
        create.mockRejectedValue(new Error('db down'));

        await expect(service.record(ENTRY)).resolves.toBeUndefined();
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
