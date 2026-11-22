"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productTokens = productTokens;
exports.sameProduct = sameProduct;
exports.judgeSaleLot = judgeSaleLot;
exports.judgeLineTrade = judgeLineTrade;
const shared_types_1 = require("@goldilocks/shared-types");
const SYNONYMS = {
    brits: 'britannia',
    brit: 'britannia',
    maples: 'maple',
    eagles: 'eagle',
    philharmonics: 'philharmonic',
    nugget: 'kangaroo',
    nuggets: 'kangaroo',
    kruger: 'krugerrand',
    maplegram: 'maple',
};
const COUNTRY_WORDS = new Set([
    'south',
    'african',
    'canadian',
    'american',
    'austrian',
    'australian',
    'irish',
    'us',
    'usa',
    'british',
    'uk',
    'leaf',
    'vienna',
]);
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
function canon(token) {
    const t = SYNONYMS[token] ?? token;
    return /^[\d./]+oz$/.test(t) ? t.slice(0, -2) : t;
}
function productTokens(text) {
    return new Set((0, shared_types_1.normaliseProductText)(text)
        .split(' ')
        .filter((t) => t && !COUNTRY_WORDS.has(t))
        .map(canon));
}
const withoutBar = (tokens) => new Set([...tokens].filter((t) => t !== 'bar'));
const subset = (small, big) => small.size > 0 && [...small].every((t) => big.has(t));
function sameProduct(a, b) {
    if (a.productId != null &&
        b.productId != null &&
        a.productId !== b.productId)
        return false;
    if (a.productKey && b.productKey && a.productKey === b.productKey)
        return true;
    const ta = productTokens(a.text);
    const tb = productTokens(b.text);
    if (ta.size === 0 || tb.size === 0)
        return false;
    const ba = withoutBar(ta);
    const bb = withoutBar(tb);
    if (ba.size === bb.size && subset(ba, bb))
        return true;
    const missingKey = !a.productKey || !b.productKey;
    if (missingKey && (subset(ba, bb) || subset(bb, ba)))
        return true;
    const plain = (t) => t.size > 0 && [...t].every((x) => WEIGHT.test(x));
    const named = (t) => [...t].some((x) => COIN_WORDS.has(x));
    if (plain(ba) && !named(bb) && subset(ba, bb))
        return true;
    if (plain(bb) && !named(ba) && subset(bb, ba))
        return true;
    return false;
}
function judgeSaleLot(sale, lot) {
    if (!sale || !lot)
        return {
            verdict: 'ASK',
            reason: 'One end of the link is not in Goldilocks.',
        };
    if (!sameProduct({
        productKey: sale.productKey,
        productId: sale.productId,
        text: sale.productText,
    }, {
        productKey: lot.productKey,
        productId: lot.productId,
        text: lot.productText,
    })) {
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
function judgeLineTrade(line, trade) {
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
    if (!sameProduct({ productKey: null, text: line.itemName }, {
        productKey: trade.productKey,
        productId: trade.productId,
        text: trade.productText,
    })) {
        return {
            verdict: 'ASK',
            reason: 'The invoice line and the sale are different products.',
        };
    }
    return { verdict: 'CONFIRM' };
}
//# sourceMappingURL=link-rules.js.map