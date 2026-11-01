# Tradesheet import: slice 1 plan

Status: draft for approval. No code written. Decisions behind it are settled (see "Decisions" at the end).

## Goal of slice 1

An admin drops a monthly trade sheet (`.xlsx` exported from Google Sheets) on a new page. Goldilocks shows a preview of what will be added, changed or flagged. On commit the data is stored. Reimporting the same month updates it. No Find P-line yet (slice 3).

Roadmap: add a new Phase 1 item "Tradesheet import + P-line matching" ahead of 1.8 Hedge control (feeds 1.8's order data; depends on 0.6 audit log and 0.8 branches). Tick nothing until built.

## Scope

- IE gold (`IE - Gold`, `IE-GP`) and IE silver (`IE - Silver`, `IE-SP`). Skip `Bonded`, `ES - *`, `Live Figures` and any other tab, and list the skipped tabs in the preview.
- One-off backfill adapter for the July copy's `RawG` (sales) and `RawGP` (purchases), Jan to Jun 2026.

## Steps

1. **Branch and roadmap** (10 min). New branch `feature/tradesheet-import` off `master`. Add the roadmap item.
2. **Pure parsers in `packages/shared-types`** (about half a day, all tested). New `tradesheet-import.ts` with a spec:
   - header normalising (lower-case, strip `:` and spaces) and per-tab column aliases;
   - reference parser: `DU-G20261002` into branch, type (G, S, GP, SP), year, month, counter; also the older prefix-less forms;
   - CPTY classifier: Quote Only, empty, HEDGED (and variants), lot reference (with stray spaces, e.g. `BL -GP20260654`), supplier invoice (`StoneX #…`, `Coininvest …`), Deferred;
   - state derivation from CPTY text, cell fill and Collected, and `Deferred from/to` link parsing from NOTES;
   - "N sold" / "all sold" remaining parser (typos like "alls old" go to review, never guessed);
   - product normaliser: alias match, then weight plus bar/coin key, then "unmatched";
   - row fingerprint for change detection.
3. **Schema and migration** (2 h). Models, all money `Decimal`:
   - `ImportBatch` (file name, month, tab counts, who, when, summary);
   - `Trade` (reference, occurrence, metal, branch, client, qty, product text and `productId?`, date, spot, raw CPTY, state, cost, receipt, profit, margin, paid, collected, notes, hedge fields, link refs, `lotRef`, source tab and row, fingerprint, `missingFromImport`);
   - `PurchaseLot` (reference, metal, qty, product, dates, price, hedged-at, raw comments, parsed sold count, source row, `missingFromImport`);
   - `StockUnit` (gold only: one row per item, `lotId`, `tradeId?`);
   - `ProductAlias` (alias to `Product`, review flag);
   - the `ES` value on `BranchRegion` for Barcelona (a branch is named by its sheet code: DU, CO, BL, BC).
   Unique key on Trade is `(reference, occurrence)`; duplicate references are stored and flagged.
4. **API module `tradesheet-import`** (1 day). `POST /tradesheet-import/preview` and `/commit` take validated rows as JSON (parsing happens in the browser). Commit runs in one `$transaction` with an audit entry, reusing the customer-orders pattern. Admin only. Specs mock `PrismaService` at the provider boundary.
5. **Import page `apps/web/src/app/tradesheets`** (1 day). Drag and drop plus button, `exceljs` reads values and cell fills, preview table with counts (added / changed / unchanged / missing / flagged), colour-inferred states marked, unmatched products and duplicate references listed, commit button.
6. **Allocation from CPTY** (half a day). On commit, resolve each sale's lot reference to a `PurchaseLot` and allocate `StockUnit` rows. Unresolved lots show as "lot not imported". Compare each lot's parsed "N sold" with allocations and store mismatches for the slice 2 review list.
7. **Backfill adapter** (half a day). Maps `RawG` and `RawGP` (older headers, Bagged booleans) into the same row shape.
8. **Verify** (2 h). Real September and October files through preview, then commit, then reimport with edited rows; `pnpm --filter api exec jest`, shared-types build and specs, web build and type check.

About 4 to 5 working days in total.

## Known risks

- Cell fills must survive the Google export; check on the October file first (they do in the copy).
- Hand-typed CPTY and comments (typos, "damaged", "brinks london") make some rows unclassifiable. They are flagged, never guessed.
- 14 duplicate sale references in the Jan to Jun backfill; they show up as flagged.
- Product aliases are seeded from the Master Data alias sheet; expect a first batch of unmatched names to review.

## Not in slice 1

Find P-line and the conflict review (3), fulfilment statuses and the `BAGGED` to `ALLOCATED` rename (4), Spain, Bonded, new-trade creation.

## Decisions

Recorded from the grilling session on 2026-11-01: sheets stay the source and Goldilocks mirrors them; admin only; gold one row per item, silver lot quantity; states Quote, Awaiting hedge, Hedged, Invoiced, Deferred; allocations from CPTY with the "N sold" comment as a check; fulfilment reuses the extended Customer Orders status.
