import { AiSettings } from './ai.settings';
import { AnswerCacheService } from './answer-cache.service';
import { QuestionLogService } from './question-log.service';
export declare class AiRetentionService {
    private readonly settings;
    private readonly questionLog;
    private readonly cache;
    private readonly logger;
    constructor(settings: AiSettings, questionLog: QuestionLogService, cache: AnswerCacheService);
    purge(now?: Date): Promise<void>;
}
//# sourceMappingURL=ai-retention.service.d.ts.map