import { coerceCell } from './import-workbook';
import { IMPORT_SCHEMA_VERSION, IMPORT_TABLE_SPECS } from './import-workbook.schema';
import { WORKBOOK_CHUNK_MAX_ROWS, WORKBOOK_LOAD_ORDER, type WorkbookChunkRequest, type WorkbookLoadTable } from './import-workbook-api.schema';
import type { RedactionMapRow } from './unredact';

/**
 * Logic behind the Import hub that does not need a browser: how a read workbook is cut into requests, and how the
 * Business Central "Orders Awaiting Collection" report becomes `bc_sales_orders` rows.
 */

type Row = Record<string, unknown>;

/**
 * Cuts the tables into the requests the server expects: load order, at most WORKBOOK_CHUNK_MAX_ROWS rows each,
 * `lastOfTable` on the final chunk of every table that is sent, `complete` on the very last request. Empty tables
 * send nothing, so an empty tab never flags the rows already stored as missing.
 */
export function planUpload(
  tables: Partial<Record<WorkbookLoadTable, Row[]>>,
  fileName: string,
  chunkSize = WORKBOOK_CHUNK_MAX_ROWS,
): Omit<WorkbookChunkRequest, 'batchId'>[] {
  const out: Omit<WorkbookChunkRequest, 'batchId'>[] = [];
  for (const table of WORKBOOK_LOAD_ORDER) {
    const rows = tables[table] ?? [];
    for (let i = 0; i < rows.length; i += chunkSize) {
      out.push({
        fileName,
        schemaVersion: IMPORT_SCHEMA_VERSION,
        table,
        rows: rows.slice(i, i + chunkSize),
        lastOfTable: i + chunkSize >= rows.length,
        complete: false,
      });
    }
  }
  if (out.length) out[out.length - 1]!.complete = true;
  return out;
}

/** Port of `normName_` in the import script: the form a name is looked up in. */
export function normaliseName(s: string | null | undefined): string {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\band\b/g, '&')
    .replace(/[^a-z0-9& ]+/g, ' ')
    .replace(/\b(ltd|limited|unlimited company|unlimited|company|dac|plc|inc|llc|eur|gbp|usd)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Real name -> redaction code, from the owner's map. Built in the browser; the map is never sent anywhere. */
export function buildNameLookup(mapRows: readonly RedactionMapRow[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const m of mapRows) {
    const code = m.code?.trim();
    if (!code) continue;
    if (m.original) lookup.set(normaliseName(m.original), code);
    if (m.key) lookup.set(m.key, code);
  }
  return lookup;
}

const nr = (s: unknown) => String(s ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Port of `coreRef_`: "DU-G20260941" -> "G20260941". */
export function coreRef(s: unknown): string {
  const k = nr(s);
  const m = k.match(/^(?:DU|CO|BL|BC|ZU|IE)?((?:GP|SP|G|S|B|P)\d{5,})$/);
  return m ? m[1]! : k;
}

function branchOf(location: unknown, ref: unknown): string | null {
  const b = String(location ?? '').trim().toUpperCase();
  if (/^(DU|CO|BL|BC|ZU)$/.test(b)) return b;
  const p = nr(ref).slice(0, 2);
  return /^(DU|CO|BL|BC|ZU)$/.test(p) ? p : null;
}

export interface BcReportResult {
  rows: Row[];
  /** Customer names the map did not know; those rows keep no customer code. */
  unmappedCustomers: number;
  /** Rows without an order number, left out. */
  skipped: number;
  /** The report's header row was not found, so nothing could be read. */
  headerFound: boolean;
}

const HEADER_LOOKAHEAD = 5;

/**
 * Reads the report's sheet (rows of cells, header within the first rows) into `bc_sales_orders` rows. The order
 * number is the row id, so a newer report updates the same order. Customer names become codes through the map; a
 * name it does not know is dropped rather than sent.
 */
export function mapBcReport(sheet: readonly (readonly unknown[])[], fileName: string, names: ReadonlyMap<string, string>): BcReportResult {
  const norm = (h: unknown) => String(h ?? '').toLowerCase().replace(/:$/, '').trim();
  let headerAt = -1;
  for (let r = 0; r < Math.min(HEADER_LOOKAHEAD, sheet.length); r++) {
    const cells = sheet[r]!.map(norm);
    if (cells.includes('external document no.') && cells.includes('amount prepaid')) {
      headerAt = r;
      break;
    }
  }
  if (headerAt === -1) return { rows: [], unmappedCustomers: 0, skipped: 0, headerFound: false };

  const header = sheet[headerAt]!.map(norm);
  const col = (...names2: string[]) => header.findIndex((h) => names2.includes(h));
  const idx = {
    no: col('no.', 'no'),
    custNo: col('sell-to customer no.'),
    custName: col('sell-to customer name'),
    ext: col('external document no.'),
    loc: col('location code'),
    docDate: col('document date'),
    amount: col('amount'),
    incl: col('amount including vat'),
    prepaid: col('amount prepaid'),
    remaining: col('remaining amount'),
    paid: col('paid'),
  };
  const spec = IMPORT_TABLE_SPECS.bc_sales_orders;
  const get = (cells: readonly unknown[], i: number) => (i >= 0 ? cells[i] : null);
  const val = (col2: keyof typeof spec, raw: unknown) => coerceCell(spec[col2], raw).value;

  let unmapped = 0;
  let skipped = 0;
  const rows: Row[] = [];
  for (const cells of sheet.slice(headerAt + 1)) {
    const no = String(get(cells, idx.no) ?? '').trim();
    if (!no) {
      if (cells.some((c) => c !== null && c !== undefined && String(c).trim() !== '')) skipped++;
      continue;
    }
    const customerName = String(get(cells, idx.custName) ?? '').trim();
    const code = customerName ? names.get(normaliseName(customerName)) ?? null : null;
    if (customerName && !code) unmapped++;
    const ext = get(cells, idx.ext);
    const paidRaw = String(get(cells, idx.paid) ?? '').trim().toUpperCase();
    rows.push({
      id: no,
      system: 'BC',
      branch_code: branchOf(get(cells, idx.loc), ext),
      snapshot: fileName,
      snapshot_date: null,
      bc_customer_no: val('bc_customer_no', get(cells, idx.custNo)),
      client_code: code,
      ext_doc_no: val('ext_doc_no', ext),
      ext_doc_core: ext ? coreRef(ext) : null,
      location: val('location', get(cells, idx.loc)),
      doc_date: val('doc_date', get(cells, idx.docDate)),
      amount: val('amount', get(cells, idx.amount)),
      amount_incl_vat: val('amount_incl_vat', get(cells, idx.incl)),
      prepaid: val('prepaid', get(cells, idx.prepaid)),
      remaining: val('remaining', get(cells, idx.remaining)),
      paid: paidRaw === '1' || paidRaw === 'TRUE' ? true : null,
    } satisfies Record<keyof typeof spec, unknown>);
  }
  return { rows, unmappedCustomers: unmapped, skipped, headerFound: true };
}

