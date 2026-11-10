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
    productId?: number | null;
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

/** Words that make a product a coin or a named piece rather than a plain bar of a weight. */
const COIN_WORDS = new Set([
    'britannia',
    'krugerrand',
    'maple',
    'eagle',
    'sovereign',
    'philharmonic',
    'buffalo',
    'libertad',
    'kangaroo',
    'nugget',
    'panda',
    'lunar',
    'tree',
    'life',
    'proof',
    'half',
    'full',
    'quarter',
    'noble',
    'angel',
    'bullion',
    'coin',
]);

const WEIGHT = /^[\d./]+(g|kg)?$/;

/** A word with its unit folded: "1/4oz" and "1/4" are the same size. */
function canon(token: string): string {
    const t = SYNONYMS[token] ?? token;
    return /^[\d./]+oz$/.test(t) ? t.slice(0, -2) : t;
}

/** Words that say what a product is, so "1oz brits" and "1oz Britannia" can be compared. */
export function productTokens(text: string): Set<string> {
    return new Set(
        normaliseProductText(text).split(' ').filter(Boolean).map(canon),
    );
}

const withoutBar = (tokens: Set<string>) =>
    new Set([...tokens].filter((t) => t !== 'bar'));
const subset = (small: Set<string>, big: Set<string>) =>
    small.size > 0 && [...small].every((t) => big.has(t));

/**
 * The same product when the catalogue keys agree. Otherwise by name: equal once "bar" is ignored; when a side has
 * no catalogue key, every word of the shorter name is in the longer one; and a plain bar of a weight ("1oz bar")
 * is the same as a named bar of that weight ("1oz PAMP Lady Fortuna") unless the named one is a coin.
 */
export function sameProduct(
    a: { productKey: string | null; productId?: number | null; text: string },
    b: { productKey: string | null; productId?: number | null; text: string },
): boolean {
    // Two different catalogue products are never the same. The same catalogue product is not enough on its own:
    // generic rows ("1/10oz Coin") cover several designs, so the names below still have to agree.
    if (
        a.productId != null &&
        b.productId != null &&
        a.productId !== b.productId
    )
        return false;
    if (a.productKey && b.productKey && a.productKey === b.productKey)
        return true;
    const ta = productTokens(a.text);
    const tb = productTokens(b.text);
    if (ta.size === 0 || tb.size === 0) return false;

    const ba = withoutBar(ta);
    const bb = withoutBar(tb);
    if (ba.size === bb.size && subset(ba, bb)) return true;

    const missingKey = !a.productKey || !b.productKey;
    if (missingKey && (subset(ba, bb) || subset(bb, ba))) return true;

    // "1oz bar" against "1oz PAMP Lady Fortuna": one side is only a weight, the other has no coin word.
    const plain = (t: Set<string>) =>
        t.size > 0 && [...t].every((x) => WEIGHT.test(x));
    const named = (t: Set<string>) => [...t].some((x) => COIN_WORDS.has(x));
    if (plain(ba) && !named(bb) && subset(ba, bb)) return true;
    if (plain(bb) && !named(ba) && subset(bb, ba)) return true;
    return false;
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
            {
                productKey: sale.productKey,
                productId: sale.productId,
                text: sale.productText,
            },
            {
                productKey: lot.productKey,
                productId: lot.productId,
                text: lot.productText,
            },
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
            {
                productKey: trade.productKey,
                productId: trade.productId,
                text: trade.productText,
            },
        )
    ) {
        return {
            verdict: 'ASK',
            reason: 'The invoice line and the sale are different products.',
        };
    }
    return { verdict: 'CONFIRM' };
}
