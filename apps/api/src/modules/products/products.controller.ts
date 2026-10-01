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
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    CreateProductDto,
    ProductResponseDto,
    UpdateProductDto,
    UpdateStockRequestDto,
} from '../../common/dto/dtos';
import { RawProduct } from '@goldilocks/shared-types';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

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

    @ApiOperation({
        summary: 'Get a product by id',
        description:
            'The stored product, unpriced. Priced products come from GET /market-data.',
    })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<RawProduct> {
        return this.service.getById(id);
    }

    // --- Admin endpoints ---
    @Post('admin/products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a product (admin)' })
    async createProduct(@Body() body: CreateProductDto) {
        return this.service.create(body);
    }

    @Patch('admin/products/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product (admin)' })
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto,
    ) {
        return this.service.update(id, body);
    }

    // Was guarded by JwtAuthGuard only — any signed-in user could change
    // stock. Now admin-only like every other product write.
    @Patch('admin/products/:id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product stock (admin)' })
    async updateStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateStockRequestDto,
    ) {
        return this.service.updateStock(id, body.stock_quantity);
    }

    @Get('admin/products/deleted')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List soft-deleted products (admin)' })
    async getDeleted() {
        return this.service.getDeleted();
    }

    @Post('admin/products/:id/restore')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Restore a soft-deleted product (admin)' })
    async restore(@Param('id', ParseIntPipe) id: number) {
        return this.service.restore(id);
    }

    @ApiOperation({
        summary:
            'Soft-delete a product (admin) — hidden everywhere, restorable',
    })
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    async delete(@Param('id', ParseIntPipe) id: number) {
        // service.delete() already throws NotFoundException for a missing
        // product, and the global PrismaExceptionFilter handles any raw
        // Prisma error — nothing left for this handler to catch.
        await this.service.delete(id);
        return { message: `Product ${id} deleted` };
    }
}
