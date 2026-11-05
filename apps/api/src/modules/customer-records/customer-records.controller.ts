import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    CustomerListResponse,
    CustomerProfile,
    InvoiceDetail,
    InvoiceListResponse,
} from '@goldilocks/shared-types';
import { CustomerRecordsService } from './customer-records.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RecordSearchRequestDto } from '../../common/dto/dtos';

/**
 * Customer history, read only. Admin only. Searches are POSTs so a name is never in a URL or a request log, and
 * a customer is opened by number.
 */
@ApiTags('customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CustomersController {
    constructor(private readonly records: CustomerRecordsService) {}

    @Post('search')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Customers, optionally filtered by name. At most 100 per page.',
    })
    search(
        @Body() body: RecordSearchRequestDto,
    ): Promise<CustomerListResponse> {
        return this.records.customers(body);
    }

    @Get(':id')
    @ApiOperation({
        summary:
            'One customer with their orders, invoices, payments and quotes.',
    })
    one(@Param('id', ParseIntPipe) id: number): Promise<CustomerProfile> {
        return this.records.customer(id);
    }
}

/** Zoho invoice history, read only. Admin only. */
@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InvoicesController {
    constructor(private readonly records: CustomerRecordsService) {}

    @Post('search')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Invoices by number, customer or serial. At most 100 per page.',
    })
    search(@Body() body: RecordSearchRequestDto): Promise<InvoiceListResponse> {
        return this.records.invoices(body);
    }

    @Get(':id')
    @ApiOperation({
        summary:
            'One invoice with its lines, serials, payments and matched sales.',
    })
    one(@Param('id', ParseIntPipe) id: number): Promise<InvoiceDetail> {
        return this.records.invoice(id);
    }
}
