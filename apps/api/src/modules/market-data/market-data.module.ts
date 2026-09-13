import { Module } from '@nestjs/common';

import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

import { ProductsModule } from '../products/products.module';
import { MetalsModule } from '../metals/metals.module';


@Module({
    imports: [
        ProductsModule,
        MetalsModule,
    ],
    controllers: [
        MarketDataController,
    ],
    providers: [
        MarketDataService,
    ],
    exports: [
        MarketDataService,
    ],
})
export class MarketDataModule {

}