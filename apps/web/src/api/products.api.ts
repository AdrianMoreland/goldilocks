import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import type { CreateProductDto } from '@goldilocks/shared-types';

export interface UpdateProductPricingBody {
    spreadSell?: number;
    spreadBuy?: number;
    stock?: number;
    vatRate?: number;
    isActive?: boolean;
}

// The admin create/update endpoints return the raw Prisma row — this app
// only needs to know the call succeeded, so the response isn't validated
// strictly against a full schema here.
const UpdateProductResponseSchema = z.object({ id: z.number() }).passthrough();

/** Admin-only product management — gated server-side by JwtAuthGuard + RolesGuard('admin'). */
export function useProductsApi() {
    const client = useApiClient();

    return {
        updateProduct: (id: number, body: UpdateProductPricingBody) =>
            client.patch(`/products/admin/products/${id}`, body, UpdateProductResponseSchema),
        createProduct: (body: CreateProductDto) =>
            client.post('/products/admin/products', body, UpdateProductResponseSchema),
    };
}
