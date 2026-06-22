export const queryKeys = {
    // Spot prices + products + historic data, fetched together as one
    // consistent snapshot from GET /market-data. There is no separate
    // "products" or "metals" query key anymore — splitting them was what
    // let the two go out of sync in the old setup.
    marketData: {
        all: ['market-data'] as const,
    },
};