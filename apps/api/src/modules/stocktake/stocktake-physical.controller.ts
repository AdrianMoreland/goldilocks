import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    CarryForwardResult,
    ImportPhysicalResult,
    PhysicalRegister,
    StocktakeBar,
    StocktakeCoin,
} from '@goldilocks/shared-types';
import { StocktakePhysicalService } from './stocktake-physical.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    AddBarRequestDto,
    AddCoinRequestDto,
    CarryForwardRequestDto,
    ImportPhysicalRequestDto,
    UpdateBarRequestDto,
    UpdateCoinRequestDto,
} from '../../common/dto/dtos';

/** Bars and coin counts for a stocktake, and carrying the last closing position forward. Admin and manager only. */
@ApiTags('stocktake')
@ApiBearerAuth()
@Controller('stocktake/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class StocktakePhysicalController {
    constructor(private readonly service: StocktakePhysicalService) {}

    @Get('register')
    @ApiOperation({ summary: 'Bars and coin counts for one stocktake' })
    register(@Param('id', ParseIntPipe) id: number): Promise<PhysicalRegister> {
        return this.service.getRegister(id);
    }

    @Post('carry-forward')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Copy the last finalised closing position in as unconfirmed (repeat-safe)',
    })
    carryForward(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CarryForwardRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<CarryForwardResult> {
        return this.service.carryForward(
            id,
            body.fromStocktakeId,
            req.user.email,
        );
    }

    @Post('bars/import')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Paste a bar list from the stock workbook (repeat-safe)',
    })
    importBars(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ImportPhysicalRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<ImportPhysicalResult> {
        return this.service.importBars(
            id,
            body.metal,
            body.text,
            req.user.email,
        );
    }

    @Post('bars')
    @ApiOperation({ summary: 'Add a bar found on the shelf' })
    addBar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AddBarRequestDto,
    ): Promise<StocktakeBar> {
        return this.service.addBar(id, body);
    }

    @Patch('bars/:barId')
    @ApiOperation({
        summary: 'Confirm a bar, mark it gone, or correct its details',
    })
    updateBar(
        @Param('id', ParseIntPipe) id: number,
        @Param('barId', ParseIntPipe) barId: number,
        @Body() body: UpdateBarRequestDto,
    ): Promise<StocktakeBar> {
        return this.service.updateBar(id, barId, body);
    }

    @Delete('bars/:barId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a bar added by mistake' })
    async deleteBar(
        @Param('id', ParseIntPipe) id: number,
        @Param('barId', ParseIntPipe) barId: number,
    ): Promise<void> {
        await this.service.deleteBar(id, barId);
    }

    @Post('coins/import')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Paste coin quantities as the previous position (repeat-safe)',
    })
    importCoins(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ImportPhysicalRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<ImportPhysicalResult> {
        return this.service.importCoins(
            id,
            body.metal,
            body.text,
            req.user.email,
        );
    }

    @Post('coins')
    @ApiOperation({ summary: 'Add a coin line' })
    addCoin(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AddCoinRequestDto,
    ): Promise<StocktakeCoin> {
        return this.service.addCoin(id, body);
    }

    @Patch('coins/:coinId')
    @ApiOperation({ summary: 'Record the counted quantity for a coin line' })
    updateCoin(
        @Param('id', ParseIntPipe) id: number,
        @Param('coinId', ParseIntPipe) coinId: number,
        @Body() body: UpdateCoinRequestDto,
    ): Promise<StocktakeCoin> {
        return this.service.updateCoin(id, coinId, body);
    }
}
