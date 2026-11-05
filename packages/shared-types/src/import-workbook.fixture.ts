import {
  IMPORT_SCHEMA_VERSION,
  IMPORT_TABLE_NAMES,
  IMPORT_TABLE_SPECS,
  OPTIONAL_COLUMNS,
  type ColumnKind,
  type ImportTableName,
} from './import-workbook.schema';
import type { RawSheets } from './import-workbook';
import type { RedactionMapRow } from './unredact';

/**
 * Builds a fake workbook in the shape the real one has, for specs and the `validate:workbook --fake` check.
 * Every name is invented; nothing here comes from real data. Cell types are deliberately varied the way a
 * spreadsheet library returns them: real dates, floats for whole numbers, TRUE/FALSE as booleans or text.
 */
export const FAKE_CUSTOMERS = ['Fake Alder Trading', 'Fake Birch Holdings', 'Fake Cedar Jewellers'];

export function fakeRedactionMap(): RedactionMapRow[] {
  return FAKE_CUSTOMERS.map((original, i) => ({
    code: `C00000${i + 1}`,
    key: original.toLowerCase(),
    original,
    type: 'customer',
  }));
}

const CODE_COLUMNS = new Set(['client_code', 'customer_code', 'seller_code', 'vendor_code']);

function cell(kind: ColumnKind, col: string, row: number): unknown {
  if (kind === 's') {
    if (CODE_COLUMNS.has(col)) return `C00000${(row % FAKE_CUSTOMERS.length) + 1}`;
    if (col === 'notes' || col === 'comments_raw' || col === 'details') return `note ${row} for C000001`;
    return `${col}-${row}`;
  }
  if (kind === 'n') return row % 2 === 0 ? row + 0.25 : row;
  if (kind === 'i') return row;
  if (kind === 'b') return row % 2 === 0 ? true : 'FALSE';
  if (kind === 'd') return new Date(Date.UTC(2026, 9, 1 + row));
  if (kind === 'm') return new Date(Date.UTC(2026, 9, 1));
  return kind.oneOf[row % kind.oneOf.length];
}

/** A raw-sheets object for the whole workbook: `rowsPerTable` rows in every table, plus `meta`. */
export function fakeWorkbookSheets(rowsPerTable = 3): RawSheets {
  const sheets: Record<string, unknown[][]> = {
    meta: [['key', 'value'], ['schema_version', IMPORT_SCHEMA_VERSION], ['redacted', 'TRUE']],
  };
  for (const name of IMPORT_TABLE_NAMES as ImportTableName[]) {
    const spec = IMPORT_TABLE_SPECS[name] as Record<string, ColumnKind>;
    const cols = Object.keys(spec);
    const rows: unknown[][] = [cols];
    for (let r = 1; r <= rowsPerTable; r++) rows.push(cols.map((c) => cell(spec[c]!, c, r)));
    sheets[name] = rows;
  }
  return sheets;
}

/** Columns an old script build did not write; handy for testing that they may be absent. */
export function withoutOptionalColumns(sheets: RawSheets): RawSheets {
  const out: Record<string, readonly (readonly unknown[])[]> = { ...sheets };
  for (const [table, drop] of Object.entries(OPTIONAL_COLUMNS)) {
    const rows = sheets[table]!;
    const keep = rows[0]!.map((h) => !drop?.includes(String(h)));
    out[table] = rows.map((r) => r.filter((_, i) => keep[i]));
  }
  return out;
}
