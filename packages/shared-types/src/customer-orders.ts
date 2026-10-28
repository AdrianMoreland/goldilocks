import { parseQuantity, parseTsv, type ParseIssue } from './stocktake';
import type { StockMetal } from './stocktake-physical';

/**
 * Where an item for a customer is in its life. ORDERED and IN_TRANSIT are not in the branch yet.
 * DELIVERED is here but not bagged; BAGGED is in the customer safe. COLLECTED has left with the customer.
 * Collection is never inferred from one source: the evidence log records where each claim came from.
 */
export const CUSTOMER_ORDER_STATUSES = ['ORDERED', 'IN_TRANSIT', 'DELIVERED', 'BAGGED', 'COLLECTED'] as const;
export type CustomerOrderStatus = (typeof CUSTOMER_ORDER_STATUSES)[number];

export const CUSTOMER_ORDER_STATUS_LABELS: Record<CustomerOrderStatus, string> = {
  ORDERED: 'Ordered',
  IN_TRANSIT: 'In transit',
  DELIVERED: 'Here, not bagged',
  BAGGED: 'Bagged (customer safe)',
  COLLECTED: 'Collected',
};

/** Physically in the branch, so still part of stock and of the customer-safe count. */
export function isPhysicallyHere(status: CustomerOrderStatus): boolean {
  return status === 'DELIVERED' || status === 'BAGGED';
}

