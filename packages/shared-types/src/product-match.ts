/**
 * One matching engine for product names from any source. Pure: the caller passes the catalogue, the metal hints
 * and (optionally) a unit price with the spot prices of that day.
 *
 * It reads the weight, the form (bar or coin), the metal, the refinery and the coin design out of the text, then
 * answers with a pricing product, a specific product, "not a product" or nothing, and how sure it is:
 *
 * - CERTAIN: safe to apply by rule.
 * - LIKELY: a suggestion for a person to accept or reject (`question` says what is being asked).
 * - UNCLEAR: a person has to choose.
 *
 * Built on `normaliseProductText`, which is left exactly as the import script has it.
 */
import { normaliseProductText } from './product-text';
import { listedRefinery, refineryMatch, refineryWords } from './refineries';

export type MatchMetal = 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
export type MatchConfidence = 'CERTAIN' | 'LIKELY' | 'UNCLEAR';
export type MatchOutcome = 'PRICING' | 'SPECIFIC' | 'NOT_A_PRODUCT' | 'NONE';

const METALS: readonly MatchMetal[] = ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'];
const GRAMS_PER_OZ = 31.1034768;

// --- the designs we sell (data; later loaded from the product_rules table) ----------------------

export interface CoinDesign {
  /** Stable key, also used by the rules table. */
  id: string;
  /** Name shown in questions ("Match to 1oz Krugerrand?"). */
  label: string;
  /** Cleaned words (see `normaliseProductText`) of which any one names the design. */
  words: readonly string[];
  /** Cleaned words that must all be present (for designs named by two words); used instead of `words`. */
  allWords?: readonly string[];
  /** The metals it is sold in, with the weights, as labels like "1oz", "1/4oz". */
  metals: Partial<Record<MatchMetal, readonly string[]>>;
  /** Refineries and mints that make it: naming one next to the design adds nothing. */
  mints: readonly string[];
  /** Fixed fine weight in grams, for designs sold by name rather than by weight (sovereigns). */
  fineGrams?: number;
}

const FRACTIONS_GOLD: readonly string[] = ['1/10oz', '1/4oz', '1/2oz', '1oz'];
const SILVER_COIN_WEIGHTS: readonly string[] = ['1oz', '2oz', '5oz', '10oz', '1kg'];

