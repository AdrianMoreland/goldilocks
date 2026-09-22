import { Module } from '@nestjs/common';
import { MetalPriceApiClient } from './metal-price-api.client';
import { METAL_PRICE_API } from './metal-price-api.port';

/**
 * Infrastructure module for the metalpriceapi.com vendor SDK — sits
 * alongside PrismaModule/RedisModule as a shared, domain-agnostic
 * data source. Feature modules (MetalsModule) import this rather
 * than declaring MetalPriceApiClient as a local provider.
 *
 * Consumers depend on the METAL_PRICE_API token (MetalPriceApiPort), not
 * MetalPriceApiClient directly — swap vendors later by changing this one
 * binding, same shape as AUTH_PROVIDER in auth.module.ts.
 */
@Module({
    providers: [
        MetalPriceApiClient,
        { provide: METAL_PRICE_API, useClass: MetalPriceApiClient },
    ],
    exports: [METAL_PRICE_API],
})
export class MetalPriceApiModule {}
