import { normalizeReference, parseSheetDate } from './customer-orders';

/**
 * Reading a monthly trade sheet (.xlsx exported from Google Sheets). Pure functions only: the browser reads the
 * workbook with its cell fills and hands plain cells here, and the API checks the same rows again with these
 * functions. Nothing in this file guesses: a row it cannot classify is returned with an issue, never forced.
 *
 * Money is returned as plain numbers straight from the sheet. The API converts them to Decimal at the boundary;
 * nothing here adds, subtracts or rounds money.
 */

// --- cells -------------------------------------------------------------------------

export type SheetValue = string | number | boolean | Date | null | undefined;

/** One cell: its value, and its background colour as read from the file (ARGB like "FF34A853", or null). */
export interface SheetCell {
  value: SheetValue;
  fill?: string | null;
}
export type SheetRow = SheetCell[];

const text = (v: SheetValue): string => {
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
};

/** Numbers as written in the sheet. Blank, "N/A", "-" and Excel errors ("#DIV/0!") are null, never zero. */
export function parseSheetNumber(v: SheetValue): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const t = text(v).replace(/[£€$,\s]/g, '');
  if (!t || t === '-' || t.toLowerCase() === 'n/a' || t.startsWith('#')) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** ISO date (yyyy-mm-dd) from a Date, an Excel serial or the text forms parseSheetDate already knows. */
export function toIsoDate(v: SheetValue): string | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  if (v === null || v === undefined || v === '') return null;
  return parseSheetDate(String(v));
}

// --- cell colours ------------------------------------------------------------------

export type FillKind = 'GREEN' | 'BLUE' | 'YELLOW' | 'NONE';

/**
 * The sheet uses colour as data: green on the Collected cell means collected (October 2026 has a value in that
 * cell on 1 of 167 rows but green on 44), light blue on an empty CPTY cell means paid and waiting for a hedge,
 * yellow marks a hedge placed on an order. White and theme fills mean nothing.
 */
export function fillKind(fill: string | null | undefined): FillKind {
  const f = (fill ?? '').replace('#', '').toUpperCase();
  const rgb = f.length === 8 ? f.slice(2) : f;
  if (rgb === '34A853') return 'GREEN';
  if (rgb === 'C9DAF8') return 'BLUE';
  if (rgb === 'FFE599') return 'YELLOW';
  return 'NONE';
}

// --- headers -----------------------------------------------------------------------

/** "Bought @:", "Price / Item:" and "price/item" are one header. The sheets mix case, colons and spaces. */
export function stripHeader(h: SheetValue): string {
  return text(h)
    .toLowerCase()
    .replace(/[\s:?]+/g, '');
}

export const SALE_FIELDS = [
  'branch',
  'initials',
  'client',
  'qty',
  'product',
  'date',
  'spot',
  'cpty',
  'cost',
  'receipt',
  'profit',
  'margin',
  'vatDue',
  'totalPrice',
  'aml',
  'paid',
  'ordered',
  'delivered',
  'collected',
  'notes',
  'netHedging',
  'boughtAt',
  'soldAt',
  'reference',
  'hedgingNotes',
] as const;
export type SaleField = (typeof SALE_FIELDS)[number];

export const PURCHASE_FIELDS = [
  'branch',
  'initials',
  'client',
  'metal',
  'qty',
  'product',
  'spot',
  'received',
  'pricePaid',
  'pricePerItem',
  'datePaid',
  'hedgedAt',
  'melt',
  'comments',
  'reference',
] as const;
export type PurchaseField = (typeof PURCHASE_FIELDS)[number];

const SALE_ALIASES: Record<SaleField, string[]> = {
  branch: ['branch'],
  initials: ['initials'],
  client: ['client'],
  qty: ['qty', 'quantity'],
  product: ['product', 'order'],
  date: ['date'],
  spot: ['spot', 'spotprice'],
  cpty: ['cpty'],
  cost: ['cost'],
  receipt: ['receipt'],
  profit: ['profit'],
  margin: ['margin'],
  vatDue: ['vatdue'],
  totalPrice: ['totalprice'],
  aml: ['aml'],
  paid: ['paid'],
  ordered: ['ordered'],
  delivered: ['delivered', 'assigned'],
  collected: ['collected'],
  notes: ['notes'],
  netHedging: ['nethedging', 'nethedgin'],
  boughtAt: ['bought@'],
  soldAt: ['sold@'],
  reference: ['reference', 'ref'],
  hedgingNotes: ['hedgingnotes'],
};

