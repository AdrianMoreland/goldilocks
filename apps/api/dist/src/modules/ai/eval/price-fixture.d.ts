import type { MetalType, Product } from '@goldilocks/shared-types';
import type { MarketDataService } from '../../market-data/market-data.service';
export declare const FIXTURE_PRODUCTS: Product[];
export declare function fixtureProduct(name: string, metal?: MetalType): Product;
export declare function fixtureProductAt(name: string, overrides: Partial<Record<MetalType, number>>): Product;
export declare function figure(amount: number): RegExp;
export declare function fixtureMarketData(now?: Date): MarketDataService;
export declare const FIXTURE_SPOT: Record<"GOLD" | "SILVER" | "PLATINUM" | "PALLADIUM", number>;
//# sourceMappingURL=price-fixture.d.ts.map