/** The coin designs the shop sells. Synonyms: brits, kruger, nugget (Kangaroo), cowboy (Irish Tree of Life). */
export const COIN_DESIGNS: readonly CoinDesign[] = [
  { id: 'sovereign:full', label: 'Full Sovereign', words: ['sovereign'], metals: { GOLD: [] }, mints: ['ROYAL MINT'], fineGrams: 7.322 },
  { id: 'sovereign:half', label: 'Half Sovereign', words: [], metals: { GOLD: [] }, mints: ['ROYAL MINT'], fineGrams: 3.661 },
  { id: 'sovereign:quarter', label: 'Quarter Sovereign', words: [], metals: { GOLD: [] }, mints: ['ROYAL MINT'], fineGrams: 1.83 },
  { id: 'sovereign:double', label: 'Double Sovereign', words: [], metals: { GOLD: [] }, mints: ['ROYAL MINT'], fineGrams: 14.644 },
  { id: 'sovereign:quintuple', label: 'Quintuple Sovereign', words: [], metals: { GOLD: [] }, mints: ['ROYAL MINT'], fineGrams: 36.61 },
  {
    id: 'britannia',
    label: 'Britannia',
    words: ['britannia', 'brit', 'britania'],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'], PALLADIUM: ['1oz'] },
    mints: ['ROYAL MINT'],
  },
  {
    id: 'krugerrand',
    label: 'Krugerrand',
    words: ['krugerrand', 'kruger', 'krug'],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'] },
    mints: ['RAND REFINERY'],
  },
  {
    id: 'treeoflife',
    label: 'Tree of Life',
    words: ['cowboy'],
    allWords: ['tree', 'life'],
    metals: { GOLD: [...FRACTIONS_GOLD, '1g'], SILVER: ['1oz'] },
    mints: ['MERRION GOLD'],
  },
  {
    id: 'philharmonic',
    label: 'Philharmonic',
    words: ['philharmonic', 'philharmoniker', 'phil'],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'] },
    mints: ['MUNZE OSTERREICH'],
  },
  {
    id: 'kangaroo',
    label: 'Kangaroo',
    words: ['kangaroo', 'nugget'],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'] },
    mints: ['PERTH MINT'],
  },
  {
    id: 'maple',
    label: 'Maple Leaf',
    words: ['maple', 'maplegram'],
    metals: { GOLD: [...FRACTIONS_GOLD, '1g'], SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'], PALLADIUM: ['1oz'] },
    mints: ['ROYAL CANADIAN MINT'],
  },
  {
    id: 'eagle',
    label: 'Eagle',
    words: ['eagle'],
    metals: { GOLD: FRACTIONS_GOLD, SILVER: SILVER_COIN_WEIGHTS, PLATINUM: ['1oz'] },
    mints: [],
  },
  {
    id: 'queensbeasts',
    label: "Queen's Beasts",
    words: [],
    allWords: ['queen', 'beast'],
    metals: { GOLD: ['1/4oz', '1oz', '2oz', '10oz'], SILVER: ['2oz', '10oz'] },
    mints: ['ROYAL MINT'],
  },
];

/** Coins we know exist but do not hold a pricing row for: they fall back to the generic coin row, flagged for the catalogue. */
const OBSCURE_COIN_WORDS = new Set([
  'koala', 'buffalo', 'panda', 'lunar', 'libertad', 'angel', 'noble', 'ducat', 'gauden', 'kookaburra', 'dragon',
  'myth', 'legend', 'sheep', 'tiger', 'rooster', 'ox', 'rat', 'monkey', 'pig', 'horse', 'goat', 'snake', 'rabbit',
  'wedge', 'isle', 'man', 'proof', 'victoria', 'elizabeth', 'edward', 'george',
]);

// --- types ---------------------------------------------------------------------------------------

export interface MatchPricingProduct {
  id: number;
  sku: string;
  name: string;
  metal: string;
  category?: string | null;
}

export interface MatchSpecificProduct {
  id: number | string;
  name: string;
  metal?: string | null;
  refinery?: string | null;
  genericNorm?: string | null;
  pricingProductId?: number | null;
}

export interface MatchCatalogue {
  pricing: readonly MatchPricingProduct[];
  specific?: readonly MatchSpecificProduct[];
}

export interface MatchInput {
  /** The product name as written. `name|REFINERY` is accepted. */
  text: string | null | undefined;
  refinery?: string | null;
  /** The metal of the tab or sheet the name came from. */
  metal?: MatchMetal | null;
  /** Where the name was seen, e.g. "purchase_orders,invoice_lines" or "tradesheet". */
  sources?: string | readonly string[] | null;
  /** Price of one unit of the product, for the price check. */
  unitPrice?: number | null;
  /** The day of the price (informational: the caller already chose `spot` for it). */
  date?: string | Date | null;
  /** Spot price per troy ounce for that day, same currency as `unitPrice`. */
  spot?: Partial<Record<MatchMetal, number>> | null;
}

export interface ProductMatch {
  outcome: MatchOutcome;
  /** The pricing product. */
  productId?: number;
  /** The specific product, only for outcome SPECIFIC. */
  salesProductId?: number | string;
  confidence: MatchConfidence;
  reason: string;
  /** For LIKELY: what to ask the person. */
  question?: string;
  /** True when the catalogue lacks a row this name needs. */
  catalogueGap?: boolean;
  /** What was read from the text, for display and tests. */
  metal?: MatchMetal;
  weight?: string;
}

// --- reading the text ---------------------------------------------------------------------------

const COUNTRY_WORDS = new Set(['south', 'african', 'canadian', 'american', 'austrian', 'australian', 'irish', 'us', 'usa', 'british', 'uk']);
const FILLER_WORDS = new Set([
  'mixed', 'year', 'unc', 'brilliant', 'uncirculated', 'assorted', 'various', 'purity', 'carat', 'ct', 'k', 'fine',
  'fineness', 'new', 'best', 'value', 'refiner', 'refinery', 'minted', 's', 'g', 'oz', 'of', 'the', 'a', 'x', 'leaf',
  'standard', 'size', 'sized', 'mint', 'other', 'africa', 'austria', 'switzerland', 'australia', 'canada', 'vienna',
]);
const PURITY_NUMBERS = /^(999(\.9)?|9999|995|916(\.7)?|9167|91\.67|99\.99|99\.9|585|750|375|925)$/;
const NATURAL_LABELS = new Set([
  '1/10oz', '1/4oz', '1/2oz', '1oz', '2oz', '5oz', '10oz', '100oz',
  '1g', '2g', '2.5g', '5g', '10g', '20g', '50g', '100g', '250g', '500g', '1kg', '5kg', '15kg',
]);
const MAYBE_NOT_A_PRODUCT_RE = /\b(account|balance|outstanding|notes?|comments?|contact|processing|invoice|inv)\b/;
const NOT_A_PRODUCT_RE = /\b(storage|fees?|shipment|shipmint|shipping|delivery|insurance|deposit|postage|courier)\b/;

interface WeightRead {
  label: string;
  grams: number;
  unit: 'oz' | 'g';
}

function ozLabel(v: number): string {
  const near = (a: number) => Math.abs(v - a) < 1e-9;
  if (near(0.1)) return '1/10oz';
  if (near(0.25)) return '1/4oz';
  if (near(0.5)) return '1/2oz';
  if (near(0.05)) return '1/20oz';
  return `${+v.toFixed(3)}oz`;
}

function gramLabel(g: number): string {
  if (g >= 1000 && Math.abs(g / 1000 - Math.round(g / 1000)) < 1e-9) return `${Math.round(g / 1000)}kg`;
  return `${+g.toFixed(3)}g`;
}

const OZ_SNAPS: ReadonlyArray<readonly [number, string]> = [
  [GRAMS_PER_OZ / 10, '1/10oz'],
  [GRAMS_PER_OZ / 4, '1/4oz'],
  [GRAMS_PER_OZ / 2, '1/2oz'],
  [GRAMS_PER_OZ, '1oz'],
  [GRAMS_PER_OZ * 2, '2oz'],
  [GRAMS_PER_OZ * 5, '5oz'],
  [GRAMS_PER_OZ * 10, '10oz'],
];

/** The weights in a cleaned text and the text with them taken out. */
function readWeights(norm: string): { weights: WeightRead[]; rest: string; bareOz: boolean } {
  const weights: WeightRead[] = [];
  let rest = norm;
  rest = rest.replace(/(?<![\d./])(\d+\/\d+|\d*\.?\d+)(oz|g|kg)\b/g, (_m, num: string, unit: string) => {
    let v: number;
    if (num.includes('/')) {
      const [a, b] = num.split('/').map(Number);
      v = b ? a! / b : NaN;
    } else v = Number(num);
    if (!Number.isFinite(v) || v <= 0) return ' ';
    if (unit === 'oz') weights.push({ label: ozLabel(v), grams: v * GRAMS_PER_OZ, unit: 'oz' });
    else {
      const g = unit === 'kg' ? v * 1000 : v;
      const snap = unit === 'g' ? OZ_SNAPS.find(([sg]) => Math.abs(g - sg) / sg < 0.015) : undefined;
      weights.push(snap ? { label: snap[1], grams: g, unit: 'g' } : { label: gramLabel(g), grams: g, unit: 'g' });
    }
    return ' ';
  });
  rest = rest.replace(/\b(half|quarter|tenth)\s+oz\b/g, (_m, w: string) => {
    const v = w === 'half' ? 0.5 : w === 'quarter' ? 0.25 : 0.1;
    weights.push({ label: ozLabel(v), grams: v * GRAMS_PER_OZ, unit: 'oz' });
    return ' ';
  });
  let bareOz = false;
  if (weights.length === 0) {
    const frac = /(?<![\d./])(1\/10|1\/4|1\/2)(?![\d./])/.exec(rest);
    if (frac) {
      const [a, b] = frac[1]!.split('/').map(Number);
      weights.push({ label: ozLabel(a! / b!), grams: (a! / b!) * GRAMS_PER_OZ, unit: 'oz' });
      rest = rest.replace(frac[1]!, ' ');
    }
  }
  if (weights.length === 0 && /(^|\s)oz(\s|$)/.test(rest)) {
    bareOz = true;
    weights.push({ label: '1oz', grams: GRAMS_PER_OZ, unit: 'oz' });
    rest = rest.replace(/(^|\s)oz(?=\s|$)/g, ' ');
  }
  return { weights, rest, bareOz };
}

interface Parsed {
  empty: boolean;
  problem: string | null;
  notProduct: boolean;
  maybeNotProduct: boolean;
  weight: string | null;
  grams: number | null;
  metals: Set<MatchMetal>;
  bar: boolean;
  coin: boolean;
  bonded: boolean;
  design: CoinDesign | null;
  obscureWord: string | null;
  refinery: string | null;
  leftover: string[];
}

const empty = (problem: string | null, over: Partial<Parsed> = {}): Parsed => ({
  empty: false,
  problem,
  notProduct: false,
  maybeNotProduct: false,
  weight: null,
  grams: null,
  metals: new Set(),
  bar: false,
  coin: false,
  bonded: false,
  design: null,
  obscureWord: null,
  refinery: null,
  leftover: [],
  ...over,
});

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** A refinery's canonical name from a spelling; null for "mixed" / unknown. */
function canonRefinery(text: string | null | undefined): string | null {
  const key = refineryWords(String(text ?? ''));
  if (!key || ['UNKNOWN', 'N A', 'NA', 'NONE'].includes(key)) return null;
  const l = listedRefinery(key);
  return l === undefined ? key : l;
}

function sovereignVariant(tokens: Set<string>): string {
  if (tokens.has('quintuple')) return 'sovereign:quintuple';
  if (tokens.has('quarter')) return 'sovereign:quarter';
  if (tokens.has('double')) return 'sovereign:double';
  if (tokens.has('half')) return 'sovereign:half';
  return 'sovereign:full';
}

/** Reads one name. `refineryHint` is a refinery given next to the name. */
export function parseProductName(text: string | null | undefined, refineryHint?: string | null): Parsed {
  let raw = stripAccents(String(text ?? '')).toLowerCase().trim();
  let hint = refineryHint ?? null;
  const bar = raw.indexOf('|');
  if (bar >= 0) {
    hint = hint ?? raw.slice(bar + 1);
    raw = raw.slice(0, bar).trim();
  }
  if (!raw) return { ...empty('no product name'), empty: true };
  if (/^#[a-z/0-9]+[!?]?$/i.test(raw)) return empty('sheet error');
  if (/^[\d\s.,£$€%-]*$/.test(raw)) return empty('a bare number');
  if (NOT_A_PRODUCT_RE.test(raw)) return empty(null, { notProduct: true });
  if (MAYBE_NOT_A_PRODUCT_RE.test(raw)) return empty(null, { maybeNotProduct: true });

  // Refinery: given, else found in the text; its words come out of the text.
  const found = refineryMatch(raw);
  const given = canonRefinery(hint);
  const refinery = given ?? found?.refinery ?? null;
  for (let hit = found, guard = 0; hit && guard < 5; hit = refineryMatch(raw), guard++) {
    const re = new RegExp(`(?<![a-z0-9])${hit.words.toLowerCase().split(' ').join('[^a-z0-9]+')}(?![a-z0-9])`, 'g');
    raw = raw.replace(re, ' ');
  }
  raw = raw.replace(/best value \(?mixed refiners\)?/g, ' ');

  if (/[,&+;]|\b(and|plus|or)\b/.test(raw)) return empty('several products in one name');
  if (/\b\d+\s*x\b|\bx\s*\d+\b/.test(raw)) return empty('a quantity in the name');

  raw = raw
    .replace(/([a-z])\/([a-z])/g, '$1 $2')
    .replace(/(\d)\s*(grams?|grammes?|gms?)\b/g, '$1g')
    .replace(/(\d)\s*(ounces?)\b/g, '$1oz')
    .replace(/(\d)\s*(kilos?|kilograms?)\b/g, '$1kg');
  if (/\b(copper|brass|bronze|nickel)\b/.test(raw)) return empty('a base metal, not gold, silver, platinum or palladium');
  const norm = normaliseProductText(raw);
  const { weights, rest, bareOz } = readWeights(norm);

  let weight: string | null = null;
  let grams: number | null = null;
  if (weights.length > 0) {
    const first = weights[0]!;
    for (const w of weights.slice(1)) {
      const ratio = w.grams / first.grams;
      const sameUnit = w.unit === first.unit;
      if ((sameUnit && w.label !== first.label) || Math.abs(ratio - 1) > 0.12) return empty('the name gives different weights');
    }
    const pick = weights.find((w) => NATURAL_LABELS.has(w.label)) ?? first;
    weight = pick.label;
    grams = pick.grams;
  }

  const tokens = rest.split(' ').filter(Boolean);
  const set = new Set(tokens);
  const metals = new Set<MatchMetal>();
  if (/\bgold\b/.test(raw)) metals.add('GOLD');
  if (/\bsilver\b/.test(raw)) metals.add('SILVER');
  if (/\bplatinum\b/.test(raw)) metals.add('PLATINUM');
  if (/\bpalladium\b/.test(raw)) metals.add('PALLADIUM');

  const barWord = set.has('bar') || set.has('combi') || set.has('combibar');
  const coinWord = /\bcoins?\b/.test(raw);
  const bonded = set.has('bonded');

  const consumed = new Set<string>(['bar', 'bonded', 'silver', 'platinum', 'palladium']);

  // Designs.
  const hits: CoinDesign[] = [];
  const sov = COIN_DESIGNS.find((d) => d.id === 'sovereign:full')!;
  let obscureWord: string | null = null;
  if (set.has('sovereign') || set.has('sov')) {
    const variant = sovereignVariant(set);
    hits.push(COIN_DESIGNS.find((d) => d.id === variant) ?? sov);
    for (const w of ['sovereign', 'sov', 'full', 'half', 'quarter', 'double', 'quintuple']) consumed.add(w);
  }
  for (const d of COIN_DESIGNS) {
    if (d.id.startsWith('sovereign')) continue;
    const named = d.allWords ? d.allWords.every((w) => set.has(w)) : false;
    const any = d.words.some((w) => set.has(w));
    if (!named && !any) continue;
    if (d.id === 'eagle' && set.has('double')) {
      obscureWord = 'double eagle';
      consumed.add('eagle');
      consumed.add('double');
      continue;
    }
    hits.push(d);
    for (const w of [...d.words, ...(d.allWords ?? []), 'of', 'irish']) consumed.add(w);
    if (d.id === 'maple') consumed.add('leaf');
  }
  if (hits.length > 1) return empty('several products in one name');
  const design = hits[0] ?? null;

  const leftover: string[] = [];
  // "Mixed sovereign" is a mixed lot, unlike "mixed years" or "mixed/other".
  if (hits[0]?.id.startsWith('sovereign') && /\bmixed\b(?!\s*years?)/.test(raw)) leftover.push('mixed');
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (consumed.has(t)) continue;
    if (COUNTRY_WORDS.has(t) || FILLER_WORDS.has(t)) continue;
    if (PURITY_NUMBERS.test(t)) continue;
    if (/^(22|24|18|9)$/.test(t) && /\b(carat|ct|k)\b/.test(rest)) continue;
    if (/^\d+(\.\d+)?$/.test(t) && /\b(purity|carat|fine|fineness)\b/.test(rest)) continue;
    leftover.push(t);
  }
  if (!obscureWord) {
    const o = leftover.find((t) => OBSCURE_COIN_WORDS.has(t));
    if (o) obscureWord = o;
  }
  // A bare "oz" is only a weight when nothing else is left unexplained ("silver market bar total oz" is not 1oz).
  if (bareOz && leftover.length > 0) {
    weight = null;
    grams = null;
  }

  return {
    empty: false,
    problem: null,
    notProduct: false,
    maybeNotProduct: false,
    weight,
    grams,
    metals,
    bar: barWord,
    coin: coinWord,
    bonded,
    design,
    obscureWord,
    refinery,
    leftover,
  };
}

// --- catalogue index -----------------------------------------------------------------------------

interface PricingRow {
  p: MatchPricingProduct;
  metal: MatchMetal;
  weight: string | null;
  form: 'BAR' | 'COIN' | null;
  design: string | null;
  bonded: boolean;
}

interface SpecificRow {
  s: MatchSpecificProduct;
  metal: MatchMetal | null;
  weight: string | null;
  form: 'BAR' | 'COIN' | null;
  design: string | null;
  refinery: string | null;
  qualifiers: string[];
  /** The pricing product it links to. */
  pricingId: number | null;
}

interface Index {
  rows: PricingRow[];
  byId: Map<number, PricingRow>;
  specifics: SpecificRow[];
}

const SKU_DESIGN: Record<string, string> = {
  BRITANNIA: 'britannia',
  KRUGERRAND: 'krugerrand',
  MAPLE: 'maple',
  MAPLELEAF: 'maple',
  PHILHARMONIC: 'philharmonic',
  KANGAROO: 'kangaroo',
  TREEOFLIFE: 'treeoflife',
  USEAGLE: 'eagle',
  US: 'eagle',
  QUEENSBEASTS: 'queensbeasts',
};

function isMetal(m: string | null | undefined): m is MatchMetal {
  return !!m && (METALS as readonly string[]).includes(m);
}

function parseSku(p: MatchPricingProduct): PricingRow | null {
  const metal = isMetal(p.metal) ? p.metal : null;
  if (!metal) return null;
  const parts = p.sku.toUpperCase().split('-');
  let weight: string | null = null;
  let design: string | null = null;
  let form: 'BAR' | 'COIN' | null = p.category === 'BAR' || p.category === 'COIN' ? p.category : null;
  let bonded = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    const w = /^(\d+(?:\.\d+)?|\d+\/\d+)(OZ|G|KG)$/.exec(part);
    if (w) {
      weight = `${w[1]}${w[2]!.toLowerCase()}`;
      continue;
    }
    if (part === 'BAR') form = 'BAR';
    else if (part === 'COIN') form = 'COIN';
    else if (part === 'BONDED') bonded = true;
    else if (part === 'FULL' || part === 'HALF' || part === 'DOUBLE' || part === 'QUARTER' || part === 'QUINTUPLE') {
      if (parts[i + 1] === 'SOVEREIGN') design = `sovereign:${part.toLowerCase()}`;
    } else if (SKU_DESIGN[part]) design = SKU_DESIGN[part]!;
  }
  return { p, metal, weight, form, design, bonded };
}

