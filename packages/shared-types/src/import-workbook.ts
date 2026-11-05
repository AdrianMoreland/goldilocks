import {
  IMPORT_SCHEMA_VERSION,
  IMPORT_TABLE_NAMES,
  IMPORT_TABLE_SPECS,
  OPTIONAL_COLUMNS,
  type ColumnKind,
  type ImportRow,
  type ImportRowIssue,
  type ImportRowIssueCode,
  type ImportTableName,
} from './import-workbook.schema';

/** Parsed sheets: sheet name -> rows of cells, first row = header. Spreadsheet libraries differ in cell types, so cells stay `unknown`. */
export type RawSheets = Record<string, readonly (readonly unknown[])[]>;

export const MAX_LISTED_ISSUES = 500;
const MIN_YEAR = 1990;
const MAX_YEAR = 2100;
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const URL_RE = /\bhttps?:\/\/|\bwww\./i;

type Coerced = { value: unknown; issue?: ImportRowIssueCode; raw?: string };
const ok = (value: unknown): Coerced => ({ value });
const bad = (issue: ImportRowIssueCode, raw: unknown): Coerced => ({ value: null, issue, raw: String(raw).slice(0, 40) });

function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
}

function ymd(y: number, m: number, d: number | null): string | null {
  if (y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12) return null;
  if (d !== null && (d < 1 || d > new Date(Date.UTC(y, m, 0)).getUTCDate())) return null;
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return d === null ? `${y}-${p(m)}` : `${y}-${p(m)}-${p(d)}`;
}

/** Parses the date forms a sheet can hold. `null` = not a date at all; otherwise the parts (the year may be impossible). */
function dateParts(v: unknown): { y: number; m: number; d: number | null; hasDay: boolean } | null {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return { y: v.getUTCFullYear(), m: v.getUTCMonth() + 1, d: v.getUTCDate(), hasDay: true };
  }
  if (typeof v === 'number') {
    if (v < 20000 || v > 80000) return null;
    return dateParts(new Date(Math.round((v - 25569) * 86400000)));
  }
  const s = String(v).trim();
  let m = s.match(/^(\d{1,4})-(\d{1,2})(?:-(\d{1,2}))?(?!\d)/);
  if (m) return { y: +m[1]!, m: +m[2]!, d: m[3] ? +m[3] : null, hasDay: Boolean(m[3]) };
  m = s.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})$/);
  if (m) return { y: m[3]!.length === 2 ? 2000 + +m[3]! : +m[3]!, m: +m[2]!, d: +m[1]!, hasDay: true };
  return null;
}

function coerce(kind: ColumnKind, v: unknown): Coerced {
  if (isEmpty(v)) return ok(null);
  if (kind === 's') {
    let s: string;
    if (v instanceof Date) s = Number.isNaN(v.getTime()) ? '' : v.toISOString().slice(0, 10);
    else if (typeof v === 'boolean') s = v ? 'TRUE' : 'FALSE';
    else s = String(v).trim();
    if (EMAIL_RE.test(s) || URL_RE.test(s)) return { value: s, issue: 'EMAIL_OR_URL' };
    return ok(s);
  }
  if (kind === 'n' || kind === 'i') {
    let n: number;
    if (typeof v === 'number') n = v;
    else {
      let t = String(v).replace(/[€£$\s]/g, '');
      if (/^-?\d+,\d{1,2}$/.test(t)) t = t.replace(',', '.');
      else t = t.replace(/,/g, '');
      n = t === '' ? NaN : Number(t);
    }
    if (!Number.isFinite(n)) return bad('BAD_NUMBER', v);
    if (kind === 'i' && !Number.isInteger(n)) return bad('BAD_INTEGER', v);
    return ok(n);
  }
  if (kind === 'b') {
    if (typeof v === 'boolean') return ok(v);
    const t = String(v).trim().toUpperCase();
    if (t === 'TRUE' || t === '1') return ok(true);
    if (t === 'FALSE' || t === '0') return ok(false);
    return bad('BAD_BOOLEAN', v);
  }
  if (kind === 'd' || kind === 'm') {
    const p = dateParts(v);
    if (!p) return bad('BAD_DATE', v);
    const shown = v instanceof Date ? v.toISOString().slice(0, 10) : v;
    if (kind === 'd' && !p.hasDay) return bad('BAD_DATE', shown);
    const out = ymd(p.y, p.m, kind === 'd' ? p.d : null);
    return out === null ? bad('IMPOSSIBLE_DATE', shown) : ok(out);
  }
  const t = String(v).trim().toUpperCase();
  const canonical = kind.oneOf.find((o) => o.toUpperCase() === t);
  return canonical !== undefined ? ok(canonical) : bad('BAD_VALUE', v);
}

