import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AiSettings } from './ai.settings';
import { AnswerCacheService } from './answer-cache.service';
import { QuestionLogService } from './question-log.service';

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Keeps the assistant's tables from growing for ever: question logs older
 * than AI_LOG_RETENTION_DAYS and expired cache rows are deleted once a day.
 */
@Injectable()
export class AiRetentionService {
    private readonly logger = new Logger(AiRetentionService.name);

    constructor(
        private readonly settings: AiSettings,
        private readonly questionLog: QuestionLogService,
        private readonly cache: AnswerCacheService,
    ) {}

    @Cron('30 4 * * *')
    async purge(now = new Date()): Promise<void> {
        try {
            const cutoff = new Date(
                now.getTime() - this.settings.logRetentionDays * DAY_MS,
            );
            const [logs, cached] = await Promise.all([
                this.questionLog.purgeOlderThan(cutoff),
                this.cache.purgeExpired(now),
            ]);
            if (logs || cached) {
                this.logger.log(
                    `Purged ${logs} question log row(s) older than ${this.settings.logRetentionDays} days and ${cached} expired cached answer(s).`,
                );
            }
        } catch (error) {
            this.logger.warn(
                `Purge failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }
}
