import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import { RawProductSchema, type CreateProductDto, type MetalType, type ProductCategory } from '@goldilocks/shared-types';

/** Every stored product field an admin can change. All optional — send only what changed. */
export interface UpdateProductBody {
    name?: string;
    sku?: string;
    metalType?: MetalType;
    category?: ProductCategory | null;
    weight?: number;
    spreadSell?: number;
    spreadBuy?: number;
    stock?: number;
    vatRate?: number;
    isActive?: boolean;
    description?: string;
}

// The admin create/update endpoints return the raw Prisma row — this app
// only needs to know the call succeeded, so the response isn't validated
// strictly against a full schema here.
const UpdateProductResponseSchema = z.object({ id: z.number() }).passthrough();
const DeleteProductResponseSchema = z.object({ message: z.string() });

export const DeletedProductSchema = RawProductSchema.extend({ deletedAt: z.string() });
export type DeletedProduct = z.infer<typeof DeletedProductSchema>;

/** Admin-only product management — gated server-side by JwtAuthGuard + RolesGuard('admin'). */
export function useProductsApi() {
    const client = useApiClient();

    return {
        updateProduct: (id: number, body: UpdateProductBody) =>
            client.patch(`/products/admin/products/${id}`, body, UpdateProductResponseSchema),
        createProduct: (body: CreateProductDto) =>
            client.post('/products/admin/products', body, UpdateProductResponseSchema),
        /** Soft delete — hidden everywhere, restorable via restoreProduct. */
        deleteProduct: (id: number) => client.del(`/products/${id}`, DeleteProductResponseSchema),
        getDeletedProducts: () => client.get('/products/admin/products/deleted', z.array(DeletedProductSchema)),
        restoreProduct: (id: number) =>
            client.post(`/products/admin/products/${id}/restore`, {}, UpdateProductResponseSchema),
    };
}
