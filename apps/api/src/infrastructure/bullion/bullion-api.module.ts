import { Module } from '@nestjs/common';
import {BullionClient} from "./bullion.client";

/**
 * Infrastructure module for the metalpriceapi.com vendor SDK — sits
 * alongside PrismaModule/RedisModule as a shared, domain-agnostic
 * data source. Feature modules (MetalsModule) import this rather
 * than declaring MetalPriceApiClient as a local provider.
 */
@Module({
    providers: [BullionClient],
    exports: [BullionClient],
})
export class BullionApiModule {}
