import { Injectable, Logger } from '@nestjs/common';
import type { AuditEntry } from '@goldilocks/shared-types';
import type { Prisma } from '../../../prisma/generated/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Who changed what. Entries live in Postgres, not Redis, so they survive a cache flush or restart.
 *
 * Pass the transaction client as `tx` when recording a change made in a transaction: the entry then
 * commits or rolls back with the change. A failed insert is deliberately not swallowed, because a
 * change that cannot be audited must not go through.
 */
@Injectable()
export class AuditLogService {
    private readonly logger = new Logger(AuditLogService.name);

    constructor(private readonly prisma: PrismaService) {}

    async record(
        actor: string,
        action: string,
        detail: string,
        tx?: Prisma.TransactionClient,
    ): Promise<void> {
        await (tx ?? this.prisma).auditLog.create({
            data: { actor, action, detail },
        });
        this.logger.log(`[audit] ${actor} ${action}: ${detail}`);
    }

    async getRecent(
        limit: number,
    ): Promise<{ entries: AuditEntry[]; persisted: boolean }> {
        const rows = await this.prisma.auditLog.findMany({
            orderBy: [{ at: 'desc' }, { id: 'desc' }],
            take: limit,
        });
        return {
            entries: rows.map((row) => ({
                at: row.at.toISOString(),
                user: row.actor,
                action: row.action,
                detail: row.detail,
            })),
            persisted: true,
        };
    }
}
