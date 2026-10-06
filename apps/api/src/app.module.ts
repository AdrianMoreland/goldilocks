import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { AdminModule } from './modules/admin/admin.module';
import { logBuffer } from './modules/admin/log-buffer';
import { MetalsModule } from './modules/metals/metals.module';
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { MetalPriceApiModule } from './infrastructure/metal-price-api/metal-price-api.module';
import { TradeModule } from './modules/trade/trade.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { BranchesModule } from './modules/branches/branches.module';
import { MarketModeModule } from './modules/market-mode/market-mode.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorLogModule } from './modules/error-log/error-log.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { AiModule } from './modules/ai/ai.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { UserThrottlerGuard } from './common/guards/user-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

// pino-pretty is a dev-only dependency, so it is loaded only outside production.
function prettyStream() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pretty = require('pino-pretty') as typeof import('pino-pretty');
    return pretty({ colorize: true, singleLine: true, ignore: 'pid,hostname' });
}

@Module({
    imports: [
        // In-memory counters: one API instance today. Move to a Redis-backed store when a second replica is added.
        // The default is a generous per-user ceiling; sensitive routes tighten it with @Throttle.
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 300 }] }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        // Structured JSON logs to stdout (Railway's log view), tee'd into an
        // in-memory buffer the admin console reads. Dev gets readable output.
        LoggerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const production = config.get('NODE_ENV') === 'production';
                const stdout = production ? process.stdout : prettyStream();
                return {
                    pinoHttp: {
                        level: config.get<string>('LOG_LEVEL', 'info'),
                        stream: pino.multistream([
                            { stream: stdout },
                            { stream: logBuffer.stream },
                        ]),
                        redact: [
                            'req.headers.authorization',
                            'req.headers.cookie',
                        ],
                        serializers: {
                            req: (req: { method: string; url: string }) => ({
                                method: req.method,
                                url: req.url,
                            }),
                            res: (res: { statusCode: number }) => ({
                                statusCode: res.statusCode,
                            }),
                        },
                        // Console polling and uptime pings would bury real traffic.
                        autoLogging: {
                            ignore: (req: { url?: string; method?: string }) =>
                                req.url === '/health' ||
                                (req.method === 'GET' &&
                                    !!req.url?.startsWith('/admin/')),
                        },
                    },
                };
            },
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        MetalPriceApiModule,
        MetalsModule,
        ProductsModule,
        MarketDataModule,
        TradeModule,
        PortfolioModule,
        BranchesModule,
        MarketModeModule,
        RoadmapModule,
        PrismaModule,
        RedisModule,
        ErrorLogModule,
        KnowledgeModule,
        AiModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // Fail-closed: every route needs a signed-in user unless marked @Public().
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        // After JwtAuthGuard: makes every @Roles() effective, including on routes that forget @UseGuards(RolesGuard).
        { provide: APP_GUARD, useClass: RolesGuard },
        // Last of the guards so the throttler can key on the signed-in user.
        { provide: APP_GUARD, useClass: UserThrottlerGuard },
        { provide: APP_PIPE, useClass: ZodValidationPipe },
        { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
    ],
})
export class AppModule {}
