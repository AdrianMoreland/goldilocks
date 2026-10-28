import { z } from 'zod';
import { DISCREPANCY_ISSUE_TYPES } from './stocktake';

export const StocktakeStatusEnum = z.enum(['DRAFT', 'COUNTING', 'RECONCILING', 'FINALISED']);
export type StocktakeStatus = z.infer<typeof StocktakeStatusEnum>;

export const DiscrepancyIssueTypeEnum = z.enum(DISCREPANCY_ISSUE_TYPES);
export const SerialsCheckedEnum = z.enum(['YES', 'NO', 'NA']);

const dateOnly = z.iso.date();

export const CreateStocktakeRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  /** The day stock was physically counted. */
  countDate: dateOnly,
  /** The month-end position the count is reconciled to (may differ from countDate). */
  cutoffDate: dateOnly,
  stocktakeLead: z.string().trim().max(120).optional(),
  secondChecker: z.string().trim().max(120).optional(),
});
export type CreateStocktakeRequest = z.infer<typeof CreateStocktakeRequestSchema>;

export const UpdateStocktakeRequestSchema = z.object({
  status: StocktakeStatusEnum.optional(),
  stocktakeLead: z.string().trim().max(120).nullable().optional(),
  secondChecker: z.string().trim().max(120).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});
export type UpdateStocktakeRequest = z.infer<typeof UpdateStocktakeRequestSchema>;

/** The raw text pasted from Excel. Parsed on the server so the rules live in one place. */
export const ImportJournalRequestSchema = z.object({
  text: z.string().min(1).max(2_000_000),
});
export type ImportJournalRequest = z.infer<typeof ImportJournalRequestSchema>;

const count = z.number().int().min(0).max(1_000_000);

export const UpdateStocktakeLineRequestSchema = z.object({
  countedNormal: count.nullable().optional(),
  countedCustomer: count.nullable().optional(),
  counted: z.boolean().optional(),
  reason: z.string().max(1000).nullable().optional(),
  serialsChecked: SerialsCheckedEnum.nullable().optional(),
  serialNote: z.string().max(2000).nullable().optional(),
});
export type UpdateStocktakeLineRequest = z.infer<typeof UpdateStocktakeLineRequestSchema>;

export const StocktakeLineSchema = z.object({
  id: z.number(),
  itemNo: z.string(),
  description: z.string(),
  locationCode: z.string(),
  qtyCalculated: z.number(),
  countedNormal: z.number().nullable(),
  countedCustomer: z.number().nullable(),
  counted: z.boolean(),
  /** Qty. (Calculated) minus the counts; null until the line is counted. */
  variance: z.number().nullable(),
  reason: z.string().nullable(),
  serialsChecked: SerialsCheckedEnum.nullable(),
  serialNote: z.string().nullable(),
  batchName: z.string().nullable(),
  documentNo: z.string().nullable(),
  entryType: z.string().nullable(),
  unitAmount: z.number().nullable(),
  unitCost: z.number().nullable(),
});
export type StocktakeLine = z.infer<typeof StocktakeLineSchema>;

export const CreateDiscrepancyRequestSchema = z.object({
  itemNo: z.string().trim().max(40).nullable().optional(),
  description: z.string().trim().min(1).max(300),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: z.string().trim().max(500).default(''),
  physicalFound: z.string().trim().max(500).default(''),
  serialNo: z.string().trim().max(80).nullable().optional(),
  action: z.string().trim().max(2000).default(''),
});
export type CreateDiscrepancyRequest = z.infer<typeof CreateDiscrepancyRequestSchema>;

/** Explaining a difference never closes it: `resolved` is set on its own. */
export const UpdateDiscrepancyRequestSchema = z.object({
  bcShows: z.string().trim().max(500).optional(),
  physicalFound: z.string().trim().max(500).optional(),
  serialNo: z.string().trim().max(80).nullable().optional(),
  action: z.string().trim().max(2000).optional(),
  resolved: z.boolean().optional(),
});
export type UpdateDiscrepancyRequest = z.infer<typeof UpdateDiscrepancyRequestSchema>;

export const DiscrepancySchema = z.object({
  id: z.number(),
  itemNo: z.string().nullable(),
  description: z.string(),
  issueType: DiscrepancyIssueTypeEnum,
  bcShows: z.string(),
  physicalFound: z.string(),
  serialNo: z.string().nullable(),
  action: z.string(),
  resolved: z.boolean(),
  createdBy: z.string(),
});
export type Discrepancy = z.infer<typeof DiscrepancySchema>;

export const StocktakeSchema = z.object({
  id: z.number(),
  name: z.string(),
  countDate: dateOnly,
  cutoffDate: dateOnly,
  status: StocktakeStatusEnum,
  stocktakeLead: z.string().nullable(),
  secondChecker: z.string().nullable(),
  notes: z.string().nullable(),
  createdBy: z.string(),
  finalisedBy: z.string().nullable(),
  finalisedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
});
export type Stocktake = z.infer<typeof StocktakeSchema>;

export const StocktakeDetailSchema = StocktakeSchema.extend({
  lines: z.array(StocktakeLineSchema),
  discrepancies: z.array(DiscrepancySchema),
});
export type StocktakeDetail = z.infer<typeof StocktakeDetailSchema>;

export const ImportJournalResultSchema = z.object({
  added: z.number(),
  /** Already present for this stocktake: left untouched so an import can be repeated safely. */
  skippedExisting: z.number(),
  issues: z.array(z.object({ row: z.number(), message: z.string() })),
});
export type ImportJournalResult = z.infer<typeof ImportJournalResultSchema>;

// --- BC item codes -----------------------------------------------------------

/** Several BC items (one per refinery) point at the same Goldilocks product. */
export const BcItemSchema = z.object({
  itemNo: z.string(),
  description: z.string(),
  productId: z.number().nullable(),
  productName: z.string().nullable(),
  /** Weight-based hints for the person confirming the link. Never applied automatically. */
  suggestedProductIds: z.array(z.number()),
});
export type BcItem = z.infer<typeof BcItemSchema>;

export const LinkBcItemRequestSchema = z.object({
  productId: z.number().int().positive().nullable(),
});
export type LinkBcItemRequest = z.infer<typeof LinkBcItemRequestSchema>;

export const BcItemProductOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const BcItemsResponseSchema = z.object({
  items: z.array(BcItemSchema),
  /** The products an item can be linked to (managers cannot read the admin product list). */
  products: z.array(BcItemProductOptionSchema),
});
export type BcItemsResponse = z.infer<typeof BcItemsResponseSchema>;
