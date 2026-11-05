import { z } from 'zod';

/**
 * Contract for the assembled import workbook ("GL import.xlsx", built by the owner's Apps Script).
 * Column lists mirror `COLS` in the script exactly; the tables below describe the cleaned values the
 * reader produces, not the raw cell types (which vary: 1.0 for 1, real dates for text, TRUE/FALSE, ...).
 */
export const IMPORT_SCHEMA_VERSION = '1.1';

/** s text, n number, i whole number, b boolean, d date (YYYY-MM-DD), m month (YYYY-MM), or an allowed list. */
export type ColumnKind = 's' | 'n' | 'i' | 'b' | 'd' | 'm' | { readonly oneOf: readonly string[] };
const oneOf = <const V extends readonly string[]>(...v: V) => ({ oneOf: v }) as { readonly oneOf: V };

export const SYSTEMS = ['ZOHO', 'BC'] as const;
export const CPTY_KINDS = ['LOT_REF', 'QUOTE_ONLY', 'DEFERRED', 'SUPPLIER_INVOICE', 'HEDGED', 'EMPTY', 'OTHER'] as const;
export const COLLECTED_FLAGS = ['YES', 'NO', 'CHECK'] as const;
export const LINK_TYPES = [
  'trade_lot', 'invoice_line_trade', 'line_serial_bc_tracking', 'trade_supplier_invoice', 'stock_bar_bc_tracking',
  'safe_trade', 'serial_customer_safe', 'serial_stock_bar', 'lot_supplier_invoice', 'bc_trade',
] as const;
export const LINK_CONFIDENCES = ['EXACT', 'PROBABLE'] as const;
export const SAFE_STATUSES = ['ALLOCATED', 'COLLECTED', 'ORDERED'] as const;

const sys = oneOf(...SYSTEMS);
const flag = oneOf(...COLLECTED_FLAGS);

/** Column kinds for every table, in the script's column order. */
export const IMPORT_TABLE_SPECS = {
  trades: {
    id: 's', system: sys, branch_code: 's', ref_month: 'm', source_month: 'm', region: 's', metal: 's', branch: 's', initials: 's',
    client_code: 's', qty: 'n', product_text: 's', product_norm: 's', date: 'd', spot: 'n', cpty_raw: 's', cpty_kind: oneOf(...CPTY_KINDS),
    hedged_order: 'b', lot_key: 's', lot_id: 's', supplier_invoice_id: 's', receipt: 'n', cost: 'n', profit: 'n', margin: 'n', paid_by: 's',
    collected_raw: 's', collected_fill: 's', cpty_fill: 's', collected_flag: flag, collected_source: 's', notes: 's', reference: 's',
    reference_key: 's', occurrence: 'i', source_file: 's', source_tab: 's', source_row: 'i', issues: 's',
  },
  purchase_lots: {
    id: 's', system: sys, branch_code: 's', region: 's', metal: 's', branch: 's', seller_code: 's', supplier_invoice_id: 's', qty: 'n',
    product_text: 's', product_norm: 's', received: 'd', date_paid: 'd', price_paid: 'n', price_per_item: 'n', hedged_at: 's',
    comments_raw: 's', comment_sold_qty: 'n', comment_all_sold: 'b', reference: 's', reference_key: 's', core_key: 's', occurrence: 'i',
    source_file: 's', source_tab: 's', source_row: 'i', issues: 's',
  },
  supplier_invoices: { id: 's', supplier: 's', number: 's', first_date: 'd', last_date: 'd', trade_rows: 'i', lot_rows: 'i' },
  invoices: { id: 's', system: sys, date: 'd', customer_code: 's', status: 's', sales_order_number: 's', total: 'n', line_count: 'i' },
  invoice_lines: {
    id: 's', system: sys, invoice_id: 's', line_no: 'i', date: 'd', customer_code: 's', qty: 'n', item_name: 's', product_norm: 's',
    unit_price: 'n', line_total: 'n', item_desc: 's', collected_flag: flag, collected_date: 'd', refinery_detected: 's',
    delivered_brinks: 'b', sold_back: 'b', refs_found: 's', source_row: 'i',
  },
  line_serials: { id: 's', invoice_line_id: 's', serial: 's', serial_norm: 's', refinery: 's', collected_flag: flag, collected_date: 'd' },
  payments: {
    id: 's', system: sys, invoice_id: 's', customer_code: 's', zoho_customer_id: 's', date: 'd', invoice_date: 'd', amount: 'n',
    invoice_amount: 'n', mode: 's', reference: 's', type: 's',
  },
  purchase_orders: {
    id: 's', system: sys, po_number: 's', line_no: 'i', date: 'd', vendor_number: 's', vendor_code: 's', item_name: 's', product_norm: 's',
    qty_ordered: 'n', qty_received: 'n', qty_billed: 'n', price: 'n', item_total: 'n', status: 's', reference: 's',
  },
  stock_bars: {
    id: 's', snapshot: 's', metal: 's', branch: 's', weight_label: 's', refinery: 's', serial: 's', serial_norm: 's', grams: 'n',
    confirmed: 's', sold_tick: 'b', details: 's', source_row: 'i',
  },
  stock_coins: {
    id: 's', snapshot: 's', metal: 's', branch: 's', item: 's', product_norm: 's', qty_prev: 'n', qty_counted: 'n', qty_allocated_since: 'n',
    qty_final: 'n', counts_json: 's', details: 's', source_row: 'i',
  },
  bc_journal_lines: {
    id: 's', snapshot: 's', item_no: 's', description: 's', location_code: 's', qty_calculated: 'n', counted_normal: 'n', counted_customer: 'n',
    variance: 'n', reason: 's', serials_checked: 's', serial_note: 's', batch_name: 's', posting_date: 'd', document_no: 's', source_row: 'i',
  },
  bc_tracking_entries: {
    id: 's', snapshot: 's', entry_no: 's', item_no: 's', location_code: 's', serial_no: 's', serial_norm: 's', lot_no: 's',
    remaining_quantity: 'n', posting_date: 'd', document_no: 's', entry_type: 's', source_row: 'i',
  },
  bc_items: { id: 's', description: 's', product_norm: 's', refinery_hint: 's', source_row: 'i' },
  zoho_products: { id: 's', sku: 's', item_name: 's', product_norm: 's', metal: 's', qty_sold: 'n', amount: 'n', avg_price: 'n' },
  customer_safe_items: {
    id: 's', metal: 's', snapshot: 's', system: sys, branch_code: 's', status_raw: 's', status_norm: oneOf(...SAFE_STATUSES), branch: 's',
    date: 'd', client_code: 's', reference: 's', reference_core: 's', qty: 'n', product_text: 's', product_norm: 's', refinery: 's',
    serials: 's', notes: 's', source_row: 'i',
  },
  bc_sales_orders: {
    id: 's', system: sys, branch_code: 's', snapshot: 's', snapshot_date: 'd', bc_customer_no: 's', client_code: 's', ext_doc_no: 's',
    ext_doc_core: 's', location: 's', doc_date: 'd', amount: 'n', amount_incl_vat: 'n', prepaid: 'n', remaining: 'n', paid: 'b',
  },
  links: {
    id: 's', link_type: oneOf(...LINK_TYPES), from_table: 's', from_id: 's', to_table: 's', to_id: 's', method: 's',
    confidence: oneOf(...LINK_CONFIDENCES), note: 's',
  },
  customers: { id: 's', zoho_number: 's', zoho_status: 's', currency: 's', sources: 's', rows: 'i' },
  vendors: { id: 's', zoho_number: 's', zoho_status: 's', currency: 's', sources: 's', rows: 'i' },
  product_aliases: { id: 's', suggested_key: 's', example_text: 's', refinery: 's', uses: 'i', sources: 's' },
} as const satisfies Record<string, Record<string, ColumnKind>>;

