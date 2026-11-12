import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    BcAwaitingResult,
    BcHistoryResult,
    ItemTrace,
    ShippedNotCollectedRow,
    ShippedNotCollectedTasksResult,
    ImportBatchSummary,
    WorkbookChunkResult,
} from '@goldilocks/shared-types';
import { WorkbookImportService } from './workbook-import.service';
import { BcAwaitingImportService } from './bc-awaiting-import.service';
import { BcHistoryImportService } from './bc-history-import.service';
import { ItemTraceService } from './item-trace.service';
import { ShippedNotCollectedService } from './shipped-not-collected.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    BcAwaitingRequestDto,
    BcHistoryRequestDto,
    ItemTraceQueryDto,
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

/** Business Central history: posted shipments, receipts and item ledger entries, and the serial trace built from them. Admin only. */
@ApiTags('imports')
@ApiBearerAuth()
@Controller('imports/bc-history')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class BcHistoryController {
    constructor(
        private readonly bc: BcHistoryImportService,
        private readonly shipped: ShippedNotCollectedService,
    ) {}

    @Get('shipped-not-collected')
    @ApiOperation({
        summary:
            'Sales a posted BC shipment links to that the tradesheet does not show as collected.',
    })
    shippedNotCollected(): Promise<ShippedNotCollectedRow[]> {
        return this.shipped.list();
    }

    @Post('shipped-not-collected/tasks')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Create a "tick Collected" sheet task for each listed sale that has none open.',
    })
    shippedNotCollectedTasks(
        @Req() req: RequestWithUser,
    ): Promise<ShippedNotCollectedTasksResult> {
        return this.shipped.createTasks(req.user.email);
    }

    @Post('preview')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'What these BC lists would add or change, and how many bars and events they give. Writes nothing.',
    })
    preview(@Body() body: BcHistoryRequestDto): Promise<BcHistoryResult> {
        return this.bc.preview(body);
    }

    @Post('commit')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Import the lists. Rows are upserted by their BC number, so sending them twice changes nothing.',
    })
    commit(
        @Body() body: BcHistoryRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<BcHistoryResult> {
        return this.bc.commit(body, req.user.email);
    }
}

/** One bar's history by serial, from the vendor it was bought from to the customer who collected it. */
@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class ItemTraceController {
    constructor(private readonly trace: ItemTraceService) {}

    @Get('trace')
    @ApiOperation({ summary: 'A bar and its events, oldest first.' })
    get(@Query() { serial }: ItemTraceQueryDto): Promise<ItemTrace> {
        return this.trace.trace(serial);
    }
}
