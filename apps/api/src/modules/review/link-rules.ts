import { normaliseProductText } from '@goldilocks/shared-types';

/**
 * When a pending link makes sense on its own, so nobody has to confirm it by hand.
 *
 * - CONFIRM: the two ends agree (same product, and for an invoice line the same quantity).
 * - ASK: something does not fit; a person decides.
 * - SEPARATE: the purchase line has more sold from it than was bought. That is its own problem (the Too many sales
 *   list), so the link is left alone rather than confirmed on top of it.
 */
export type Verdict =
    | { verdict: 'CONFIRM' }
    | { verdict: 'ASK'; reason: string }
    | { verdict: 'SEPARATE'; reason: string };

export interface SaleEnd {
    qty: number | null;
    productKey: string | null;
    productText: string;
}

export interface LotEnd extends SaleEnd {
    allocatedQty: number;
}

export interface LineEnd {
    qty: number | null;
    itemName: string;
}

const SYNONYMS: Record<string, string> = {
    brits: 'britannia',
    brit: 'britannia',
    maples: 'maple',
    eagles: 'eagle',
    philharmonics: 'philharmonic',
};

/** Words that say what a product is, so "1oz brits" and "1oz Britannia" can be compared. */
export function productTokens(text: string): Set<string> {
    return new Set(
        normaliseProductText(text)
            .split(' ')
            .filter(Boolean)
            .map((t) => SYNONYMS[t] ?? t),
    );
}

/** The same product when the catalogue keys agree, or when every word of the shorter name is in the longer one. */
export function sameProduct(
    a: { productKey: string | null; text: string },
    b: { productKey: string | null; text: string },
): boolean {
    if (a.productKey && b.productKey) return a.productKey === b.productKey;
    const ta = productTokens(a.text);
    const tb = productTokens(b.text);
    if (ta.size === 0 || tb.size === 0) return false;
    const [small, big] = ta.size <= tb.size ? [ta, tb] : [tb, ta];
    return [...small].every((t) => big.has(t));
}

/** A sale and the purchase line its CPTY names. */
export function judgeSaleLot(
    sale: SaleEnd | null,
    lot: LotEnd | null,
): Verdict {
    if (!sale || !lot)
        return {
            verdict: 'ASK',
            reason: 'One end of the link is not in Goldilocks.',
        };
    if (
        !sameProduct(
            { productKey: sale.productKey, text: sale.productText },
            { productKey: lot.productKey, text: lot.productText },
        )
    ) {
        return {
            verdict: 'ASK',
            reason: 'The sale and the purchase line are different products.',
        };
    }
    if (lot.qty === null)
        return { verdict: 'ASK', reason: 'The purchase line has no quantity.' };
    if (lot.allocatedQty > lot.qty) {
        return {
            verdict: 'SEPARATE',
            reason: `${lot.allocatedQty} sold from a purchase line of ${lot.qty}: reviewed under Too many sales.`,
        };
    }
    return { verdict: 'CONFIRM' };
}

/** A Zoho invoice line and the sale it was matched to by customer, date and quantity. */
export function judgeLineTrade(
    line: LineEnd | null,
    trade: SaleEnd | null,
): Verdict {
    if (!line || !trade)
        return {
            verdict: 'ASK',
            reason: 'One end of the link is not in Goldilocks.',
        };
    if (line.qty === null || trade.qty === null)
        return { verdict: 'ASK', reason: 'A quantity is missing.' };
    if (line.qty !== trade.qty)
        return {
            verdict: 'ASK',
            reason: `The invoice line has ${line.qty} and the sale ${trade.qty}.`,
        };
    if (
        !sameProduct(
            { productKey: null, text: line.itemName },
            { productKey: trade.productKey, text: trade.productText },
        )
    ) {
        return {
            verdict: 'ASK',
            reason: 'The invoice line and the sale are different products.',
        };
    }
    return { verdict: 'CONFIRM' };
}
