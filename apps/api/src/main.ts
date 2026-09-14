import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {ZodValidationPipe} from "nestjs-zod";

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
  const missing = REQUIRED_ENV_VARS.filter((key) => !config.get<string>(key));
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  validateEnv(config);

  // Enable global validation with Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Railway hosts the API and the web app on different origins, so the
  // allowed origin has to come from an env var rather than being hardcoded
  // to the local dev server — see CLAUDE.md §13.
  const frontendUrl = config.get<string>('FRONTEND_URL', 'http://localhost:5173');
  app.enableCors({
    origin: frontendUrl.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
      .setTitle('Merrion Gold API')
      .setDescription('Internal pricing and trading API for Merrion Gold\'s bullion desk')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & session management')
      .addTag('products', 'Product catalog & per-item pricing')
      .addTag('trade', 'Trade cart calculations & melt value')
      .addTag('portfolio', 'Portfolio P/L, scenario, and builder tools')
      .addTag('metals', 'Live and historic metal spot prices')
      .addTag('market-data', 'Market data snapshots for the dashboard')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);

  logger.log(`🚀 Goldilocks API running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/docs`);
  logger.log(`🔍 OpenAPI JSON: http://localhost:${port}/docs-json`);

}
bootstrap().catch((error) => {
  logger.error('❌ Failed to start server:', error instanceof Error ? error.stack : error);
  process.exit(1);
});