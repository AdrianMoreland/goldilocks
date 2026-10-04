import type { RawProduct } from '@goldilocks/shared-types';

/** The columns an admin can change; timestamps and the id are bookkeeping, not an edit. */
const TRACKED = [
    'sku',
    'name',
    'metalType',
    'weight',
    'spreadBuy',
    'spreadSell',
    'vatRate',
    'stock',
    'isActive',
    'category',
    'description',
] as const satisfies readonly (keyof RawProduct)[];

function show(value: string | number | boolean | null | undefined): string {
    return value === null || value === undefined || value === ''
        ? '(none)'
        : String(value);
}

/**
 * "spreadSell 1.5 → 2, stock 3 → 4": only what changed, old → new, so the audit trail answers
 * "who moved this premium and from what". Empty when nothing tracked differs.
 */
export function describeProductChange(
    before: RawProduct,
    after: RawProduct,
): string {
    return TRACKED.filter((field) => before[field] !== after[field])
        .map(
            (field) =>
                `${field} ${show(before[field])} → ${show(after[field])}`,
        )
        .join(', ');
}
