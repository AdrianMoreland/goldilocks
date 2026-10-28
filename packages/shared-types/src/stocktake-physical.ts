import { normalizeSerial, parseQuantity, parseTsv, type ParseIssue } from './stocktake';

/** Metal groups as the monthly stock workbook splits them (the PGM sheet covers platinum and palladium). */
export const STOCK_METALS = ['GOLD', 'SILVER', 'PGM'] as const;
export type StockMetal = (typeof STOCK_METALS)[number];

/**
 * UNCONFIRMED: carried from last month's list, not yet seen on the shelf. Never assumed present.
 * CONFIRMED: carried from last month and physically seen this month.
 * NEW: found this month and not on last month's list.
 * GONE: on last month's list and no longer here (sold, moved); kept with its history, not deleted.
 */
export const BAR_STATUSES = ['UNCONFIRMED', 'CONFIRMED', 'NEW', 'GONE'] as const;
export type BarStatus = (typeof BAR_STATUSES)[number];

export interface BarImportRow {
  locationCode: string;
  weightLabel: string;
  refinery: string | null;
  serial: string | null;
  grams: number | null;
  details: string | null;
}

export interface BarsImportResult {
  rows: BarImportRow[];
  issues: ParseIssue[];
}

function indexOf(header: string[]): Map<string, number> {
  const m = new Map<string, number>();
  header.forEach((h, i) => {
    const k = h.trim().toLowerCase();
    if (k && !m.has(k)) m.set(k, i);
  });
  return m;
}

const NO_VALUE = new Set(['', 'n/a', 'na', '-', 'none']);
const clean = (v: string | undefined): string | null => {
  const t = (v ?? '').trim();
  return NO_VALUE.has(t.toLowerCase()) ? null : t;
};

/**
 * Reads a bar list pasted from the stock workbook: Branch, Weight, Refinery, Serial, Gram, Details (any order,
 * any extra columns such as CONFIRMED or Sold are ignored). A serial written as "Valcambi Suisse: AG84938"
 * with no Refinery cell is split into refinery and serial, as the silver sheet does. A bar with no serial is
 * kept as a bar with no serial; nothing is invented.
 */
export function parseBarsPaste(text: string): BarsImportResult {
  const table = parseTsv(text);
  const issues: ParseIssue[] = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: 'Nothing to import.' }] };
  const idx = indexOf(header);
  const weightCol = idx.get('weight') ?? idx.get('weight/product') ?? idx.get('product');
  if (weightCol === undefined || !idx.has('branch')) {
    return { rows: [], issues: [{ row: 1, message: 'Needs at least a Branch and a Weight column.' }] };
  }
  const get = (r: string[], name: string) => (idx.has(name) ? r[idx.get(name) ?? -1] : undefined);

  const rows: BarImportRow[] = [];
  table.slice(1).forEach((r, n) => {
    const branch = clean(get(r, 'branch'));
    const weight = clean(r[weightCol]);
    if (!branch && !weight) return;
    if (!branch) return issues.push({ row: n + 2, message: 'Branch is blank.' });
    if (!weight) return issues.push({ row: n + 2, message: 'Weight is blank.' });
    let refinery = clean(get(r, 'refinery'));
    let serialRaw = clean(get(r, 'serial'));
    if (serialRaw && !refinery && serialRaw.includes(':')) {
      const [maker, ...rest] = serialRaw.split(':');
      refinery = clean(maker);
      serialRaw = clean(rest.join(':'));
    }
    const serial = serialRaw ? normalizeSerial(serialRaw) : null;
    rows.push({
      locationCode: branch.toUpperCase(),
      weightLabel: weight,
      refinery,
      serial: serial || null,
      grams: parseQuantity(get(r, 'gram') ?? get(r, 'grams')),
      details: clean(get(r, 'details')),
    });
  });
  return { rows, issues };
}

export interface CoinImportRow {
  locationCode: string;
  item: string;
  quantity: number;
}

/**
 * Reads coin counts as "Item" plus "Quantity" (an optional "Branch" column gives a location; blank means one
 * shared count). Coins are counted by product and quantity, never one row per coin.
 */
export function parseCoinsPaste(text: string): { rows: CoinImportRow[]; issues: ParseIssue[] } {
  const table = parseTsv(text);
  const issues: ParseIssue[] = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: 'Nothing to import.' }] };
  const idx = indexOf(header);
  const itemCol = idx.get('item') ?? idx.get('product') ?? idx.get('weight');
  const qtyCol = idx.get('quantity') ?? idx.get('qty') ?? idx.get('oct') ?? idx.get('sept');
  if (itemCol === undefined || qtyCol === undefined) {
    return { rows: [], issues: [{ row: 1, message: 'Needs an Item column and a Quantity column.' }] };
  }
  const branchCol = idx.get('branch');
  const seen = new Set<string>();
  const rows: CoinImportRow[] = [];
  table.slice(1).forEach((r, n) => {
    const item = (r[itemCol] ?? '').trim();
    if (!item) return;
    const qty = parseQuantity(r[qtyCol]);
    if (qty === null || !Number.isInteger(qty) || qty < 0) {
      return issues.push({ row: n + 2, message: `${item}: quantity is not a whole number.` });
    }
    const loc = branchCol === undefined ? '' : (r[branchCol] ?? '').trim().toUpperCase();
    const key = `${loc}|${item.toLowerCase()}`;
    if (seen.has(key)) return issues.push({ row: n + 2, message: `${item} appears twice.` });
    seen.add(key);
    rows.push({ locationCode: loc, item, quantity: qty });
  });
  return { rows, issues };
}