const indexCache = new WeakMap<object, Index>();

function parseSpecific(s: MatchSpecificProduct, byId: Map<number, PricingRow>): SpecificRow {
  const pricing = s.pricingProductId != null ? byId.get(s.pricingProductId) : undefined;
  const refineryField = canonRefinery(s.refinery);
  const parsed = parseProductName(s.genericNorm || s.name, refineryField);
  const refinery = refineryField ?? parsed.refinery;
  let metal: MatchMetal | null = pricing?.metal ?? (isMetal(s.metal) ? s.metal : null);
  if (!metal && parsed.metals.size === 1) metal = [...parsed.metals][0]!;
  const form = pricing?.form ?? (parsed.bar ? 'BAR' : parsed.design || parsed.coin ? 'COIN' : refinery ? 'BAR' : null);
  const design = parsed.design?.id ?? null;
  const qualifiers = [...parsed.leftover, ...(form === 'BAR' && design ? [design] : [])].sort();
  return {
    s,
    metal,
    weight: parsed.weight,
    form,
    design: form === 'BAR' ? null : design,
    refinery: parsed.design && refinery && parsed.design.mints.includes(refinery) && form !== 'BAR' ? null : refinery,
    qualifiers,
    pricingId: s.pricingProductId ?? null,
  };
}

