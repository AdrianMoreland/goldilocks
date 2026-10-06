import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { ErrorLogService } from './modules/error-log/error-log.service';
import { Logger as PinoLogger } from 'nestjs-pino';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ApiCatalogueService } from './modules/admin/api-catalogue.service';
import { RequestMetricsService } from './modules/request-metrics/request-metrics.service';

const logger = new Logger('Bootstrap');

// Fails fast with a clear message instead of an obscure error deep inside
// whichever service first touches the missing variable (e.g. Prisma's own
// "Environment variable not found" a few layers down the stack).
const REQUIRED_ENV_VARS = [
    'DATABASE_URL',
    'DIRECT_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_KEY',
    'METALPRICE_API_KEY',
    'REDIS_URL',
] as const;

function validateEnv(config: ConfigService): void {
    const missing: string[] = REQUIRED_ENV_VARS.filter(
        (key) => !config.get<string>(key),
    );
    // The assistant's key is only required once the assistant is switched on.
    if (
        config.get<string>('AI_ENABLED') === 'true' &&
        !config.get<string>('OPENAI_API_KEY')
    ) {
        missing.push('OPENAI_API_KEY (required because AI_ENABLED=true)');
    }
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variable(s): ${missing.join(', ')}`,
        );
    }
}

async function bootstrap() {
    // bufferLogs holds Nest's own startup lines until pino is attached, so none go to the default logger.
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(PinoLogger));
    const config = app.get(ConfigService);
    validateEnv(config);

    // Without this, SIGTERM (every Railway redeploy) skips OnModuleDestroy, so
    // Prisma and Redis never close their connections cleanly.
    app.enableShutdownHooks();

    // Failures outside any HTTP request (cron jobs, fire-and-forget promises)
    // never reach the exception filter — record them too, so the Admin
    // panel's error log isn't blind to background work.
    const errorLog = app.get(ErrorLogService);
    process.on('unhandledRejection', (reason) => {
        void errorLog.record({
            kind: 'crash',
            message: 'Unhandled promise rejection',
            error: reason,
            detail: reason instanceof Error ? null : String(reason),
        });
    });
    // Record, then still exit: a listener here would otherwise stop Node
    // crashing and leave the API running in an unknown state.
    process.on('uncaughtException', (error) => {
        void errorLog
            .record({
                kind: 'crash',
                message: 'Uncaught exception — API process exiting',
                error,
            })
            .finally(() => process.exit(1));
    });

    // Behind Railway's proxy every request would otherwise appear to come from the proxy's address, and
    // the rate limiter would treat all users as one client. Raise this only if more proxies are added in
    // front: trusting too many hops lets a client forge its own address.
    // Number(): an env var is a string, and Express reads a string here as an address list, not a hop count.
    app.set('trust proxy', Number(config.get('TRUST_PROXY_HOPS', 1)));

    app.use(app.get(RequestMetricsService).middleware());

    // Enable global validation with Zod
    app.useGlobalPipes(new ZodValidationPipe());

    // Railway hosts the API and the web app on different origins, so the
    // allowed origin has to come from an env var rather than being hardcoded
    // to the local dev server — see docs/ENGINEERING.md §13.
    const frontendUrl = config.get<string>(
        'FRONTEND_URL',
        'http://localhost:5173',
    );
    app.enableCors({
        origin: frontendUrl.split(',').map((origin) => origin.trim()),
        credentials: true,
    });

    // Swagger lists every route, admin ones included, without authentication —
    // on by default for local dev, off in production unless SWAGGER_ENABLED=true.
    const swaggerEnabled =
        config.get<string>(
            'SWAGGER_ENABLED',
            config.get('NODE_ENV') === 'production' ? 'false' : 'true',
        ) === 'true';
    // Standard security headers (HSTS, no MIME sniffing, no framing). Helmet's default Content-Security-Policy
    // blocks Swagger UI's inline scripts, so it is dropped only while /docs is switched on.
    app.use(
        helmet({ contentSecurityPolicy: swaggerEnabled ? false : undefined }),
    );

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Merrion Gold API')
        .setDescription(
            "Internal pricing and trading API for Merrion Gold's bullion desk",
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication & session management')
        .addTag('products', 'Product catalog & per-item pricing')
        .addTag('trade', 'Trade cart calculations & melt value')
        .addTag('portfolio', 'Portfolio P/L, scenario, and builder tools')
        .addTag('metals', 'Live and historic metal spot prices')
        .addTag('market-data', 'Market data snapshots for the dashboard')
        .addTag('admin', 'Admin console: health, logs, database browser')
        .build();

    // Built even when the public /docs page is off: the admin console's
    // endpoint tester reads the route list from it (behind the admin guard).
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    app.get(ApiCatalogueService).setDocument(cleanupOpenApiDoc(document));
    if (swaggerEnabled) {
        // Keeps the pasted bearer token across page reloads; otherwise every
        // reload (e.g. after a --watch restart) silently drops it and calls 401.
        SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }

    const port = config.get<number>('PORT', 4000);
    await app.listen(port);

    logger.log(`🚀 Goldilocks API running on http://localhost:${port}`);
    if (swaggerEnabled) {
        logger.log(`📚 Swagger docs at http://localhost:${port}/docs`);
        logger.log(`🔍 OpenAPI JSON: http://localhost:${port}/docs-json`);
    }
}
bootstrap().catch((error) => {
    logger.error(
        '❌ Failed to start server:',
        error instanceof Error ? error.stack : error,
    );
    process.exit(1);
});
