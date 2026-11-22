import { type AnalyticsPreset, type ChatbotAnalytics, type CustomersAnalytics, type InventoryAnalytics, type OpsAnalytics, type OrdersAnalytics, type PricingAnalytics, type SalesAnalytics } from '@goldilocks/shared-types';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
export declare function dublinToday(now?: Date): string;
export declare class AnalyticsService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    private cached;
    pricing(preset: AnalyticsPreset): Promise<PricingAnalytics>;
    sales(preset: AnalyticsPreset): Promise<SalesAnalytics>;
    orders(preset: AnalyticsPreset): Promise<OrdersAnalytics>;
    inventory(preset: AnalyticsPreset): Promise<InventoryAnalytics>;
    customers(preset: AnalyticsPreset): Promise<CustomersAnalytics>;
    chatbot(preset: AnalyticsPreset): Promise<ChatbotAnalytics>;
    ops(preset: AnalyticsPreset): Promise<OpsAnalytics>;
}
//# sourceMappingURL=analytics.service.d.ts.map