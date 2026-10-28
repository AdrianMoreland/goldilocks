import { GRAMS_PER_TROY_OUNCE } from './pricing-math';

// ============================================================================
// Variance
// ============================================================================

/**
 * Business Central's Physical Inventory Journal convention used by the month-end stocktake:
 * `Variance = Qty. (Calculated) - (normal safe + customer safe)`. Negative means more was found than BC
 * expects; positive means stock is missing from the shelves.
 *
 * `null` means "not counted yet", never zero: a blank count must not read as "everything is missing".
 * Once a line is marked counted, a blank column counts as 0.
 */
export function computeVariance(
  qtyCalculated: number,
  countedNormal: number | null,
  countedCustomer: number | null,
  counted: boolean,
): number | null {
  if (!counted) return null;
  return qtyCalculated - ((countedNormal ?? 0) + (countedCustomer ?? 0));
}

/** Total physically present, i.e. what goes into BC's `Qty. (Phys. Inventory)`. */
export function totalCounted(countedNormal: number | null, countedCustomer: number | null): number {
  return (countedNormal ?? 0) + (countedCustomer ?? 0);
}

// ============================================================================
// Pasted Excel / Business Central exports
// ============================================================================

export interface ParseIssue {
  row: number;
  message: string;
}

/** Excel gives tab-separated text; quoted cells can hold tabs and newlines. */
export function parseTsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/\r\n?/g, '\n');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"' && cell === '') quoted = true;
    else if (ch === '\t') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      cell = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

/** Accepts "1,234", "1 234", "5.0" and plain numbers; returns null for blanks and non-numbers. */
export function parseQuantity(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const cleaned = raw.trim().replace(/[,\s]/g, '');
  if (cleaned === '') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function headerIndex(header: string[]): Map<string, number> {
  const map = new Map<string, number>();
  header.forEach((h, i) => {
    const key = h.trim().toLowerCase();
    if (key && !map.has(key)) map.set(key, i);
  });
  return map;
}

export interface JournalImportRow {
  itemNo: string;
  description: string;
  locationCode: string;
  qtyCalculated: number;
  batchName: string | null;
  documentNo: string | null;
  entryType: string | null;
  unitAmount: number | null;
  unitCost: number | null;
}

export interface JournalImportResult {
  rows: JournalImportRow[];
  issues: ParseIssue[];
}

/**
 * Reads the Physical Inventory Journal as pasted from Excel. Columns are found by their BC header, so the
 * extra columns the team adds (counts, variance, reasons) and a different column order are both fine.
 * Duplicate Item No. + Location rows are flagged, never merged: BC can list one item twice, and which
 * line is right is a decision for a person.
 */
export function parseJournalPaste(text: string): JournalImportResult {
  const table = parseTsv(text);
  const issues: ParseIssue[] = [];
  if (table.length === 0) return { rows: [], issues: [{ row: 0, message: 'Nothing to import.' }] };

  const idx = headerIndex(table[0] ?? []);
  const col = (name: string) => idx.get(name.toLowerCase());
  const missing = ['Item No.', 'Location Code', 'Qty. (Calculated)'].filter((h) => col(h) === undefined);
  if (missing.length > 0) {
    return { rows: [], issues: [{ row: 1, message: `Missing column(s): ${missing.join(', ')}.` }] };
  }

  const cell = (r: string[], name: string) => {
    const i = col(name);
    return i === undefined ? '' : (r[i] ?? '').trim();
  };

  const rows: JournalImportRow[] = [];
  const seen = new Set<string>();
  table.slice(1).forEach((r, n) => {
    const rowNo = n + 2;
    const itemNo = cell(r, 'Item No.');
    const locationCode = cell(r, 'Location Code');
    const qty = parseQuantity(cell(r, 'Qty. (Calculated)'));
    if (!itemNo) return issues.push({ row: rowNo, message: 'Item No. is blank.' });
    if (!locationCode) return issues.push({ row: rowNo, message: `Item ${itemNo}: Location Code is blank.` });
    if (qty === null || !Number.isInteger(qty)) {
      return issues.push({ row: rowNo, message: `Item ${itemNo}: Qty. (Calculated) is not a whole number.` });
    }
    const key = `${itemNo}|${locationCode}`;
    if (seen.has(key)) return issues.push({ row: rowNo, message: `Item ${itemNo} at ${locationCode} appears twice.` });
    seen.add(key);
    rows.push({
      itemNo,
      description: cell(r, 'Description') || cell(r, 'ItemDescription'),
      locationCode,
      qtyCalculated: qty,
      batchName: cell(r, 'Batch Name') || null,
      documentNo: cell(r, 'Document No.') || null,
      entryType: cell(r, 'Entry Type') || null,
      unitAmount: parseQuantity(cell(r, 'Unit Amount')),
      unitCost: parseQuantity(cell(r, 'Unit Cost')),
    });
  });
  return { rows, issues };
}

// ============================================================================
// Serial numbers
// ============================================================================

/**
 * Serials are identifiers, not numbers: "046156" keeps its zero. Excel sometimes hands a numeric serial
 * back as "251109.0", which is the same bar.
 */
export function normalizeSerial(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/^(\d+)\.0+$/, '$1');
}

