import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsProvider } from './products.provider';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { ProductCacheStore } from './product-cache.store';

@Module({
    imports: [
        AuthModule, // needed by JwtAuthGuard/RolesGuard on admin endpoints
        AuditLogModule,
        PrismaModule, // ProductsProvider reads/writes product rows
        RedisModule, // ProductsProvider caches the product list — wasn't imported before
        // NOTE: MetalsModule is intentionally NOT imported here.
        // Products must never depend on Metals.
    ],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsProvider, ProductCacheStore],
    exports: [ProductsService], // the only door in; ProductsProvider stays private
})
export class ProductsModule {}