const PURCHASE_ALIASES: Record<PurchaseField, string[]> = {
  branch: ['branch'],
  initials: ['initials'],
  client: ['client'],
  metal: ['metal'],
  qty: ['qty', 'quantity'],
  product: ['product'],
  spot: ['spot', 'spotprice'],
  received: ['received', 'datereceived'],
  pricePaid: ['pricepaid'],
  pricePerItem: ['price/item', 'priceperitem'],
  datePaid: ['datepaid'],
  hedgedAt: ['hedgedat', 'hedged'],
  melt: ['melt'],
  comments: ['comments'],
  reference: ['reference', 'ref'],
};

/**
 * The RawG tab has two Collected columns: a true/false flag (a formula whose saved value is often missing) and,
 * further right, "Collected:" holding the date. The date is the real record, so the flag is renamed out of the way
 * and the date column is the one the importer reads.
 */
export function normaliseBackfillHeaders(headers: SheetValue[]): SheetValue[] {
  const hits = headers.map((h, i) => (stripHeader(h) === 'collected' ? i : -1)).filter((i) => i !== -1);
  if (hits.length < 2) return headers;
  return headers.map((h, i) => (i === hits[0] ? 'Collected (flag)' : h));
}

export type HeaderMap<F extends string> = Partial<Record<F, number>>;

/** First occurrence of a header wins: the sheets repeat "Net Hedging", "Bought @" and "Comments" further right. */
function mapHeaders<F extends string>(headers: SheetValue[], aliases: Record<F, string[]>): HeaderMap<F> {
  const stripped = headers.map(stripHeader);
  const map: HeaderMap<F> = {};
  for (const field of Object.keys(aliases) as F[]) {
    const index = stripped.findIndex((h) => h !== '' && aliases[field].includes(h));
    if (index !== -1) map[field] = index;
  }
  return map;
}

export const mapSaleHeaders = (headers: SheetValue[]): HeaderMap<SaleField> => mapHeaders(headers, SALE_ALIASES);
export const mapPurchaseHeaders = (headers: SheetValue[]): HeaderMap<PurchaseField> => mapHeaders(headers, PURCHASE_ALIASES);

/**
 * The month a file covers, read from the dates in its rows, for a file whose name does not say. It is the month of
 * the newest sale or purchase date that is not in the future, so a master file that runs January to August reads as
 * 2026-08. A stray date far in the past or the future (a typo such as the year 206) cannot win. Null when no tab
 * holds a usable date.
 */
export function guessSheetMonthFromTabs(
  tabs: ReadonlyArray<{ headers: SheetValue[]; rows: ReadonlyArray<{ cells: SheetValue[] }> }>,
  now: Date = new Date(),
): string | null {
  const latestAllowed = new Date(now.getTime() + 31 * 86400000).toISOString().slice(0, 10);
  const earliestAllowed = '2020-01-01';
  let best: string | null = null;
  for (const tab of tabs) {
    const columns = [mapSaleHeaders(tab.headers).date, mapPurchaseHeaders(tab.headers).received].filter((c): c is number => c !== undefined);
    if (columns.length === 0) continue;
    for (const row of tab.rows) {
      for (const column of columns) {
        const iso = toIsoDate(row.cells[column] ?? null);
        if (iso && iso >= earliestAllowed && iso <= latestAllowed && (best === null || iso > best)) best = iso;
      }
    }
  }
  return best ? best.slice(0, 7) : null;
}

/**
 * The header is on row 1 in the real sheets and on row 2 in the July copy (row 1 is a timestamp). Looks at the
 * first rows for the one that names a reference column and enough other known columns.
 */
export function findHeaderRow(rows: SheetValue[][], kind: 'sale' | 'purchase', lookAhead = 5): number {
  const limit = Math.min(rows.length, lookAhead);
  for (let i = 0; i < limit; i++) {
    const row = rows[i] ?? [];
    const map = kind === 'sale' ? mapSaleHeaders(row) : mapPurchaseHeaders(row);
    if (map.reference !== undefined && Object.keys(map).length >= 6) return i;
  }
  return -1;
}

// --- tabs --------------------------------------------------------------------------

export type TabKind = 'IE_GOLD_SALES' | 'IE_SILVER_SALES' | 'IE_GOLD_PURCHASES' | 'IE_SILVER_PURCHASES';

