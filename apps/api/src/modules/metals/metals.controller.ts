import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { Throttle } from '@nestjs/throttler';
import { UseInterceptors } from '@nestjs/common';
import { MetalTypeEnum, type MetalType } from '@goldilocks/shared-types';
import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { FetchAttemptService } from './fetch-attempt.service';
import { ALL_METALS } from '../../common/utils/pricing.util';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    FetchAttemptResponseDto,
    FetchLogQueryDto,
    FetchMetricsResponseDto,
    RawSpotPriceResponseDto,
} from '../../common/dto/dtos';

/**
 * Ops-only controller. The frontend gets spot prices via GET /market-data —
 * this controller exists purely for admin-only operational actions: a
 * manual refresh, pausing/resuming the 10-minute price-refresh cron, and
 * clearing the spot-price cache.
 */
@ApiTags('metals')
@Controller('metals')
@Roles('admin')
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class MetalsController {
    constructor(
        private readonly metalsProvider: MetalsProvider,
        private readonly metalsCron: MetalsCron,
        private readonly fetchAttempts: FetchAttemptService,
    ) {}

    // Spends paid vendor quota: limited far below the global ceiling.
    @Throttle({ default: { limit: 6, ttl: 60_000 } })
    @Post('refresh')
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
    @ApiOperation({
        summary:
            'Whether the 10-minute price-refresh cron is currently running (admin)',
    })
    getCronStatus(): { running: boolean } {
        return { running: this.metalsCron.isPriceCronRunning() };
    }

    @Post('cron-toggle')
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
    @ApiParam({ name: 'metal', enum: ALL_METALS })
    @ApiOperation({
        summary: 'Retry a live fetch for one metal (admin)',
        description:
            'The vendor API always returns all four metals in one call — this makes that same call but only stores/reports the one metal retried.',
    })
    @ApiResponse({ status: 200, type: RawSpotPriceResponseDto })
    async retryMetal(
        @Param('metal', new ZodValidationPipe(MetalTypeEnum)) metal: MetalType,
    ): Promise<RawSpotPriceResponseDto> {
        const result = await this.metalsProvider.retryMetal(metal);

        if (!result) {
            throw new NotFoundException(
                `Retry didn't return a usable rate for ${metal} — the vendor API may still be down.`,
            );
        }

        return result;
    }

    @Get('fetch-log')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiOperation({
        summary: 'Recent external-API fetch attempts, newest first (admin)',
    })
    @ApiResponse({ status: 200, type: [FetchAttemptResponseDto] })
    async getFetchLog(
        @Query() { limit }: FetchLogQueryDto,
    ): Promise<FetchAttemptResponseDto[]> {
        return this.fetchAttempts.getRecent(limit);
    }

    @Get('fetch-metrics')
    @ApiOperation({
        summary:
            '24h fetch success rate, avg latency, and cache hit ratio (admin)',
    })
    @ApiResponse({ status: 200, type: FetchMetricsResponseDto })
    async getFetchMetrics(): Promise<FetchMetricsResponseDto> {
        return this.fetchAttempts.getMetrics();
    }
}
