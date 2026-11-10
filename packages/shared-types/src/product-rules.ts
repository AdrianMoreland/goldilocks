import { normaliseProductText } from './product-text';
import type { MetalType } from './spot-price.schema';

/**
 * Built-in rules that turn generic product text ("1oz Krugerrand", "50g PAMP", "Full Sovereign") into the SKU of
 * a pricing product. Pure: it returns SKU candidates in priority order and the caller picks the first one the
 * catalogue really has. When the text is not clear it returns null rather than guess.
 */

export interface PricingSkuGuess {
  /** The first candidate. */
  sku: string;
  /** Every SKU worth trying, best first. */
  candidates: string[];
  /** Set when the text itself names platinum or palladium. */
  metalFromText: MetalType | null;
}

/** Platinum or palladium named in the text, else null. */
export function metalInText(text: string | null | undefined): MetalType | null {
  const s = String(text ?? '').toLowerCase();
  if (/\bplatinum\b/.test(s)) return 'PLATINUM';
  if (/\bpalladium\b/.test(s)) return 'PALLADIUM';
  return null;
}

const WEIGHT_RE = /(?<![\d./])(\d+\/\d+|\d+(?:\.\d+)?)(oz|g|kg)\b/;
const FRACTIONS = new Set(['1/10OZ', '1/4OZ', '1/2OZ']);
const BAR_BRANDS =
  /\b(pamp|valcambi|metalor|umicore|argor|heraeus|nadir|combi|combibar|credit suisse|baird|hafner|johnson matthey|rand refinery)\b/;
// Coin names that are not in the catalogue: send them to review, never to a generic coin.
const UNKNOWN_COINS = /\b(buffalo|panda|angel|lunar|gauden|double eagle|ducat|isle of man|libertad)\b/;

function weightOf(key: string): string | null {
  if (/\bhalf oz\b/.test(key)) return '1/2OZ';
  if (/\bquarter oz\b/.test(key)) return '1/4OZ';
  if (/\btenth oz\b/.test(key)) return '1/10OZ';
  const m = WEIGHT_RE.exec(key);
  return m ? `${m[1]}${m[2]}`.toUpperCase() : null;
}

/** The design word for the catalogue SKU, or null when the text names none of the designs we hold. */
function designOf(key: string, metal: MetalType): string | null {
  const pgm = metal === 'PLATINUM' || metal === 'PALLADIUM';
  if (/\bkrugerrand\b/.test(key)) return 'KRUGERRAND';
  if (/\bmaple/.test(key)) return pgm ? 'MAPLE' : 'MAPLELEAF';
  if (/\bbritannia\b/.test(key)) return 'BRITANNIA';
  if (/\bkangaroo\b/.test(key)) return 'KANGAROO';
  if (/\b(philharmonic|phil)\b/.test(key)) return 'PHILHARMONIC';
  if (/\btree\b/.test(key) && /\blife\b/.test(key)) return 'TREEOFLIFE';
  if (/\beagle\b/.test(key)) return 'USEAGLE';
  if (/\bqueen/.test(key) && /\bbeast/.test(key)) return 'QUEENSBEASTS';
  return null;
}

function sovereignSku(key: string): string | null {
  if (/\b(quarter|quintuple|eighth|eight)\b/.test(key)) return null;
  if (/\bhalf\b/.test(key)) return 'GOLD-HALF-SOVEREIGN-COIN';
  if (/\bdouble\b/.test(key)) return 'GOLD-DOUBLE-SOVEREIGN-COIN';
  return 'GOLD-FULL-SOVEREIGN-COIN';
}

/** `metal` is the metal of the sheet the text came from; platinum or palladium in the text overrides it. */
export function pricingSkuFor(text: string | null | undefined, metal: MetalType): PricingSkuGuess | null {
  const raw = String(text ?? '').toLowerCase();
  // Several products in one cell cannot be one product.
  if (/[,&+;]|\band\b/.test(raw)) return null;
  const key = normaliseProductText(raw);
  if (!key) return null;

  const metalFromText = metalInText(key);
  const M = metalFromText ?? metal;
  const done = (candidates: string[]): PricingSkuGuess | null => {
    const unique = [...new Set(candidates)];
    return unique.length > 0 ? { sku: unique[0]!, candidates: unique, metalFromText } : null;
  };

  if (/\bsovereign\b/.test(key)) {
    if (M !== 'GOLD' || /\bsilver\b/.test(key)) return null;
    const sku = sovereignSku(key);
    return sku ? done([sku]) : null;
  }

  const W = weightOf(key);
  if (!W) return null;
  const design = designOf(key, M);
  if (/\bdouble eagle\b/.test(key) || (!design && UNKNOWN_COINS.test(key))) return null;

  const bonded = /\bbonded\b/.test(key);
  const coinWord = /\bcoins?\b/.test(raw);
  const generic = FRACTIONS.has(W) || W === '1G';

  if (design) {
    const out: string[] = [];
    if (design === 'USEAGLE' && FRACTIONS.has(W)) out.push(`${M}-${W}-US-COIN`);
    out.push(`${M}-${W}-${design}-COIN`);
    if (generic) out.push(`${M}-${W}-COIN`);
    return done(out);
  }

  const isBar = /\bbar\b/.test(key) || BAR_BRANDS.test(key);
  if (isBar) {
    const out = bonded ? [`${M}-${W}-BONDED-BAR`] : [];
    out.push(`${M}-${W}-BAR`);
    if (M === 'SILVER') out.push(`${W}-SILVER-BAR`);
    return done(out);
  }

  if (coinWord) {
    const out: string[] = [];
    if (bonded) out.push(`${M}-${W}-BONDED-COIN`);
    if (M === 'SILVER' && W === '1KG') out.push('SILVER-1KG-COINS-COIN');
    out.push(`${M}-${W}-COIN`);
    if (M === 'SILVER') out.push(`${W}-SILVER-COIN`);
    return done(out);
  }

  // A bare fractional gold weight is a gold coin.
  if (M === 'GOLD' && FRACTIONS.has(W)) return done([`GOLD-${W}-COIN`]);
  return null;
}