export interface TabClassification {
  kind: TabKind | null;
  /** Why a tab is not imported, for the preview. Null when it is. */
  skipReason: string | null;
}

export type ImportSource = 'TRADESHEET' | 'BACKFILL';

/**
 * Older months name the purchases tab "IE - Purchases" or "IE - GP". All of those are Irish gold purchases.
 * A backfill file is the July copy, where Jan to Jun 2026 sit in one `RawG` tab (gold sales) and one `RawGP` tab
 * (gold purchases): those two names count only when the file is marked as a backfill.
 */
export function classifyTab(name: string, source: ImportSource = 'TRADESHEET'): TabClassification {
  const n = name.trim().toLowerCase().replace(/\s+/g, ' ');
  if (source === 'BACKFILL') {
    if (n === 'rawg') return { kind: 'IE_GOLD_SALES', skipReason: null };
    if (n === 'rawgp') return { kind: 'IE_GOLD_PURCHASES', skipReason: null };
    return { kind: null, skipReason: 'A backfill file is read from its RawG and RawGP tabs only.' };
  }
  if (n === 'ie - gold') return { kind: 'IE_GOLD_SALES', skipReason: null };
  if (n === 'ie - silver') return { kind: 'IE_SILVER_SALES', skipReason: null };
  if (n === 'ie-gp' || n === 'ie - gp' || n === 'ie - purchases') return { kind: 'IE_GOLD_PURCHASES', skipReason: null };
  if (n === 'ie-sp' || n === 'ie - sp') return { kind: 'IE_SILVER_PURCHASES', skipReason: null };
  if (n === 'bonded') return { kind: null, skipReason: 'Bonded is modelled separately, later.' };
  if (n.startsWith('es ')) return { kind: null, skipReason: 'Spain tabs are imported later.' };
  return { kind: null, skipReason: 'Not a trade or purchase tab.' };
}

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/** "October 2026 - EU Trade Sheet (1).xlsx" is 2026-10. Null when the name does not say, so a person picks. */
export function guessSheetMonth(fileName: string): string | null {
  const lower = fileName.toLowerCase();
  const year = /\b(20\d{2})\b/.exec(lower)?.[1];
  if (!year) return null;
  const idx = MONTH_NAMES.findIndex((m) => new RegExp(`\\b${m}\\b|\\b${m.slice(0, 3)}\\b`).test(lower));
  if (idx !== -1) return `${year}-${String(idx + 1).padStart(2, '0')}`;
  const numeric = /\b(20\d{2})[-_.](0[1-9]|1[0-2])\b/.exec(lower);
  return numeric ? `${numeric[1]}-${numeric[2]}` : null;
}

// --- references --------------------------------------------------------------------

export type ReferenceType = 'G' | 'S' | 'B' | 'GP' | 'SP' | 'P';

export interface ParsedReference {
  /** Two-letter branch prefix when there is one (DU, CO, BL, BC, ZU). Older references have none. */
  branch: string | null;
  type: ReferenceType;
  role: 'SALE' | 'PURCHASE';
  /** Known from the type letter. A bare "P" purchase (older sheets) is gold or silver, so it is null. */
  metal: 'GOLD' | 'SILVER' | null;
  year: number;
  month: number;
  counter: number;
}

const REFERENCE_RE = /^(?:([A-Z]{2})-?)?(GP|SP|G|S|P|B)-?(\d{4})(\d{2})(\d{1,4})$/;

/**
 * DU-G20261002 is branch DU, a gold sale (G), October 2026, row 02. Purchases are GP (gold) and SP (silver);
 * the July template wrote GP-20260673, older sheets wrote P20250102 or G20260102 with no branch. Returns null
 * for anything else, so a typo is visible instead of half-parsed.
 */
export function parseReference(raw: string | null | undefined): ParsedReference | null {
  const m = REFERENCE_RE.exec(normalizeReference(raw));
  if (!m) return null;
  const month = Number(m[4]);
  if (month < 1 || month > 12) return null;
  const type = m[2] as ReferenceType;
  return {
    branch: m[1] ?? null,
    type,
    role: type === 'G' || type === 'S' || type === 'B' ? 'SALE' : 'PURCHASE',
    metal: type === 'G' || type === 'GP' ? 'GOLD' : type === 'S' || type === 'SP' ? 'SILVER' : null,
    year: Number(m[3]),
    month,
    counter: Number(m[5]),
  };
}