export type ImportTableName = keyof typeof IMPORT_TABLE_SPECS;
export const IMPORT_TABLE_NAMES = Object.keys(IMPORT_TABLE_SPECS) as ImportTableName[];

/** Columns an older build of the script did not write yet; missing is allowed and reads as empty. */
export const OPTIONAL_COLUMNS: Partial<Record<ImportTableName, readonly string[]>> = {
  invoice_lines: ['refinery_detected'],
  product_aliases: ['refinery'],
};

type KindValue<K> = K extends 'n' | 'i' ? number | null
  : K extends 'b' ? boolean | null
  : K extends { readonly oneOf: infer V extends readonly string[] } ? V[number] | null
  : string | null;

export type ImportRow<T extends ImportTableName> = { -readonly [C in keyof (typeof IMPORT_TABLE_SPECS)[T]]: KindValue<(typeof IMPORT_TABLE_SPECS)[T][C]> };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;

function kindSchema(kind: ColumnKind): z.ZodType {
  if (kind === 's') return z.string().nullable();
  if (kind === 'n') return z.number().finite().nullable();
  if (kind === 'i') return z.number().int().nullable();
  if (kind === 'b') return z.boolean().nullable();
  if (kind === 'd') return z.string().regex(DATE_RE).nullable();
  if (kind === 'm') return z.string().regex(MONTH_RE).nullable();
  return z.enum(kind.oneOf as [string, ...string[]]).nullable();
}

/** One strict Zod schema per table. The API re-validates every uploaded chunk with these. */
export const ImportTableSchemas = Object.fromEntries(
  IMPORT_TABLE_NAMES.map((name) => [
    name,
    z.strictObject(Object.fromEntries(Object.entries(IMPORT_TABLE_SPECS[name]).map(([col, kind]) => [col, kindSchema(kind as ColumnKind)]))),
  ]),
) as unknown as { [T in ImportTableName]: z.ZodType<ImportRow<T>> };

export const ImportMetaSchema = z.object({ schema_version: z.literal(IMPORT_SCHEMA_VERSION) });

export const ImportRowIssueCodeSchema = z.enum([
  'BAD_NUMBER', 'BAD_INTEGER', 'BAD_BOOLEAN', 'BAD_DATE', 'IMPOSSIBLE_DATE', 'BAD_VALUE', 'EMAIL_OR_URL',
]);
export type ImportRowIssueCode = z.infer<typeof ImportRowIssueCodeSchema>;

export const ImportRowIssueSchema = z.object({
  table: z.string(),
  /** 1-based sheet row (the header is row 1). */
  row: z.number().int(),
  column: z.string(),
  code: ImportRowIssueCodeSchema,
  /** Raw cell text for dates, numbers and flags only; never set for emails or free text. */
  raw: z.string().optional(),
});
export type ImportRowIssue = z.infer<typeof ImportRowIssueSchema>;
