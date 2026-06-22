import { Controller, Get, Post, Patch, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";

@ApiTags('orders')
@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('orders')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Place a new order' })
    async placeOrder(@Body() body: any, @Req() req: any) {
        return this.ordersService.placeOrder(req.user?.id, body);
    }

    @Get('orders')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my orders (customer)' })
    async getMyOrders(@Req() req: any, @Query('page') page: number = 1) {
        return this.ordersService.getOrdersByCustomer(req.user?.id, page);
    }

    @Get('orders/:id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get order details' })
    async getOrderById(@Param('id') id: string) {
        return this.ordersService.getOrderById(id);
    }

    @Patch('admin/orders/:id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update order status (admin)' })
    async updateOrderStatus(
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        return this.ordersService.updateOrderStatus(id, body.status);
    }

    @Get('admin/orders')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all orders (admin, filtered)' })
    async getAllOrders(
        @Query('status') status?: string,
        @Query('date') date?: string,
        @Query('page') page: number = 1,
    ) {
        return this.ordersService.getAllOrders({ status, date, page });
    }

    @Get('admin/stats')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin dashboard stats for today' })
    async getAdminStats() {
        return this.ordersService.getAdminStats();
    }
}
