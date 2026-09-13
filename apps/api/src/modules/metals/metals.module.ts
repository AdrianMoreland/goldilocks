import {Module} from '@nestjs/common';
import {MetalsController} from './metals.controller';
import {MetalsProvider} from './metals.provider';
import {MetalsCron} from './metals.cron';
import {AuthModule} from '../auth/auth.module';
import {RedisModule} from '../../redis/redis.module';
import {PrismaModule} from '../../infrastructure/prisma/prisma.module';
import {MetalPriceApiModule} from '../../infrastructure/metal-price-api/metal-price-api.module';
import {SpotPriceCacheStore} from "./spot-price-cache.store";

@Module({
    imports: [
        AuthModule,   // needed by JwtAuthGuard/RolesGuard on the refresh endpoint
        RedisModule,  // MetalsProvider reads/writes the spot-price cache
        PrismaModule, // MetalsProvider reads/writes spot history
        MetalPriceApiModule // external vendor API — infra concern, not a "metals" concern
    ],
    controllers: [MetalsController],
    providers: [
        MetalsProvider,
        MetalsCron,
        SpotPriceCacheStore
    ],
    exports: [
        MetalsProvider, // MarketDataModule needs this — MetalsService no longer exists
    ],
})
export class MetalsModule {
}
