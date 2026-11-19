import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    SheetApplyItem,
    SheetApplyPreview,
    SheetApplyResult,
} from '@goldilocks/shared-types';
import { SheetApplyService } from './sheet-apply.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ResolveSheetApplicationRequestDto } from '../../common/dto/dtos';

/** Applying committed tradesheet rows to live stock. Preview and apply are admin only; settling a row is branch-scoped. */
@ApiTags('live-stock')
@ApiBearerAuth()
@Controller('live-stock/sheet')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SheetApplyController {
    constructor(private readonly service: SheetApplyService) {}

    @Get('preview')
    @ApiOperation({ summary: 'Admin: what applying the sheet would change' })
    preview(@Req() req: RequestWithUser): Promise<SheetApplyPreview> {
        return this.service.preview(req.user);
    }

    @Post('apply')
    @HttpCode(200)
    @ApiOperation({ summary: 'Admin: apply the clear rows, park the rest' })
    apply(@Req() req: RequestWithUser): Promise<SheetApplyResult> {
        return this.service.apply(req.user);
    }

    @Get('pending')
    @ApiOperation({ summary: 'Rows waiting for a decision' })
    pending(@Req() req: RequestWithUser): Promise<SheetApplyItem[]> {
        return this.service.pending(req.user);
    }

    @Post('applications/:id/resolve')
    @HttpCode(200)
    @ApiOperation({ summary: 'Settle a waiting row' })
    resolve(
        @Req() req: RequestWithUser,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ResolveSheetApplicationRequestDto,
    ): Promise<{ status: string }> {
        return this.service.resolve(req.user, id, body);
    }
}
