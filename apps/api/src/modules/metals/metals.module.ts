import { Module } from '@nestjs/common';
import { MetalsController } from './metals.controller';
import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../../redis/redis.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { MetalPriceApiModule } from '../../infrastructure/metal-price-api/metal-price-api.module';
import { SpotPriceCacheStore } from './spot-price-cache.store';
import { CascadeMetricsService } from './cascade-metrics.service';
import { FetchAttemptService } from './fetch-attempt.service';
import { HistoricSpotService } from './historic-spot.service';
import { SpotPriceRetentionService } from './spot-price-retention.service';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard on the refresh endpoint
        RedisModule, // MetalsProvider reads/writes the spot-price cache
        PrismaModule, // MetalsProvider reads/writes spot history
        MetalPriceApiModule, // external vendor API — infra concern, not a "metals" concern
    ],
    controllers: [MetalsController],
    providers: [
        MetalsProvider,
        HistoricSpotService,
        MetalsCron,
        SpotPriceCacheStore,
        CascadeMetricsService,
        FetchAttemptService,
        SpotPriceRetentionService,
    ],
    exports: [
        MetalsProvider, // MarketDataModule needs this — MetalsService no longer exists
        HistoricSpotService, // MarketDataModule reads the chart history and runs the manual backfills
        FetchAttemptService, // AppModule's /health endpoint needs "last successful API call"
    ],
})
export class MetalsModule {}