function indexOf(cat: MatchCatalogue): Index {
  const hit = indexCache.get(cat);
  if (hit) return hit;
  const rows = cat.pricing.map(parseSku).filter((r): r is PricingRow => r !== null);
  const byId = new Map(rows.map((r) => [r.p.id, r]));
  const specifics = (cat.specific ?? []).map((s) => parseSpecific(s, byId));
  const idx = { rows, byId, specifics };
  indexCache.set(cat, idx);
  return idx;
}

function findRow(idx: Index, metal: MatchMetal, weight: string | null, form: 'BAR' | 'COIN', design: string | null, bonded = false): PricingRow | undefined {
  return idx.rows.find((r) => r.metal === metal && r.weight === weight && r.form === form && r.design === design && r.bonded === bonded);
}

// --- metal ---------------------------------------------------------------------------------------

const toSources = (s: MatchInput['sources']): string[] =>
  (Array.isArray(s) ? (s as string[]) : String(s ?? '').split(/[\s,|]+/)).map((x) => x.toLowerCase()).filter(Boolean);

const isZohoSource = (sources: string[]) => sources.some((s) => /zoho|invoice_line|purchase_order/.test(s));

function fitMetals(perOz: number, spot: Partial<Record<MatchMetal, number>>): MatchMetal[] {
  return METALS.filter((m) => {
    const s = spot[m];
    if (!s || s <= 0) return false;
    return perOz >= s * 0.85 && perOz <= s * (m === 'SILVER' ? 1.6 : 1.25);
  });
}

