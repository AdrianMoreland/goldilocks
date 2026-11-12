import { z } from 'zod';
import { normaliseName } from './import-hub';

/**
 * Business Central history: posted sales shipments (+ lines), posted purchase receipts and item ledger entries. With
 * the item tracking entries the workbook already imports, they give each serial its receipt (who we bought it from)
 * and its shipment (who collected it). Names are turned into redaction codes in the browser; the API never sees them.
 */

export const BC_HISTORY_KINDS = ['shipments', 'shipment_lines', 'receipts', 'ledger'] as const;
export type BcHistoryKind = (typeof BC_HISTORY_KINDS)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const text = (max: number) => z.string().max(max).nullable();
const customerCode = z.string().regex(/^C\d{6}$/).nullable();

export const BcShipmentRowSchema = z.strictObject({
  no: z.string().min(1).max(40),
  customerNo: text(40),
  /** Redaction code of the sell-to customer, looked up from the name in the browser. */
  customerCode,
  documentDate: isoDate.nullable(),
  postingDate: isoDate.nullable(),
  externalDocNo: text(100),
  locationCode: text(40),
});
export type BcShipmentRow = z.infer<typeof BcShipmentRowSchema>;

export const BcShipmentLineRowSchema = z.strictObject({
  documentNo: z.string().min(1).max(40),
  /** Position of the line within its shipment, from 1. The export has no line number of its own. */
  lineNo: z.number().int().positive(),
  customerNo: text(40),
  itemNo: text(40),
  description: text(200),
  locationCode: text(40),
  quantity: z.number().nullable(),
});
export type BcShipmentLineRow = z.infer<typeof BcShipmentLineRowSchema>;

export const BcReceiptRowSchema = z.strictObject({
  no: z.string().min(1).max(40),
  vendorNo: text(40),
  /** Redaction code of a private seller (customer table), when the vendor name is in the map. */
  sellerCode: customerCode,
  documentDate: isoDate.nullable(),
  locationCode: text(40),
});
export type BcReceiptRow = z.infer<typeof BcReceiptRowSchema>;

export const BcLedgerRowSchema = z.strictObject({
  entryNo: z.number().int().positive(),
  postingDate: isoDate.nullable(),
  entryType: z.string().min(1).max(40),
  documentType: text(40),
  documentNo: z.string().max(40),
  itemNo: z.string().min(1).max(40),
  locationCode: text(40),
  quantity: z.number(),
  remainingQuantity: z.number().nullable(),
  salesAmount: z.number().nullable(),
  costAmount: z.number().nullable(),
  open: z.boolean().nullable(),
  /** Serial No. column, when the list shows it. Placeholders ("NOBARNO3", "BRINKS TBC") are dropped. */
  serialNo: text(60).default(null),
  /** Customer or Vendor (Source Type) and its BC number (Source No.). */
  sourceType: text(20).default(null),
  sourceNo: text(40).default(null),
});
export type BcLedgerRow = z.infer<typeof BcLedgerRowSchema>;

const MAX_ROWS = 50_000;

export const BcHistoryRequestSchema = z.object({
  fileNames: z.array(z.string().min(1).max(200)).max(10),
  shipments: z.array(BcShipmentRowSchema).max(MAX_ROWS).default([]),
  shipmentLines: z.array(BcShipmentLineRowSchema).max(MAX_ROWS).default([]),
  receipts: z.array(BcReceiptRowSchema).max(MAX_ROWS).default([]),
  ledger: z.array(BcLedgerRowSchema).max(MAX_ROWS).default([]),
});
export type BcHistoryRequest = z.infer<typeof BcHistoryRequestSchema>;

const tableCounts = z.object({ added: z.number().int(), changed: z.number().int(), unchanged: z.number().int() });

