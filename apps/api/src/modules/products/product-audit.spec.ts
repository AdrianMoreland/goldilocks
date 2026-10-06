import type { RawProduct } from '@goldilocks/shared-types';
import { describeProductChange } from './product-audit';

const base: RawProduct = {
    id: 1,
    sku: 'GB-1OZ',
    name: '1oz Gold Bar',
    metalType: 'GOLD',
    weight: 31.1035,
    spreadBuy: 1.5,
    spreadSell: 2,
    vatRate: 0,
    stock: 3,
    isActive: true,
    category: null,
    description: null,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
};

describe('describeProductChange', () => {
    it('lists only what changed, old → new', () => {
        expect(
            describeProductChange(base, {
                ...base,
                spreadSell: 2.5,
                stock: 4,
            }),
        ).toBe('spreadSell 2 → 2.5, stock 3 → 4');
    });

    it('ignores timestamps, which move on every save', () => {
        expect(
            describeProductChange(base, {
                ...base,
                updatedAt: '2026-10-04T00:00:00.000Z',
            }),
        ).toBe('');
    });

    it('shows a cleared value as (none)', () => {
        expect(
            describeProductChange(
                { ...base, description: 'Bar' },
                { ...base, description: null },
            ),
        ).toBe('description Bar → (none)');
    });
});
