/**
 * Resolves what an invoice line, trade or stock row sold to a specific *sales product*, which maps to exactly one
 * *pricing product* (the reduced catalogue behind the price table). Pure: the caller supplies the lists.
 *
 * Order: BC item number, then exact alias, then generic name + normalised refinery, then the review queue.
 *
 * `resolveRowProduct` is the same idea for rows that only need a pricing product: BC item number, saved name
 * decision, generic name + refinery, built-in rules, else not recognised.
 */
import { aliasOk, normaliseProductText } from './product-text';
import { metalInText, pricingSkuFor } from './product-rules';
import type { MetalType } from './spot-price.schema';

export type SalesProductId = string | number;

export interface RefineryAliasEntry {
  /** A spelling seen in the data. */
  alias: string;
  /** The canonical refinery it stands for. */
  refinery: string;
}

const UNKNOWN_REFINERY = new Set(['', 'UNKNOWN', 'N A', 'NA', 'NONE']);

const refineryKey = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

/** "ARGOR HERAEUS" and "ARGOR-HERAEUS" become one refinery; listed aliases map onto their canonical name. Null = not known. */
export function normaliseRefinery(text: string | null | undefined, aliases: readonly RefineryAliasEntry[] = []): string | null {
  const key = refineryKey(String(text ?? ''));
  if (UNKNOWN_REFINERY.has(key)) return null;
  for (const a of aliases) if (refineryKey(a.alias) === key) return refineryKey(a.refinery);
  return key;
}

export interface SalesProductRef {
  id: SalesProductId;
  name: string;
  /** The generic `product_norm` this product is a specific version of, e.g. "1oz bar" or "1/10oz krugerrand". */
  genericNorm: string;
  /** Normalised refinery, or null for products with no refinery (coins). */
  refinery: string | null;
  pricingProductId: number | null;
}

export interface ResolverData {
  salesProducts: readonly SalesProductRef[];
  /** BC item number -> sales product id. */
  bcItems?: ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;
  /** Confirmed alias keys (a normalised product text, or `norm|REFINERY`) -> sales product id. */
  aliases?: ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;
  refineryAliases?: readonly RefineryAliasEntry[];
}

export interface ResolveInput {
  productText?: string | null;
  /** The workbook's `product_norm`, when you have it; otherwise derived from `productText`. */
  productNorm?: string | null;
  refinery?: string | null;
  bcItemNo?: string | null;
}

export type ResolveMethod = 'BC_ITEM' | 'ALIAS' | 'GENERIC_REFINERY';
export type ReviewReason = 'NO_MATCH' | 'AMBIGUOUS' | 'NEEDS_REFINERY';

export type ResolveResult =
  | { status: 'RESOLVED'; method: ResolveMethod; salesProductId: SalesProductId; pricingProductId: number | null }
  | { status: 'REVIEW'; reason: ReviewReason; /** Alias key to confirm in the queue. */ key: string; candidateIds: SalesProductId[] };

type IdMap = ReadonlyMap<string, SalesProductId> | Record<string, SalesProductId>;

const lookup = (m: IdMap | undefined, k: string): SalesProductId | undefined =>
  !m ? undefined : m instanceof Map ? m.get(k) : Object.prototype.hasOwnProperty.call(m, k) ? (m as Record<string, SalesProductId>)[k] : undefined;

export function aliasKey(productNorm: string, refinery: string | null): string {
  return refinery ? `${productNorm}|${refinery}` : productNorm;
}

type Done = (method: ResolveMethod, id: SalesProductId) => ResolveResult | null;

/** Step 3: the generic name plus the refinery. */
function matchGeneric(norm: string, refinery: string | null, key: string, salesProducts: readonly SalesProductRef[], done: Done): ResolveResult {
  if (!norm) return { status: 'REVIEW', reason: 'NO_MATCH', key, candidateIds: [] };
  const sameName = salesProducts.filter((p) => p.genericNorm === norm);
  if (sameName.length === 0) return { status: 'REVIEW', reason: 'NO_MATCH', key, candidateIds: [] };

  if (refinery) {
    const exact = sameName.filter((p) => p.refinery === refinery);
    if (exact.length === 1) return done('GENERIC_REFINERY', exact[0]!.id) as ResolveResult;
    if (exact.length > 1) return { status: 'REVIEW', reason: 'AMBIGUOUS', key, candidateIds: exact.map((p) => p.id) };
    return { status: 'REVIEW', reason: 'NO_MATCH', key, candidateIds: sameName.map((p) => p.id) };
  }

  // No refinery on the row: fine for products that have none (coins), otherwise a person must say which.
  const noRefinery = sameName.filter((p) => p.refinery === null);
  if (noRefinery.length === 1) return done('GENERIC_REFINERY', noRefinery[0]!.id) as ResolveResult;
  return { status: 'REVIEW', reason: sameName.length ? 'NEEDS_REFINERY' : 'NO_MATCH', key, candidateIds: sameName.map((p) => p.id) };
}

export function resolveProduct(input: ResolveInput, data: ResolverData): ResolveResult {
  const byId = new Map(data.salesProducts.map((p) => [p.id, p]));
  const done = (method: ResolveMethod, id: SalesProductId): ResolveResult | null => {
    const p = byId.get(id);
    return p ? { status: 'RESOLVED', method, salesProductId: p.id, pricingProductId: p.pricingProductId } : null;
  };

  const norm = (input.productNorm?.trim() || normaliseProductText(input.productText)).trim();
  const refinery = normaliseRefinery(input.refinery, data.refineryAliases);
  const key = aliasKey(norm, refinery);

  // 1. BC item number is the most specific thing a row can carry.
  const bcItemNo = input.bcItemNo?.trim();
  if (bcItemNo) {
    const hit = lookup(data.bcItems, bcItemNo);
    const r = hit !== undefined ? done('BC_ITEM', hit) : null;
    if (r) return r;
  }

  // 2. A confirmed alias: the exact text + refinery first, then the text alone.
  for (const k of refinery ? [key, norm] : [norm]) {
    const hit = lookup(data.aliases, k);
    const r = hit !== undefined ? done('ALIAS', hit) : null;
    if (r) return r;
  }

  // 3. The generic name plus the refinery.
  return matchGeneric(norm, refinery, key, data.salesProducts, done);
}