export const BcHistoryResultSchema = z.object({
  /** 0 on a preview. */
  batchId: z.number().int(),
  shipments: tableCounts,
  shipmentLines: tableCounts,
  receipts: tableCounts,
  ledger: tableCounts,
  /** Customers that got their BC customer or vendor number from this import. */
  customersLinked: z.number().int(),
  /** A customer already holds a different BC number; nothing was overwritten. */
  customerConflicts: z.number().int(),
  /** Customer codes in the file that the app does not know. */
  unknownCustomerCodes: z.number().int(),
  /** Shipments whose External Document No. is a tradesheet reference found in the app. */
  shipmentsToTrades: z.number().int(),
  /** Shipments whose External Document No. is a Zoho invoice found in the app. */
  shipmentsToZohoInvoices: z.number().int(),
  /** Matched sales the tradesheet does not show as collected although BC shipped them. */
  shippedNotCollected: z.number().int(),
  itemsAdded: z.number().int(),
  itemsUpdated: z.number().int(),
  eventsAdded: z.number().int(),
  eventsUnchanged: z.number().int(),
  /** Serial tracking entries whose ledger entry is not imported yet; they get events on a later import. */
  trackingWithoutLedger: z.number().int(),
});
export type BcHistoryResult = z.infer<typeof BcHistoryResultSchema>;

// --- one bar and its history -------------------------------------------------------------------

export const ITEM_EVENT_KINDS = [
  'RECEIVED',
  'OPENING_BALANCE',
  'ADJUSTED_IN',
  'ADJUSTED_OUT',
  'TRANSFERRED',
  'COLLECTED',
  'RETURNED_BY_CUSTOMER',
  'RETURNED_TO_VENDOR',
] as const;
export type ItemEventKind = (typeof ITEM_EVENT_KINDS)[number];

export const ITEM_STATUSES = ['IN_STOCK', 'COLLECTED', 'GONE', 'UNKNOWN'] as const;
export type ItemStatus = (typeof ITEM_STATUSES)[number];

/**
 * What a BC item ledger entry means for one bar. A posted sales shipment is the collection (the shipment is posted
 * when the customer collects). Opening balances carry the document number "OPEN…" in this tenant. Null for an entry
 * that says nothing about where a bar is.
 */
export function bcEventKind(entryType: string, documentType: string | null, documentNo: string | null, quantity: number): ItemEventKind | null {
  const type = entryType.trim().toLowerCase();
  const doc = (documentType ?? '').trim().toLowerCase();
  if (type === 'purchase') return doc.includes('credit memo') || quantity < 0 ? 'RETURNED_TO_VENDOR' : 'RECEIVED';
  if (type === 'sale') return doc.includes('credit memo') || quantity > 0 ? 'RETURNED_BY_CUSTOMER' : 'COLLECTED';
  if (type === 'transfer') return 'TRANSFERRED';
  if (type === 'positive adjmt.' || type === 'positive adjmt') {
    return /^open/i.test((documentNo ?? '').trim()) ? 'OPENING_BALANCE' : 'ADJUSTED_IN';
  }
  if (type === 'negative adjmt.' || type === 'negative adjmt') return 'ADJUSTED_OUT';
  return null;
}

/** Where a bar is after an event. A transfer keeps it in stock (its location changes). */
export function itemStatusAfter(kind: ItemEventKind): ItemStatus {
  switch (kind) {
    case 'COLLECTED':
      return 'COLLECTED';
    case 'ADJUSTED_OUT':
    case 'RETURNED_TO_VENDOR':
      return 'GONE';
    default:
      return 'IN_STOCK';
  }
}

