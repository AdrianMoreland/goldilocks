import { z } from 'zod';
import { ORDER_LIFECYCLE, ORDER_STEPS, SHEETS } from './orders';

export const OrderLifecycleEnum = z.enum(ORDER_LIFECYCLE);
export const OrderStepEnum = z.enum(ORDER_STEPS);
export const SheetNameEnum = z.enum(SHEETS);
export const OrderSourceEnum = z.enum(['STOCK', 'SUPPLIER', 'UNDECIDED', 'NEEDS_ORDER']);
export const OrderQueueEnum = z.enum(['order', 'arrive', 'alloc', 'pline', 'nopost', 'tsmark', 'bcanom', 'over', 'defer', 'quote']);
export const TaskCheckEnum = z.enum(['TRADE_COLLECTED', 'TRADE_CPTY', 'MANUAL']);

const dateOnly = z.iso.date();

export const SheetTaskSchema = z.object({
  id: z.number(),
  tradeId: z.number().nullable(),
  reference: z.string(),
  client: z.string(),
  sheet: SheetNameEnum,
  what: z.string(),
  value: z.string(),
  check: TaskCheckEnum,
  status: z.enum(['OPEN', 'DONE']),
  createdAt: z.iso.datetime(),
  createdBy: z.string(),
  closedAt: z.iso.datetime().nullable(),
  closedBy: z.string().nullable(),
  closedVia: z.enum(['MANUAL', 'IMPORT']).nullable(),
});
export type SheetTask = z.infer<typeof SheetTaskSchema>;

export const OrderEventSchema = z.object({
  id: z.number(),
  step: OrderStepEnum,
  by: z.string(),
  at: z.iso.datetime(),
  note: z.string().nullable(),
});
export type OrderEvent = z.infer<typeof OrderEventSchema>;

export const OrderRowSchema = z.object({
  id: z.number(),
  reference: z.string(),
  client: z.string(),
  branchCode: z.string().nullable(),
  metal: z.string(),
  qty: z.number().nullable(),
  product: z.string(),
  date: dateOnly.nullable(),
  amount: z.number().nullable(),
  cpty: z.string().nullable(),
  supplierInvoice: z.string().nullable(),
  lifecycle: OrderLifecycleEnum,
  source: OrderSourceEnum,
  queues: z.array(OrderQueueEnum),
  nextAction: z.object({ code: z.string(), label: z.string(), who: z.enum(['broker', 'manager']).nullable(), step: OrderStepEnum.nullable() }),
  openTasks: z.number(),
});
export type OrderRow = z.infer<typeof OrderRowSchema>;

export const OrderDetailSchema = OrderRowSchema.extend({
  events: z.array(OrderEventSchema),
  tasks: z.array(SheetTaskSchema),
  allowedSteps: z.array(OrderStepEnum),
  notes: z.string().nullable(),
});
export type OrderDetail = z.infer<typeof OrderDetailSchema>;

export const OrderListQuerySchema = z.object({
  queue: z.union([OrderQueueEnum, z.literal('all')]).optional(),
  q: z.string().trim().max(80).optional(),
  branch: z.string().trim().max(8).optional(),
});
export type OrderListQuery = z.infer<typeof OrderListQuerySchema>;

export const OrderListResponseSchema = z.object({
  rows: z.array(OrderRowSchema),
  /** Rows per queue across the whole open set, not just the filtered rows. */
  counts: z.record(z.string(), z.number()),
  openTasks: z.number(),
  asOf: z.iso.datetime(),
});
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;

export const RecordStepRequestSchema = z.object({
  supplierInvoice: z.string().trim().max(60).optional(),
  pline: z.string().trim().max(40).optional(),
  soldComment: z.string().trim().max(60).optional(),
  serials: z.array(z.string().trim().max(40)).max(200).optional(),
  refinery: z.string().trim().max(60).optional(),
  stockChange: z.string().trim().max(200).optional(),
  note: z.string().trim().max(500).optional(),
});
export type RecordStepRequest = z.infer<typeof RecordStepRequestSchema>;

export const SheetTaskListQuerySchema = z.object({ status: z.enum(['OPEN', 'DONE']).optional() });
export type SheetTaskListQuery = z.infer<typeof SheetTaskListQuerySchema>;

export const ReconcileResultSchema = z.object({ checked: z.number(), closed: z.number() });
export type ReconcileResult = z.infer<typeof ReconcileResultSchema>;

export const HandoverSchema = z.object({ id: z.number(), note: z.string(), by: z.string(), createdAt: z.iso.datetime() });
export type Handover = z.infer<typeof HandoverSchema>;
/** Wrapped so that "no note yet" is a normal answer, not an empty body. */
export const LatestHandoverSchema = z.object({ handover: HandoverSchema.nullable() });
export type LatestHandover = z.infer<typeof LatestHandoverSchema>;
export const SaveHandoverRequestSchema = z.object({ note: z.string().trim().min(1).max(2000) });
export type SaveHandoverRequest = z.infer<typeof SaveHandoverRequestSchema>;
