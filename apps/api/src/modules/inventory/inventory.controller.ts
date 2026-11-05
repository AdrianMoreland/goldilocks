import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    InventoryBarsResponse,
    InventoryCoinsResponse,
    InventoryPosition,
} from '@goldilocks/shared-types';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/** Stock position from the stocktake models. Admin only (bars held for customers show the customer). Read only. */
@ApiTags('inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InventoryController {
    constructor(private readonly inventory: InventoryService) {}

    @Get('position')
    @ApiOperation({
        summary:
            'Bars and coins in the newest stocktake, or the one asked for.',
    })
    position(
        @Query('stocktakeId') stocktakeId?: string,
    ): Promise<InventoryPosition> {
        return this.inventory.position(stocktakeId);
    }

    @Get('bars')
    @ApiOperation({
        summary:
            'Bars by serial, with the open customer order that holds each.',
    })
    bars(
        @Query() query: Record<string, string>,
    ): Promise<InventoryBarsResponse> {
        return this.inventory.bars(query);
    }

    @Get('coins')
    @ApiOperation({ summary: 'Coins by quantity.' })
    coins(
        @Query() query: Record<string, string>,
    ): Promise<InventoryCoinsResponse> {
        return this.inventory.coins(query);
    }
}
