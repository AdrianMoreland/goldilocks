import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { MarketDataService } from './market-data.service';
import {
    HistoricCloseQueryDto,
    MarketDataResponseDto,
    ProductResponseDto,
    RecalculateOverridesDto,
} from '../../common/dto/dtos';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { getYesterday } from '../../common/utils/date.utils';

@ApiTags('market-data')
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
        @Body() overrides: RecalculateOverridesDto,
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
    // Any signed-in user (the desk's Refresh button) — the global JwtAuthGuard
    // already requires a token; this is deliberately not admin-only.
    @Post('refresh')
    @ApiBearerAuth()
    async refresh(): Promise<MarketDataResponseDto> {
        return this.marketDataService.refresh();
    }

    @ApiOperation({
        summary: "Debug: fetch one day's historic close",
        description:
            'Fetches and stores the historic close for a single date (defaults to yesterday). For manual/debug use, not the regular seeding flow.',
    })
    @ApiResponse({
        status: 200,
        description: 'Historic close fetched successfully',
    })
    @Get('historic-close/debug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    async debugHistoricClose(@Query() { date }: HistoricCloseQueryDto) {
        const targetDate = date ?? getYesterday();

        await this.marketDataService.fetchHistoricClose(targetDate);

        return {
            success: true,
            date: targetDate,
        };
    }

    @Post('backfill-history')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Backfill historic metal prices (admin)',
        description:
            'Fetches up to 10 years of daily closes from the vendor, a year per window (2 vendor requests each). Windows already in the database are skipped. Returns what happened to each window.',
    })
    @ApiQuery({ name: 'years', required: false, type: Number })
    backfillHistory(@Query('years') years?: string) {
        const n = years === undefined ? 5 : Number(years);
        if (!Number.isInteger(n) || n < 1 || n > 10) {
            throw new BadRequestException(
                'years must be a whole number from 1 to 10.',
            );
        }
        return this.marketDataService.backfillHistory(n);
    }

    @Post('seed-history')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
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
