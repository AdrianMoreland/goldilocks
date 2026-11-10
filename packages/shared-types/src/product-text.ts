/**
 * Product text as it arrives from sheets and invoices, cleaned to one comparable key. Pure.
 */

/** Port of `productNorm_` in the import script, so text normalised here equals the workbook's `product_norm`. */
export function normaliseProductText(text: string | null | undefined): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[()]/g, ' ')
    .replace(/\b20\d\d\b/g, ' ')
    .replace(/krugerrands/g, 'krugerrand')
    .replace(/\bounces?\b/g, 'oz')
    .replace(/\bgrams?\b/g, 'g')
    .replace(/(\d)\s+(oz|g|kg)\b/g, '$1$2')
    .replace(/\b(gold|silver)?\s*(bullion bar|gold bar|bar)\b/g, ' bar ')
    .replace(/\b(gold|investment grade|bullion|coin|coins)\b/g, ' ')
    .replace(/[^a-z0-9/.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => (/^[a-z]{4,}$/.test(w) && /s$/.test(w) && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w))
    .join(' ');
}

/** Input text and the key it must produce. The import script's copy of the rule is checked against the same pairs. */
export const PRODUCT_NORM_EXAMPLES: ReadonlyArray<readonly [string, string]> = [
  ['Full Sovereign', 'full sovereign'],
  ['Sovereign (Full)', 'sovereign full'],
  ['1oz Gold Krugerrand Coin 2023', '1oz krugerrand'],
  ['1/2 oz Philharmonics', '1/2oz philharmonic'],
  ['10 gram gold bars', '10g bar'],
  ['1oz (31.1g) Gold Bar - PAMP', '1oz 31.1g bar pamp'],
  ['Half Ounce (15.5g) Gold Bar', 'half oz 15.5g bar'],
  ['Investment Grade Gold Bullion (grams)', 'g'],
  ['Silver - 1oz Coins -', 'silver 1oz'],
  ['1oz Trees of Life (Mixed Years)', '1oz tree of life mixed year'],
  ['St Gaudens', 'st gauden'],
  ['Lunar Series', 'lunar serie'],
  ['#REF!', 'ref'],
  ['5469.18', '5469.18'],
  ['', ''],
  ['1KG Bar', '1kg bar'],
  ['2.5g Bar', '2.5g bar'],
];

/**
 * Whether a text and its key are fit to be saved as a name decision, or to match one. Rejects sheet errors, keys
 * that say nothing about the product (no words, or just a weight), texts that list several products, and keys
 * that carry a refinery suffix or a marketing phrase.
 */
export function aliasOk(text: string | null | undefined, key: string | null | undefined): boolean {
  const t = String(text ?? '').trim();
  const k = String(key ?? '');
  if (/^#[A-Z/0-9]+[!?]?$/i.test(t)) return false;
  if (k.replace(/[^a-z]/gi, '').length < 3) return false;
  if (/[,&+;]|\band\b/i.test(t)) return false;
  if (/investment/i.test(k)) return false;
  if (k.includes('|')) return false;
  return true;
}
