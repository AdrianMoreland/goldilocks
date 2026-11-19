import { z } from 'zod';

/** Live stock board (roadmap 1.12b): current counts per branch that staff edit, backed by append-only movements. */

export const LiveMetalSchema = z.enum(['GOLD', 'SILVER', 'PGM']);
export const LiveKindSchema = z.enum(['COIN', 'BAR']);
export const LiveBarStatusSchema = z.enum(['IN_STOCK', 'SOLD', 'REMOVED']);
export const LiveMovementSourceSchema = z.enum([
  'MANUAL',
  'IMPORT',
  'SHEET_SALE',
  'SHEET_PURCHASE',
  'TRANSFER',
  'UNDO',
]);

const BranchCode = z.string().trim().min(1).max(8).transform((s) => s.toUpperCase());
const Reason = z.string().trim().min(1, 'A short reason is required').max(120);
const Note = z.string().trim().max(500).optional();

// ---------------------------------------------------------------- reads

export const LiveStockBarSchema = z.object({
  id: z.number().int(),
  serial: z.string(),
  grams: z.number().nullable(),
  details: z.string().nullable(),
  status: LiveBarStatusSchema,
});
export type LiveStockBar = z.infer<typeof LiveStockBarSchema>;

export const LiveStockLineSchema = z.object({
  id: z.number().int(),
  branchCode: z.string(),
  metal: LiveMetalSchema,
  kind: LiveKindSchema,
  family: z.string(),
  variant: z.string(),
  refinery: z.string(),
  qty: z.number().int(),
  lowThreshold: z.number().int().nullable(),
  unassigned: z.number().int(),
  details: z.string().nullable(),
  /** In-stock serialled bars on this line (bars only). */
  bars: z.array(LiveStockBarSchema),
  updatedAt: z.string(),
});
export type LiveStockLine = z.infer<typeof LiveStockLineSchema>;

export const LiveStockBranchSchema = z.object({
  code: z.string(),
  name: z.string(),
  branchId: z.number().int().nullable(),
  cutoverDate: z.string().nullable(),
  /** Whether the signed-in person may change this branch's counts. */
  canEdit: z.boolean(),
});
export type LiveStockBranch = z.infer<typeof LiveStockBranchSchema>;

export const LiveStockBoardSchema = z.object({
  branch: LiveStockBranchSchema,
  metal: LiveMetalSchema,
  lines: z.array(LiveStockLineSchema),
});
export type LiveStockBoard = z.infer<typeof LiveStockBoardSchema>;

export const LiveStockBranchesResponseSchema = z.object({
  branches: z.array(LiveStockBranchSchema),
  /** The code of the signed-in person's own branch, when it is linked. */
  mine: z.string().nullable(),
});
export type LiveStockBranchesResponse = z.infer<typeof LiveStockBranchesResponseSchema>;

export const LiveStockMovementSchema = z.object({
  id: z.number().int(),
  lineId: z.number().int(),
  delta: z.number().int(),
  qtyAfter: z.number().int(),
  source: LiveMovementSourceSchema,
  reference: z.string().nullable(),
  reason: z.string().nullable(),
  note: z.string().nullable(),
  actor: z.string(),
  at: z.string(),
  reversesId: z.number().int().nullable(),
  /** True when a later UNDO already reversed this movement. */
  undone: z.boolean(),
});
export type LiveStockMovement = z.infer<typeof LiveStockMovementSchema>;

// ---------------------------------------------------------------- writes

/** Change a count by a step (`delta`) or to a typed value (`qty`). Exactly one of the two. */
export const AdjustLiveStockRequestSchema = z
  .object({
    delta: z.number().int().optional(),
    qty: z.number().int().min(0).optional(),
    reason: Reason,
    note: Note,
  })
  .refine((v) => (v.delta === undefined) !== (v.qty === undefined), {
    message: 'Send either delta or qty, not both.',
  })
  .refine((v) => v.delta !== 0, { message: 'A change of zero is not a change.' });
export type AdjustLiveStockRequest = z.infer<typeof AdjustLiveStockRequestSchema>;

