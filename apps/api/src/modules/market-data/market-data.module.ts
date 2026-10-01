import { Module } from '@nestjs/common';

import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { MetalsModule } from '../metals/metals.module';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard on the admin endpoints
        ProductsModule,
        MetalsModule,
    ],
    controllers: [MarketDataController],
    providers: [MarketDataService],
    exports: [MarketDataService],
})
export class MarketDataModule {}
