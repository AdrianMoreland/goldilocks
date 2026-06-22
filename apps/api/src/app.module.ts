import {Module} from '@nestjs/common';

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

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        AuthModule,
        MetalPriceApiModule,
        MetalsModule,
        ProductsModule,
        MarketDataModule,
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