export const CreateLiveStockLineRequestSchema = z.object({
  branchCode: BranchCode,
  metal: LiveMetalSchema,
  kind: LiveKindSchema,
  family: z.string().trim().min(1).max(60),
  variant: z.string().trim().min(1).max(80),
  refinery: z.string().trim().max(60).default(''),
  qty: z.number().int().min(0).default(0),
  reason: Reason,
  note: Note,
});
export type CreateLiveStockLineRequest = z.infer<typeof CreateLiveStockLineRequestSchema>;

export const AddLiveStockBarRequestSchema = z.object({
  serial: z.string().trim().min(2).max(60),
  grams: z.number().positive().optional(),
  details: z.string().trim().max(200).optional(),
  reason: Reason,
});
export type AddLiveStockBarRequest = z.infer<typeof AddLiveStockBarRequestSchema>;

export const SetLiveStockBarStatusRequestSchema = z.object({
  status: LiveBarStatusSchema,
  reason: Reason,
  note: Note,
});
export type SetLiveStockBarStatusRequest = z.infer<typeof SetLiveStockBarStatusRequestSchema>;

export const TransferLiveStockRequestSchema = z.object({
  toBranchCode: BranchCode,
  qty: z.number().int().min(1),
  /** Serials of the bars that move; they must number `qty` or fewer (the rest travel unserialled). */
  barIds: z.array(z.number().int()).default([]),
  reason: Reason,
  note: Note,
});
export type TransferLiveStockRequest = z.infer<typeof TransferLiveStockRequestSchema>;

export const LowThresholdRequestSchema = z.object({
  lowThreshold: z.number().int().min(0).nullable(),
});
export type LowThresholdRequest = z.infer<typeof LowThresholdRequestSchema>;

export const LinkLiveStockBranchRequestSchema = z.object({
  branchId: z.number().int().nullable(),
});
export type LinkLiveStockBranchRequest = z.infer<typeof LinkLiveStockBranchRequestSchema>;

// ---------------------------------------------------------------- baseline load

export const BaselineBarRowSchema = z.object({
  metal: LiveMetalSchema,
  row: z.number().int(),
  branch: z.string(),
  weight: z.string(),
  refinery: z.string().nullable(),
  serial: z.string().nullable(),
  grams: z.number().nullable(),
  details: z.string().nullable(),
  sold: z.boolean(),
});

export const BaselineCoinRowSchema = z.object({
  metal: LiveMetalSchema,
  row: z.number().int(),
  item: z.string(),
  counts: z.record(z.string(), z.number().nullable()),
  details: z.record(z.string(), z.string().nullable()),
});

/** The stock sheet as the browser read it. The server plans and (on commit) writes; it never opens the file. */
export const LiveBaselineRequestSchema = z.object({
  bars: z.array(BaselineBarRowSchema).max(5000),
  coins: z.array(BaselineCoinRowSchema).max(2000),
  /** The day the sheet was last updated. Sheet sales dated on or before it never apply. */
  cutoverDate: z.iso.date(),
  /** Only these branches are loaded; others in the file are ignored. */
  branchCodes: z.array(BranchCode).min(1).default(['DU', 'CO', 'BL', 'BC']),
});
export type LiveBaselineRequest = z.infer<typeof LiveBaselineRequestSchema>;

export const LiveBaselinePreviewSchema = z.object({
  lines: z.number().int(),
  linesToCreate: z.number().int(),
  linesToChange: z.number().int(),
  units: z.number().int(),
  bars: z.number().int(),
  barsToCreate: z.number().int(),
  skippedSold: z.number().int(),
  fixes: z.array(z.object({ row: z.number(), field: z.string(), from: z.string(), to: z.string() })),
  issues: z.array(z.object({ row: z.number(), message: z.string() })),
  clashes: z.array(z.object({ serialKey: z.string(), rows: z.array(z.number()) })),
  unlistedRefineries: z.array(z.string()),
  byBranch: z.record(z.string(), z.number().int()),
});
export type LiveBaselinePreview = z.infer<typeof LiveBaselinePreviewSchema>;

export const LiveBaselineResultSchema = LiveBaselinePreviewSchema.extend({
  applied: z.literal(true),
});
export type LiveBaselineResult = z.infer<typeof LiveBaselineResultSchema>;

export const LiveStockBoardQuerySchema = z.object({
  branch: BranchCode,
  metal: LiveMetalSchema.default('GOLD'),
});
export type LiveStockBoardQuery = z.infer<typeof LiveStockBoardQuerySchema>;
