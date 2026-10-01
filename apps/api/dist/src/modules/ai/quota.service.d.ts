import { RedisService } from '../../redis/redis.service';
import { AiSettings } from './ai.settings';
export interface QuotaSlot {
    release(): Promise<void>;
}
export declare class QuotaService {
    private readonly redis;
    private readonly settings;
    constructor(redis: RedisService, settings: AiSettings);
    acquire(userId: string, now?: Date): Promise<QuotaSlot>;
    private tooMany;
    private limitsUnavailable;
}
//# sourceMappingURL=quota.service.d.ts.map