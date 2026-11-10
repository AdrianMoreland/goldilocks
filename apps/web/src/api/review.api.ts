import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    AliasesResponseSchema,
    BcSalesProductsApplyResultSchema,
    BcSalesProductsPreviewSchema,
    DuplicatesResponseSchema,
    LinkDecisionResultSchema,
    OverAllocatedResponseSchema,
    PricingProductOptionListSchema,
    ReviewLinksResponseSchema,
    ReviewSummarySchema,
    SalesProductListSchema,
    SettleResultSchema,
    SalesProductSchema,
    UnresolvedLotsResponseSchema,
    type BcSalesProductsApplyRequest,
    type CreateSalesProductRequest,
    type LinkDecisionRequest,
    type MapAliasRequest,
} from '@goldilocks/shared-types';

const page = (limit: number, offset: number, extra: Record<string, string | undefined> = {}) => {
    const p = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    return `?${p.toString()}`;
};

/** Review queues: what the import could not settle by itself. Admin only on the server. */
export function useReviewApi() {
    const client = useApiClient();
    return {
        summary: () => client.get('/review/summary', ReviewSummarySchema),
        links: (type: string | undefined, limit: number, offset: number) => client.get(`/review/links${page(limit, offset, { type })}`, ReviewLinksResponseSchema),
        decide: (body: LinkDecisionRequest) => client.post('/review/links/decide', body, LinkDecisionResultSchema),
        settle: () => client.post('/review/links/settle', {}, SettleResultSchema),
        overAllocated: (limit: number, offset: number) => client.get(`/review/over-allocated${page(limit, offset)}`, OverAllocatedResponseSchema),
        unresolvedLots: (limit: number, offset: number) => client.get(`/review/unresolved-lots${page(limit, offset)}`, UnresolvedLotsResponseSchema),
        duplicates: (limit: number, offset: number) => client.get(`/review/duplicates${page(limit, offset)}`, DuplicatesResponseSchema),
        aliases: (limit: number, offset: number) => client.get(`/review/aliases${page(limit, offset)}`, AliasesResponseSchema),
        salesProducts: () => client.get('/review/sales-products', SalesProductListSchema),
        pricingProducts: () => client.get('/review/pricing-products', PricingProductOptionListSchema),
        createSalesProduct: (body: CreateSalesProductRequest) => client.post('/review/sales-products', body, SalesProductSchema),
        bcSalesProductsPreview: () => client.get('/review/sales-products/from-bc', BcSalesProductsPreviewSchema),
        bcSalesProductsApply: (body: BcSalesProductsApplyRequest) => client.post('/review/sales-products/from-bc', body, BcSalesProductsApplyResultSchema),
        mapAlias: (id: number, body: MapAliasRequest) => client.post(`/review/aliases/${id}/map`, body, z.object({ id: z.number() })),
    };
}
