import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { UseInterceptors } from '@nestjs/common';
import { MetalsProvider } from './metals.provider';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SpotPriceResponseDto } from '../../common/dto/dtos';

/**
 * Ops-only controller. The frontend gets spot prices via GET /market-data —
 * this controller exists purely to let an admin force a manual refresh from
 * the external API (e.g. if the cron hasn't run yet, or prices look stale).
 */
@ApiTags('metals')
@Controller('metals')
@UseInterceptors(ZodSerializerInterceptor)
export class MetalsController {
    constructor(private readonly metalsProvider: MetalsProvider) {}

    @Post('refresh')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Force a manual spot-price refresh (admin)',
        description:
            'Bypasses the cron schedule and fetches fresh prices from the external API immediately.',
    })
    @ApiResponse({ status: 200, type: [SpotPriceResponseDto] })
    async refresh(): Promise<SpotPriceResponseDto[]> {
        await this.metalsProvider.fetchAndStore();
        return this.metalsProvider.getAllLatest();
    }

/*
     @Get('metals')
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    @ApiOperation({ summary: 'List all metals (admin, filtered)' })
    async getAllMetals() {
        return this.metalsService.getAllLatest();
    }


@Get('metals/:latest')
    async getLatestSpotPrices(): Promise<Record<MetalType, SpotPriceResponseDto>> {
        return this.metalsService.getSpotMap();
    }

    @Get('metals/:sku')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get metal details' })
    async getOne(@Param('metal') metal: MetalType) {
        return this.metalsService.getLatest(metal);
    }*/
}
