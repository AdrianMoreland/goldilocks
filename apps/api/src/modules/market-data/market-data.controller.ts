import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import { MarketDataResponseDto, ProductResponseDto } from '../../common/dto/dtos';
import {MetalType} from "@goldilocks/shared-types";

@ApiTags('MarketData')
@Controller('market-data')
export class MarketDataController {
    constructor(private readonly marketDataService: MarketDataService) {}

    @ApiOperation({
        summary: 'Get application market data',
        description:
            'Loads spot prices, historic spot prices (for charting), and products priced against current spot.',
    })
    @ApiResponse({
        status: 200,
        description: 'Market data retrieved successfully',
        type: MarketDataResponseDto,
    })
    @Get()
    async getMarketData(): Promise<MarketDataResponseDto> {
        return this.marketDataService.getMarketData();
    }

    @ApiOperation({
        summary: 'Recalculate product prices with manual spot overrides',
        description:
            'Lets the UI preview "what if" pricing using user-supplied spot prices ' +
            'for one or more metals. Falls back to live spot prices for any metal not ' +
            'overridden. Does not persist anything.',
    })
    @ApiResponse({
        status: 200,
        description: 'Products recalculated successfully',
        type: [ProductResponseDto],
    })
    @Post('recalculate')
    async recalculate(
        @Body() overrides: Partial<Record<MetalType, number>>,
    ): Promise<ProductResponseDto[]> {
        return this.marketDataService.recalculate(overrides);
    }

    @ApiOperation({
        summary: 'Refresh market data',
        description:
            'Fetches latest EUR and GBP metal spot prices, updates cache/database, ' +
            'and returns the refreshed market snapshot.',
    })
    @ApiResponse({
        status: 200,
        description: 'Market data refreshed successfully',
        type: MarketDataResponseDto,
    })
    @Post('refresh')
    async refresh(): Promise<MarketDataResponseDto> {
        return this.marketDataService.refresh();
    }
}