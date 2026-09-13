import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import {
    ProfitAnalysisRequestDto,
    ProfitAnalysisResponseDto,
    PortfolioBuildRequestDto,
    PortfolioBuildResponseDto,
} from '../../common/dto/dtos';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Post('profit-analysis')
    @ApiOperation({
        summary: 'Portfolio P/L — solve purchase spot/premium/price and profit if sold back today',
        description:
            'Exactly one of purchaseSpot/purchasePremium/purchasePrice is treated as missing (see missingField) ' +
            'and solved from the other two, then compared against a live buyback to compute profit and the spot ' +
            'move needed to hit a target profit.',
    })
    @ApiResponse({ status: 200, type: ProfitAnalysisResponseDto })
    async calculateProfitAnalysis(@Body() body: ProfitAnalysisRequestDto): Promise<ProfitAnalysisResponseDto> {
        return this.portfolioService.calculateProfitAnalysis(body);
    }

    @Post('build')
    @ApiOperation({
        summary: 'Portfolio Builder — build and score Maximum Value / Balanced / Maximum Flexibility portfolios',
        description:
            'Prices every in-stock product of the requested metal, classifies it as a bar or coin by name, and ' +
            'builds three candidate portfolios for the given budget, optionally weighting one product as a priority.',
    })
    @ApiResponse({ status: 200, type: PortfolioBuildResponseDto })
    async buildPortfolio(@Body() body: PortfolioBuildRequestDto): Promise<PortfolioBuildResponseDto> {
        return this.portfolioService.buildPortfolio(body);
    }
}