interface MetalRead {
  metal: MatchMetal | null;
  confidence: MatchConfidence;
  how: string;
  problem?: string;
}

function readMetal(p: Parsed, input: MatchInput, grams: number | null, designMetals: MatchMetal[]): MetalRead {
  if (p.metals.size > 1) return { metal: null, confidence: 'UNCLEAR', how: '', problem: 'the name gives two metals' };
  if (p.metals.size === 1) return { metal: [...p.metals][0]!, confidence: 'CERTAIN', how: 'text' };

  const sources = toSources(input.sources);
  const hint = isMetal(input.metal) ? input.metal : null;
  const zoho = isZohoSource(sources) ? ('GOLD' as const) : null;
  const base = hint ?? zoho;
  const baseHow = hint ? 'tab' : 'zoho convention';

  let fits: MatchMetal[] = [];
  const price = input.unitPrice;
  if (price && price > 0 && input.spot && grams && grams > 0) fits = fitMetals(price / (grams / GRAMS_PER_OZ), input.spot);

  if (fits.length === 1) {
    if (base === fits[0]) return { metal: base, confidence: 'CERTAIN', how: `${baseHow}, price agrees` };
    return {
      metal: fits[0]!,
      confidence: 'LIKELY',
      how: base ? `price per oz fits ${fits[0]!.toLowerCase()}, not ${base.toLowerCase()} (${baseHow})` : 'price per oz',
    };
  }
  if (fits.length > 1) {
    if (base && fits.includes(base)) return { metal: base, confidence: 'LIKELY', how: `${baseHow}, price fits ${fits.length} metals` };
    return { metal: null, confidence: 'UNCLEAR', how: '', problem: 'the price fits more than one metal' };
  }
  if (base) return { metal: base, confidence: 'CERTAIN', how: baseHow };
  if (designMetals.length === 1) return { metal: designMetals[0]!, confidence: 'CERTAIN', how: 'only metal sold' };
  return { metal: null, confidence: 'UNCLEAR', how: '', problem: 'no metal in the name or from the source' };
}

