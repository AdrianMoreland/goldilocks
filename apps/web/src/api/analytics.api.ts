import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import type {
    AnalyticsPreset,
    ChatbotAnalytics,
    CustomersAnalytics,
    InventoryAnalytics,
    OpsAnalytics,
    OrdersAnalytics,
    PricingAnalytics,
    SalesAnalytics,
} from '@goldilocks/shared-types';

/** The Analytics tabs. Shapes come from shared-types; the server builds them, so they are not re-validated here. */
export function useAnalyticsApi() {
    const client = useApiClient();
    const get = <T,>(path: string, preset: AnalyticsPreset) => client.get(`/analytics/${path}?preset=${preset}`, z.custom<T>());

    return {
        pricing: (preset: AnalyticsPreset) => get<PricingAnalytics>('spot', preset),
        sales: (preset: AnalyticsPreset) => get<SalesAnalytics>('sales', preset),
        orders: (preset: AnalyticsPreset) => get<OrdersAnalytics>('orders', preset),
        inventory: (preset: AnalyticsPreset) => get<InventoryAnalytics>('inventory', preset),
        customers: (preset: AnalyticsPreset) => get<CustomersAnalytics>('customers', preset),
        chatbot: (preset: AnalyticsPreset) => get<ChatbotAnalytics>('ai', preset),
        ops: (preset: AnalyticsPreset) => get<OpsAnalytics>('ops', preset),
    };
}
