import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisService } from './redis/redis.service';
import { FetchAttemptService } from './modules/metals/fetch-attempt.service';

@Injectable()
export class AppService {
  constructor(
      private configService: ConfigService,
      private readonly prisma: PrismaService,
      private readonly redis: RedisService,
      private readonly fetchAttempts: FetchAttemptService,
  ) {}

  getStatus() {
    return {
      name: 'Merrion Gold API',
      status: 'ok',
      port: this.configService.get<number>('PORT', 4000),
    };
  }

  /** GET /health — Railway (or any uptime monitor) hits this to confirm the app can actually reach its dependencies, not just that the process is up. */
  async getHealth() {
    const db = await this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);
    const redis = this.redis.isHealthy();
    const lastSuccessfulMetalsApiCall = await this.fetchAttempts.getLastSuccessfulAt().catch(() => null);

    return {
      status: db && redis ? 'ok' : 'degraded',
      db: db ? 'ok' : 'unreachable',
      redis: redis ? 'ok' : 'unreachable',
      lastSuccessfulMetalsApiCall,
    };
  }
}
