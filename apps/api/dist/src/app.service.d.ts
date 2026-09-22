import { ConfigService } from '@nestjs/config';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisService } from './redis/redis.service';
import { FetchAttemptService } from './modules/metals/fetch-attempt.service';
export declare class AppService {
    private configService;
    private readonly prisma;
    private readonly redis;
    private readonly fetchAttempts;
    constructor(configService: ConfigService, prisma: PrismaService, redis: RedisService, fetchAttempts: FetchAttemptService);
    getStatus(): {
        name: string;
        status: string;
        port: number;
    };
    getHealth(): Promise<{
        status: string;
        db: string;
        redis: string;
        lastSuccessfulMetalsApiCall: string | null;
    }>;
}
//# sourceMappingURL=app.service.d.ts.map