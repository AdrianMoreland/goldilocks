import { Logger } from '@nestjs/common';
import type { AiSettings } from './ai.settings';
import type { AnswerCacheService } from './answer-cache.service';
import { AiRetentionService } from './ai-retention.service';
import type { QuestionLogService } from './question-log.service';

const NOW = new Date('2026-10-01T04:30:00Z');

function build(failure?: Error) {
    const purgeOlderThan = jest.fn(async () => {
        if (failure) throw failure;
        return 5;
    });
    const purgeExpired = jest.fn(async () => 2);
    const service = new AiRetentionService(
        { logRetentionDays: 90 } as AiSettings,
        { purgeOlderThan } as unknown as QuestionLogService,
        { purgeExpired } as unknown as AnswerCacheService,
    );
    return { service, purgeOlderThan, purgeExpired };
}

describe('AiRetentionService.purge', () => {
    afterEach(() => jest.restoreAllMocks());

    it('deletes question logs older than the retention period, and expired cached answers', async () => {
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
        const { service, purgeOlderThan, purgeExpired } = build();

        await service.purge(NOW);

        expect(purgeOlderThan).toHaveBeenCalledWith(
            new Date('2026-07-03T04:30:00Z'),
        );
        expect(purgeExpired).toHaveBeenCalledWith(NOW);
    });

    it('swallows a failure so the scheduler keeps running', async () => {
        const warn = jest
            .spyOn(Logger.prototype, 'warn')
            .mockImplementation(() => undefined);
        const { service } = build(new Error('db down'));

        await expect(service.purge(NOW)).resolves.toBeUndefined();
        expect(warn).toHaveBeenCalled();
    });
});
