import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../prisma/generated/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    constructor(config: ConfigService) {
        super({
            adapter: new PrismaPg({
                connectionString: config.get<string>('DATABASE_URL')!,
            }),
            log:
                config.get<string>('NODE_ENV') === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
