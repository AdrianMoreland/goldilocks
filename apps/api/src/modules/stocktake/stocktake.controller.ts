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
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    BcItemsResponse,
    Discrepancy,
    ImportJournalResult,
    Stocktake,
    StocktakeDetail,
    StocktakeLine,
} from '@goldilocks/shared-types';
import { StocktakeService } from './stocktake.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    CreateDiscrepancyRequestDto,
    CreateStocktakeRequestDto,
    ImportJournalRequestDto,
    LinkBcItemRequestDto,
    UpdateDiscrepancyRequestDto,
    UpdateStocktakeLineRequestDto,
    UpdateStocktakeRequestDto,
} from '../../common/dto/dtos';

/** Month-end stocktake. Admin and manager only (the owner's decision); the guard is the boundary. */
@ApiTags('stocktake')
@ApiBearerAuth()
@Controller('stocktake')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class StocktakeController {
    constructor(private readonly service: StocktakeService) {}

    @Get()
    @ApiOperation({ summary: 'List stocktakes' })
    list(): Promise<Stocktake[]> {
        return this.service.list();
    }

    // Literal routes before `:id` so they are not parsed as an id.
    @Get('bc-items')
    @ApiOperation({
        summary: 'BC item codes seen so far, with their product link',
    })
    listBcItems(): Promise<BcItemsResponse> {
        return this.service.listBcItems();
    }

    @Put('bc-items/:itemNo/product')
    @HttpCode(204)
    @ApiOperation({
        summary: 'Link (or unlink with null) a BC item to a Goldilocks product',
    })
    async linkBcItem(
        @Param('itemNo') itemNo: string,
        @Body() body: LinkBcItemRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<void> {
        await this.service.linkBcItem(itemNo, body.productId, req.user.email);
    }

    @Post()
    @ApiOperation({ summary: 'Start a stocktake' })
    create(
        @Body() body: CreateStocktakeRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<Stocktake> {
        return this.service.create(body, req.user.email);
    }

    @Get(':id')
    @ApiOperation({ summary: 'One stocktake with its lines and discrepancies' })
    get(@Param('id', ParseIntPipe) id: number): Promise<StocktakeDetail> {
        return this.service.get(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update status, people or notes' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateStocktakeRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<Stocktake> {
        return this.service.update(id, body, req.user.email);
    }

    @Post(':id/finalise')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Lock the count. Does not adjust Business Central.',
    })
    finalise(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUser,
    ): Promise<Stocktake> {
        return this.service.finalise(id, req.user.email);
    }

    @Post(':id/import-journal')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Add Physical Inventory Journal lines pasted from Excel (repeat-safe)',
    })
    importJournal(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ImportJournalRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<ImportJournalResult> {
        return this.service.importJournal(id, body.text, req.user.email);
    }

    @Patch(':id/lines/:lineId')
    @ApiOperation({ summary: 'Record a count for one line' })
    updateLine(
        @Param('id', ParseIntPipe) id: number,
        @Param('lineId', ParseIntPipe) lineId: number,
        @Body() body: UpdateStocktakeLineRequestDto,
    ): Promise<StocktakeLine> {
        return this.service.updateLine(id, lineId, body);
    }

    @Post(':id/discrepancies')
    @ApiOperation({ summary: 'Add a discrepancy to the register' })
    addDiscrepancy(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateDiscrepancyRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<Discrepancy> {
        return this.service.addDiscrepancy(id, body, req.user.email);
    }

    @Patch(':id/discrepancies/:discrepancyId')
    @ApiOperation({
        summary:
            'Update a discrepancy; resolved is set separately from the explanation',
    })
    updateDiscrepancy(
        @Param('id', ParseIntPipe) id: number,
        @Param('discrepancyId', ParseIntPipe) discrepancyId: number,
        @Body() body: UpdateDiscrepancyRequestDto,
    ): Promise<Discrepancy> {
        return this.service.updateDiscrepancy(id, discrepancyId, body);
    }

    @Delete(':id/discrepancies/:discrepancyId')
    @HttpCode(204)
    @ApiOperation({ summary: 'Remove a discrepancy entered by mistake' })
    async deleteDiscrepancy(
        @Param('id', ParseIntPipe) id: number,
        @Param('discrepancyId', ParseIntPipe) discrepancyId: number,
    ): Promise<void> {
        await this.service.deleteDiscrepancy(id, discrepancyId);
    }
}
