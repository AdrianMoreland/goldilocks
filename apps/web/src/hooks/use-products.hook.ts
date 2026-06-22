// src/hooks/use-products.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProductsApi } from '@/api/products.api';
import { queryKeys } from '@/lib/query-keys';

import type { CreateProductDto, UpdateProductFullDto } from '../lib/types.ts';

/**
 * Read concerns moved to useMarketData() — the priced product list is
 * always part of the combined market-data snapshot. This file is now
 * mutations only, and every mutation invalidates marketData.all so the
 * UI refetches the (re-priced) product list after a write.
 */

export function useCreateProduct() {
    const api = useProductsApi();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateProductDto) => api.createProduct(dto),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.marketData.all });
        },
    });
}

export function useUpdateProduct() {
    const api = useProductsApi();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProductFullDto }) =>
            api.updateProduct(id, data),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.marketData.all });
        },
    });
}

export function useUpdateProductStock() {
    const api = useProductsApi();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, stockQuantity }: { id: number; stockQuantity: number }) =>
            api.updateStock(id, stockQuantity),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.marketData.all });
        },
    });
}

export function useDeleteProduct() {
    const api = useProductsApi();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => api.deleteProduct(id),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.marketData.all });
        },
    });
}