import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { UseInterceptors } from '@nestjs/common';
import { MetalsProvider } from './metals.provider';
import { MetalsCron } from './metals.cron';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {RawSpotPriceResponseDto} from '../../common/dto/dtos';

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
    @ApiOperation({ summary: 'Whether the 10-minute price-refresh cron is currently running (admin)' })
    getCronStatus(): { running: boolean } {
        return { running: this.metalsCron.isPriceCronRunning() };
    }

    @Post('cron-toggle')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Pause or resume the 10-minute price-refresh cron (admin)',
        description: 'A manual runtime pause — resets to running on the next restart/redeploy, not a persisted setting.',
    })
    toggleCron(): { running: boolean } {
        const running = this.metalsCron.setPriceCronEnabled(!this.metalsCron.isPriceCronRunning());
        return { running };
    }

    @Post('clear-cache')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Clear the spot-price cache (admin)',
        description: 'Forces the next read of every metal back to the DB/live API instead of whatever is currently cached.',
    })
    async clearCache(): Promise<{ message: string }> {
        await this.metalsProvider.clearCache();
        return { message: 'Spot-price cache cleared.' };
    }
}
