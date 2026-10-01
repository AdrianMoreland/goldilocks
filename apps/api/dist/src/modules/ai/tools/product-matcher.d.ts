import type { MetalType, Product } from '@goldilocks/shared-types';
export interface ProductMatch {
    products: Product[];
    ambiguous: boolean;
}
export declare function parseWeightsGrams(text: string): number[];
export declare function matchProducts(products: Product[], query: string, metal?: MetalType): ProductMatch;
//# sourceMappingURL=product-matcher.d.ts.map