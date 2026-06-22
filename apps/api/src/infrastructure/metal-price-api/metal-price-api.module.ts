import { Module } from '@nestjs/common';
import { MetalPriceApiClient } from './metal-price-api.client';

/**
 * Infrastructure module for the metalpriceapi.com vendor SDK — sits
 * alongside PrismaModule/RedisModule as a shared, domain-agnostic
 * data source. Feature modules (MetalsModule) import this rather
 * than declaring MetalPriceApiClient as a local provider.
 */
@Module({
    providers: [MetalPriceApiClient],
    exports: [MetalPriceApiClient],
})
export class MetalPriceApiModule {}
