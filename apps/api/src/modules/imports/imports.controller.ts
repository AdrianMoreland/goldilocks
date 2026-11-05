import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    BcAwaitingResult,
    ImportBatchSummary,
    WorkbookChunkResult,
} from '@goldilocks/shared-types';
import { WorkbookImportService } from './workbook-import.service';
import { BcAwaitingImportService } from './bc-awaiting-import.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    BcAwaitingRequestDto,
    WorkbookChunkRequestDto,
} from '../../common/dto/dtos';

/** The assembled import workbook (Zoho, Business Central, tradesheets), one table per request. Admin only. */
@ApiTags('imports')
@ApiBearerAuth()
@Controller('imports/workbook')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ImportsController {
    constructor(private readonly workbook: WorkbookImportService) {}

    @Get('batches')
    @ApiOperation({ summary: 'The last workbook imports, newest first.' })
    batches(): Promise<ImportBatchSummary[]> {
        return this.workbook.recentBatches();
    }

    @Post('preview')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'What this chunk would add, change or leave alone. Writes nothing.',
    })
    preview(
        @Body() body: WorkbookChunkRequestDto,
    ): Promise<WorkbookChunkResult> {
        return this.workbook.preview(body);
    }

    @Post('commit')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Import this chunk. Rows are upserted by key, so sending a file twice changes nothing.',
    })
    commit(
        @Body() body: WorkbookChunkRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<WorkbookChunkResult> {
        return this.workbook.commit(body, req.user.email);
    }
}

/** The Business Central "Orders Awaiting Collection" report: orders missing from a newer report are posted. Admin only. */
@ApiTags('imports')
@ApiBearerAuth()
@Controller('imports/bc-awaiting')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class BcAwaitingController {
    constructor(private readonly bc: BcAwaitingImportService) {}

    @Post('preview')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Which orders would be posted by this report. Writes nothing.',
    })
    preview(@Body() body: BcAwaitingRequestDto): Promise<BcAwaitingResult> {
        return this.bc.preview(body);
    }

    @Post('commit')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Import the whole report; orders no longer in it get a POSTED step.',
    })
    commit(
        @Body() body: BcAwaitingRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<BcAwaitingResult> {
        return this.bc.commit(body, req.user.email);
    }
}
