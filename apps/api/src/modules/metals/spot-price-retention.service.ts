import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ErrorLogService } from '../error-log/error-log.service';
import { ALL_METALS } from '../../common/utils/pricing.util';

const DEFAULT_RETENTION_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * `metal_spot_prices` gets four rows every ten minutes (~576 a day) and is only
 * ever read for the latest row per metal. The chart reads the daily closes in
 * `historic_spot_prices`, so older ticks have no reader; a week is kept for
 * debugging the price feed, and the rest is deleted daily.
 *
 * The newest row of each metal is never deleted, however old: it is the
 * fallback price if the vendor and Redis are both down.
 */
@Injectable()
export class SpotPriceRetentionService implements OnModuleInit {
    private readonly logger = new Logger(SpotPriceRetentionService.name);
    private readonly retentionDays: number;

    constructor(
        private readonly prisma: PrismaService,
        private readonly errorLog: ErrorLogService,
        config: ConfigService,
    ) {
        const configured = Number(config.get('SPOT_PRICE_RETENTION_DAYS'));
        this.retentionDays =
            Number.isFinite(configured) && configured >= 1
                ? Math.floor(configured)
                : DEFAULT_RETENTION_DAYS;
    }

    /** Also at boot, so a deploy cleans up straight away instead of at the next 03:30 UTC. Background: never delays startup. */
    onModuleInit(): void {
        void this.prune();
    }

    @Cron('30 3 * * *', { timeZone: 'UTC' })
    async prune(): Promise<number> {
        try {
            const cutoff = new Date(Date.now() - this.retentionDays * DAY_MS);

            const newest = await Promise.all(
                ALL_METALS.map((metalType) =>
                    this.prisma.metalSpotPrice.findFirst({
                        where: { metalType },
                        orderBy: { timestamp: 'desc' },
                        select: { id: true },
                    }),
                ),
            );
            const keep = newest.flatMap((row) => (row ? [row.id] : []));

            const { count } = await this.prisma.metalSpotPrice.deleteMany({
                where: { timestamp: { lt: cutoff }, id: { notIn: keep } },
            });
            if (count > 0) {
                this.logger.log(
                    `Deleted ${count} spot-price rows older than ${this.retentionDays} days`,
                );
            }
            return count;
        } catch (error) {
            // A failed cleanup is harmless; it is recorded so it isn't silent, and retried tomorrow.
            await this.errorLog.record({
                severity: 'warning',
                kind: 'database',
                message: 'Spot-price cleanup failed',
                error,
            });
            return 0;
        }
    }
}
