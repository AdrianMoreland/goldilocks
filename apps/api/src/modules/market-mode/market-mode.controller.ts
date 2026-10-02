import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    MarketModeStateDto,
    UpdateMarketModeRequestDto,
} from '../../common/dto/dtos';
import { MarketModeService } from './market-mode.service';
import type { MarketModeState } from '@goldilocks/shared-types';

@ApiTags('market-mode')
@Controller('market-mode')
export class MarketModeController {
    constructor(private readonly service: MarketModeService) {}

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'The company-wide market mode every user sees' })
    @ApiResponse({ status: 200, type: MarketModeStateDto })
    get(): Promise<MarketModeState> {
        return this.service.get();
    }

    @Put()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'manager')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Set the market mode for everyone (admin or manager)',
    })
    @ApiResponse({ status: 200, type: MarketModeStateDto })
    set(
        @Body() body: UpdateMarketModeRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<MarketModeState> {
        return this.service.set(body, req.user);
    }
}
