// Re-export shared types
export type {
    Product,
    Products,
    SpotPrice,
    HistoricSpot,
    MarketDataResponse,
    ProductMapDTO,
    CreateProductDto,
    UpdateProductFullDto,
    MetalType,
} from '@goldilocks/shared-types';

export {
    MarketDataResponseSchema,
} from '@goldilocks/shared-types';

// Frontend-specific type for filtering (includes 'all')
import type { MetalType as MT } from '@goldilocks/shared-types';
export type MetalTypeFilter = MT | 'all';
export type SpotOverrideRequest = Partial<Record<MT, number>>;