/** Splits pasted serial lists on commas, semicolons, tabs and line breaks; blanks and N/A are dropped. */
export function splitSerials(text: string): string[] {
  return text
    .split(/[,;\t\n\r]+/)
    .map(normalizeSerial)
    .filter((s) => s !== '' && s !== 'N/A' && s !== 'NA' && s !== '-');
}

export interface SerialComparison {
  /** In BC and found on the shelf. */
  matched: string[];
  /** In BC but not found physically. */
  missing: string[];
  /** Found physically but not in BC (includes bars BC has no serial for). */
  unexpected: string[];
  /** Typed or scanned more than once: one bar cannot be in two places. */
  duplicatesFound: string[];
  /** Listed more than once in BC: a data problem to escalate, not to merge. */
  duplicatesExpected: string[];
}

function duplicatesOf(list: string[]): string[] {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const s of list) (seen.has(s) ? dup : seen).add(s);
  return [...dup].sort();
}

/** A matching count does not prove the serials are right; this is the check that does. */
export function compareSerials(expectedRaw: string[], foundRaw: string[]): SerialComparison {
  const expected = expectedRaw.map(normalizeSerial).filter(Boolean);
  const found = foundRaw.map(normalizeSerial).filter(Boolean);
  const exp = new Set(expected);
  const fnd = new Set(found);
  return {
    matched: [...fnd].filter((s) => exp.has(s)).sort(),
    missing: [...exp].filter((s) => !fnd.has(s)).sort(),
    unexpected: [...fnd].filter((s) => !exp.has(s)).sort(),
    duplicatesFound: duplicatesOf(found),
    duplicatesExpected: duplicatesOf(expected),
  };
}

export interface TrackingEntry {
  itemNo: string;
  locationCode: string;
  serialNo: string;
  remainingQuantity: number;
  entryNo: string | null;
}

/**
 * Reads the Item Tracking Entries report. Only entries with Remaining Quantity above zero are on hand;
 * the report also lists serials that have already left, so the filter is applied by the caller via
 * {@link onHandSerials} and the whole list is kept here.
 */
export function parseTrackingPaste(text: string): { entries: TrackingEntry[]; issues: ParseIssue[] } {
  const table = parseTsv(text);
  const issues: ParseIssue[] = [];
  if (table.length === 0) return { entries: [], issues: [{ row: 0, message: 'Nothing to import.' }] };
  const idx = headerIndex(table[0] ?? []);
  const need = ['Item No.', 'Location Code', 'Serial No.', 'Remaining Quantity'];
  const missing = need.filter((h) => !idx.has(h.toLowerCase()));
  if (missing.length > 0) {
    return { entries: [], issues: [{ row: 1, message: `Missing column(s): ${missing.join(', ')}.` }] };
  }
  const get = (r: string[], h: string) => (r[idx.get(h.toLowerCase()) ?? -1] ?? '').trim();
  const entries: TrackingEntry[] = [];
  table.slice(1).forEach((r, n) => {
    const remaining = parseQuantity(get(r, 'Remaining Quantity'));
    const itemNo = get(r, 'Item No.');
    if (!itemNo) return issues.push({ row: n + 2, message: 'Item No. is blank.' });
    if (remaining === null) return issues.push({ row: n + 2, message: `Item ${itemNo}: Remaining Quantity is not a number.` });
    entries.push({
      itemNo,
      locationCode: get(r, 'Location Code'),
      // A blank serial is kept as an empty string; it is a recorded fact, not a reason to drop the row.
      serialNo: normalizeSerial(get(r, 'Serial No.')),
      remainingQuantity: remaining,
      entryNo: idx.has('entry no.') ? get(r, 'Entry No.') || null : null,
    });
  });
  return { entries, issues };
}

/** Serials BC believes are still on hand for an item at a location. */
export function onHandSerials(entries: TrackingEntry[], itemNo: string, locationCode: string): string[] {
  return entries
    .filter((e) => e.itemNo === itemNo && e.locationCode === locationCode && e.remainingQuantity > 0 && e.serialNo !== '')
    .map((e) => e.serialNo);
}

