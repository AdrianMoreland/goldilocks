import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetalType } from '@goldilocks/shared-types';
import { TradeService } from './trade.service';
import {
    MeltCalculatorRequestDto,
    MeltCalculatorResponseDto,
    TradeBootstrapResponseDto,
    TradeCartRequestDto,
    TradeCartResponseDto,
} from '../../common/dto/dtos';

@ApiTags('trade')
@Controller('trade')
export class TradeController {
    constructor(private readonly tradeService: TradeService) {}

    @Get(':metal/bootstrap')
    @ApiParam({ name: 'metal', enum: ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] })
    @ApiOperation({
        summary: 'Load Trade tab bootstrap data for a metal',
        description:
            'Live spot price, slider bounds, and the tradeable product list for the given metal mode.',
    })
    @ApiResponse({ status: 200, type: TradeBootstrapResponseDto })
    async getBootstrap(@Param('metal') metal: MetalType): Promise<TradeBootstrapResponseDto> {
        return this.tradeService.getBootstrap(metal);
    }

    @Post('cart')
    @ApiOperation({
        summary: 'Price a Trade tab buy/sell cart',
        description:
            'Prices every item in the cart against a shared spot price (live or a custom override), applying each item\'s own premium/discount.',
    })
    @ApiResponse({ status: 200, type: TradeCartResponseDto })
    async calculateCart(@Body() body: TradeCartRequestDto): Promise<TradeCartResponseDto> {
        return this.tradeService.calculateCart(body);
    }

    @Post('melt')
    @ApiOperation({
        summary: 'Calculate melt/scrap value',
        description: 'Gold and silver only — Merrion Gold does not melt-buy platinum/palladium.',
    })
    @ApiResponse({ status: 200, type: MeltCalculatorResponseDto })
    async calculateMelt(@Body() body: MeltCalculatorRequestDto): Promise<MeltCalculatorResponseDto> {
        return this.tradeService.calculateMelt(body);
    }
}