/**
 * The form two references are compared in: spacing, case and hyphens folded away, so "BL -GP20260654" and
 * "BL-GP20260654" match. Nothing else is folded: a reference with the wrong branch is a different reference.
 */
export function referenceMatchKey(raw: string | null | undefined): string {
  return normalizeReference(raw).replace(/-/g, '');
}

/** Occurrence number per row (1 for the first use of a reference, 2 for a repeat). Repeats are history errors. */
export function assignOccurrences(references: Array<string | null | undefined>): number[] {
  const seen = new Map<string, number>();
  return references.map((r) => {
    const key = referenceMatchKey(r);
    if (!key) return 0;
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return n;
  });
}

// --- CPTY and trade state -----------------------------------------------------------

export type CptyKind = 'EMPTY' | 'QUOTE_ONLY' | 'HEDGED' | 'DEFERRED' | 'LOT_REF' | 'SUPPLIER_INVOICE' | 'OTHER';

export interface CptyInfo {
  kind: CptyKind;
  /** The cell as written, trimmed. */
  raw: string;
  /** Set for LOT_REF: the purchase reference in the form lots are compared in. */
  lotKey?: string;
  /** Set for SUPPLIER_INVOICE: the supplier name and its invoice number, e.g. StoneX and 510873. */
  supplier?: string;
  supplierInvoice?: string;
}

/**
 * What the CPTY cell says. The staff type "Quote Only" on a quote, clear it when the customer has paid, write
 * "HEDGED" when the manager hedges, then replace it with the purchase line (a GP reference) or the supplier
 * invoice (StoneX / Coininvest). "Deferred" marks a hedged sale that got no purchase line before month end.
 * Case, trailing spaces and the "Deffered" typo are all in the real data.
 */
export function classifyCpty(value: SheetValue): CptyInfo {
  const raw = text(value);
  if (!raw) return { kind: 'EMPTY', raw };
  const lower = raw.toLowerCase();
  if (/^quote\s*only\b/.test(lower)) return { kind: 'QUOTE_ONLY', raw };
  if (/^def+er+ed\b/.test(lower)) return { kind: 'DEFERRED', raw };
  if (/^hedged\b/.test(lower)) return { kind: 'HEDGED', raw };
  const ref = parseReference(raw);
  if (ref && ref.role === 'PURCHASE') return { kind: 'LOT_REF', raw, lotKey: referenceMatchKey(raw) };
  const supplier = /^([A-Za-z][A-Za-z. ]*?)\s*#?\s*(\d{4,})$/.exec(raw);
  if (supplier) return { kind: 'SUPPLIER_INVOICE', raw, supplier: supplier[1]!.trim(), supplierInvoice: supplier[2]! };
  return { kind: 'OTHER', raw };
}

export const TRADE_STATES = ['QUOTE', 'AWAITING_HEDGE', 'HEDGED', 'INVOICED', 'DEFERRED', 'UNKNOWN'] as const;
export type TradeState = (typeof TRADE_STATES)[number];

export interface TradeStateResult {
  state: TradeState;
  /** True when the state needed the cell colour (an empty CPTY with a blue fill). The preview marks these. */
  fromColour: boolean;
}

/** The real sheets have no Status column. An empty CPTY with no colour could be anything, so it stays UNKNOWN. */
export function deriveTradeState(cpty: CptyInfo, cptyFill: string | null | undefined): TradeStateResult {
  switch (cpty.kind) {
    case 'QUOTE_ONLY':
      return { state: 'QUOTE', fromColour: false };
    case 'HEDGED':
      return { state: 'HEDGED', fromColour: false };
    case 'DEFERRED':
      return { state: 'DEFERRED', fromColour: false };
    case 'LOT_REF':
    case 'SUPPLIER_INVOICE':
      return { state: 'INVOICED', fromColour: false };
    case 'EMPTY':
      return fillKind(cptyFill) === 'BLUE' ? { state: 'AWAITING_HEDGE', fromColour: true } : { state: 'UNKNOWN', fromColour: false };
    default:
      return { state: 'UNKNOWN', fromColour: false };
  }
}

export interface CollectedInfo {
  collected: boolean;
  /** Collected cell has a date or any text (VALUE), or is filled green (FILL). */
  source: 'VALUE' | 'FILL' | null;
  date: string | null;
}

