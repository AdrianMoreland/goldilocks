import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    OrderListQuerySchema,
    OrderStepEnum,
    SheetTaskListQuerySchema,
    type Handover,
    type OrderDetail,
    type OrderListResponse,
    type ReconcileResult,
    type SheetTask,
} from '@goldilocks/shared-types';
import { OrdersService } from './orders.service';
import { SheetTasksService } from './sheet-tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    RecordStepRequestDto,
    SaveHandoverRequestDto,
} from '../../common/dto/dtos';

/** Orders from quote to collection. Admin only for now; brokers and managers get it in a later phase. */
@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class OrdersController {
    constructor(private readonly service: OrdersService) {}

    @Get()
    @ApiOperation({
        summary: 'Orders with their lifecycle, next action and queue counts',
    })
    list(@Query() query: Record<string, string>): Promise<OrderListResponse> {
        const parsed = OrderListQuerySchema.safeParse(query);
        if (!parsed.success)
            throw new BadRequestException('Invalid order filter');
        return this.service.list(parsed.data);
    }

    @Get(':id')
    @ApiOperation({ summary: 'One order with its steps and sheet tasks' })
    get(@Param('id', ParseIntPipe) id: number): Promise<OrderDetail> {
        return this.service.get(id);
    }

    @Post(':id/steps/:step')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Record a step. Creates the sheet tasks that go with it',
    })
    step(
        @Param('id', ParseIntPipe) id: number,
        @Param('step') step: string,
        @Body() body: RecordStepRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<OrderDetail> {
        const parsed = OrderStepEnum.safeParse(step);
        if (!parsed.success) throw new BadRequestException('Unknown step');
        return this.service.recordStep(id, parsed.data, body, req.user.email);
    }
}

/** The changes staff must make by hand in the sheets. */
@ApiTags('sheet-tasks')
@ApiBearerAuth()
@Controller('sheet-tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SheetTasksController {
    constructor(private readonly service: SheetTasksService) {}

    @Get()
    @ApiOperation({ summary: 'Sheet tasks, open first' })
    list(@Query() query: Record<string, string>): Promise<SheetTask[]> {
        const parsed = SheetTaskListQuerySchema.safeParse(query);
        if (!parsed.success) throw new BadRequestException('Invalid filter');
        return this.service.list(parsed.data);
    }

    // Literal route before `:id`.
    @Post('reconcile')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Close tasks that the imported trades now show as done',
    })
    reconcile(@Req() req: RequestWithUser): Promise<ReconcileResult> {
        return this.service.reconcile(req.user.email);
    }

    @Post(':id/done')
    @HttpCode(200)
    @ApiOperation({ summary: 'Tick a task as done in the sheet' })
    done(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUser,
    ): Promise<SheetTask> {
        return this.service.complete(id, req.user.email);
    }
}

/** The note one person leaves for the next when they close the day. */
@ApiTags('handover')
@ApiBearerAuth()
@Controller('handover')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class HandoverController {
    constructor(private readonly service: SheetTasksService) {}

    @Get()
    @ApiOperation({ summary: 'The latest handover note' })
    latest(): Promise<Handover | null> {
        return this.service.latestHandover();
    }

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Save the handover note and close the day' })
    save(
        @Body() body: SaveHandoverRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<Handover> {
        return this.service.saveHandover(body.note, req.user.email);
    }
}
