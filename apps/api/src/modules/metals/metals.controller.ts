import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { UseInterceptors } from '@nestjs/common';
import type { MetalType } from '@goldilocks/shared-types';
import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { FetchAttemptService } from './fetch-attempt.service';
import { ALL_METALS } from '../../common/utils/pricing.util';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    FetchAttemptResponseDto,
    FetchMetricsResponseDto,
    RawSpotPriceResponseDto,
} from '../../common/dto/dtos';

function parseMetal(value: string): MetalType {
    const metal = value.toUpperCase();
    if (!ALL_METALS.includes(metal as MetalType)) {
        throw new BadRequestException(
            `Unknown metal "${value}" — expected one of ${ALL_METALS.join(', ')}`,
        );
    }
    return metal as MetalType;
}

/**
 * Ops-only controller. The frontend gets spot prices via GET /market-data —
 * this controller exists purely for admin-only operational actions: a
 * manual refresh, pausing/resuming the 10-minute price-refresh cron, and
 * clearing the spot-price cache.
 */
@ApiTags('metals')
@Controller('metals')
@UseInterceptors(ZodSerializerInterceptor)
export class MetalsController {
    constructor(
        private readonly metalsProvider: MetalsProvider,
        private readonly metalsCron: MetalsCron,
        private readonly fetchAttempts: FetchAttemptService,
    ) {}

    @Post('refresh')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Force a manual spot-price refresh (admin)',
        description:
            'Bypasses the cron schedule and fetches fresh prices from the external API immediately.',
    })
    @ApiResponse({ status: 200, type: [RawSpotPriceResponseDto] })
    async refresh(): Promise<RawSpotPriceResponseDto[]> {
        const { prices } = await this.metalsProvider.refreshAll();
        return prices;
    }

    @Get('cron-status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary:
            'Whether the 10-minute price-refresh cron is currently running (admin)',
    })
    getCronStatus(): { running: boolean } {
        return { running: this.metalsCron.isPriceCronRunning() };
    }

    @Post('cron-toggle')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Pause or resume the 10-minute price-refresh cron (admin)',
        description:
            'A manual runtime pause — resets to running on the next restart/redeploy, not a persisted setting.',
    })
    async toggleCron(): Promise<{ running: boolean }> {
        const running = await this.metalsCron.setPriceCronEnabled(
            !this.metalsCron.isPriceCronRunning(),
        );
        return { running };
    }

    @Post('clear-cache')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Clear the spot-price cache (admin)',
        description:
            'Forces the next read of every metal back to the DB/live API instead of whatever is currently cached.',
    })
    async clearCache(): Promise<{ message: string }> {
        await this.metalsProvider.clearCache();
        return { message: 'Spot-price cache cleared.' };
    }

    @Post(':metal/retry')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiParam({ name: 'metal', enum: ALL_METALS })
    @ApiOperation({
        summary: 'Retry a live fetch for one metal (admin)',
        description:
            'The vendor API always returns all four metals in one call — this makes that same call but only stores/reports the one metal retried.',
    })
    @ApiResponse({ status: 200, type: RawSpotPriceResponseDto })
    async retryMetal(
        @Param('metal') metalParam: string,
    ): Promise<RawSpotPriceResponseDto> {
        const metal = parseMetal(metalParam);
        const result = await this.metalsProvider.retryMetal(metal);

        if (!result) {
            throw new NotFoundException(
                `Retry didn't return a usable rate for ${metal} — the vendor API may still be down.`,
            );
        }

        return result;
    }

    @Get('fetch-log')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOperation({
        summary: 'Recent external-API fetch attempts, newest first (admin)',
    })
    @ApiResponse({ status: 200, type: [FetchAttemptResponseDto] })
    async getFetchLog(
        @Query('limit') limit?: string,
    ): Promise<FetchAttemptResponseDto[]> {
        const parsed = limit ? Number(limit) : 20;
        const take =
            Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 100) : 20;
        return this.fetchAttempts.getRecent(take);
    }

    @Get('fetch-metrics')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary:
            '24h fetch success rate, avg latency, and cache hit ratio (admin)',
    })
    @ApiResponse({ status: 200, type: FetchMetricsResponseDto })
    async getFetchMetrics(): Promise<FetchMetricsResponseDto> {
        return this.fetchAttempts.getMetrics();
    }
}