export function readCollected(cell: SheetCell | undefined): CollectedInfo {
  if (!cell) return { collected: false, source: null, date: null };
  const value = cell.value;
  const hasValue = value instanceof Date || (typeof value === 'number' && value !== 0) || (typeof value === 'string' && value.trim() !== '') || value === true;
  if (hasValue) return { collected: true, source: 'VALUE', date: toIsoDate(value instanceof Date || typeof value === 'string' ? value : null) };
  if (fillKind(cell.fill) === 'GREEN') return { collected: true, source: 'FILL', date: null };
  return { collected: false, source: null, date: null };
}

// --- deferred links ------------------------------------------------------------------

export interface DeferredLinks {
  /** References this sale was carried from ("Deferred from DU-G202609226"). */
  from: string[];
  /** References this sale was carried to ("Deferred to DU-G202609132-3"). */
  to: string[];
}

const LINK_TOKEN_RE = /(?:[A-Za-z]{2}\s*-\s*)?[GS]\d{7,}/gi;

/** Reads "Deferred from ..." / "Deferred to ..." in NOTES (or CPTY), with several references and spacing slips. */
export function parseDeferredLinks(...cells: Array<string | null | undefined>): DeferredLinks {
  const out: DeferredLinks = { from: [], to: [] };
  const all = cells.filter(Boolean).join(' | ');
  const re = /deferred\s+(from|to)\s+([^|]*)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(all)) !== null) {
    const refs = (m[2]!.match(LINK_TOKEN_RE) ?? []).map((t) => normalizeReference(t));
    const target = m[1]!.toLowerCase() === 'from' ? out.from : out.to;
    for (const r of refs) if (!target.includes(r)) target.push(r);
  }
  return out;
}

// --- purchase remaining ---------------------------------------------------------------

export interface SoldInfo {
  /** Items the comment says were sold. Null when the comment says nothing about sales. */
  soldCount: number | null;
  allSold: boolean;
  /** What is left according to the comment alone. The allocations from sales are the real answer. */
  remaining: number;
  /** True when the comment was a typo, a bare "sold", more sold than bought, or notes a person should read. */
  review: boolean;
  reason: string | null;
}

const ALL_SOLD_RE = /\b(all\s*sold|sold\s*out|fully\s*matched|all\s*matched|matched\s*instantly|instantly\s*matched)\b/;
const CONCERN_RE = /damag|lost|missing|return|faulty|stolen/;

/**
 * "3 sold", "ALL SOLD" and friends. The only record of what is left of a purchase in the sheets is this
 * free text, so anything beyond the plain forms is flagged for a person instead of being guessed.
 */
export function parseSoldComment(comment: SheetValue, qty: number): SoldInfo {
  const raw = text(comment);
  const lower = raw.toLowerCase();
  const none: SoldInfo = { soldCount: null, allSold: false, remaining: qty, review: false, reason: null };
  if (!raw) return none;

  if (ALL_SOLD_RE.test(lower)) return { soldCount: qty, allSold: true, remaining: 0, review: false, reason: null };

  const counts = [...lower.matchAll(/(\d+)\s*sold/g)].map((m) => Number(m[1]));
  if (counts.length > 0) {
    const sold = counts.reduce((a, b) => a + b, 0);
    const over = sold > qty;
    return {
      soldCount: sold,
      allSold: false,
      remaining: Math.max(0, qty - sold),
      review: over,
      reason: over ? `Comment says ${sold} sold but only ${qty} were bought.` : null,
    };
  }

  const squashed = lower.replace(/[^a-z]/g, '');
  if (squashed.includes('allsold')) {
    return { soldCount: qty, allSold: true, remaining: 0, review: true, reason: `Read "${raw}" as all sold; check the spelling.` };
  }
  if (/\bsold\b/.test(lower)) {
    return { soldCount: qty, allSold: true, remaining: 0, review: true, reason: `"${raw}" has no number; read as all sold.` };
  }
  if (CONCERN_RE.test(lower)) return { ...none, review: true, reason: `Comment may affect stock: "${raw}".` };
  return none;
}

// --- products -------------------------------------------------------------------------

export interface QtyAndProduct {
  qty: number | null;
  product: string;
}

/** "5 x 10g gold bar", "5x 10g bar" and "1oz Eagles x 3" carry the quantity in the product cell. */
export function extractQtyAndProduct(value: SheetValue): QtyAndProduct {
  const s = text(value).replace(/×/g, 'x');
  if (!s) return { qty: null, product: '' };
  let m = /^(\d+)\s*x\s*(.+)$/i.exec(s);
  if (m) return { qty: Number(m[1]), product: m[2]!.trim() };
  m = /^(.+?)\s*x\s*(\d+)$/i.exec(s);
  if (m) return { qty: Number(m[2]), product: m[1]!.trim() };
  return { qty: null, product: s };
}

