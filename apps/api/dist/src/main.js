"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const error_log_service_1 = require("./modules/error-log/error-log.service");
const nestjs_pino_1 = require("nestjs-pino");
const nestjs_zod_2 = require("nestjs-zod");
const api_catalogue_service_1 = require("./modules/admin/api-catalogue.service");
const request_metrics_service_1 = require("./modules/admin/request-metrics.service");
const logger = new common_1.Logger('Bootstrap');
const REQUIRED_ENV_VARS = [
    'DATABASE_URL',
    'DIRECT_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_KEY',
    'METALPRICE_API_KEY',
    'REDIS_URL',
];
function validateEnv(config) {
    const missing = REQUIRED_ENV_VARS.filter((key) => !config.get(key));
    if (config.get('AI_ENABLED') === 'true' &&
        !config.get('OPENAI_API_KEY')) {
        missing.push('OPENAI_API_KEY (required because AI_ENABLED=true)');
    }
    if (missing.length > 0) {
        throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    const config = app.get(config_1.ConfigService);
    validateEnv(config);
    app.enableShutdownHooks();
    const errorLog = app.get(error_log_service_1.ErrorLogService);
    process.on('unhandledRejection', (reason) => {
        void errorLog.record({
            kind: 'crash',
            message: 'Unhandled promise rejection',
            error: reason,
            detail: reason instanceof Error ? null : String(reason),
        });
    });
    process.on('uncaughtException', (error) => {
        void errorLog
            .record({
            kind: 'crash',
            message: 'Uncaught exception — API process exiting',
            error,
        })
            .finally(() => process.exit(1));
    });
    app.use(app.get(request_metrics_service_1.RequestMetricsService).middleware());
    app.useGlobalPipes(new nestjs_zod_1.ZodValidationPipe());
    const frontendUrl = config.get('FRONTEND_URL', 'http://localhost:5173');
    app.enableCors({
        origin: frontendUrl.split(',').map((origin) => origin.trim()),
        credentials: true,
    });
    const swaggerEnabled = config.get('SWAGGER_ENABLED', config.get('NODE_ENV') === 'production' ? 'false' : 'true') === 'true';
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Merrion Gold API')
        .setDescription("Internal pricing and trading API for Merrion Gold's bullion desk")
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
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    app.get(api_catalogue_service_1.ApiCatalogueService).setDocument((0, nestjs_zod_2.cleanupOpenApiDoc)(document));
    if (swaggerEnabled) {
        swagger_1.SwaggerModule.setup('docs', app, document);
    }
    const port = config.get('PORT', 4000);
    await app.listen(port);
    logger.log(`🚀 Goldilocks API running on http://localhost:${port}`);
    if (swaggerEnabled) {
        logger.log(`📚 Swagger docs at http://localhost:${port}/docs`);
        logger.log(`🔍 OpenAPI JSON: http://localhost:${port}/docs-json`);
    }
}
bootstrap().catch((error) => {
    logger.error('❌ Failed to start server:', error instanceof Error ? error.stack : error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map