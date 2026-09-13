export const queryKeys = {
    // Spot prices + products + historic data, fetched as one consistent snapshot from GET /market-data.
    marketData: {
        all: ['market-data'] as const,
    },
    trade: {
        bootstrap: (metal: string) => ['trade', 'bootstrap', metal] as const,
    },
};