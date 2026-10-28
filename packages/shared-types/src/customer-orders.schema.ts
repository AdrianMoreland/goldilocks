import { z } from 'zod';
import { CUSTOMER_ORDER_STATUSES, EVIDENCE_KINDS } from './customer-orders';
import { StockMetalEnum } from './stocktake.schema';

export const CustomerOrderStatusEnum = z.enum(CUSTOMER_ORDER_STATUSES);
export const EvidenceKindEnum = z.enum(EVIDENCE_KINDS);

const dateOnly = z.iso.date();

export const CustomerOrderEvidenceSchema = z.object({
  id: z.number(),
  kind: EvidenceKindEnum,
  reference: z.string().nullable(),
  note: z.string().nullable(),
  observedOn: dateOnly.nullable(),
  recordedBy: z.string(),
  createdAt: z.iso.datetime(),
});
export type CustomerOrderEvidence = z.infer<typeof CustomerOrderEvidenceSchema>;

export const CustomerOrderSchema = z.object({
  id: z.number(),
  locationCode: z.string(),
  client: z.string(),
  /** The tradesheet reference as written, e.g. DU-G20261002. */
  reference: z.string().nullable(),
  /** The Business Central sales order, e.g. SOR-100014. */
  bcOrderNo: z.string().nullable(),
  /** The supplier order, e.g. StoneX #505097. */
  supplierRef: z.string().nullable(),
  metal: StockMetalEnum.nullable(),
  product: z.string(),
  /** Optional BC item number, entered by a person. */
  bcItemNo: z.string().nullable(),
  quantity: z.number(),
  refinery: z.string().nullable(),
  serials: z.string().nullable(),
  status: CustomerOrderStatusEnum,
  orderedOn: dateOnly.nullable(),
  missing: z.boolean(),
  notes: z.string().nullable(),
  createdBy: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  evidence: z.array(CustomerOrderEvidenceSchema),
});
export type CustomerOrder = z.infer<typeof CustomerOrderSchema>;

const text = (max: number) => z.string().trim().max(max);

export const CreateCustomerOrderRequestSchema = z.object({
  locationCode: text(20).min(1),
  client: text(200).min(1),
  reference: text(60).nullable().optional(),
  bcOrderNo: text(40).nullable().optional(),
  supplierRef: text(80).nullable().optional(),
  metal: StockMetalEnum.nullable().optional(),
  product: text(200).min(1),
  bcItemNo: text(40).nullable().optional(),
  quantity: z.number().int().min(1).max(1_000_000),
  refinery: text(80).nullable().optional(),
  serials: text(2000).nullable().optional(),
  status: CustomerOrderStatusEnum.default('ORDERED'),
  orderedOn: dateOnly.nullable().optional(),
  notes: text(2000).nullable().optional(),
});
export type CreateCustomerOrderRequest = z.infer<typeof CreateCustomerOrderRequestSchema>;

export const UpdateCustomerOrderRequestSchema = z.object({
  locationCode: text(20).min(1).optional(),
  client: text(200).min(1).optional(),
  reference: text(60).nullable().optional(),
  bcOrderNo: text(40).nullable().optional(),
  supplierRef: text(80).nullable().optional(),
  metal: StockMetalEnum.nullable().optional(),
  product: text(200).min(1).optional(),
  bcItemNo: text(40).nullable().optional(),
  quantity: z.number().int().min(1).max(1_000_000).optional(),
  refinery: text(80).nullable().optional(),
  serials: text(2000).nullable().optional(),
  status: CustomerOrderStatusEnum.optional(),
  orderedOn: dateOnly.nullable().optional(),
  missing: z.boolean().optional(),
  notes: text(2000).nullable().optional(),
});
export type UpdateCustomerOrderRequest = z.infer<typeof UpdateCustomerOrderRequestSchema>;

export const AddEvidenceRequestSchema = z.object({
  kind: EvidenceKindEnum,
  reference: text(200).nullable().optional(),
  note: text(2000).nullable().optional(),
  observedOn: dateOnly.nullable().optional(),
});
export type AddEvidenceRequest = z.infer<typeof AddEvidenceRequestSchema>;

export const ImportCustomerOrdersRequestSchema = z.object({
  metal: StockMetalEnum,
  /** Used for rows that carry no status of their own (for example the Not bagged sheet). */
  fallbackStatus: CustomerOrderStatusEnum.nullable().optional(),
  text: z.string().min(1).max(2_000_000),
});
export type ImportCustomerOrdersRequest = z.infer<typeof ImportCustomerOrdersRequestSchema>;

export const ImportCustomerOrdersResultSchema = z.object({
  added: z.number(),
  skipped: z.number(),
  issues: z.array(z.object({ row: z.number(), message: z.string() })),
});
export type ImportCustomerOrdersResult = z.infer<typeof ImportCustomerOrdersResultSchema>;

export const ExpectedCustomerStockSchema = z.array(
  z.object({ locationCode: z.string(), product: z.string(), quantity: z.number() }),
);
export type ExpectedCustomerStockResponse = z.infer<typeof ExpectedCustomerStockSchema>;
