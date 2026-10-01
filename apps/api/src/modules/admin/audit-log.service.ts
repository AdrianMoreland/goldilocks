import { Injectable, Logger } from '@nestjs/common';
import type { AuditEntry } from '@goldilocks/shared-types';
import { RedisService } from '../../redis/redis.service';

const REDIS_KEY = 'admin:audit';
const MAX_ENTRIES = 500;

/**
 * Who changed what from the admin console. Kept apart from the error log:
 * these are deliberate actions, not failures. Same Redis-plus-memory shape as
 * ErrorLogService, so it still answers when Redis is down.
 */
@Injectable()
export class AuditLogService {
    private readonly logger = new Logger(AuditLogService.name);
    private readonly memory: AuditEntry[] = [];

    constructor(private readonly redis: RedisService) {}

    async record(user: string, action: string, detail: string): Promise<void> {
        const entry: AuditEntry = {
            at: new Date().toISOString(),
            user,
            action,
            detail,
        };
        this.memory.unshift(entry);
        if (this.memory.length > MAX_ENTRIES) this.memory.length = MAX_ENTRIES;
        this.logger.log(`[audit] ${user} ${action}: ${detail}`);
        await this.redis.pushCapped(REDIS_KEY, entry, MAX_ENTRIES);
    }

    async getRecent(
        limit: number,
    ): Promise<{ entries: AuditEntry[]; persisted: boolean }> {
        const fromRedis = await this.redis.listRange<AuditEntry>(
            REDIS_KEY,
            limit,
        );
        if (fromRedis) return { entries: fromRedis, persisted: true };
        return { entries: this.memory.slice(0, limit), persisted: false };
    }
}
