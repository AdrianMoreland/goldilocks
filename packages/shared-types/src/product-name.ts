/**
 * Product names are written "1oz Gold Bar", never "1 oz Gold Bar" — the
 * trade writes weights without a space, and customer messages and the
 * table are read side by side with the price workbook. Handles decimals and
 * fractions ("2.5 g", "1/10 oz") and leaves any other spacing alone.
 */
const WEIGHT_SPACE_RE = /(\d+(?:[./]\d+)?)\s+(oz|kg|g)\b/gi;

export function normalizeProductName(name: string): string {
  return name.replace(WEIGHT_SPACE_RE, '$1$2').trim();
}
