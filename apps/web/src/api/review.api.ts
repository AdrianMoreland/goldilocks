import { z } from 'zod';
import { useApiClient } from '@/api/api-client';
import {
    AliasesResponseSchema,
    AliasUsageResponseSchema,
    ApplyPerMetalResultSchema,
    BcSalesProductsApplyResultSchema,
    BcSalesProductsPreviewSchema,
    DuplicatesResponseSchema,
    LinkDecisionResultSchema,
    NameSuggestionAcceptResultSchema,
    NameSuggestionDecisionResultSchema,
    OverAllocatedResponseSchema,
    RelinkResultSchema,
    PricingProductOptionListSchema,
    ReviewLinksResponseSchema,
    ReviewSummarySchema,
    SalesProductListSchema,
    SettleNamesResultSchema,
    SettleResultSchema,
    SalesProductSchema,
    UnresolvedLotsResponseSchema,
    type ApplyPerMetalRequest,
    type BcSalesProductsApplyRequest,
    type CreateSalesProductRequest,
    type LinkDecisionRequest,
    type MapAliasRequest,
    type NameSuggestionAcceptRequest,
    type RelinkRequest,
    type AliasesQuery,
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
        aliases: (view: AliasesQuery['view'], limit: number, offset: number) => client.get(`/review/aliases${page(limit, offset, { view })}`, AliasesResponseSchema),
        /** Up to five example rows of where a name is used; loaded when a row is expanded. */
        aliasUsage: (id: number) => client.get(`/review/aliases/${id}/usage`, AliasUsageResponseSchema),
        /** Gives the unresolved sales and purchases of each chosen metal their product; the name stays undecided. */
        applyPerMetal: (id: number, body: ApplyPerMetalRequest) => client.post(`/review/aliases/${id}/per-metal`, body, ApplyPerMetalResultSchema),
        /** Rescan the product names with the rules. A dry run only counts. */
        rescanNames: (dryRun: boolean) => client.post('/review/product-names/settle', { dryRun }, SettleNamesResultSchema),
        /** Gives existing rows their product from the settled names. A dry run only counts. */
        relinkRows: (body: RelinkRequest) => client.post('/review/product-names/relink', body, RelinkResultSchema),
        /** Each item carries the suggestion the person saw; the server skips a name whose suggestion has changed. */
        acceptNames: (items: NameSuggestionAcceptRequest['items']) => client.post('/review/product-names/accept', { items }, NameSuggestionAcceptResultSchema),
        rejectNames: (ids: number[]) => client.post('/review/product-names/reject', { ids }, NameSuggestionDecisionResultSchema),
        salesProducts: () => client.get('/review/sales-products', SalesProductListSchema),
        pricingProducts: () => client.get('/review/pricing-products', PricingProductOptionListSchema),
        createSalesProduct: (body: CreateSalesProductRequest) => client.post('/review/sales-products', body, SalesProductSchema),
        bcSalesProductsPreview: () => client.get('/review/sales-products/from-bc', BcSalesProductsPreviewSchema),
        bcSalesProductsApply: (body: BcSalesProductsApplyRequest) => client.post('/review/sales-products/from-bc', body, BcSalesProductsApplyResultSchema),
        mapAlias: (id: number, body: MapAliasRequest) => client.post(`/review/aliases/${id}/map`, body, z.object({ id: z.number() })),
    };
}