/** The form serials are matched in: upper case, letters and digits only (same as the import script's `nr_`). */
export function serialKey(raw: unknown): string {
  return String(raw ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * A serial that names a real bar. BC holds placeholders typed when a bar had none ("NOBARNO12", "BRINKS TBC",
 * "TBC"); those, and keys without a digit or shorter than 3 characters, are not serials.
 */
export function isRealSerial(raw: unknown): boolean {
  const key = serialKey(raw);
  if (key.length < 3 || !/\d/.test(key)) return false;
  return !/^NOBARNO\d*$|TBC$|^NOSERIAL|^NA$|^NONE$/.test(key);
}

// --- reading a pasted list or an exported sheet ------------------------------------------------

/** A block copied from a BC list (Ctrl+C) is tab-separated, one row per line, header first. */
export function parsePastedTable(textIn: string): string[][] {
  return textIn
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.split('\t'));
}

const headerNorm = (h: unknown) => String(h ?? '').toLowerCase().replace(/:$/, '').trim();

/** Which BC list a header row comes from. */
export function detectBcHistoryKind(header: readonly unknown[]): BcHistoryKind | null {
  const h = new Set(header.map(headerNorm));
  if (h.has('entry no.') && h.has('entry type') && h.has('item no.')) return 'ledger';
  if (h.has('buy-from vendor no.')) return 'receipts';
  if (h.has('document no.') && h.has('sell-to customer no.') && h.has('quantity')) return 'shipment_lines';
  if (h.has('no.') && h.has('sell-to customer no.') && !h.has('amount prepaid')) return 'shipments';
  return null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * A BC date as YYYY-MM-DD. Accepts a Date, an Excel serial, ISO text, or the M/D/YYYY text BC copies out in this
 * tenant (a first part above 12 is read as a day). Null when it cannot be read.
 */
export function bcDate(raw: unknown): string | null {
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw.toISOString().slice(0, 10);
  if (typeof raw === 'number' && raw > 20000 && raw < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(raw) * 86_400_000);
    return d.toISOString().slice(0, 10);
  }
  const s = String(raw ?? '').trim();
  if (!s) return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const us = s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (!us) return null;
  let month = Number(us[1]);
  let day = Number(us[2]);
  if (month > 12) [month, day] = [day, month];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${us[3]}-${pad(month)}-${pad(day)}`;
}

function num(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const s = String(raw ?? '').trim().replace(/,/g, '');
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function str(raw: unknown, max: number): string | null {
  const s = String(raw ?? '').trim();
  return s ? s.slice(0, max) : null;
}

function bool(raw: unknown): boolean | null {
  if (typeof raw === 'boolean') return raw;
  const s = String(raw ?? '').trim().toLowerCase();
  if (['1', 'true', 'yes'].includes(s)) return true;
  if (['0', 'false', 'no'].includes(s)) return false;
  return null;
}

export interface BcHistoryMapped {
  kind: BcHistoryKind | null;
  shipments: BcShipmentRow[];
  shipmentLines: BcShipmentLineRow[];
  receipts: BcReceiptRow[];
  ledger: BcLedgerRow[];
  /** Customer or private-seller names not in the redaction map (the row is kept with no code). */
  unmappedNames: number;
  /** Rows without their key column, left out. */
  skipped: number;
}

/**
 * Maps one BC list (header row first) to import rows. `names` is the redaction lookup (normalised name -> code);
 * names never leave the browser. Company vendors (non-PRV) are not looked up: they are suppliers, not customers.
 */
export function mapBcHistory(sheet: readonly (readonly unknown[])[], names: ReadonlyMap<string, string>): BcHistoryMapped {
  const out: BcHistoryMapped = { kind: null, shipments: [], shipmentLines: [], receipts: [], ledger: [], unmappedNames: 0, skipped: 0 };
  const headerAt = sheet.findIndex((r, i) => i < 10 && detectBcHistoryKind(r) !== null);
  if (headerAt === -1) return out;
  const header = sheet[headerAt]!.map(headerNorm);
  const kind = detectBcHistoryKind(sheet[headerAt]!)!;
  out.kind = kind;
  const at = (...names2: string[]) => header.findIndex((h) => names2.includes(h));
  const cell = (cells: readonly unknown[], i: number) => (i >= 0 ? cells[i] : null);
  const code = (name: unknown) => {
    const n = normaliseName(String(name ?? ''));
    if (!n) return null;
    const c = names.get(n) ?? null;
    if (!c) out.unmappedNames++;
    return c && /^C\d{6}$/.test(c) ? c : null;
  };
  const body = sheet.slice(headerAt + 1).filter((r) => r.some((c) => String(c ?? '').trim() !== ''));

  if (kind === 'shipments') {
    const i = { no: at('no.'), custNo: at('sell-to customer no.'), name: at('sell-to customer name'), doc: at('document date'), post: at('posting date'), ext: at('external document no.'), loc: at('location code') };
    for (const r of body) {
      const no = str(cell(r, i.no), 40);
      if (!no) { out.skipped++; continue; }
      out.shipments.push({
        no,
        customerNo: str(cell(r, i.custNo), 40),
        customerCode: code(cell(r, i.name)),
        documentDate: bcDate(cell(r, i.doc)),
        postingDate: bcDate(cell(r, i.post)),
        externalDocNo: str(cell(r, i.ext), 100),
        locationCode: str(cell(r, i.loc), 40),
      });
    }
  } else if (kind === 'shipment_lines') {
    const i = { doc: at('document no.'), custNo: at('sell-to customer no.'), item: at('no.'), desc: at('description'), loc: at('location code'), qty: at('quantity') };
    const lineNos = new Map<string, number>();
    for (const r of body) {
      const documentNo = str(cell(r, i.doc), 40);
      if (!documentNo) { out.skipped++; continue; }
      const lineNo = (lineNos.get(documentNo) ?? 0) + 1;
      lineNos.set(documentNo, lineNo);
      out.shipmentLines.push({
        documentNo,
        lineNo,
        customerNo: str(cell(r, i.custNo), 40),
        itemNo: str(cell(r, i.item), 40),
        description: str(cell(r, i.desc), 200),
        locationCode: str(cell(r, i.loc), 40),
        quantity: num(cell(r, i.qty)),
      });
    }
  } else if (kind === 'receipts') {
    const i = { no: at('no.'), vendorNo: at('buy-from vendor no.'), name: at('buy-from vendor name'), doc: at('document date'), loc: at('location code') };
    for (const r of body) {
      const no = str(cell(r, i.no), 40);
      if (!no) { out.skipped++; continue; }
      const vendorNo = str(cell(r, i.vendorNo), 40);
      out.receipts.push({
        no,
        vendorNo,
        sellerCode: vendorNo && /^PRV/i.test(vendorNo) ? code(cell(r, i.name)) : null,
        documentDate: bcDate(cell(r, i.doc)),
        locationCode: str(cell(r, i.loc), 40),
      });
    }
  } else {
    const i = {
      entry: at('entry no.'), post: at('posting date'), type: at('entry type'), docType: at('document type'), docNo: at('document no.'), item: at('item no.'),
      loc: at('location code'), qty: at('quantity'), rem: at('remaining quantity'), sales: at('sales amount (actual)'), cost: at('cost amount (actual)'), open: at('open'),
      serial: at('serial no.'), srcType: at('source type'), srcNo: at('source no.'),
    };
    for (const r of body) {
      const entryNo = num(cell(r, i.entry));
      const entryType = str(cell(r, i.type), 40);
      const itemNo = str(cell(r, i.item), 40);
      if (!entryNo || !Number.isInteger(entryNo) || entryNo <= 0 || !entryType || !itemNo) { out.skipped++; continue; }
      out.ledger.push({
        entryNo,
        postingDate: bcDate(cell(r, i.post)),
        entryType,
        documentType: str(cell(r, i.docType), 40),
        documentNo: str(cell(r, i.docNo), 40) ?? '',
        itemNo,
        locationCode: str(cell(r, i.loc), 40),
        quantity: num(cell(r, i.qty)) ?? 0,
        remainingQuantity: num(cell(r, i.rem)),
        salesAmount: num(cell(r, i.sales)),
        costAmount: num(cell(r, i.cost)),
        open: bool(cell(r, i.open)),
        serialNo: isRealSerial(cell(r, i.serial)) ? str(cell(r, i.serial), 60) : null,
        sourceType: str(cell(r, i.srcType), 20),
        sourceNo: str(cell(r, i.srcNo), 40),
      });
    }
  }
  return out;
}

// --- reading one bar's history ------------------------------------------------------------------

export const ItemTraceEventSchema = z.object({
  kind: z.enum(ITEM_EVENT_KINDS),
  date: isoDate.nullable(),
  source: z.string(),
  sourceRef: z.string().nullable(),
  locationCode: z.string().nullable(),
  /** BC customer or vendor no. on the document. */
  partyNo: z.string().nullable(),
  /** Redaction code of the customer, when known. */
  customerCode: z.string().nullable(),
  /** Tradesheet reference of the matched sale, when known. */
  tradeReference: z.string().nullable(),
  quantity: z.number(),
  amount: z.number().nullable(),
});
export type ItemTraceEvent = z.infer<typeof ItemTraceEventSchema>;

export const ItemTraceSchema = z.object({
  serial: z.string(),
  bcItemNo: z.string().nullable(),
  product: z.string().nullable(),
  status: z.enum(ITEM_STATUSES),
  locationCode: z.string().nullable(),
  events: z.array(ItemTraceEventSchema),
});
export type ItemTrace = z.infer<typeof ItemTraceSchema>;

export const ItemTraceQuerySchema = z.object({ serial: z.string().trim().min(3).max(60) });
export type ItemTraceQuery = z.infer<typeof ItemTraceQuerySchema>;