// --- rows: the pricing product a trade, lot or invoice line belongs to ---------------------------

/** A saved name decision: a cleaned product text settled to a specific product, or to a pricing product. */
export interface ProductDecision {
  key: string;
  productId: number | null;
  salesProductId: SalesProductId | null;
}

export interface CatalogueProductRef {
  id: number;
  sku: string;
  metalType: MetalType;
}

export interface RowResolverData {
  /** The pricing products (the catalogue). */
  catalogue: readonly CatalogueProductRef[];
  salesProducts?: readonly SalesProductRef[];
  bcItems?: IdMap;
  decisions?: readonly ProductDecision[];
  refineryAliases?: readonly RefineryAliasEntry[];
}

export interface RowResolveInput {
  productText?: string | null;
  metal: MetalType;
  refinery?: string | null;
  bcItemNo?: string | null;
}

export type RowResolveMethod = 'BC_ITEM' | 'ALIAS' | 'GENERIC_REFINERY' | 'RULE' | 'NONE';

export interface RowResolveResult {
  /** The cleaned product text. */
  key: string;
  pricingProductId: number | null;
  /** Only set when the row named a specific product. */
  salesProductId: SalesProductId | null;
  refinery: string | null;
  method: RowResolveMethod;
  /** Platinum or palladium named in the text. */
  metalFromText: MetalType | null;
  /** "scrap" or "melt" in the text: bought back for its metal, not for resale. */
  melt: boolean;
}

const MELT_RE = /\b(scrap|melt)\b/;

/** A decision matches when every word of its key is among the words of the text; most words wins, then the longer key. */
function bestDecision(keyTokens: ReadonlySet<string>, decisions: readonly ProductDecision[]): ProductDecision | null {
  let best: ProductDecision | null = null;
  let bestTokens = 0;
  for (const d of decisions) {
    if (d.productId === null && d.salesProductId === null) continue;
    if (!aliasOk(d.key, d.key)) continue;
    const tokens = d.key.split(' ').filter(Boolean);
    if (tokens.length === 0 || !tokens.every((t) => keyTokens.has(t))) continue;
    if (!best || tokens.length > bestTokens || (tokens.length === bestTokens && d.key.length > best.key.length)) {
      best = d;
      bestTokens = tokens.length;
    }
  }
  return best;
}

/**
 * First hit wins: BC item number, saved name decision, generic name + refinery against the specific products,
 * built-in rules against the catalogue, else NONE. A row keeps the pricing product when there is one and the
 * specific product only when it was named.
 */
export function resolveRowProduct(input: RowResolveInput, data: RowResolverData): RowResolveResult {
  const text = input.productText ?? '';
  const key = normaliseProductText(text);
  const refinery = normaliseRefinery(input.refinery, data.refineryAliases);
  const salesProducts = data.salesProducts ?? [];
  const byId = new Map(salesProducts.map((p) => [p.id, p]));
  const base = {
    key,
    refinery,
    metalFromText: metalInText(key),
    melt: MELT_RE.test(key),
  };
  const viaSales = (method: 'BC_ITEM' | 'ALIAS' | 'GENERIC_REFINERY', id: SalesProductId): RowResolveResult | null => {
    const p = byId.get(id);
    return p ? { ...base, refinery: p.refinery ?? refinery, pricingProductId: p.pricingProductId, salesProductId: p.id, method } : null;
  };

  // 1. BC item number.
  const bcItemNo = input.bcItemNo?.trim();
  if (bcItemNo) {
    const hit = lookup(data.bcItems, bcItemNo);
    const r = hit !== undefined ? viaSales('BC_ITEM', hit) : null;
    if (r) return r;
  }

  // 2. A saved name decision.
  if (key && aliasOk(text, key)) {
    const d = bestDecision(new Set(key.split(' ')), data.decisions ?? []);
    if (d) {
      const r = d.salesProductId !== null ? viaSales('ALIAS', d.salesProductId) : null;
      if (r) return { ...r, pricingProductId: r.pricingProductId ?? d.productId };
      if (d.productId !== null) return { ...base, pricingProductId: d.productId, salesProductId: null, method: 'ALIAS' };
    }
  }

  // 3. The generic name plus the refinery, against the specific products.
  if (key && salesProducts.length > 0) {
    const g = matchGeneric(key, refinery, aliasKey(key, refinery), salesProducts, (method, id) => {
      const p = byId.get(id);
      return p ? { status: 'RESOLVED', method, salesProductId: p.id, pricingProductId: p.pricingProductId } : null;
    });
    if (g.status === 'RESOLVED') {
      const r = viaSales('GENERIC_REFINERY', g.salesProductId);
      if (r) return r;
    }
  }

  // 4. Built-in rules for generic text, against the catalogue.
  const guess = pricingSkuFor(text, input.metal);
  if (guess) {
    for (const sku of guess.candidates) {
      const p = data.catalogue.find((c) => c.sku === sku);
      if (p) return { ...base, pricingProductId: p.id, salesProductId: null, method: 'RULE' };
    }
  }

  // 5. Not recognised.
  return { ...base, pricingProductId: null, salesProductId: null, method: 'NONE' };
}