// ============================================================================
// BC item to Goldilocks product suggestions
// ============================================================================

export interface SuggestableProduct {
  id: number;
  name: string;
  weight: number;
  category: 'BAR' | 'COIN' | null;
  metalType?: 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM';
}

/**
 * Pulls a weight in grams out of a BC description such as "Umicore - 250g bar", "1oz Pamp Suisse",
 * "Argor-Heraeus 1KG bar" or "1/2oz Krugerrand". Returns null when no weight is stated.
 */
export function parseWeightGrams(description: string): number | null {
  const d = description.toLowerCase();
  const frac = d.match(/(\d+)\s*\/\s*(\d+)\s*oz/);
  if (frac) return (Number(frac[1]) / Number(frac[2])) * GRAMS_PER_TROY_OUNCE;
  const m = d.match(/(\d+(?:\.\d+)?)\s*(kg|g|oz)\b/);
  if (!m) return null;
  const n = Number(m[1]);
  if (m[2] === 'kg') return n * 1000;
  if (m[2] === 'oz') return n * GRAMS_PER_TROY_OUNCE;
  return n;
}

/** The metal a BC description names ("1oz Gold Britannia", "Platinum Valcambi Suisse 5g bars"), or null when it names none. */
export function parseMetal(description: string): 'GOLD' | 'SILVER' | 'PLATINUM' | 'PALLADIUM' | null {
  const d = description.toLowerCase();
  const found = (['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM'] as const).filter((m) => d.split(/[^a-z]+/).includes(m.toLowerCase()));
  return found.length === 1 ? (found[0] ?? null) : null;
}

export type MappingSuggestion =
  | { status: 'SUGGESTED'; productId: number }
  | { status: 'AMBIGUOUS'; productIds: number[] }
  | { status: 'NONE' };

/**
 * A starting point for the person confirming the mapping, never a decision. A single hit still needs
 * confirming; several hits (gold and silver 1oz, say) are returned as ambiguous. Matches on weight and,
 * when the description says so, bar or coin.
 */
export function suggestProductForBcItem(description: string, products: SuggestableProduct[]): MappingSuggestion {
  const grams = parseWeightGrams(description);
  if (grams === null) return { status: 'NONE' };
  const wantsBar = /\bbar\b/i.test(description);
  const wantsCoin = /\bcoin\b/i.test(description);
  const metal = parseMetal(description);
  const hits = products.filter((p) => {
    if (metal && p.metalType && p.metalType !== metal) return false;
    if (Math.abs(p.weight - grams) > Math.max(0.05, grams * 0.005)) return false;
    if (wantsBar && p.category === 'COIN') return false;
    if (wantsCoin && p.category === 'BAR') return false;
    return true;
  });
  if (hits.length === 0) return { status: 'NONE' };
  if (hits.length === 1) return { status: 'SUGGESTED', productId: hits[0]?.id ?? 0 };

  // Same weight and metal, several products (1oz Britannia, Maple, Krugerrand): use the coin's own name to narrow.
  const skip = new Set(['mixed', 'years', 'year', 'coin', 'coins', 'bars', 'bar', 'gold', 'silver', 'platinum', 'palladium']);
  const words = (s: string) => s.toLowerCase().split(/[^a-z]+/).filter((w) => w.length >= 4 && !skip.has(w));
  const wanted = words(description);
  const score = (p: SuggestableProduct) => {
    const have = new Set(words(p.name));
    return wanted.filter((w) => have.has(w)).length;
  };
  const best = Math.max(...hits.map(score));
  const narrowed = best > 0 ? hits.filter((p) => score(p) === best) : hits;
  if (narrowed.length === 1) return { status: 'SUGGESTED', productId: narrowed[0]?.id ?? 0 };
  return { status: 'AMBIGUOUS', productIds: narrowed.map((p) => p.id) };
}

// ============================================================================
// Summary and export
// ============================================================================

export interface CountLine {
  itemNo: string;
  description: string;
  locationCode: string;
  qtyCalculated: number;
  countedNormal: number | null;
  countedCustomer: number | null;
  counted: boolean;
  reason: string | null;
  serialsChecked: 'YES' | 'NO' | 'NA' | null;
  serialNote: string | null;
  batchName: string | null;
  documentNo: string | null;
  entryType: string | null;
  unitAmount: number | null;
  unitCost: number | null;
}

export interface StocktakeSummary {
  lines: number;
  counted: number;
  uncounted: number;
  withVariance: number;
  netVariance: number;
}

