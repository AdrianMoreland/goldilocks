import { Inject, Injectable, Logger } from '@nestjs/common';
import type { HistoricSpot, MetalType } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
    METAL_PRICE_API,
    type MetalPriceApiPort,
} from '../../infrastructure/metal-price-api/metal-price-api.port';
import {
    ALL_METALS,
    HISTORIC_LOOKBACK_DAYS,
    thinOldHistory,
    SYMBOL_MAP,
    toNumber,
    type HistoricSpotRecord,
} from '../../common/utils/pricing.util';
import { mapTimeframeRecords } from './vendor-rates';

export interface BackfillWindowReport {
    from: string;
    to: string;
    status: 'stored' | 'skipped' | 'refused';
    inserted: number;
}

/**
 * Historic (end-of-day) spot prices: reading them for the chart, and the
 * backfill/daily-close jobs that fill the table. Split from MetalsProvider,
 * which is about the *latest* price — different tables, callers and cadence.
 */
@Injectable()
export class HistoricSpotService {
    private readonly logger = new Logger(HistoricSpotService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(METAL_PRICE_API)
        private readonly metalPriceApi: MetalPriceApiPort,
    ) {}

    /**
     * Historic spot prices for charting (last five years; the oldest four are
     * thinned to one point a week to keep the dashboard payload small).
     */
    async getHistoricSpots(): Promise<HistoricSpot[]> {
        const rows = thinOldHistory(await this.readFromDb());

        if (rows.length === 0) {
            this.logger.warn(
                'No historic spot data found — has the cron run yet?',
            );
        }

        return rows.map((row) => ({
            metalType: row.metalType,
            priceEur: toNumber(row.priceEur),
            priceGbp: toNumber(row.priceGbp),
            timestamp: row.recordedAt.toISOString(),
        }));
    }

    /**
     * Most recent date we have a historic close for, across all metals.
     * Used by MetalsCron on startup to detect a stale gap (e.g. the app
     * wasn't running when the daily cron would have fired) and backfill it.
     */
    async getLatestHistoricDate(): Promise<Date | null> {
        const latest = await this.prisma.historicSpotPrice.findFirst({
            orderBy: { recordedAt: 'desc' },
            select: { recordedAt: true },
        });
        return latest?.recordedAt ?? null;
    }

    async fetchAndStoreHistoricClose(date: string): Promise<void> {
        this.logger.log(`Fetching OHLC historic close for ${date}`);
        const recordedAt = new Date(`${date}T00:00:00.000Z`);
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);

        const existingCount = await this.prisma.historicSpotPrice.count({
            where: { recordedAt: { gte: startOfDay, lte: endOfDay } },
        });

        if (existingCount === ALL_METALS.length) {
            this.logger.log(
                `Historic OHLC already exists for ${recordedAt.toISOString()}`,
            );
            return;
        }

        const records = await Promise.all(
            (Object.entries(SYMBOL_MAP) as [MetalType, string][]).map(
                async ([metalType, symbol]) => {
                    const [eurResponse, gbpResponse] = await Promise.all([
                        this.metalPriceApi.ohlcPrices(date, 'EUR', symbol),
                        this.metalPriceApi.ohlcPrices(date, 'GBP', symbol),
                    ]);

                    if (!eurResponse.success || !gbpResponse.success) {
                        return null;
                    }

                    this.logger.debug(
                        `${metalType} close: EUR raw=${eurResponse.rate.close}, GBP raw=${gbpResponse.rate.close}`,
                    );

                    return {
                        metalType,
                        priceEur: 1 / Number(eurResponse.rate.close),
                        priceGbp: 1 / Number(gbpResponse.rate.close),
                        recordedAt,
                    };
                },
            ),
        );

        const validRecords = records.filter(
            (r): r is HistoricSpotRecord => r !== null,
        );