export interface ImportReadResult {
  /** False when the workbook's shape is wrong (see `schemaErrors`); the tables are then not usable. */
  ok: boolean;
  schemaErrors: string[];
  schemaVersion: string | null;
  tables: { [T in ImportTableName]: ImportRow<T>[] };
  counts: Record<ImportTableName, number>;
  /** The first MAX_LISTED_ISSUES issues; totals below are complete. */
  issues: ImportRowIssue[];
  /** `table.CODE` -> count. */
  issueTotals: Record<string, number>;
  /** Rows left out because a required enum value was invalid (links only). */
  droppedRows: Partial<Record<ImportTableName, number>>;
  /** Cells that need the owner's Continue or Stop before anything is kept. */
  warnings: { emailOrUrlCells: number; impossibleDates: number };
}

const LINK_KEY_COLUMNS = ['link_type', 'confidence'];

function emptyTables(): ImportReadResult['tables'] {
  return Object.fromEntries(IMPORT_TABLE_NAMES.map((n) => [n, []])) as unknown as ImportReadResult['tables'];
}

/** Reads the parsed sheets into typed tables. Never throws on data: every problem is a schema error or a row issue. */
export function readImportWorkbook(sheets: RawSheets): ImportReadResult {
  const schemaErrors: string[] = [];
  const tables = emptyTables();
  const issues: ImportRowIssue[] = [];
  const issueTotals: Record<string, number> = {};
  const droppedRows: Partial<Record<ImportTableName, number>> = {};

  let schemaVersion: string | null = null;
  const metaRows = sheets['meta'];
  if (!metaRows) schemaErrors.push('Missing sheet "meta".');
  else {
    for (const r of metaRows.slice(1)) if (String(r[0] ?? '').trim() === 'schema_version') schemaVersion = String(r[1] ?? '').trim() || null;
    if (schemaVersion !== IMPORT_SCHEMA_VERSION) {
      schemaErrors.push(`Unsupported schema version "${schemaVersion ?? 'none'}" (expected ${IMPORT_SCHEMA_VERSION}).`);
    }
  }

  for (const name of IMPORT_TABLE_NAMES) {
    const rows = sheets[name];
    if (!rows || rows.length === 0) {
      schemaErrors.push(`Missing sheet "${name}".`);
      continue;
    }
    const spec = IMPORT_TABLE_SPECS[name] as Record<string, ColumnKind>;
    const header = rows[0]!.map((h) => String(h ?? '').trim());
    const optional = OPTIONAL_COLUMNS[name] ?? [];
    const missing = Object.keys(spec).filter((c) => !header.includes(c) && !optional.includes(c));
    const unknown = header.filter((h) => h !== '' && !(h in spec));
    if (missing.length || unknown.length) {
      const parts = [];
      if (missing.length) parts.push(`missing column(s) ${missing.join(', ')}`);
      if (unknown.length) parts.push(`unknown column(s) ${unknown.join(', ')}`);
      schemaErrors.push(`Sheet "${name}": ${parts.join('; ')}.`);
      continue;
    }

    const colIndex = header.map((h) => (h in spec ? h : null));
    const out = tables[name] as Record<string, unknown>[];
    for (let r = 1; r < rows.length; r++) {
      const cells = rows[r]!;
      if (cells.every(isEmpty)) continue;
      const row: Record<string, unknown> = Object.fromEntries(Object.keys(spec).map((c) => [c, null]));
      let drop = false;
      colIndex.forEach((col, i) => {
        if (!col) return;
        const res = coerce(spec[col]!, cells[i]);
        row[col] = res.value;
        if (!res.issue) return;
        const key = `${name}.${res.issue}`;
        issueTotals[key] = (issueTotals[key] ?? 0) + 1;
        if (issues.length < MAX_LISTED_ISSUES) {
          issues.push({ table: name, row: r + 1, column: col, code: res.issue, ...(res.raw !== undefined && res.issue !== 'EMAIL_OR_URL' ? { raw: res.raw } : {}) });
        }
        if (name === 'links' && LINK_KEY_COLUMNS.includes(col)) drop = true;
      });
      if (drop) droppedRows[name] = (droppedRows[name] ?? 0) + 1;
      else out.push(row);
    }
  }

  const counts = Object.fromEntries(IMPORT_TABLE_NAMES.map((n) => [n, tables[n].length])) as Record<ImportTableName, number>;
  const total = (code: ImportRowIssueCode) => Object.entries(issueTotals).filter(([k]) => k.endsWith(`.${code}`)).reduce((s, [, n]) => s + n, 0);
  return {
    ok: schemaErrors.length === 0,
    schemaErrors,
    schemaVersion,
    tables,
    counts,
    issues,
    issueTotals,
    droppedRows,
    warnings: { emailOrUrlCells: total('EMAIL_OR_URL'), impossibleDates: total('IMPOSSIBLE_DATE') },
  };
}
