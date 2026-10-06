import { Injectable } from '@nestjs/common';
import type {
    MarketModeState,
    UpdateMarketModeRequest,
} from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

/** The one row that holds the shared mode. */
const ROW_ID = 1;

const STANDARD: MarketModeState = {
    weekend: false,
    volatile: false,
    shortage: false,
    updatedBy: null,
    updatedAt: null,
};

function label(state: UpdateMarketModeRequest): string {
    const on = (['weekend', 'volatile', 'shortage'] as const).filter(
        (mode) => state[mode],
    );
    return on.length === 0 ? 'standard' : on.join(' + ');
}

@Injectable()
export class MarketModeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly audit: AuditLogService,
    ) {}

    /** No row yet means nobody has ever set a mode: Standard. */
    async get(): Promise<MarketModeState> {
        const row = await this.prisma.marketModeState.findUnique({
            where: { id: ROW_ID },
        });
        if (!row) return STANDARD;
        return {
            weekend: row.weekend,
            volatile: row.volatile,
            shortage: row.shortage,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }

    async set(
        next: UpdateMarketModeRequest,
        actor: { firstName: string; lastName: string; email: string },
    ): Promise<MarketModeState> {
        const name =
            `${actor.firstName} ${actor.lastName}`.trim() || actor.email;
        const data = {
            weekend: next.weekend,
            volatile: next.volatile,
            shortage: next.shortage,
            updatedBy: name,
        };
        // Read, write and audit share one transaction so the "before" in the entry is the state
        // that was actually replaced, and no change exists without its entry.
        const row = await this.prisma.$transaction(async (tx) => {
            const previous = await tx.marketModeState.findUnique({
                where: { id: ROW_ID },
            });
            const saved = await tx.marketModeState.upsert({
                where: { id: ROW_ID },
                create: { id: ROW_ID, ...data },
                update: data,
            });
            await this.audit.record(
                actor.email,
                'market-mode',
                `${label(previous ?? STANDARD)} → ${label(next)}`,
                tx,
            );
            return saved;
        });
        return {
            weekend: row.weekend,
            volatile: row.volatile,
            shortage: row.shortage,
            updatedBy: row.updatedBy,
            updatedAt: row.updatedAt.toISOString(),
        };
    }
}
