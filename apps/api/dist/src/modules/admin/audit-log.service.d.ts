import type { AuditEntry } from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';
export declare class AuditLogService {
    private readonly redis;
    private readonly logger;
    private readonly memory;
    constructor(redis: RedisService);
    record(user: string, action: string, detail: string): Promise<void>;
    getRecent(limit: number): Promise<{
        entries: AuditEntry[];
        persisted: boolean;
    }>;
}
//# sourceMappingURL=audit-log.service.d.ts.map