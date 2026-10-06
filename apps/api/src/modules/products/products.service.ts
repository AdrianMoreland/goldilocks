// src/products/products.service.ts
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { RawProduct } from '@goldilocks/shared-types';
import { CreateProductDto, UpdateProductDto } from '../../common/dto/dtos';
import { ProductsProvider } from './products.provider';

@Injectable()
export class ProductsService {
    constructor(private readonly productsProvider: ProductsProvider) {}

    /**
     * Raw products, no pricing applied: the module's read API for other
     * modules and for admin views. Priced products come from MarketDataService.
     */
    async getRawProducts(): Promise<RawProduct[]> {
        return this.productsProvider.getAll();
    }

    /** One live product, or null when it does not exist. For callers that word their own not-found error. */
    async findById(id: number): Promise<RawProduct | null> {
        return this.productsProvider.getById(id);
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

    async create(dto: CreateProductDto, actor: string) {
        await this.assertSkuAvailable(dto.sku);
        return this.productsProvider.create(dto, actor);
    }

    async update(id: number, dto: Partial<UpdateProductDto>, actor: string) {
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
        return this.productsProvider.update(
            id,
            {
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
            },
            actor,
        );
    }

    /** Soft delete — the row is kept (and can be restored), just hidden everywhere. */
    async delete(id: number, actor: string) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.softDelete(id, actor);
    }

    async getDeleted() {
        return this.productsProvider.getDeleted();
    }

    async restore(id: number, actor: string) {
        const existing = await this.productsProvider.getDeletedById(id);
        if (!existing) {
            throw new NotFoundException('Deleted product not found');
        }
        return this.productsProvider.restore(id, actor);
    }

    async updateStock(id: number, stockQuantity: number, actor: string) {
        const existing = await this.productsProvider.getById(id);
        if (!existing) {
            throw new NotFoundException('Product not found');
        }
        return this.productsProvider.updateStock(id, stockQuantity, actor);
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
