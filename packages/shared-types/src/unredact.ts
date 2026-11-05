import type { ImportRow, ImportTableName } from './import-workbook.schema';

/** One row of the owner's private `map` sheet. The map never leaves the owner's browser. */
export interface RedactionMapRow {
  code: string;
  key?: string;
  original: string;
  type?: string;
}

/**
 * Columns that hold exactly one redacted code (or a supplier name left readable on purpose). These stay codes:
 * only the customers and vendors tables get a `name`, so a real name lives in one place in the database and
 * every other row points at it by code. They are still scanned so a code with no mapping is reported.
 */
export const REDACTED_CODE_COLUMNS: Partial<Record<ImportTableName, readonly string[]>> = {
  trades: ['client_code'],
  purchase_lots: ['seller_code'],
  invoices: ['customer_code'],
  invoice_lines: ['customer_code'],
  payments: ['customer_code'],
  purchase_orders: ['vendor_code'],
  customer_safe_items: ['client_code'],
  bc_sales_orders: ['client_code'],
};

/** Tables whose rows are the people themselves: `id` stays the code and a `name` is added. */
export const REDACTED_NAME_TABLES = ['customers', 'vendors'] as const;

/** Free-text columns where the script replaced names inside sentences with codes. */
export const REDACTED_TEXT_COLUMNS: Partial<Record<ImportTableName, readonly string[]>> = {
  trades: ['notes', 'cpty_raw', 'reference', 'collected_raw', 'paid_by'],
  purchase_lots: ['comments_raw', 'reference'],
  invoice_lines: ['item_desc'],
  payments: ['reference'],
  purchase_orders: ['reference'],
  customer_safe_items: ['notes', 'reference', 'serials'],
  stock_bars: ['details'],
  stock_coins: ['details'],
  bc_journal_lines: ['description', 'reason', 'serial_note'],
  links: ['note'],
};

const CODE = /^[CV]\d{6}$/;
const CODE_IN_TEXT = /\b[CV]\d{6}\b/g;

export interface UnredactResult<Tables> {
  tables: Tables;
  /** Distinct codes found in the data that the map does not know, sorted. Empty = fully resolved. */
  unmappedCodes: string[];
  /** Number of cells rewritten. */
  replaced: number;
}

/**
 * Adds the real `name` to every customers and vendors row, and restores names inside the free-text columns.
 * Code columns elsewhere are checked (unmapped codes are reported) but kept as codes. Pure: the input is not changed.
 * Values that are not codes (supplier names, invoice numbers) are left as they are, and name themselves.
 */
export function unredactTables<Tables extends Partial<{ [T in ImportTableName]: ImportRow<T>[] }>>(
  tables: Tables,
  mapRows: readonly RedactionMapRow[],
): UnredactResult<Tables> {
  const names = new Map<string, string>();
  for (const m of mapRows) {
    const code = m.code?.trim();
    const original = m.original?.trim();
    if (code && original) names.set(code, original);
  }
  const unmapped = new Set<string>();
  let replaced = 0;

  const checkCode = (v: string): void => {
    if (CODE.test(v) && !names.has(v)) unmapped.add(v);
  };
  const swapText = (v: string): string =>
    v.replace(CODE_IN_TEXT, (code) => {
      const name = names.get(code);
      if (name === undefined) {
        unmapped.add(code);
        return code;
      }
      replaced++;
      return name;
    });

  const out: Record<string, unknown> = {};
  for (const [table, rows] of Object.entries(tables) as [ImportTableName, Record<string, unknown>[] | undefined][]) {
    if (!rows) continue;
    const codeCols = REDACTED_CODE_COLUMNS[table] ?? [];
    const textCols = REDACTED_TEXT_COLUMNS[table] ?? [];
    const isPeople = (REDACTED_NAME_TABLES as readonly string[]).includes(table);
    if (codeCols.length === 0 && textCols.length === 0 && !isPeople) {
      out[table] = rows;
      continue;
    }
    out[table] = rows.map((row) => {
      let next: Record<string, unknown> | null = null;
      for (const col of codeCols) {
        const v = row[col];
        if (typeof v === 'string') checkCode(v);
      }
      if (isPeople) {
        const id = String(row['id'] ?? '');
        checkCode(id);
        next = { ...row, name: names.get(id) ?? id };
        if (names.has(id)) replaced++;
      }
      for (const col of textCols) {
        const v = row[col];
        if (typeof v === 'string') {
          const s = swapText(v);
          if (s !== v) (next ??= { ...row })[col] = s;
        }
      }
      return next ?? row;
    });
  }
  return { tables: out as Tables, unmappedCodes: [...unmapped].sort(), replaced };
}
