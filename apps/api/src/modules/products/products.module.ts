import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsProvider } from './products.provider';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../redis/redis.module';

@Module({
    imports: [
        AuthModule,   // needed by JwtAuthGuard/RolesGuard on admin endpoints
        PrismaModule, // ProductsProvider reads/writes product rows
        RedisModule,  // ProductsProvider caches the product list — wasn't imported before
        // NOTE: MetalsModule is intentionally NOT imported here.
        // Products must never depend on Metals.
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsProvider],
    exports: [
        ProductsService,  // for anything needing product CRUD/business logic
        ProductsProvider, // MarketDataModule needs the raw data layer directly
    ],
})
export class ProductsModule {}