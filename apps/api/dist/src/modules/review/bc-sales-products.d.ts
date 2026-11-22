import { type BcSalesProductsPreview, type MetalType } from '@goldilocks/shared-types';
export interface BcItemInput {
    itemNo: string;
    description: string;
    productId: number | null;
    salesProductId: number | null;
}
export interface ExistingSalesProduct {
    name: string;
    metal: string;
    pricingProductId: number | null;
}
export interface CataloguePricingProduct {
    id: number;
    sku: string;
    name: string;
    metalType: MetalType;
}
export declare function genericNormOf(description: string, refineryWords: string | null): string;
export declare function planBcSalesProducts(items: readonly BcItemInput[], catalogue: readonly CataloguePricingProduct[], existing?: readonly ExistingSalesProduct[]): BcSalesProductsPreview;
//# sourceMappingURL=bc-sales-products.d.ts.map