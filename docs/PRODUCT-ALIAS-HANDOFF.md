# Handoff: product names not recognised on tradesheet import (state on 2026-11-09)

Read this first in a new session. It says what is wrong, what the owner wants, and what to read. It does not prescribe the fix: plan it, then get the owner's approval before editing code. No secrets are in it.

## 1. The problem in one paragraph

Importing a monthly tradesheet (Import hub → Tradesheet) flags `Product "Full Sovereign" is not recognised.` on every sovereign row, in the tab summary ("Products not recognised") and again on each row. The cause is verified: **the `product_aliases` table is empty (0 rows)**, so the import only recognises products whose name contains a weight (`1oz`, `10g`...), through its weight fallback. Anything named without a weight (sovereigns, "Melt Ounces") fails, and **no trade is linked to a catalogue product** (`trades.productId` is null on all 1,107 rows), although the catalogue has "Full Sovereign" (product id 81, SKU `FULL-SOVEREIGN`). The aliases exist in the owner's assembled workbook ("GL import.xlsx", tab `product_aliases`, 1,124 rows, `full sovereign` included) but that workbook has never been imported (`import_batches` holds tradesheet batches only).

## 2. The desired result

1. Every product the business sells is recognised on import, whatever the wording in the sheet ("Full Sovereign", "Sovereign (Full)", "1oz Gold Krugerrand Coin", plurals, a quantity in the cell), and is linked to the real catalogue product, not just to a text key.
2. It keeps working when new wording or new products appear: an unrecognised name is settled once by a person (review queue), and never asked again.
3. A missing or empty alias list is visible (a clear warning), never a silent fall-back.
4. Rows already imported (the 28 "Full Sovereign" trades, "Half Sovereign", "Melt Ounces") get their product filled in without re-entering data.
5. Bad alias data cannot cause wrong matches: sheet errors (`#REF!`), bare numbers (`2`, `5469.18`), too-short names (`1oz`, `ref`), cells listing several products (`100g bar, 10g bar`).
6. The GL Import Apps Script and Goldilocks agree on how a product name is cleaned, so the same text always gives the same key on both sides. The owner will change the script too; tell them exactly what to change in it.
7. The preview is less noisy: one clear "not recognised" message per product per tab is enough (the per-row repeat is optional).

## 3. Facts already checked (do not redo)

- Database (Supabase project `jzhdcaspwoclrrosdoei`, read-only queries only): `product_aliases` 0 rows, `sales_products` 0 rows, `products` 71 rows, `trades` 1,107 rows of which 75 have no `productKey` (43 with empty product text, 28 "Full Sovereign", 3 "Melt Ounces", 1 "Half Sovereign").
- The script builds `suggested_key` with its own `productNorm_` (cleaned text, e.g. `full sovereign`), **not** a catalogue key; Goldilocks stores it as both `alias` and `productKey`. Its `example_text` is not stored.
- Goldilocks cleans sheet text with `cleanAliasText`, which differs from `productNorm_` (it keeps "gold", "coin", years, brackets), and matches by "longest alias contained in the text", without word boundaries.
- 468 script keys end in ` | royal mint` (invoice lines: name + refinery); they can never match tradesheet text.
- A re-import does not rewrite unchanged rows, and the fingerprint does not include the product key, so existing rows will not fix themselves.
- Importing the whole workbook also loads its `trades` and `purchase_lots`, which may overlap the trades already loaded from tradesheets. Check before importing it.
- The workbook importer refuses unknown columns (`Sheet "product_aliases": unknown column(s) ...`), so new script columns need the code first.

## 4. Files to read

| What | Where |
|---|---|
| Alias matching and product text cleaning | `packages/shared-types/src/tradesheet-import.ts` (`cleanAliasText`, `matchProduct`, `extractQtyAndProduct`, `fingerprint`) |
| Tradesheet plan, per-row issues, "not recognised" summary | `apps/api/src/modules/tradesheet-import/tradesheet-import.plan.ts` (`keyRows`, `summariseTab`) |
| Alias loading, what a re-import writes | `apps/api/src/modules/tradesheet-import/tradesheet-import.service.ts` (`loadAliases`, `writeTrades`) |
| Preview UI | `apps/web/src/app/tradesheets/page.tsx` (`TabCard`, `PreviewRow`) |
| Workbook contract (columns, optional columns, version) | `packages/shared-types/src/import-workbook.schema.ts`, `import-workbook.ts`, `import-workbook-api.schema.ts` |
| How `product_aliases` rows are saved | `apps/api/src/modules/imports/workbook-tables.ts` (`DIRECT_TABLES.product_aliases`), `workbook-import.service.ts` (`upsertDirect`) |
| Alias review queue (maps an alias to a sales product) | `apps/api/src/modules/review/review.service.ts` (`aliases`, `mapAlias`), `apps/web/src/app/import/review-tab.tsx` |
| Schema | `apps/api/prisma/schema.prisma` (`ProductAlias`, `Product`, `SalesProduct`, `Trade`); the comment on `ProductAlias` wrongly says "Master Data alias sheet" |
| Catalogue seed (sovereign SKUs) | `apps/api/prisma/seed-pricing-update.ts` |
| Tests to extend | `packages/shared-types/src/tradesheet-import.spec.ts`, `apps/api/src/modules/tradesheet-import/tradesheet-import.plan.spec.ts`, `apps/api/src/modules/imports/workbook-import.service.spec.ts` |
| GL Import Apps Script (not in the repo; the owner pastes it) | Look at `productNorm_`, `table_` (text-format regex), the "product aliases" block in `stage5_`, and `rebuild`/`deleteRaw` (rebuilding from stage 1 needs the `raw_*` tabs) |
| Roadmap section | `docs/ROADMAP.md` → 1.19 Tradesheet import and P-line matching |

**Ask the owner to paste the script and upload** the trimmed workbook (`fix_product_name.xlsx`: tabs `product_aliases`, `stock_coins`, `bc_items`, `zoho_products`, a few `raw_*`, `_columns`). It is not in the repo on purpose.

## 5. Rules for this task

- **Plan first, no code edits until the owner approves.** Give the plan in short: what changes in Goldilocks, what the owner changes in the script, in which order.
- Owner merges every PR; never merge or enable auto-merge. No `Co-Authored-By` or session trailers, no "Generated with" footers.
- A migration goes in its own commit, flagged in the PR title, and needs the owner's approval. New tables must enable RLS. Any data fix to the live database (aliases, backfill) is proposed, not run, until approved; never apply migrations through the Supabase MCP.
- UI follows `DESIGN.md`. Checks and gotchas: `docs/ROADMAP-TOOL-HANDOFF.md` sections 4 and 5 (rebuild `shared-types` after changing it; tracked `dist/` folders).
- The owner pays per token: read the files above in ranges, keep replies short.

## 6. Prompt for the next session (paste this)

> Read `docs/PRODUCT-ALIAS-HANDOFF.md`, then the files it lists. I'll paste the GL Import Apps Script and upload `fix_product_name.xlsx`. Plan how to reach the desired result in section 2, both the Goldilocks code changes and the exact changes I should make to the GL Import Apps Script, and say what order to do them in. Don't edit code until I approve.