// --- the match -----------------------------------------------------------------------------------

const RANK: Record<MatchConfidence, number> = { CERTAIN: 2, LIKELY: 1, UNCLEAR: 0 };
const lower = (a: MatchConfidence, b: MatchConfidence): MatchConfidence => (RANK[a] <= RANK[b] ? a : b);
const metalWord = (m: MatchMetal) => m.toLowerCase();

const none = (reason: string, over: Partial<ProductMatch> = {}): ProductMatch => ({ outcome: 'NONE', confidence: 'UNCLEAR', reason, ...over });

export function matchProductName(input: MatchInput, cat: MatchCatalogue): ProductMatch {
  const idx = indexOf(cat);
  const p = parseProductName(input.text, input.refinery ?? null);

  if (p.empty) return none('no product name');
  if (p.notProduct) return { outcome: 'NOT_A_PRODUCT', confidence: 'CERTAIN', reason: 'a fee, shipment or deposit, not a product' };
  if (p.maybeNotProduct) {
    return { outcome: 'NOT_A_PRODUCT', confidence: 'LIKELY', reason: 'looks like a note, balance or account line', question: 'Mark as not a product?' };
  }
  if (p.problem) return none(p.problem);

  const design = p.design;
  const isSovereign = !!design && design.id.startsWith('sovereign');
  const designMetals = design ? (Object.keys(design.metals) as MatchMetal[]) : [];
  const grams = p.grams ?? (design?.fineGrams ?? null);

  const m = readMetal(p, input, grams, designMetals);
  if (!m.metal) return none(m.problem ?? 'no metal', { weight: p.weight ?? undefined });
  const metal = m.metal;
  if (p.weight && !NATURAL_LABELS.has(p.weight)) return none(`unusual weight ${p.weight}`, { metal, weight: p.weight });
  let conf: MatchConfidence = m.confidence;
  const parts: string[] = [];
  const metalPart = `${metalWord(metal)} (${m.how})`;
  const unsure = (c: MatchConfidence) => {
    conf = lower(conf, c);
  };

  // Redundant mint next to a design: ignore it. Otherwise a refinery stays.
  const refinery = design && p.refinery && design.mints.includes(p.refinery) && !p.bar ? null : p.refinery;

  // Form.
  const sources = toSources(input.sources);
  let form: 'BAR' | 'COIN' | null = null;
  let formNote = '';
  if (p.bar && p.coin && !design) return none('the name says both bar and coin');
  if (p.bar) form = 'BAR';
  else if (p.coin || design || p.obscureWord) form = 'COIN';
  else if (p.weight && !refinery && p.leftover.length > 0) {
    form = 'COIN';
    formNote = 'named piece with no bar word';
    unsure('LIKELY');
  }
  if (!form && p.weight) {
    const fractional = ['1/10oz', '1/4oz', '1/2oz'].includes(p.weight);
    if (refinery && !p.leftover.length) {
      form = 'BAR';
      formNote = 'refinery names a bar';
      if (!BAR_REFINERIES.has(refinery)) unsure('LIKELY');
    } else if (sources.includes('stock_coins') && !sources.includes('stock_bars')) {
      form = 'COIN';
      formNote = 'stock coin';
      unsure('LIKELY');
    } else if (sources.includes('stock_bars') && !sources.includes('stock_coins')) {
      form = 'BAR';
      formNote = 'stock bar';
      unsure('LIKELY');
    } else if (metal === 'SILVER' && /oz$/.test(p.weight) && !p.leftover.length) {
      form = 'COIN';
      formNote = 'silver by the ounce with no bar word';
      unsure('LIKELY');
    } else if (fractional && metal === 'GOLD') {
      form = 'COIN';
      formNote = 'fractional gold is a coin';
      unsure('LIKELY');
    } else if (/g$/.test(p.weight) && !['1g', '2g'].includes(p.weight)) {
      form = 'BAR';
      formNote = 'weight in grams';
      unsure('LIKELY');
    } else if (/kg$/.test(p.weight)) {
      form = 'BAR';
      formNote = 'weight in kg';
      unsure('LIKELY');
    }
  }

  // ---- sovereigns: sold by name, gold only ----
  if (isSovereign && design) {
    if (metal !== 'GOLD') return none(`${design.label} is only sold in gold`, { metal });
    const row = findRow(idx, 'GOLD', null, 'COIN', design.id);
    if (!row) return none(`no ${design.label} pricing row`, { catalogueGap: true, metal });
    const quals = p.leftover.filter((t) => !OBSCURE_COIN_WORDS.has(t) || t === 'proof');
    return finish(idx, row, { ...p, design }, metal, 'COIN', null, quals.length ? lower(conf, 'LIKELY') : conf, [design.label, metalPart], quals.length ? `Match to ${row.p.name}?` : undefined, quals, null, conf);
  }

  // ---- bars ----
  if (form === 'BAR') {
    if (!p.weight) return none('a bar with no weight', { metal });
    const row = (p.bonded ? findRow(idx, metal, p.weight, 'BAR', null, true) : undefined) ?? findRow(idx, metal, p.weight, 'BAR', null);
    if (!row) return none(`no ${p.weight} ${metalWord(metal)} bar pricing row`, { catalogueGap: true, metal, weight: p.weight });
    if (p.bonded && !row.bonded) unsure('LIKELY');
    const quals = [...p.leftover, ...(design ? [design.id] : [])].sort();
    const explained = conf;
    if (p.leftover.length > 0) unsure('LIKELY');
    if (formNote) parts.push(formNote);
    return finish(idx, row, p, metal, 'BAR', refinery, conf, [p.weight, 'bar', ...(design ? [design.label] : []), ...(refinery ? [refinery] : []), metalPart, ...parts], p.leftover.length ? `Match to ${row.p.name}?` : undefined, quals, null, explained);
  }

  // ---- coins ----
  if (form === 'COIN') {
    const obscure = !design && (p.obscureWord || p.leftover.length > 0);
    const weight = p.weight;
    const bonded = p.bonded;

    if (!weight) {
      if (design) {
        const w = design.metals[metal];
        if (!w) return none(`${design.label} is not sold in ${metalWord(metal)}`, { metal });
        const row = findRow(idx, metal, '1oz', 'COIN', design.id) ?? findRow(idx, metal, '1oz', 'COIN', null);
        if (!row) return none(`no 1oz ${metalWord(metal)} ${design.label} row`, { catalogueGap: true, metal });
        const q = row.design ? row.p.name : `1oz ${design.label}`;
        return {
          outcome: 'PRICING',
          productId: row.p.id,
          confidence: 'LIKELY',
          reason: `${design.label} + ${metalPart}, no weight`,
          question: `Match to ${q}?`,
          metal,
          catalogueGap: row.design ? undefined : true,
        };
      }
      return none('a coin with no weight', { metal });
    }

    const base: ProductMatch = { outcome: 'PRICING', confidence: conf, reason: '', metal, weight };
    const reasonBase = [weight, 'coin', ...(design ? [design.label] : p.obscureWord ? [p.obscureWord] : []), metalPart];
    if (formNote) reasonBase.push(formNote);

    const dedicated = design ? findRow(idx, metal, weight, 'COIN', design.id, bonded) : undefined;
    const generic = (bonded ? findRow(idx, metal, weight, 'COIN', null, true) : undefined) ?? findRow(idx, metal, weight, 'COIN', null);

    if (design) {
      const sold = design.metals[metal]?.includes(weight) ?? false;
      const row = dedicated ?? findRow(idx, metal, weight, 'COIN', design.id) ?? generic;
      if (!row) {
        return none(`needs generic ${weight} ${metalWord(metal)} coin row`, { catalogueGap: true, metal, weight });
      }
      let c = conf;
      if (!sold) c = lower(c, 'LIKELY');
      const quals = p.leftover;
      const explained = c;
      if (p.leftover.length > 0) c = lower(c, 'LIKELY');
      return finish(idx, row, p, metal, 'COIN', refinery, c, reasonBase.concat(row.design ? [] : ['generic row']), c === 'LIKELY' ? `Match to ${row.p.name}?` : undefined, quals, design.id, explained);
    }

    // No design named: a plain weight coin, or one we do not hold a row for.
    if (!generic) {
      const gap = `needs generic ${weight} ${metalWord(metal)} coin row`;
      return none(gap, { catalogueGap: true, metal, weight });
    }
    if (obscure) {
      return {
        ...base,
        productId: generic.p.id,
        confidence: lower(conf, 'LIKELY'),
        reason: `${reasonBase.join(' + ')}; not in the catalogue, generic coin row`,
        question: `Match to ${generic.p.name}?`,
        catalogueGap: true,
      };
    }
    return finish(idx, generic, p, metal, 'COIN', refinery, conf, reasonBase, undefined, [], null);
  }

  // ---- no form at all ----
  if (p.weight) return none(`${p.weight} ${metalWord(metal)}: bar or coin?`, { metal, weight: p.weight });
  return none('no weight, form or design', { metal });
}

