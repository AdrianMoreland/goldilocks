import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly logger;
    private client;
    private isConnected;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(...keys: string[]): Promise<void>;
    pushCapped(key: string, value: unknown, maxLength: number): Promise<boolean>;
    listRange<T>(key: string, count: number): Promise<T[] | null>;
    isHealthy(): boolean;
}
//# sourceMappingURL=redis.service.d.ts.map