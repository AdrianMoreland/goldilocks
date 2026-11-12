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
  /** Set when the text itself names one metal. */
  metalFromText: MetalType | null;
}

/** The metal the text names, as a whole word. Null when it names none, or names two different ones. */
export function metalInText(text: string | null | undefined): MetalType | null {
  const s = String(text ?? '').toLowerCase();
  const found = new Set<MetalType>();
  if (/\bgold\b/.test(s)) found.add('GOLD');
  if (/\bsilver\b/.test(s)) found.add('SILVER');
  if (/\bplatinum\b/.test(s)) found.add('PLATINUM');
  if (/\bpalladium\b/.test(s)) found.add('PALLADIUM');
  return found.size === 1 ? [...found][0]! : null;
}

const WEIGHT_RE = /(?<![\d./])(\d+\/\d+|\d+(?:\.\d+)?)(oz|g|kg)\b/g;
const FRACTIONS = new Set(['1/10OZ', '1/4OZ', '1/2OZ']);
const BAR_BRANDS =
  /\b(pamp|valcambi|metalor|umicore|argor|heraeus|nadir|combi|combibar|credit suisse|baird|hafner|johnson matthey|rand refinery)\b/;
// Coin names that are not in the catalogue: send them to review, never to a generic coin.
const UNKNOWN_COINS = /\b(buffalo|panda|angel|lunar|gauden|double eagle|ducat|isle of man|libertad)\b/;

/** Every weight in the text, in order; "half oz" style words come first. */
function weightsOf(key: string): string[] {
  const out: string[] = [];
  if (/\bhalf oz\b/.test(key)) out.push('1/2OZ');
  if (/\bquarter oz\b/.test(key)) out.push('1/4OZ');
  if (/\btenth oz\b/.test(key)) out.push('1/10OZ');
  for (const m of key.matchAll(WEIGHT_RE)) out.push(`${m[1]}${m[2]}`.toUpperCase());
  return [...new Set(out)];
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

/** `metal` is the metal of the sheet the text came from; a metal named in the text overrides it. */
export function pricingSkuFor(text: string | null | undefined, metal: MetalType): PricingSkuGuess | null {
  const raw = String(text ?? '').toLowerCase();
  // Several products in one cell cannot be one product.
  if (/[,&+;]|\band\b/.test(raw)) return null;
  const key = normaliseProductText(raw);
  if (!key) return null;

  const metalFromText = metalInText(raw);
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

  const weights = weightsOf(key);
  if (weights.length === 0) return null;
  const design = designOf(key, M);
  if (/\bdouble eagle\b/.test(key) || (!design && UNKNOWN_COINS.test(key))) return null;

  const bonded = /\bbonded\b/.test(key);
  const coinWord = /\bcoins?\b/.test(raw);
  const isBar = /\bbar\b/.test(key) || BAR_BRANDS.test(key);

  const forWeight = (W: string): string[] => {
    const out: string[] = [];
    if (design) {
      if (design === 'USEAGLE' && FRACTIONS.has(W)) out.push(`${M}-${W}-US-COIN`);
      out.push(`${M}-${W}-${design}-COIN`);
      if (FRACTIONS.has(W) || W === '1G') out.push(`${M}-${W}-COIN`);
    } else if (isBar) {
      if (bonded) out.push(`${M}-${W}-BONDED-BAR`);
      out.push(`${M}-${W}-BAR`);
      if (M === 'SILVER') out.push(`${W}-SILVER-BAR`);
    } else if (coinWord) {
      if (bonded) out.push(`${M}-${W}-BONDED-COIN`);
      if (M === 'SILVER' && W === '1KG') out.push('SILVER-1KG-COINS-COIN');
      out.push(`${M}-${W}-COIN`);
      if (M === 'SILVER') out.push(`${W}-SILVER-COIN`);
    } else if (M === 'GOLD' && FRACTIONS.has(W)) {
      // A bare fractional gold weight is a gold coin.
      out.push(`GOLD-${W}-COIN`);
    }
    return out;
  };
  return done(weights.flatMap(forWeight));
}
