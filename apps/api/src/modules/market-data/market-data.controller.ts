import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import { MarketDataResponseDto, ProductResponseDto } from '../../common/dto/dtos';
import {MetalType} from "@goldilocks/shared-types";
import {getYesterday} from "../../common/utils/date.utils";

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

    @ApiOperation({
        summary: 'Debug: fetch one day\'s historic close',
        description: 'Fetches and stores the historic close for a single date (defaults to yesterday). For manual/debug use, not the regular seeding flow.',
    })
    @ApiResponse({status: 200, description: 'Historic close fetched successfully'})
    @Get('historic-close/debug')
    async debugHistoricClose(
        @Query('date') date?: string,
    ) {
        const targetDate = date ?? getYesterday();

        await this.marketDataService.fetchHistoricClose(
            targetDate
        );

        return {
            success: true,
            date: targetDate,
        };
    }

    @Post('seed-history')
    @ApiOperation({
        summary: 'Seed historic metal prices',
        description:
            'Fetches the last year of historic metal prices from MetalPriceAPI and stores them in the database.',
    })
    @ApiResponse({
        status: 201,
        description: 'Historic prices seeded successfully',
    })
    async seedHistory(): Promise<void> {
        await this.marketDataService.seedHistoricPrices();
    }
}