const BAR_REFINERIES = new Set([
  'PAMP SUISSE', 'VALCAMBI SUISSE', 'ARGOR-HERAEUS', 'HERAEUS', 'UMICORE', 'METALOR', 'CREDIT SUISSE', 'BAIRD & CO', 'C HAFNER',
  'JOHNSON MATTHEY', 'NADIR', 'DEGUSSA', 'OPM METALS', 'ELEMENTAL', 'SEMPSA', 'ASSAY OFFICE', 'RAND REFINERY',
]);

/** Finish a match on a pricing row: look for the one specific product the name points to, else answer with the pricing row. */
function finish(
  idx: Index,
  row: PricingRow,
  p: Parsed,
  metal: MatchMetal,
  form: 'BAR' | 'COIN',
  refinery: string | null,
  conf: MatchConfidence,
  reasonParts: string[],
  question: string | undefined,
  qualifiers: string[],
  designId: string | null,
  confIfSpecific?: MatchConfidence,
): ProductMatch {
  const weightKey = designId?.startsWith('sovereign') || p.design?.id.startsWith('sovereign') ? null : p.weight;
  const designKey = form === 'BAR' ? null : (p.design?.id ?? designId);
  const quals = [...qualifiers].sort();
  const reasonText = reasonParts.join(' + ');
  const searchable = refinery !== null || quals.length > 0 || designKey !== null;
  if (searchable) {
    const cands = idx.specifics.filter(
      (s) =>
        s.metal === metal &&
        s.form === form &&
        s.weight === weightKey &&
        s.design === designKey &&
        s.refinery === refinery &&
        s.qualifiers.length === quals.length &&
        s.qualifiers.every((q, i) => q === quals[i]),
    );
    if (cands.length === 1 && cands[0]!.pricingId != null) {
      const c = cands[0]!;
      return {
        outcome: 'SPECIFIC',
        productId: c.pricingId!,
        salesProductId: c.s.id,
        confidence: confIfSpecific ?? conf,
        reason: `${reasonText} -> ${c.s.name}`,
        ...((confIfSpecific ?? conf) === 'LIKELY' ? { question: `Match to ${c.s.name}?` } : {}),
        metal,
        weight: p.weight ?? undefined,
      };
    }
    if (cands.length > 1) {
      return {
        outcome: 'PRICING',
        productId: row.p.id,
        confidence: conf,
        reason: `${reasonText}; ${cands.length} specific products fit, pricing only`,
        ...(question ? { question } : {}),
        metal,
        weight: p.weight ?? undefined,
      };
    }
  }
  return {
    outcome: 'PRICING',
    productId: row.p.id,
    confidence: conf,
    reason: reasonText,
    ...(question ? { question } : {}),
    metal,
    weight: p.weight ?? undefined,
  };
}
