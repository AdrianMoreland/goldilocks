/**
 * Small helpers for product names that settle themselves: the metal a name was seen under, and the Business Central
 * item number a Zoho SKU stands for.
 */
import { parseProductName, type MatchMetal } from './product-match';

const METAL_TOKEN: ReadonlyArray<readonly [RegExp, MatchMetal]> = [
  [/gold/, 'GOLD'],
  [/silver/, 'SILVER'],
  [/platinum/, 'PLATINUM'],
  [/palladium/, 'PALLADIUM'],
];

/**
 * The metal a name was seen under: what its own text says (as the matching engine reads it), else the one metal
 * named by its sources (a tab such as "tradesheet:silver"). Null when neither says, or they say two.
 */
export function deriveMetalHint(
  text: string | null | undefined,
  sources: string | readonly string[] | null | undefined,
  refinery?: string | null,
): MatchMetal | null {
  const read = parseProductName(text, refinery ?? null).metals;
  if (read.size === 1) return [...read][0]!;
  if (read.size > 1) return null;
  const list = (Array.isArray(sources) ? (sources as string[]) : String(sources ?? '').split(/[\s,|]+/)).map((s) => s.toLowerCase());
  const found = new Set<MatchMetal>();
  for (const s of list) for (const [re, m] of METAL_TOKEN) if (re.test(s)) found.add(m);
  return found.size === 1 ? [...found][0]! : null;
}

/**
 * The BC item number inside a Zoho SKU: "1103", "1103-HISTORIC" and "2705.0" all give the number. Null when the SKU
 * is not (or does not start with) a plain item number.
 */
export function bcItemNoFromSku(sku: string | null | undefined): string | null {
  const m = /^\s*(\d{3,6})(?:\.0+)?(?:\s*-\s*[A-Za-z][\w\s-]*)?\s*$/.exec(String(sku ?? ''));
  return m ? m[1]! : null;
}
