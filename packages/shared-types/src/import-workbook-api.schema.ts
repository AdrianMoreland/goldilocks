import { z } from 'zod';
import { IMPORT_SCHEMA_VERSION } from './import-workbook.schema';

/**
 * Tables the workbook import writes, in the order a batch must send them: parents first, so a row can find the
 * customer, invoice or supplier invoice it points at. The browser sends one table per request, at most
 * WORKBOOK_CHUNK_MAX_ROWS rows each.
 */
export const WORKBOOK_LOAD_ORDER = [
  'customers',
  'vendors',
  'supplier_invoices',
  'purchase_lots',
  'trades',
  'invoices',
  'invoice_lines',
  'line_serials',
  'payments',
  'purchase_orders',
  'bc_sales_orders',
  'bc_tracking_entries',
  'bc_items',
  'stock_bars',
  'stock_coins',
  'bc_journal_lines',
  'product_aliases',
  'links',
] as const;
export type WorkbookLoadTable = (typeof WORKBOOK_LOAD_ORDER)[number];

export const WORKBOOK_CHUNK_MAX_ROWS = 5000;

export const WorkbookChunkRequestSchema = z.object({
  /** Omit on the first chunk of a batch; send the id the server returned after that. */
  batchId: z.number().int().positive().optional(),
  fileName: z.string().min(1).max(200),
  schemaVersion: z.literal(IMPORT_SCHEMA_VERSION),
  table: z.enum(WORKBOOK_LOAD_ORDER),
  /** Rows exactly as the reader produces them (customers and vendors also carry `name`). Validated per table on the server. */
  rows: z.array(z.record(z.string(), z.unknown())).max(WORKBOOK_CHUNK_MAX_ROWS),
  /** True on the last chunk of this table: rows of the table not seen in this batch are then flagged missing. */
  lastOfTable: z.boolean().default(false),
  /** True on the very last request: the batch is marked complete. */
  complete: z.boolean().default(false),
});
export type WorkbookChunkRequest = z.infer<typeof WorkbookChunkRequestSchema>;

export const WorkbookChunkResultSchema = z.object({
  batchId: z.number().int(),
  table: z.enum(WORKBOOK_LOAD_ORDER),
  added: z.number().int(),
  changed: z.number().int(),
  unchanged: z.number().int(),
  /** Trades and purchase lots the tradesheet importer has not loaded yet: nothing is created for them. */
  unmatched: z.number().int(),
  /** Quotes recorded (trades whose counterparty says QUOTE_ONLY). */
  quotes: z.number().int(),
  /** Quotes that a real trade with the same reference turned into INVOICED. */
  quotesInvoiced: z.number().int(),
  /** Rows whose customer, invoice or supplier invoice is not loaded yet, per column. */
  unresolved: z.record(z.string(), z.number().int()),
  markedMissing: z.number().int(),
});
export type WorkbookChunkResult = z.infer<typeof WorkbookChunkResultSchema>;

/**
 * The Business Central "Orders Awaiting Collection" report, read in the browser into `bc_sales_orders` rows
 * (id = the BC order number, so a newer report updates the same order). The whole report goes in one request: an
 * order that is no longer in it has been posted, so a partial file would post orders wrongly.
 */
export const BcAwaitingRequestSchema = z.object({
  fileName: z.string().min(1).max(200),
  schemaVersion: z.literal(IMPORT_SCHEMA_VERSION),
  rows: z.array(z.record(z.string(), z.unknown())).min(1).max(WORKBOOK_CHUNK_MAX_ROWS),
});
export type BcAwaitingRequest = z.infer<typeof BcAwaitingRequestSchema>;

export const BcAwaitingResultSchema = z.object({
  batchId: z.number().int(),
  added: z.number().int(),
  changed: z.number().int(),
  unchanged: z.number().int(),
  /** Orders in the previous report that are not in this one. */
  gone: z.number().int(),
  /** Trades that got a POSTED step because their BC order is gone. */
  posted: z.number().int(),
  /** Gone orders whose trade already had a POSTED step. */
  alreadyPosted: z.number().int(),
  /** Gone orders that name no trade we have. */
  noTrade: z.number().int(),
});
export type BcAwaitingResult = z.infer<typeof BcAwaitingResultSchema>;

export const ImportBatchSummarySchema = z.object({
  id: z.number().int(),
  fileName: z.string(),
  importedBy: z.string(),
  importedAt: z.string(),
  status: z.string(),
  schemaVersion: z.string().nullable(),
  /** Per table: added, changed, unchanged, unmatched. */
  tableCounts: z.record(z.string(), z.record(z.string(), z.number())).nullable(),
});
export type ImportBatchSummary = z.infer<typeof ImportBatchSummarySchema>;
export const ImportBatchListSchema = z.array(ImportBatchSummarySchema);
