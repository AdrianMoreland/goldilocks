import { z } from 'zod';
import { TRADE_STATES } from './tradesheet-import';

/**
 * What the browser sends for a tradesheet import. It reads the workbook (exceljs) and sends cell values plus the
 * colour of the few cells that matter. The API re-reads every row with the same parsers, so nothing the browser
 * says about a row's meaning is trusted: only the raw cells.
 */
const CellValueSchema = z.union([z.string().max(4000), z.number(), z.boolean(), z.null()]);

export const TradesheetTabSchema = z.object({
  name: z.string().min(1).max(100),
  /** 1-based row number of the header row in the sheet. */
  headerRow: z.number().int().min(1),
  headers: z.array(CellValueSchema).max(80),
  rows: z
    .array(
      z.object({
        /** 1-based row number in the sheet, for messages and traceability. */
        row: z.number().int().min(1),
        cells: z.array(CellValueSchema).max(80),
        /** Background colour (ARGB) by column index, only for cells whose colour means something. */
        fills: z.record(z.string(), z.string().max(12)).optional(),
      }),
    )
    .max(6000),
});
export type TradesheetTab = z.infer<typeof TradesheetTabSchema>;

export const TradesheetImportRequestSchema = z.object({
  fileName: z.string().min(1).max(300),
  /** The month the file covers, "2026-10". */
  sheetMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use the form 2026-10'),
  source: z.enum(['TRADESHEET', 'BACKFILL']).default('TRADESHEET'),
  tabs: z.array(TradesheetTabSchema).min(1).max(20),
});
export type TradesheetImportRequest = z.infer<typeof TradesheetImportRequestSchema>;

// --- what the preview and the commit report ---------------------------------------------

export const PLAN_ROW_STATUSES = ['ADDED', 'CHANGED', 'RESTORED', 'MISSING', 'UNCHANGED'] as const;
export const PlanRowStatusEnum = z.enum(PLAN_ROW_STATUSES);
export type PlanRowStatus = z.infer<typeof PlanRowStatusEnum>;

export const PlanCountsSchema = z.object({
  added: z.number(),
  changed: z.number(),
  restored: z.number(),
  unchanged: z.number(),
  missing: z.number(),
  flagged: z.number(),
});
export type PlanCounts = z.infer<typeof PlanCountsSchema>;

export const PlanRowSchema = z.object({
  reference: z.string(),
  sourceRow: z.number(),
  status: PlanRowStatusEnum,
  /** Fields that differ from what Goldilocks holds, for CHANGED rows. */
  changedFields: z.array(z.string()),
  issues: z.array(z.string()),
  /** The state (or collected flag) was read from a cell colour. The preview marks these. */
  fromColour: z.boolean(),
  state: z.enum(TRADE_STATES).nullable(),
  /** The same reference appears more than once in this file. */
  duplicate: z.boolean(),
});
export type PlanRow = z.infer<typeof PlanRowSchema>;

export const TabPlanSchema = z.object({
  name: z.string(),
  kind: z.enum(['IE_GOLD_SALES', 'IE_SILVER_SALES', 'IE_GOLD_PURCHASES', 'IE_SILVER_PURCHASES']).nullable(),
  /** Why the tab is not imported, or what is wrong with its header. Empty when the tab is read. */
  problems: z.array(z.string()),
  counts: PlanCountsSchema,
  /** Rows worth showing: everything except clean unchanged rows. */
  rows: z.array(PlanRowSchema),
  /** Product texts that matched no catalogue key, with how many rows use each. */
  unmatchedProducts: z.array(z.object({ text: z.string(), rows: z.number() })),
});
export type TabPlan = z.infer<typeof TabPlanSchema>;

export const TradesheetImportPlanSchema = z.object({
  fileName: z.string(),
  sheetMonth: z.string(),
  tabs: z.array(TabPlanSchema),
  totals: PlanCountsSchema,
});
export type TradesheetImportPlan = z.infer<typeof TradesheetImportPlanSchema>;

/** What matching sales to purchase lots found, for the lots and sales this import touched. */
export const AllocationSummarySchema = z.object({
  /** Lots whose allocation was recomputed. */
  lotsChecked: z.number(),
  /** Sales now linked to the lot their CPTY names. */
  salesLinked: z.number(),
  /** Sales that name a purchase line which is not in the imported data (an older month, or a typo). */
  lotNotImported: z.number(),
  /** Lots where the sales took more items than were bought. */
  overAllocated: z.number(),
  /** Lots where the sheet's "N sold" comment disagrees with what the sales took. */
  soldMismatches: z.number(),
});
export type AllocationSummary = z.infer<typeof AllocationSummarySchema>;

export const TradesheetImportResultSchema = z.object({
  batchId: z.number(),
  plan: TradesheetImportPlanSchema,
  allocation: AllocationSummarySchema,
});
export type TradesheetImportResult = z.infer<typeof TradesheetImportResultSchema>;
