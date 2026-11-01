import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    TradesheetImportPlan,
    TradesheetImportResult,
} from '@goldilocks/shared-types';
import { TradesheetImportService } from './tradesheet-import.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { TradesheetImportRequestDto } from '../../common/dto/dtos';

/** Monthly trade sheets (roadmap 1.19). Admin only for now. */
@ApiTags('tradesheet-import')
@ApiBearerAuth()
@Controller('tradesheet-import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class TradesheetImportController {
    constructor(private readonly service: TradesheetImportService) {}

    @Post('preview')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'What importing this file would add, change or flag. Writes nothing.',
    })
    preview(
        @Body() body: TradesheetImportRequestDto,
    ): Promise<TradesheetImportPlan> {
        return this.service.preview(body);
    }

    @Post('commit')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Import this file. Reimporting a month updates its rows by reference.',
    })
    commit(
        @Body() body: TradesheetImportRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<TradesheetImportResult> {
        return this.service.commit(body, req.user.email);
    }
}
