import {Module} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './modules/auth/auth.module';
import {ProductsModule} from './modules/products/products.module';
import {ConfigModule} from '@nestjs/config'
import {MetalsModule} from "./modules/metals/metals.module";
import {APP_PIPE, APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {ZodValidationPipe, ZodSerializerInterceptor, } from "nestjs-zod";
import {MarketDataModule} from "./modules/market-data/market-data.module";
import {MetalPriceApiModule} from "./infrastructure/metal-price-api/metal-price-api.module";
import {TradeModule} from "./modules/trade/trade.module";
import {PortfolioModule} from "./modules/portfolio/portfolio.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        MetalPriceApiModule,
        MetalsModule,
        ProductsModule,
        MarketDataModule,
        TradeModule,
        PortfolioModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_PIPE, useClass: ZodValidationPipe },
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    ],
})
export class AppModule {
}
