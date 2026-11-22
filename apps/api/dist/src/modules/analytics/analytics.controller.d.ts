import type { ChatbotAnalytics, CustomersAnalytics, InventoryAnalytics, OpsAnalytics, OrdersAnalytics, PricingAnalytics, SalesAnalytics } from '@goldilocks/shared-types';
import { AnalyticsQueryDto } from '../../common/dto/dtos';
import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analytics;
    constructor(analytics: AnalyticsService);
    spot({ preset }: AnalyticsQueryDto): Promise<PricingAnalytics>;
    sales({ preset }: AnalyticsQueryDto): Promise<SalesAnalytics>;
    orders({ preset }: AnalyticsQueryDto): Promise<OrdersAnalytics>;
    inventory({ preset }: AnalyticsQueryDto): Promise<InventoryAnalytics>;
    customers({ preset }: AnalyticsQueryDto): Promise<CustomersAnalytics>;
    ai({ preset }: AnalyticsQueryDto): Promise<ChatbotAnalytics>;
    ops({ preset }: AnalyticsQueryDto): Promise<OpsAnalytics>;
}
//# sourceMappingURL=analytics.controller.d.ts.map