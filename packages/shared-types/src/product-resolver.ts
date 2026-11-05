/**
 * Resolves what an invoice line, trade or stock row sold to a specific *sales product*, which maps to exactly one
 * *pricing product* (the reduced catalogue behind the price table). Pure: the caller supplies the lists.
 *
 * Order: BC item number, then exact alias, then generic name + normalised refinery, then the review queue.
 */

/** Port of `productNorm_` in the import script, so text normalised here equals the workbook's `product_norm`. */
export function normaliseProductText(text: string | null | undefined): string {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b20\d\d\b/g, ' ')
    .replace(/krugerrands/g, 'krugerrand')
    .replace(/\bounces?\b/g, 'oz')
    .replace(/\bgrams?\b/g, 'g')
    .replace(/(\d)\s+(oz|g|kg)\b/g, '$1$2')
    .replace(/\b(gold|silver)?\s*(bullion bar|gold bar|bar)\b/g, ' bar ')
    .replace(/\b(gold|investment grade|bullion|coin|coins)\b/g, ' ')
    .replace(/[^a-z0-9/.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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
  id: string;
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
  bcItems?: ReadonlyMap<string, string> | Record<string, string>;
  /** Confirmed alias keys (a normalised product text, or `norm|REFINERY`) -> sales product id. */
  aliases?: ReadonlyMap<string, string> | Record<string, string>;
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
  | { status: 'RESOLVED'; method: ResolveMethod; salesProductId: string; pricingProductId: number | null }
  | { status: 'REVIEW'; reason: ReviewReason; /** Alias key to confirm in the queue. */ key: string; candidateIds: string[] };

const lookup = (m: ReadonlyMap<string, string> | Record<string, string> | undefined, k: string): string | undefined =>
  !m ? undefined : m instanceof Map ? m.get(k) : Object.prototype.hasOwnProperty.call(m, k) ? (m as Record<string, string>)[k] : undefined;

export function aliasKey(productNorm: string, refinery: string | null): string {
  return refinery ? `${productNorm}|${refinery}` : productNorm;
}

export function resolveProduct(input: ResolveInput, data: ResolverData): ResolveResult {
  const byId = new Map(data.salesProducts.map((p) => [p.id, p]));
  const done = (method: ResolveMethod, id: string): ResolveResult | null => {
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
    const r = hit ? done('BC_ITEM', hit) : null;
    if (r) return r;
  }

  // 2. A confirmed alias: the exact text + refinery first, then the text alone.
  for (const k of refinery ? [key, norm] : [norm]) {
    const hit = lookup(data.aliases, k);
    const r = hit ? done('ALIAS', hit) : null;
    if (r) return r;
  }

  // 3. The generic name plus the refinery.
  if (!norm) return { status: 'REVIEW', reason: 'NO_MATCH', key, candidateIds: [] };
  const sameName = data.salesProducts.filter((p) => p.genericNorm === norm);
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
