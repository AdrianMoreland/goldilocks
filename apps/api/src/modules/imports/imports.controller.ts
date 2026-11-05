import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { WorkbookChunkResult } from '@goldilocks/shared-types';
import { WorkbookImportService } from './workbook-import.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { WorkbookChunkRequestDto } from '../../common/dto/dtos';

/** The assembled import workbook (Zoho, Business Central, tradesheets), one table per request. Admin only. */
@ApiTags('imports')
@ApiBearerAuth()
@Controller('imports/workbook')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ImportsController {
    constructor(private readonly workbook: WorkbookImportService) {}

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
