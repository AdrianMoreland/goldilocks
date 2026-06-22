import {
    Controller, Get, Post, Param, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller()
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Get('invoices')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'List my invoices (customer)' })
    async getInvoices(
        @Req() req: any,
        @Query('status') status?: string,
        @Query('limit') limit?: number,
    ) {
        return this.invoiceService.getInvoices({
            customer_id: req.user.id,
            status,
            limit: limit || 50,
        });
    }

    @Get('invoices/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get invoice with line items' })
    async getInvoice(@Param('id') id: string) {
        return this.invoiceService.getInvoiceById(id);
    }

    @Post('orders/:orderId/invoice')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Generate invoice for an order' })
    async generateInvoice(@Param('orderId') orderId: string) {
        return this.invoiceService.autoGenerateForOrder(orderId);
    }

    @Get('admin/invoices')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Admin: List all invoices' })
    async adminGetInvoices(
        @Query('status') status?: string,
        @Query('limit') limit?: number,
    ) {
        return this.invoiceService.getInvoices({ status, limit: limit || 100 });
    }
}
