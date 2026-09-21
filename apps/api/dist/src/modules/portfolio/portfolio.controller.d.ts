import { PortfolioService } from './portfolio.service';
import { ProfitAnalysisRequestDto, ProfitAnalysisResponseDto, PortfolioBuildRequestDto, PortfolioBuildResponseDto } from '../../common/dto/dtos';
export declare class PortfolioController {
    private readonly portfolioService;
    constructor(portfolioService: PortfolioService);
    calculateProfitAnalysis(body: ProfitAnalysisRequestDto): Promise<ProfitAnalysisResponseDto>;
    buildPortfolio(body: PortfolioBuildRequestDto): Promise<PortfolioBuildResponseDto>;
}
//# sourceMappingURL=portfolio.controller.d.ts.map