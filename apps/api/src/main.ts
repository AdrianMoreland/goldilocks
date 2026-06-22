import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {ZodValidationPipe} from "nestjs-zod";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Enable global validation with Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // main.ts in NestJS
  app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
      .setTitle('Goldilocks API')
      .setDescription('Internal tool for Gold Trading company')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & user management')
      .addTag('products', 'Product catalog & categories')
      .addTag('orders', 'Order placement & management')
      .addTag('delivery', 'Delivery dispatch & tracking')
      .addTag('messaging', 'WhatsApp & Telegram webhooks')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  console.log('✅ Metals cached in Redis');

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);

  console.log(`🚀 Goldilocks API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
  console.log(`🔍 OpenAPI JSON: http://localhost:${port}/docs-json`);

}
bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});