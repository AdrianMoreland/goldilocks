import type { MeltCategoryKey, ProfitAnalysisRequest, TradeCartRequest } from '@goldilocks/shared-types';

export const queryKeys = {
    // Spot prices + products + historic data, fetched as one consistent snapshot from GET /market-data.
    marketData: {
        all: ['market-data'] as const,
    },
    trade: {
        // Shared by the Trade tab and Portfolio's P/L subtab — same key on
        // purpose (see usePortfolioPL), so opening both doesn't double the
        // network call for the same bootstrap data.
        bootstrap: (metal: string) => ['trade', 'bootstrap', metal] as const,
        cart: (payload: TradeCartRequest | null) => ['trade', 'cart', payload] as const,
        melt: (payload: { category: MeltCategoryKey; weight: number } | null) => ['trade', 'melt', payload] as const,
    },
    portfolio: {
        profitAnalysis: (payload: ProfitAnalysisRequest | null) => ['portfolio', 'profit-analysis', payload] as const,
    },
    admin: {
        cronStatus: ['admin', 'cron-status'] as const,
        branches: ['admin', 'branches'] as const,
        fetchMetrics: ['admin', 'fetch-metrics'] as const,
        fetchLog: ['admin', 'fetch-log'] as const,
        deletedProducts: ['admin', 'deleted-products'] as const,
        errorLog: ['admin', 'error-log'] as const,
    },
};