export interface SerialHolder {
  id: number;
  serial: string | null;
  refinery?: string | null;
  status: BarStatus;
}

/**
 * Serials that appear on more than one live bar. A serial identifies one bar, so a repeat is a data problem to
 * look at, not a reason to block either bar from being counted. Bars marked GONE are ignored.
 */
export function findDuplicateSerials(bars: SerialHolder[]): Map<string, number[]> {
  const by = new Map<string, number[]>();
  for (const b of bars) {
    if (!b.serial || b.status === 'GONE') continue;
    by.set(b.serial, [...(by.get(b.serial) ?? []), b.id]);
  }
  for (const [k, ids] of by) if (ids.length < 2) by.delete(k);
  return by;
}

export interface BarSummary {
  total: number;
  confirmed: number;
  added: number;
  gone: number;
  /** Carried from last month and still not seen: must be resolved or reported, never assumed. */
  unconfirmed: number;
  withoutSerial: number;
}

export function summarizeBars(bars: { status: BarStatus; serial: string | null }[]): BarSummary {
  const s: BarSummary = { total: 0, confirmed: 0, added: 0, gone: 0, unconfirmed: 0, withoutSerial: 0 };
  for (const b of bars) {
    if (b.status === 'GONE') {
      s.gone++;
      continue;
    }
    s.total++;
    if (b.status === 'CONFIRMED') s.confirmed++;
    else if (b.status === 'NEW') s.added++;
    else s.unconfirmed++;
    if (!b.serial) s.withoutSerial++;
  }
  return s;
}

/**
 * What a finalised stocktake hands to the next one: bars that were seen (confirmed or newly found).
 * Unconfirmed bars are not part of the closing position and stay visible in the old report.
 */
export function isClosingBar(status: BarStatus): boolean {
  return status === 'CONFIRMED' || status === 'NEW';
}

/**
 * Decides which pasted bars are new, so pasting the same list twice adds nothing. A serial is the identity of a
 * bar, so a serial already on a live bar is skipped. Bars with no serial have no identity, so they are matched by
 * branch, weight and refinery and skipped only up to the number already on the register: pasting 3 identical
 * unnumbered bars when 2 are there adds 1.
 */
export function planBarImport(
  existing: { locationCode: string; weightLabel: string; refinery: string | null; serial: string | null; status: BarStatus }[],
  incoming: BarImportRow[],
): { toAdd: BarImportRow[]; skipped: number } {
  const liveSerials = new Set(existing.filter((b) => b.serial && b.status !== 'GONE').map((b) => b.serial as string));
  const key = (b: { locationCode: string; weightLabel: string; refinery: string | null }) =>
    `${b.locationCode}|${b.weightLabel.toLowerCase()}|${(b.refinery ?? '').toLowerCase()}`;
  const unnumbered = new Map<string, number>();
  for (const b of existing) {
    if (!b.serial && b.status !== 'GONE') unnumbered.set(key(b), (unnumbered.get(key(b)) ?? 0) + 1);
  }
  const toAdd: BarImportRow[] = [];
  let skipped = 0;
  for (const row of incoming) {
    if (row.serial) {
      if (liveSerials.has(row.serial)) {
        skipped++;
        continue;
      }
      liveSerials.add(row.serial);
      toAdd.push(row);
      continue;
    }
    const left = unnumbered.get(key(row)) ?? 0;
    if (left > 0) {
      unnumbered.set(key(row), left - 1);
      skipped++;
    } else toAdd.push(row);
  }
  return { toAdd, skipped };
}

export const BAR_EXPORT_HEADERS = ['Metal', 'Branch', 'Weight', 'Refinery', 'Serial', 'Gram', 'Status', 'Details'] as const;

const BAR_STATUS_TEXT: Record<BarStatus, string> = {
  UNCONFIRMED: 'Not seen',
  CONFIRMED: 'Confirmed',
  NEW: 'Found (new)',
  GONE: 'Gone',
};

export function buildBarExportRows(
  bars: { metal: StockMetal; locationCode: string; weightLabel: string; refinery: string | null; serial: string | null; grams: number | null; status: BarStatus; details: string | null }[],
): (string | number)[][] {
  return bars.map((b) => [b.metal, b.locationCode, b.weightLabel, b.refinery ?? '', b.serial ?? '', b.grams ?? '', BAR_STATUS_TEXT[b.status], b.details ?? '']);
}

export const COIN_EXPORT_HEADERS = ['Metal', 'Branch', 'Item', 'Last count', 'Counted now', 'Change', 'Details'] as const;

/** Change is blank unless both counts exist, so an uncounted line never looks like a loss. */
export function buildCoinExportRows(
  coins: { metal: StockMetal; locationCode: string; item: string; previousQty: number | null; countedQty: number | null; details: string | null }[],
): (string | number)[][] {
  return coins.map((c) => [
    c.metal,
    c.locationCode,
    c.item,
    c.previousQty ?? '',
    c.countedQty ?? '',
    c.previousQty !== null && c.countedQty !== null ? c.countedQty - c.previousQty : '',
    c.details ?? '',
  ]);
}
