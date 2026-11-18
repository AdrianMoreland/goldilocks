import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    LiveStockBoardQuerySchema,
    type LiveBaselinePreview,
    type LiveBaselineResult,
    type LiveStockBoard,
    type LiveStockBranch,
    type LiveStockBranchesResponse,
    type LiveStockMovement,
} from '@goldilocks/shared-types';
import { LiveStockService } from './live-stock.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
    AddLiveStockBarRequestDto,
    AdjustLiveStockRequestDto,
    CreateLiveStockLineRequestDto,
    LinkLiveStockBranchRequestDto,
    LiveBaselineRequestDto,
    LowThresholdRequestDto,
    SetLiveStockBarStatusRequestDto,
    TransferLiveStockRequestDto,
} from '../../common/dto/dtos';

/**
 * Live stock counts per branch. Any signed-in person reads every branch; the service decides who edits (own branch, or
 * an admin anywhere), because that rule depends on the line being changed.
 */
@ApiTags('live-stock')
@ApiBearerAuth()
@Controller('live-stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiveStockController {
    constructor(private readonly service: LiveStockService) {}

    @Get('branches')
    @ApiOperation({ summary: 'Stock locations and which the caller may edit' })
    branches(@Req() req: RequestWithUser): Promise<LiveStockBranchesResponse> {
        return this.service.branches(req.user);
    }

    @Get('board')
    @ApiOperation({ summary: 'Lines and serials for one branch and metal' })
    board(
        @Req() req: RequestWithUser,
        @Query() query: Record<string, string>,
    ): Promise<LiveStockBoard> {
        return this.service.board(
            req.user,
            LiveStockBoardQuerySchema.parse(query),
        );
    }

    @Get('lines/:id/history')
    @ApiOperation({ summary: 'Newest changes on a line, with their source' })
    history(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<LiveStockMovement[]> {
        return this.service.history(id);
    }

    @Post('lines')
    @ApiOperation({ summary: 'Add a stock line (and an opening count)' })
    createLine(
        @Req() req: RequestWithUser,
        @Body() body: CreateLiveStockLineRequestDto,
    ): Promise<{ id: number }> {
        return this.service.createLine(req.user, body);
    }

    @Post('lines/:id/adjust')
    @HttpCode(200)
    @ApiOperation({ summary: 'Change a count by a step or to a typed value' })
    adjust(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AdjustLiveStockRequestDto,
    ): Promise<{ qty: number; movementId: number }> {
        return this.service.adjust(req.user, id, body);
    }

    @Post('lines/:id/transfer')
    @HttpCode(200)
    @ApiOperation({ summary: 'Move stock to another branch' })
    transfer(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: TransferLiveStockRequestDto,
    ): Promise<{ fromQty: number; toQty: number }> {
        return this.service.transfer(req.user, id, body);
    }

    @Patch('lines/:id/threshold')
    @HttpCode(204)
    @ApiOperation({ summary: 'Set or clear the low-stock threshold' })
    async threshold(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: LowThresholdRequestDto,
    ): Promise<void> {
        await this.service.setThreshold(req.user, id, body.lowThreshold);
    }

    @Post('lines/:id/bars')
    @ApiOperation({ summary: 'Add a serialled bar to a bar line' })
    addBar(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AddLiveStockBarRequestDto,
    ): Promise<{ id: number; qty: number }> {
        return this.service.addBar(req.user, id, body);
    }

    @Post('bars/:id/status')
    @HttpCode(200)
    @ApiOperation({ summary: 'Mark a bar sold, removed or back in stock' })
    barStatus(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: SetLiveStockBarStatusRequestDto,
    ): Promise<{ qty: number }> {
        return this.service.setBarStatus(req.user, id, body);
    }

    @Post('movements/:id/undo')
    @HttpCode(200)
    @ApiOperation({ summary: "Undo a line's latest manual change" })
    undo(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ qty: number }> {
        return this.service.undo(req.user, id);
    }

    @Put('branches/:code/link')
    @ApiOperation({ summary: 'Admin: link a stock location to an app branch' })
    link(
        @Req() req: RequestWithUser,
        @Param('code') code: string,
        @Body() body: LinkLiveStockBranchRequestDto,
    ): Promise<LiveStockBranch> {
        return this.service.linkBranch(req.user, code.toUpperCase(), body);
    }

    @Post('baseline/preview')
    @HttpCode(200)
    @ApiOperation({ summary: 'Admin: what loading the stock sheet would do' })
    previewBaseline(
        @Req() req: RequestWithUser,
        @Body() body: LiveBaselineRequestDto,
    ): Promise<LiveBaselinePreview> {
        return this.service.previewBaseline(req.user, body);
    }

    @Post('baseline')
    @HttpCode(200)
    @ApiOperation({ summary: 'Admin: load the stock sheet as the baseline' })
    commitBaseline(
        @Req() req: RequestWithUser,
        @Body() body: LiveBaselineRequestDto,
    ): Promise<LiveBaselineResult> {
        return this.service.commitBaseline(req.user, body);
    }
}