// --- fingerprints -----------------------------------------------------------------------

/** A short stable hash of the fields that matter, to tell on reimport whether a row changed. Not a security hash. */
export function fingerprint(parts: Array<string | number | boolean | null | undefined>): string {
  const s = parts.map((p) => (p === null || p === undefined ? '' : String(p))).join('\u001f');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// --- rows ---------------------------------------------------------------------------------

export interface ParsedSale {
  /** Row number in the tab, 1-based, for messages. */
  sourceRow: number;
  reference: string;
  parsedReference: ParsedReference | null;
  branchCode: string | null;
  initials: string | null;
  client: string;
  qty: number | null;
  product: string;
  date: string | null;
  spot: number | null;
  cpty: CptyInfo;
  state: TradeState;
  stateFromColour: boolean;
  collected: CollectedInfo;
  cost: number | null;
  receipt: number | null;
  profit: number | null;
  margin: number | null;
  vatDue: number | null;
  totalPrice: number | null;
  paid: string | null;
  netHedging: number | null;
  boughtAt: number | null;
  soldAt: number | null;
  notes: string | null;
  hedgingNotes: string | null;
  deferred: DeferredLinks;
  fingerprint: string;
  issues: string[];
}

export interface ParsedPurchase {
  sourceRow: number;
  reference: string;
  parsedReference: ParsedReference | null;
  branchCode: string | null;
  client: string;
  qty: number | null;
  product: string;
  received: string | null;
  datePaid: string | null;
  pricePaid: number | null;
  pricePerItem: number | null;
  hedgedAt: number | null;
  melt: boolean;
  comments: string | null;
  sold: SoldInfo;
  fingerprint: string;
  issues: string[];
}

const cellAt = (row: SheetRow, map: Record<string, number | undefined>, field: string): SheetCell | undefined => {
  const i = map[field];
  return i === undefined ? undefined : row[i];
};
const valueAt = (row: SheetRow, map: Record<string, number | undefined>, field: string): SheetValue => cellAt(row, map, field)?.value;
const orNull = (s: string): string | null => (s === '' ? null : s);

/**
 * A reference always has letters in it (DU-G20261002). A cell holding only digits and punctuation is a stray
 * figure from a scratch calculation below the data, not a trade, so the row is skipped rather than flagged.
 */
export const isReferenceCell = (reference: string): boolean => /[A-Za-z]/.test(reference);

export const rowIsBlank = (row: SheetRow): boolean => row.every((c) => text(c?.value) === '');

/**
 * One sales row. A row with no reference is not a trade (spacer or total) and returns null. Everything the
 * parser could not read is listed in `issues`; the row is still returned so the preview can show it.
 */
export function parseSaleRow(row: SheetRow, map: HeaderMap<SaleField>, sourceRow: number): ParsedSale | null {
  const m = map as Record<string, number | undefined>;
  const reference = text(valueAt(row, m, 'reference'));
  if (!isReferenceCell(reference)) return null;

  const issues: string[] = [];
  const parsedReference = parseReference(reference);
  if (!parsedReference) issues.push('Reference is not in the expected format.');
  else if (parsedReference.role !== 'SALE') issues.push('Reference looks like a purchase, not a sale.');

  const qtyAndProduct = extractQtyAndProduct(valueAt(row, m, 'product'));
  const qtyCell = parseSheetNumber(valueAt(row, m, 'qty'));
  const qty = qtyCell ?? qtyAndProduct.qty;
  if (qty === null || qty <= 0) issues.push('No quantity.');
  if (!qtyAndProduct.product) issues.push('No product.');

  const cptyCell = cellAt(row, m, 'cpty');
  const cpty = classifyCpty(cptyCell?.value);
  const { state, fromColour } = deriveTradeState(cpty, cptyCell?.fill);
  if (state === 'UNKNOWN') issues.push(cpty.kind === 'OTHER' ? `CPTY "${cpty.raw}" is not recognised.` : 'CPTY is empty and not marked as awaiting a hedge.');

  const date = toIsoDate(valueAt(row, m, 'date'));
  if (!date) issues.push('No date.');

  const notes = orNull(text(valueAt(row, m, 'notes')));
  const hedgingNotes = orNull(text(valueAt(row, m, 'hedgingNotes')));
  const collected = readCollected(cellAt(row, m, 'collected'));
  const branchCode = orNull(text(valueAt(row, m, 'branch')).toUpperCase()) ?? parsedReference?.branch ?? null;

  const sale: Omit<ParsedSale, 'fingerprint'> = {
    sourceRow,
    reference,
    parsedReference,
    branchCode,
    initials: orNull(text(valueAt(row, m, 'initials'))),
    client: text(valueAt(row, m, 'client')),
    qty,
    product: qtyAndProduct.product,
    date,
    spot: parseSheetNumber(valueAt(row, m, 'spot')),
    cpty,
    state,
    stateFromColour: fromColour,
    collected,
    cost: parseSheetNumber(valueAt(row, m, 'cost')),
    receipt: parseSheetNumber(valueAt(row, m, 'receipt')),
    profit: parseSheetNumber(valueAt(row, m, 'profit')),
    margin: parseSheetNumber(valueAt(row, m, 'margin')),
    vatDue: parseSheetNumber(valueAt(row, m, 'vatDue')),
    totalPrice: parseSheetNumber(valueAt(row, m, 'totalPrice')),
    paid: orNull(text(valueAt(row, m, 'paid'))),
    netHedging: parseSheetNumber(valueAt(row, m, 'netHedging')),
    boughtAt: parseSheetNumber(valueAt(row, m, 'boughtAt')),
    soldAt: parseSheetNumber(valueAt(row, m, 'soldAt')),
    notes,
    hedgingNotes,
    deferred: parseDeferredLinks(notes, cpty.raw),
    issues,
  };
  return {
    ...sale,
    fingerprint: fingerprint([
      sale.client,
      sale.qty,
      sale.product,
      sale.date,
      sale.cpty.raw,
      sale.state,
      sale.collected.collected,
      sale.cost,
      sale.receipt,
      sale.boughtAt,
      sale.soldAt,
      sale.notes,
    ]),
  };
}

/** One purchases row. The lot's remaining stock is the comment's reading here; sales decide the real figure later. */
export function parsePurchaseRow(row: SheetRow, map: HeaderMap<PurchaseField>, sourceRow: number): ParsedPurchase | null {
  const m = map as Record<string, number | undefined>;
  const reference = text(valueAt(row, m, 'reference'));
  if (!isReferenceCell(reference)) return null;

  const issues: string[] = [];
  const parsedReference = parseReference(reference);
  if (!parsedReference) issues.push('Reference is not in the expected format.');
  else if (parsedReference.role !== 'PURCHASE') issues.push('Reference looks like a sale, not a purchase.');

  const { qty: embeddedQty, product } = extractQtyAndProduct(valueAt(row, m, 'product'));
  const qty = parseSheetNumber(valueAt(row, m, 'qty')) ?? embeddedQty;
  if (qty === null || qty <= 0) issues.push('No quantity.');
  if (!product) issues.push('No product.');

  const comments = orNull(text(valueAt(row, m, 'comments')));
  const sold = parseSoldComment(comments, qty ?? 0);
  if (sold.review && sold.reason) issues.push(sold.reason);

  const purchase: Omit<ParsedPurchase, 'fingerprint'> = {
    sourceRow,
    reference,
    parsedReference,
    branchCode: orNull(text(valueAt(row, m, 'branch')).toUpperCase()) ?? parsedReference?.branch ?? null,
    client: text(valueAt(row, m, 'client')),
    qty,
    product,
    received: toIsoDate(valueAt(row, m, 'received')),
    datePaid: toIsoDate(valueAt(row, m, 'datePaid')),
    pricePaid: parseSheetNumber(valueAt(row, m, 'pricePaid')),
    pricePerItem: parseSheetNumber(valueAt(row, m, 'pricePerItem')),
    hedgedAt: parseSheetNumber(valueAt(row, m, 'hedgedAt')),
    melt: valueAt(row, m, 'melt') === true || /^(true|yes|y|melt)$/i.test(text(valueAt(row, m, 'melt'))),
    comments,
    sold,
    issues,
  };
  return {
    ...purchase,
    fingerprint: fingerprint([purchase.client, purchase.qty, purchase.product, purchase.received, purchase.pricePaid, purchase.hedgedAt, purchase.comments]),
  };
}
