// src/api/products.api.ts
import { useApiClient } from '@/api/api-client';
import { ProductSchema, MessageResponseSchema } from '@goldilocks/shared-types';
import type { CreateProductDto, UpdateProductFullDto } from '../lib/types.ts';

/**
 * Admin product CRUD only. Reading the (priced) product list happens via
 * useMarketData() — GET /market-data — since pricing requires live spot
 * prices that only MarketDataService has access to.
 *
 * NOTE: removed getProductsIncludeInactive / restoreProduct / forceDeleteProduct
 * from the old version of this file — none of them have a backing backend
 * endpoint. `isActive` is currently hardcoded `true` server-side, so there's
 * no soft-delete to restore from yet. Add the backend support first if you
 * want these back.
 */
export function useProductsApi() {
    const client = useApiClient();

    return {
        createProduct: (dto: CreateProductDto) =>
            client.post('/admin/products', dto, ProductSchema),

        updateProduct: (id: number, dto: UpdateProductFullDto) =>
            client.patch(`/admin/products/${id}`, dto, ProductSchema),

        updateStock: (id: number, stockQuantity: number) =>
            client.patch(
                `/admin/products/${id}/stock`,
                { stock_quantity: stockQuantity },
                ProductSchema,
            ),

        deleteProduct: (id: number) =>
            client.del(`/admin/products/${id}`, MessageResponseSchema),
    };
}