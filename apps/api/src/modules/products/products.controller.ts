import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    UseGuards,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiBearerAuth, ApiResponse} from '@nestjs/swagger';
import {ProductsService} from './products.service';
import {JwtAuthGuard} from '../../common/guards/jwt-auth.guard';
import {RolesGuard} from "../../common/guards/roles.guard";
import {Roles} from "../../common/decorators/roles.decorator";
import {CreateProductDto, ProductResponseDto, UpdateProductDto} from "../../common/dto/dtos";
import {RawProduct} from "@goldilocks/shared-types";

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {
    }

    // --- Public endpoints ---
    @ApiOperation({
        summary: 'Get All Products',
        description: 'Get a list of all products.',
    })
    @ApiResponse({
        status: 200,
        description: 'Products retrieved successfully',
        type: ProductResponseDto,
    })
    @Get('products')
    async getAll(): Promise<RawProduct[]> {
        return this.service.getRawProducts();
    }

    @ApiOperation({summary: 'Get a product by id'})
    @ApiResponse({status: 200, description: 'Product retrieved successfully', type: ProductResponseDto})
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number, @Param('metal') metal: any): Promise<ProductResponseDto> {
        return this.service.getById(id, metal);
    }

    // --- Admin endpoints ---
    @Post('admin/products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Create a product (admin)'})
    async createProduct(@Body() body: CreateProductDto) {
        return this.service.create(body);
    }

    @Patch('admin/products/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Update a product (admin)'})
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto) {
        return this.service.update(id, body);
    }

    @Patch('admin/products/:id/stock')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Update product stock (admin)'})
    async updateStock(@Param('id', ParseIntPipe) id: number, @Body() body: { stock_quantity: number }) {
        return this.service.updateStock(id, body.stock_quantity);
    }

    // 🗑️ DELETE /products/:id
    @ApiOperation({summary: 'Delete a product (admin)'})
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async delete(@Param('id', ParseIntPipe) id: number) {
        // service.delete() already throws NotFoundException for a missing
        // product, and the global PrismaExceptionFilter handles any raw
        // Prisma error (e.g. a P2025 race) — nothing left for this handler
        // to catch and re-wrap, so any failure here is genuinely unexpected
        // and correctly surfaces as a 500.
        await this.service.delete(id);
        return {message: `✅ Producto ${id} eliminado correctamente`};
    }
}