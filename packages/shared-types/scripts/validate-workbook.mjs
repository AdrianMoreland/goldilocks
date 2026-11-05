// Usage: node scripts/validate-workbook.mjs <workbook.xlsx>      check a real workbook
//        node scripts/validate-workbook.mjs --fake               build a fake workbook, write it as xlsx, read it back
// Prints counts and issues only, never cell values. Needs `pnpm build` first (reads dist/).
import ExcelJS from 'exceljs';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fakeWorkbookSheets, readImportWorkbook } from '../dist/index.js';

function plain(v) {
  if (v && typeof v === 'object' && !(v instanceof Date)) {
    if ('result' in v) return plain(v.result);
    if ('richText' in v) return v.richText.map((t) => t.text).join('');
    if ('text' in v) return v.text;
    if ('error' in v) return null;
  }
  return v ?? null;
}

async function readXlsx(path) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path);
  const sheets = {};
  wb.eachSheet((ws) => {
    const rows = [];
    ws.eachRow({ includeEmpty: true }, (row) => {
      const cells = [];
      for (let c = 1; c <= ws.columnCount; c++) cells.push(plain(row.getCell(c).value));
      rows.push(cells);
    });
    sheets[ws.name] = rows;
  });
  return sheets;
}

async function writeFakeXlsx() {
  const wb = new ExcelJS.Workbook();
  for (const [name, rows] of Object.entries(fakeWorkbookSheets(5))) wb.addWorksheet(name).addRows(rows);
  const path = join(mkdtempSync(join(tmpdir(), 'gl-fake-')), 'fake-workbook.xlsx');
  await wb.xlsx.writeFile(path);
  return path;
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: validate-workbook.mjs <workbook.xlsx> | --fake');
  process.exit(2);
}
const path = arg === '--fake' ? await writeFakeXlsx() : arg;
const r = readImportWorkbook(await readXlsx(path));

console.log(`schema version: ${r.schemaVersion ?? 'none'}   ok: ${r.ok}`);
for (const e of r.schemaErrors) console.log(`SCHEMA  ${e}`);
console.log('rows per table:');
for (const [t, n] of Object.entries(r.counts)) console.log(`  ${t.padEnd(22)} ${n}`);
const totals = Object.entries(r.issueTotals);
console.log(totals.length ? 'row issues (table.code: count):' : 'row issues: none');
for (const [k, n] of totals) console.log(`  ${k}: ${n}`);
for (const [t, n] of Object.entries(r.droppedRows)) console.log(`dropped rows ${t}: ${n}`);
if (r.warnings.emailOrUrlCells || r.warnings.impossibleDates) {
  console.log(`NEEDS CONTINUE/STOP: ${r.warnings.emailOrUrlCells} email/web cells, ${r.warnings.impossibleDates} impossible dates`);
}
process.exit(r.ok && totals.length === 0 ? 0 : 1);
