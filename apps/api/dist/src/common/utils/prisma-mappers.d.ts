import { RawProduct, RawSpotPrice } from '@goldilocks/shared-types';
import { Decimal } from '../../../prisma/generated/internal/prismaNamespace';
import { Product as PrismaProduct } from '../../../prisma/generated/client';
import { MetalSpotPrice as PrismaSpotPrice } from '../../../prisma/generated/client';
export declare function toNumber(value: Decimal | number | undefined | null): number;
export declare function toRawMetalSpotPrice(record: PrismaSpotPrice): RawSpotPrice;
export declare function toRawProduct(product: PrismaProduct): RawProduct;
//# sourceMappingURL=prisma-mappers.d.ts.map