import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { MarketDataModule } from '../market-data/market-data.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PriceSnapshotService } from './price-snapshot.service';

@Module({
    imports: [PrismaModule, RedisModule, MarketDataModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService, PriceSnapshotService],
})
export class AnalyticsModule {}
