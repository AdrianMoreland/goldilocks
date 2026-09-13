import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    UseGuards,
    NotFoundException,
    Delete,
    ParseIntPipe,
    InternalServerErrorException
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
   /* //  GET /products
    @Get('product')
    async getProducts(@Query('spotPrices') spotPrices: Record<MetalType, number>) {
        // ProductsService uses spotPrices to calculate prices
        return this.service.getProductsWithSpot(spotPrices);
    }

    @Post('recalculate')
    recalculateProducts(
        @Body() overrides: Record<MetalType, number>
    ): Promise<ProductResponseDto[]> {
        return this.service.recalculate(overrides);
    }*/

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
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            const deleted = await this.service.delete(id);

            if (!deleted) {
                throw new NotFoundException(`Producto con ID ${id} no encontrado`);
            }

            return {message: `✅ Producto ${id} eliminado correctamente`};
        } catch (error) {
            console.error('❌ Error al eliminar producto:', error);
            throw new InternalServerErrorException('Error al eliminar el producto');
        }
    }

    /*

        // GET /products/exists
    @Get('exists')
    async existsBySku(@Query('sku') sku?: string) {
        const n = (sku || '').trim();
        if (!n) return {exists: false};
        const existing = await this.service.existsBySku(n);
        if (!existing) return {exists: false};
        const inList = existing.id === 1 ? 2 : 3;
        return {exists: true, in: inList};
    }

        @Get('dashboard/products-with-spot')
    async getProductsWithSpot() {
        return this.service.getProductsWithSpotPackage();
    }

    @Get('products/:id')
    @ApiOperation({summary: 'Get product details'})
    async getProduct(@Param('id') id: number, @Param('metal') metal: any) {
        const product = await this.service.getById(id, metal);
        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return product;
    }
*/
}