        if (validRecords.length === 0) {
            this.logger.warn('No OHLC records generated');
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data: validRecords,
            skipDuplicates: true,
        });

        this.logger.log(
            `Inserted ${validRecords.length} historic close prices for ${date}`,
        );
    }

    async seedHistoricPrices(): Promise<void> {
        this.logger.log('Starting historic price seed...');

        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - 364); // 365 days max for free plan

        const startDate = start.toISOString().slice(0, 10);
        const endDate = end.toISOString().slice(0, 10);

        const records = await this.fetchTimeframe(startDate, endDate);

        if (!records.length) {
            this.logger.warn('No historic records returned');
            return;
        }

        await this.prisma.historicSpotPrice.createMany({
            data: records,
            skipDuplicates: true,
        });

        this.logger.log(`Inserted ${records.length} historic spot prices`);
    }

    /**
     * Fills the table back to `years` years ago, one vendor window at a time
     * (the vendor caps a timeframe call at ~a year, and each window costs two
     * requests: EUR and GBP). A window the table already covers is skipped, so
     * re-running is cheap, and the first window the vendor refuses ends the run
     * with that window's dates in the report instead of an exception.
     */
    async backfillYears(years: number): Promise<BackfillWindowReport[]> {
        const dayMs = 24 * 60 * 60 * 1000;
        const today = new Date();
        const reports: BackfillWindowReport[] = [];

        for (let i = 0; i < years; i++) {
            const end = new Date(today.getTime() - i * 364 * dayMs);
            const start = new Date(end.getTime() - 363 * dayMs);
            const from = start.toISOString().slice(0, 10);
            const to = end.toISOString().slice(0, 10);

            const existing = await this.prisma.historicSpotPrice.count({
                where: {
                    recordedAt: {
                        gte: new Date(`${from}T00:00:00.000Z`),
                        lte: new Date(`${to}T23:59:59.999Z`),
                    },
                },
            });
            // Weekends and holidays leave gaps, so "covered" means nearly full, not exactly full.
            if (existing >= 364 * ALL_METALS.length * 0.85) {
                reports.push({ from, to, status: 'skipped', inserted: 0 });
                continue;
            }

            const records = await this.fetchTimeframe(from, to);
            if (records.length === 0) {
                reports.push({ from, to, status: 'refused', inserted: 0 });
                break;
            }

            const { count } = await this.prisma.historicSpotPrice.createMany({
                data: records,
                skipDuplicates: true,
            });
            reports.push({ from, to, status: 'stored', inserted: count });
            this.logger.log(`Backfilled ${count} rows for ${from} to ${to}`);
        }

        return reports;
    }

    private async fetchTimeframe(
        startDate: string,
        endDate: string,
    ): Promise<HistoricSpotRecord[]> {
        const [eurResponse, gbpResponse] = await Promise.all([
            this.metalPriceApi.timeframePrices(startDate, endDate, 'EUR'),
            this.metalPriceApi.timeframePrices(startDate, endDate, 'GBP'),
        ]);

        if (!eurResponse.success) {
            this.logger.error(
                `EUR historic failed: ${JSON.stringify(eurResponse)}`,
            );
            return [];
        }

        if (!gbpResponse.success) {
            this.logger.error(
                `GBP historic failed: ${JSON.stringify(gbpResponse)}`,
            );
            return [];
        }

        return mapTimeframeRecords(eurResponse.rates, gbpResponse.rates);
    }

    private async readFromDb() {
        const since = new Date();
        since.setDate(since.getDate() - HISTORIC_LOOKBACK_DAYS);

        this.logger.debug(
            `Reading historic spot prices since ${since.toISOString()} from DB…`,
        );
        return this.prisma.historicSpotPrice.findMany({
            where: {
                metalType: { in: ALL_METALS },
                recordedAt: { gte: since },
            },
            orderBy: { recordedAt: 'asc' },
            select: {
                metalType: true,
                priceEur: true,
                priceGbp: true,
                recordedAt: true,
            },
        });
    }
}
