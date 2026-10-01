// src/products/products.service.ts
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { MetalType } from '../../../prisma/generated/enums';
import { Product, RawProduct } from '@goldilocks/shared-types';
import { CreateProductDto, UpdateProductDto } from '../../common/dto/dtos';
import { ProductsProvider } from './products.provider';
import {
    calculateProductPrice,
    ZERO_SPOT_MAP,
} from '../../common/utils/pricing.util';

@Injectable()
export class ProductsService {
    constructor(private readonly productsProvider: ProductsProvider) {}

    /**
     * Priced products. Caller (MarketDataService, typically) supplies spotMap.
     * If omitted, prices default to 0 rather than silently fetching live spot.
     */
    async getProducts(
        spotMap: Record<MetalType, number> = ZERO_SPOT_MAP,
    ): Promise<Product[]> {
        const rawProducts = await this.productsProvider.getAll();
        return rawProducts.map((p) => calculateProductPrice(p, spotMap));
    }

    /**
     * Raw products, no pricing applied. Useful for admin views/CRUD.
     */
    async getRawProducts() {
        return this.productsProvider.getAll();
    }

    /**
     * One product as stored. Pricing needs live spot, which this module is
     * deliberately not allowed to know about (see ProductsModule) — the
     * priced view of every product comes from GET /market-data.
     */
    async getById(id: number): Promise<RawProduct> {
        const raw = await this.productsProvider.getById(id);
        if (!raw) {
            throw new NotFoundException('Product not found');
        }
        return raw;
    }

    async create(dto: CreateProductDto) {
        await this.assertSkuAvailable(dto.sku);
        return this.productsProvider.create(dto);
    }

    async update(id: number, dto: Partial<UpdateProductDto>) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        if (dto.sku && dto.sku.toLowerCase() !== existing.sku.toLowerCase()) {
            await this.assertSkuAvailable(dto.sku);
        }
        // Only the stored columns — the DTO schema also allows calculated
        // fields (priceSell, marketValue, …) that don't exist on the row.
        const {
            name,
            sku,
            metalType,
            weight,
            spreadSell,
            spreadBuy,
            vatRate,
            stock,
            isActive,
            category,
            description,
        } = dto;
        return this.productsProvider.update(id, {
            name,
            sku,
            metalType,
            weight,
            spreadSell,
            spreadBuy,
            vatRate,
            stock,
            isActive,
            category,
            description,
        });
    }

    /** Soft delete — the row is kept (and can be restored), just hidden everywhere. */
    async delete(id: number) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.softDelete(id);
    }

    async getDeleted() {
        return this.productsProvider.getDeleted();
    }

    async restore(id: number) {
        const existing = await this.productsProvider.getDeletedById(id);
        if (!existing) {
            throw new NotFoundException('Deleted product not found');
        }
        return this.productsProvider.restore(id);
    }

    async updateStock(id: number, stockQuantity: number) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.updateStock(id, stockQuantity);
    }

    private async assertSkuAvailable(sku: string) {
        const existing = await this.productsProvider.findBySku(sku);
        if (!existing) return;
        throw new ConflictException(
            existing.deletedAt
                ? 'A deleted product already uses this SKU. Restore it from Deleted products instead.'
                : 'A product with this SKU already exists.',
        );
    }
}