export const EVIDENCE_KINDS = ['TRADESHEET_COLLECTED', 'ZOHO_INVOICE', 'SIGNED_INVOICE', 'BC_RECORD', 'STAFF_NOTE'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const EVIDENCE_KIND_LABELS: Record<EvidenceKind, string> = {
  TRADESHEET_COLLECTED: 'Tradesheet says collected',
  ZOHO_INVOICE: 'Zoho invoice',
  SIGNED_INVOICE: 'Signed invoice',
  BC_RECORD: 'Business Central record',
  STAFF_NOTE: 'Staff note',
};

// --- matching keys ----------------------------------------------------------------

/** "DU- G202609166", "du-g202609166 " and "DU-G202609166" are one reference. */
export function normalizeReference(raw: string | null | undefined): string {
  return (raw ?? '').toUpperCase().replace(/\s+/g, '');
}

/** Case, spacing and punctuation differences only. A different spelling ("Caulfeild") is not folded in: it is flagged. */
export function normalizeClient(raw: string | null | undefined): string {
  return (raw ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface TradeLineKey {
  reference: string;
  client: string;
}

export type TradeMatch =
  | { status: 'EXACT'; line: TradeLineKey }
  | { status: 'REVIEW'; line: TradeLineKey; reason: string }
  | { status: 'AMBIGUOUS'; lines: TradeLineKey[] }
  | { status: 'NONE' };

const wordSet = (s: string) => new Set(s.split(' ').filter(Boolean));

/**
 * Links a customer order to a tradesheet line using the reference first and the client name second. The name
 * alone never links anything. A reference match with a different name (a typo, or a different customer) is
 * returned for review, never silently accepted. The same reference on several lines is ambiguous.
 */
export function matchTradeLine(order: TradeLineKey, tradeLines: TradeLineKey[]): TradeMatch {
  const ref = normalizeReference(order.reference);
  if (!ref) return { status: 'NONE' };
  const byRef = tradeLines.filter((t) => normalizeReference(t.reference) === ref);
  if (byRef.length === 0) return { status: 'NONE' };
  const name = normalizeClient(order.client);
  const sameName = byRef.filter((t) => normalizeClient(t.client) === name);
  if (sameName.length === 1) return { status: 'EXACT', line: sameName[0] as TradeLineKey };
  if (sameName.length > 1) return { status: 'AMBIGUOUS', lines: sameName };
  if (byRef.length === 1) {
    const only = byRef[0] as TradeLineKey;
    const a = wordSet(name);
    const shared = [...wordSet(normalizeClient(only.client))].filter((w) => a.has(w)).length;
    return {
      status: 'REVIEW',
      line: only,
      reason: shared > 0 ? 'Reference matches; the client name is spelled differently.' : 'Reference matches but the client name is different.',
    };
  }
  return { status: 'AMBIGUOUS', lines: byRef };
}

// --- importing the existing Customer Orders sheet -----------------------------------

/** Excel serial numbers (46293), ISO dates and day/month/year all appear in the existing sheets. */
export function parseSheetDate(raw: string | undefined): string | null {
  const t = (raw ?? '').trim();
  if (!t) return null;
  if (/^\d{4,6}(\.0+)?$/.test(t)) {
    const n = Math.floor(Number(t));
    if (n < 30000 || n > 80000) return null;
    return new Date(Date.UTC(1899, 11, 30) + n * 86400000).toISOString().slice(0, 10);
  }
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return iso[0];
  const dmy = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (dmy) {
    const year = dmy[3]!.length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    const d = new Date(Date.UTC(year, Number(dmy[2]) - 1, Number(dmy[1])));
    return d.getUTCDate() === Number(dmy[1]) ? d.toISOString().slice(0, 10) : null;
  }
  return null;
}

const STATUS_WORDS: Record<string, CustomerOrderStatus> = {
  ordered: 'ORDERED',
  'in transit': 'IN_TRANSIT',
  transit: 'IN_TRANSIT',
  delivered: 'DELIVERED',
  bagged: 'BAGGED',
  collected: 'COLLECTED',
};

export interface CustomerOrderImportRow {
  locationCode: string;
  client: string;
  reference: string | null;
  supplierRef: string | null;
  product: string;
  quantity: number;
  refinery: string | null;
  serials: string | null;
  status: CustomerOrderStatus;
  orderedOn: string | null;
  missing: boolean;
  notes: string | null;
}

const none = (v: string | undefined): string | null => {
  const t = (v ?? '').trim();
  return ['', 'n/a', 'na', '-'].includes(t.toLowerCase()) ? null : t;
};

/**
 * Reads a sheet pasted from the Customer Orders workbook. Columns are found by header (STATUS or OrderStatus,
 * Collection Status, BRANCH, Date or DATE ORDERED, Client, Reference, QTY, Product, Refinery, SERIALS,
 * ORDER NUMBER, NOTES, Missing?). A status the app does not know rejects that row instead of guessing; if
 * the sheet has no status column, `fallbackStatus` is used (for example "Not bagged" sheets are DELIVERED).
 */
export function parseCustomerOrdersPaste(
  text: string,
  fallbackStatus: CustomerOrderStatus | null,
): { rows: CustomerOrderImportRow[]; issues: ParseIssue[] } {
  const table = parseTsv(text);
  const issues: ParseIssue[] = [];
  const header = table[0];
  if (!header) return { rows: [], issues: [{ row: 0, message: 'Nothing to import.' }] };
  const idx = new Map<string, number>();
  header.forEach((h, i) => {
    const k = h.trim().toLowerCase();
    if (k && !idx.has(k)) idx.set(k, i);
  });
  const col = (...names: string[]) => names.map((n) => idx.get(n)).find((v) => v !== undefined);
  const c = {
    status: col('status', 'orderstatus', 'order status'),
    collection: col('collection status'),
    branch: col('branch'),
    date: col('date ordered', 'date'),
    client: col('client'),
    ref: col('reference'),
    qty: col('qty', 'quantity'),
    product: col('product'),
    refinery: col('refinery'),
    serials: col('serials', 'serial'),
    order: col('order number'),
    notes: col('notes'),
    missing: col('missing?', 'missing'),
  };
  if (c.client === undefined || c.qty === undefined || c.product === undefined) {
    return { rows: [], issues: [{ row: 1, message: 'Needs at least Client, QTY and Product columns.' }] };
  }
  const get = (r: string[], i: number | undefined) => (i === undefined ? undefined : r[i]);

  const rows: CustomerOrderImportRow[] = [];
  table.slice(1).forEach((r, n) => {
    const rowNo = n + 2;
    const client = none(get(r, c.client));
    const product = none(get(r, c.product));
    if (!client && !product) return;
    if (!client) return issues.push({ row: rowNo, message: 'Client is blank.' });
    if (!product) return issues.push({ row: rowNo, message: `${client}: product is blank.` });
    const qty = parseQuantity(get(r, c.qty));
    if (qty === null || !Number.isInteger(qty) || qty < 1) {
      return issues.push({ row: rowNo, message: `${client}: quantity is not a whole number above zero.` });
    }
    const branch = none(get(r, c.branch));
    if (!branch) return issues.push({ row: rowNo, message: `${client}: branch is blank.` });

    let status = fallbackStatus;
    const statusText = (get(r, c.status) ?? '').trim().toLowerCase();
    if (statusText) {
      status = STATUS_WORDS[statusText] ?? null;
      if (!status) return issues.push({ row: rowNo, message: `${client}: status "${statusText}" is not one the app knows.` });
    }
    if ((get(r, c.collection) ?? '').trim().toLowerCase() === 'collected') status = 'COLLECTED';
    if (!status) return issues.push({ row: rowNo, message: `${client}: no status on the row and none chosen.` });

    const serials = none(get(r, c.serials));
    const missingText = (get(r, c.missing) ?? '').trim().toLowerCase();
    rows.push({
      locationCode: branch.toUpperCase(),
      client,
      reference: none(get(r, c.ref)),
      supplierRef: none(get(r, c.order)),
      product,
      quantity: qty,
      refinery: none(get(r, c.refinery)),
      serials,
      status,
      orderedOn: parseSheetDate(get(r, c.date)),
      missing: ['yes', 'y', 'true', '1', 'missing'].includes(missingText),
      notes: none(get(r, c.notes)),
    });
  });
  return { rows, issues };
}

/**
 * Which pasted rows are new. A row is the same as one already stored when branch, client, product, quantity and
 * reference all match; duplicates are skipped only up to the number already there, so two genuine identical
 * orders in one paste are both kept the first time and neither added again on a repeat.
 */
export function planCustomerOrderImport(
  existing: { locationCode: string; client: string; reference: string | null; product: string; quantity: number }[],
  incoming: CustomerOrderImportRow[],
): { toAdd: CustomerOrderImportRow[]; skipped: number } {
  const key = (r: { locationCode: string; client: string; reference: string | null; product: string; quantity: number }) =>
    [r.locationCode.toUpperCase(), normalizeClient(r.client), normalizeReference(r.reference), r.product.trim().toLowerCase(), r.quantity].join('|');
  const have = new Map<string, number>();
  for (const e of existing) have.set(key(e), (have.get(key(e)) ?? 0) + 1);
  const toAdd: CustomerOrderImportRow[] = [];
  let skipped = 0;
  for (const row of incoming) {
    const left = have.get(key(row)) ?? 0;
    if (left > 0) {
      have.set(key(row), left - 1);
      skipped++;
    } else toAdd.push(row);
  }
  return { toAdd, skipped };
}

// --- tying orders to the stocktake --------------------------------------------------

export interface CustomerSafeLine {
  locationCode: string;
  product: string;
  quantity: number;
}

/** What the customer orders say should be physically in each branch, grouped by product text. A reference for counting, not the count. */
export function expectedCustomerStock(
  orders: { locationCode: string; product: string; quantity: number; status: CustomerOrderStatus }[],
): CustomerSafeLine[] {
  const by = new Map<string, CustomerSafeLine>();
  for (const o of orders) {
    if (!isPhysicallyHere(o.status)) continue;
    const key = `${o.locationCode.toUpperCase()}|${o.product.trim().toLowerCase()}`;
    const cur = by.get(key);
    if (cur) cur.quantity += o.quantity;
    else by.set(key, { locationCode: o.locationCode.toUpperCase(), product: o.product.trim(), quantity: o.quantity });
  }
  return [...by.values()].sort((a, b) => a.locationCode.localeCompare(b.locationCode) || a.product.localeCompare(b.product));
}

export type { StockMetal };
