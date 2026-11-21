import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    ChatbotAnalytics,
    CustomersAnalytics,
    InventoryAnalytics,
    OpsAnalytics,
    OrdersAnalytics,
    PricingAnalytics,
    SalesAnalytics,
} from '@goldilocks/shared-types';
import { RequiresCapability } from '../../common/decorators/capability.decorator';
import { RequiresPermission } from '../../common/decorators/permission.decorator';
import { AnalyticsQueryDto } from '../../common/dto/dtos';
import { AnalyticsService } from './analytics.service';

/** One route per Analytics tab, each behind that tab's permission. Read-only; cached 5 minutes. */
@ApiTags('analytics')
@ApiBearerAuth()
@RequiresCapability('pricingWorkbook')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analytics: AnalyticsService) {}

    @Get('spot')
    @RequiresPermission('analytics.pricing')
    @ApiOperation({ summary: 'Pricing tab: spot, premiums, market modes' })
    spot(@Query() { preset }: AnalyticsQueryDto): Promise<PricingAnalytics> {
        return this.analytics.pricing(preset);
    }

    @Get('sales')
    @RequiresPermission('analytics.sales')
    @ApiOperation({
        summary: 'Sales & margin tab: profit, margin, products, branches',
    })
    sales(@Query() { preset }: AnalyticsQueryDto): Promise<SalesAnalytics> {
        return this.analytics.sales(preset);
    }

    @Get('orders')
    @RequiresPermission('analytics.orders')
    @ApiOperation({
        summary: 'Orders tab: conversion, step times, waiting orders',
    })
    orders(@Query() { preset }: AnalyticsQueryDto): Promise<OrdersAnalytics> {
        return this.analytics.orders(preset);
    }

    @Get('inventory')
    @RequiresPermission('analytics.inventory')
    @ApiOperation({
        summary: 'Inventory tab: pieces by branch, low lines, movements',
    })
    inventory(
        @Query() { preset }: AnalyticsQueryDto,
    ): Promise<InventoryAnalytics> {
        return this.analytics.inventory(preset);
    }

    @Get('customers')
    @RequiresPermission('analytics.customers')
    @ApiOperation({ summary: 'Customers & invoices tab' })
    customers(
        @Query() { preset }: AnalyticsQueryDto,
    ): Promise<CustomersAnalytics> {
        return this.analytics.customers(preset);
    }

    @Get('ai')
    @RequiresPermission('analytics.chatbot')
    @ApiOperation({
        summary: 'Chatbot tab: questions, outcomes, cost, feedback',
    })
    ai(@Query() { preset }: AnalyticsQueryDto): Promise<ChatbotAnalytics> {
        return this.analytics.chatbot(preset);
    }

    @Get('ops')
    @RequiresPermission('analytics.ops')
    @ApiOperation({ summary: 'Ops tab: price feed and imports' })
    ops(@Query() { preset }: AnalyticsQueryDto): Promise<OpsAnalytics> {
        return this.analytics.ops(preset);
    }
}
