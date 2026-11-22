import { ProfitAnalysisRequest, ProfitAnalysisResponse, PortfolioBuildRequest, PortfolioBuildResponse } from '@goldilocks/shared-types';
import { ProductsService } from '../products/products.service';
import { MetalsProvider } from '../metals/metals.provider';
export declare class PortfolioService {
    private readonly productsService;
    private readonly metalsProvider;
    constructor(productsService: ProductsService, metalsProvider: MetalsProvider);
    calculateProfitAnalysis(request: ProfitAnalysisRequest): Promise<ProfitAnalysisResponse>;
    buildPortfolio(request: PortfolioBuildRequest): Promise<PortfolioBuildResponse>;
}
//# sourceMappingURL=portfolio.service.d.ts.map