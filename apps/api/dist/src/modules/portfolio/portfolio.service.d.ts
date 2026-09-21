import { ProfitAnalysisRequest, ProfitAnalysisResponse, PortfolioBuildRequest, PortfolioBuildResponse } from '@goldilocks/shared-types';
import { ProductsProvider } from '../products/products.provider';
import { MetalsProvider } from '../metals/metals.provider';
export declare class PortfolioService {
    private readonly productsProvider;
    private readonly metalsProvider;
    constructor(productsProvider: ProductsProvider, metalsProvider: MetalsProvider);
    calculateProfitAnalysis(request: ProfitAnalysisRequest): Promise<ProfitAnalysisResponse>;
    buildPortfolio(request: PortfolioBuildRequest): Promise<PortfolioBuildResponse>;
}
//# sourceMappingURL=portfolio.service.d.ts.map