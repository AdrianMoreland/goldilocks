import type { MeltCategoryKey, ProfitAnalysisRequest, TradeCartRequest } from '@goldilocks/shared-types';

export const queryKeys = {
    // Spot prices + products + historic data, fetched as one consistent snapshot from GET /market-data.
    marketData: {
        all: ['market-data'] as const,
    },
    marketMode: ['market-mode'] as const,
    roadmap: ['roadmap'] as const,
    trade: {
        // Shared by the Trade tab and Portfolio's P/L subtab — same key on
        // purpose (see usePortfolioPL), so opening both doesn't double the
        // network call for the same bootstrap data.
        bootstrap: (metal: string) => ['trade', 'bootstrap', metal] as const,
        cart: (payload: TradeCartRequest | null) => ['trade', 'cart', payload] as const,
        melt: (payload: { category: MeltCategoryKey; weight: number; customSpot?: number } | null) => ['trade', 'melt', payload] as const,
    },
    portfolio: {
        profitAnalysis: (payload: ProfitAnalysisRequest | null) => ['portfolio', 'profit-analysis', payload] as const,
    },
    knowledge: {
        documents: ['knowledge', 'documents'] as const,
    },
    ai: {
        status: ['ai', 'status'] as const,
    },
    admin: {
        cronStatus: ['admin', 'cron-status'] as const,
        branches: ['admin', 'branches'] as const,
        fetchMetrics: ['admin', 'fetch-metrics'] as const,
        fetchLog: ['admin', 'fetch-log'] as const,
        deletedProducts: ['admin', 'deleted-products'] as const,
        errorLog: ['admin', 'error-log'] as const,
        overview: ['admin', 'overview'] as const,
        logs: (level: string, q: string) => ['admin', 'logs', level, q] as const,
        audit: ['admin', 'audit'] as const,
        endpoints: ['admin', 'endpoints'] as const,
        dbTables: ['admin', 'db', 'tables'] as const,
        dbRows: (table: string, page: number, sort: string, dir: string, q: string) => ['admin', 'db', 'rows', table, page, sort, dir, q] as const,
    },
};