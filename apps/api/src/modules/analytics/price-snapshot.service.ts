import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MarketDataService } from '../market-data/market-data.service';
import { dublinToday } from './analytics.service';

/**
 * Once a day, records every active product's Price and Buyback from the live spot, so the Pricing tab can
 * chart premium and spread history. Prices come from the same catalogue the product table shows.
 */
@Injectable()
export class PriceSnapshotService {
    private readonly logger = new Logger(PriceSnapshotService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly marketData: MarketDataService,
    ) {}

    // After the London afternoon fix and the end of the shop day.
    @Cron('45 17 * * *', { timeZone: 'Europe/Dublin' })
    async run(): Promise<void> {
        try {
            const n = await this.capture(new Date());
            this.logger.log(`Daily price snapshot: ${n} products`);
        } catch (error) {
            this.logger.error(
                `Daily price snapshot failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    /** Returns how many products were recorded. Running twice on one day replaces that day's rows. */
    async capture(now: Date): Promise<number> {
        const { products, degradedMetals } =
            await this.marketData.getPricedCatalogue();
        const day = new Date(`${dublinToday(now)}T00:00:00Z`);
        const rows = products.filter(
            (p) => p.isActive && !degradedMetals.includes(p.metalType),
        );
        await this.prisma.$transaction(
            rows.map((p) => {
                const data = {
                    metalType: p.metalType,
                    spotEur: p.spotPrice,
                    spreadSell: p.spreadSell,
                    spreadBuy: p.spreadBuy,
                    sellPriceEur: p.priceSell,
                    buyPriceEur: p.priceBuy,
                };
                return this.prisma.productPriceSnapshot.upsert({
                    where: { productId_day: { productId: p.id, day } },
                    create: { productId: p.id, day, ...data },
                    update: data,
                });
            }),
        );
        return rows.length;
    }
}
