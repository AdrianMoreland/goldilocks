// src/api/portfolio.api.ts
import { useApiClient } from '@/api/api-client';
import {
    ProfitAnalysisResponseSchema,
    type ProfitAnalysisRequest,
    PortfolioBuildResponseSchema,
    type PortfolioBuildRequest,
} from '@goldilocks/shared-types';

/** Portfolio tab — P/L, Builder subtabs. Mirrors Api.Pricing.gs/Api.Portfolio.gs. */
export function usePortfolioApi() {
    const client = useApiClient();

    return {
        calculateProfitAnalysis: (body: ProfitAnalysisRequest) =>
            client.post('/portfolio/profit-analysis', body, ProfitAnalysisResponseSchema),
        buildPortfolio: (body: PortfolioBuildRequest) =>
            client.post('/portfolio/build', body, PortfolioBuildResponseSchema),
    };
}
