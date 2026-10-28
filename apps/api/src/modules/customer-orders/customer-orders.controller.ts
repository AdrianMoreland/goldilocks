import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    CustomerOrderStatusEnum,
    type CustomerOrder,
    type ExpectedCustomerStockResponse,
    type ImportCustomerOrdersResult,
} from '@goldilocks/shared-types';
import { CustomerOrdersService } from './customer-orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    AddEvidenceRequestDto,
    CreateCustomerOrderRequestDto,
    ImportCustomerOrdersRequestDto,
    UpdateCustomerOrderRequestDto,
} from '../../common/dto/dtos';

/** Goods held for customers (replaces the Customer Orders sheet). Admin and manager only. */
@ApiTags('customer-orders')
@ApiBearerAuth()
@Controller('customer-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class CustomerOrdersController {
    constructor(private readonly service: CustomerOrdersService) {}

    @Get()
    @ApiOperation({
        summary: 'List customer order items, optionally by status or branch',
    })
    list(
        @Query('status') status?: string,
        @Query('locationCode') locationCode?: string,
    ): Promise<CustomerOrder[]> {
        const parsed = CustomerOrderStatusEnum.safeParse(status);
        return this.service.list({
            status: parsed.success ? parsed.data : undefined,
            locationCode: locationCode || undefined,
        });
    }

    // Literal routes before `:id`.
    @Get('expected-stock')
    @ApiOperation({
        summary: 'Items that should physically be in each branch for customers',
    })
    expectedStock(): Promise<ExpectedCustomerStockResponse> {
        return this.service.expectedStock();
    }

    @Post('import')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Paste rows from the Customer Orders sheet (repeat-safe)',
    })
    importSheet(
        @Body() body: ImportCustomerOrdersRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<ImportCustomerOrdersResult> {
        return this.service.importSheet(body, req.user.email);
    }

    @Post()
    @ApiOperation({ summary: 'Add a customer order item' })
    create(
        @Body() body: CreateCustomerOrderRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<CustomerOrder> {
        return this.service.create(body, req.user.email);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Change status or details' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCustomerOrderRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<CustomerOrder> {
        return this.service.update(id, body, req.user.email);
    }

    @Post(':id/evidence')
    @ApiOperation({
        summary: 'Log where a collection claim came from (append-only)',
    })
    addEvidence(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AddEvidenceRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<CustomerOrder> {
        return this.service.addEvidence(id, body, req.user.email);
    }
}