export function summarizeLines(lines: CountLine[]): StocktakeSummary {
  let counted = 0;
  let withVariance = 0;
  let netVariance = 0;
  for (const l of lines) {
    const v = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted);
    if (v === null) continue;
    counted++;
    if (v !== 0) withVariance++;
    netVariance += v;
  }
  return { lines: lines.length, counted, uncounted: lines.length - counted, withVariance, netVariance };
}

/** The journal's own columns first, in BC's order, then the team's added columns, as the accounts team receives it. */
export const JOURNAL_EXPORT_HEADERS = [
  'Batch Name',
  'Posting Date',
  'Entry Type',
  'Document No.',
  'Item No.',
  'Description',
  'Location Code',
  'Salespers./Purch. Code',
  'Qty. (Calculated)',
  'Quantity Counted (normal Safe)',
  'Quantity Counted (customer Safe with sale after 1 Sept)',
  'Variance',
  'Reason for Variance',
  'Serial Numbers Checked (if applicable) (Yes/No/N/A)',
  'Note any serial number discrepancies',
  'Qty. (Phys. Inventory)',
  'Quantity',
  'Unit Amount',
  'Amount',
  'Unit Cost',
  'Applies-to Entry',
  'ItemDescription',
] as const;

const SERIALS_LABEL = { YES: 'Yes', NO: 'No', NA: 'N/A' } as const;

/**
 * One row per line. Uncounted lines leave the count, variance and phys. columns blank rather than
 * writing zeros, and `Qty. (Phys. Inventory)` keeps BC's calculated value so the file is not mistaken
 * for a posted count. `Quantity` is BC's own adjustment (phys. minus calculated), the opposite sign to
 * Variance, and is blank until the line is counted.
 */
export function buildJournalExportRows(lines: CountLine[], postingDate: string | null): (string | number)[][] {
  return lines.map((l) => {
    const variance = computeVariance(l.qtyCalculated, l.countedNormal, l.countedCustomer, l.counted);
    const phys = l.counted ? totalCounted(l.countedNormal, l.countedCustomer) : l.qtyCalculated;
    return [
      l.batchName ?? '',
      postingDate ?? '',
      l.entryType ?? '',
      l.documentNo ?? '',
      l.itemNo,
      l.description,
      l.locationCode,
      '',
      l.qtyCalculated,
      l.countedNormal ?? '',
      l.countedCustomer ?? '',
      variance ?? '',
      l.reason ?? '',
      l.serialsChecked ? SERIALS_LABEL[l.serialsChecked] : '',
      l.serialNote ?? '',
      phys,
      l.counted ? phys - l.qtyCalculated : '',
      l.unitAmount ?? '',
      '',
      l.unitCost ?? '',
      '',
      l.description,
    ];
  });
}

/** Issue types from the manager's month-end guide. */
export const DISCREPANCY_ISSUE_TYPES = ['QUANTITY', 'LOCATION', 'SERIAL', 'PAID_NOT_COLLECTED', 'OTHER'] as const;
export type DiscrepancyIssueType = (typeof DISCREPANCY_ISSUE_TYPES)[number];

export const ISSUE_TYPE_LABELS: Record<DiscrepancyIssueType, string> = {
  QUANTITY: 'Quantity',
  LOCATION: 'Location',
  SERIAL: 'Serial Number',
  PAID_NOT_COLLECTED: 'Paid-but-not-collected',
  OTHER: 'Other',
};

export interface RegisterEntry {
  itemNo: string | null;
  description: string;
  issueType: DiscrepancyIssueType;
  bcShows: string;
  physicalFound: string;
  serialNo: string | null;
  action: string;
  resolved: boolean;
}

export const REGISTER_EXPORT_HEADERS = [
  'Item No.',
  'Description',
  'Issue Type',
  'BC Shows',
  'Physical Count / Found',
  'Serial No.',
  'Action / Notes',
  'Resolved',
] as const;

export function buildRegisterExportRows(entries: RegisterEntry[]): string[][] {
  return entries.map((e) => [
    e.itemNo ?? '',
    e.description,
    ISSUE_TYPE_LABELS[e.issueType],
    e.bcShows,
    e.physicalFound,
    e.serialNo ?? '',
    e.action,
    e.resolved ? 'Yes' : 'No',
  ]);
}

/** RFC 4180 CSV; opens in Excel. Cells that would be read as a formula are prefixed so pasted text cannot run one. */
export function toCsv(headers: readonly string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => {
    let s = String(v);
    if (typeof v === 'string' && /^[=+\-@]/.test(s) && Number.isNaN(Number(s))) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\r\n');
}
