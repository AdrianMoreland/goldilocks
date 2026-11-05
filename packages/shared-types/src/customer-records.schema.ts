import { z } from 'zod';

/**
 * Customers and invoices from the imported Zoho history and the tradesheets. Read only, admin only. Customer names
 * appear only in these responses: searches are POST bodies and pages are addressed by number, so a name never reaches
 * a URL, a log line or browser storage. Lists are paged (at most 100 rows); there is no export.
 */

export const RECORD_PAGE_MAX = 100;

export const RecordSearchRequestSchema = z.object({
  q: z.string().trim().max(80).optional(),
  status: z.string().trim().max(30).optional(),
  limit: z.number().int().min(1).max(RECORD_PAGE_MAX).default(50),
  offset: z.number().int().min(0).default(0),
});
export type RecordSearchRequest = z.infer<typeof RecordSearchRequestSchema>;

export const CustomerListRowSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  status: z.string().nullable(),
  currency: z.string().nullable(),
  /** Sales linked to this customer that are not collected yet. */
  openOrders: z.number().int(),
  lastOrder: z.string().nullable(),
  /** Sum of their Zoho invoices that are not draft or void. */
  lifetime: z.number(),
  /** Date of their first invoice or sale. */
  since: z.string().nullable(),
});
export type CustomerListRow = z.infer<typeof CustomerListRowSchema>;

export const CustomerListResponseSchema = z.object({ total: z.number().int(), rows: z.array(CustomerListRowSchema) });
export type CustomerListResponse = z.infer<typeof CustomerListResponseSchema>;

export const CustomerOrderRowSchema = z.object({
  tradeId: z.number().int(),
  reference: z.string(),
  date: z.string().nullable(),
  qty: z.number().nullable(),
  productText: z.string(),
  state: z.string(),
  collected: z.boolean(),
  branchCode: z.string().nullable(),
});

export const InvoiceCollectedSchema = z.enum(['YES', 'NO', 'PARTIAL']).nullable();

export const CustomerInvoiceRowSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  date: z.string().nullable(),
  total: z.number().nullable(),
  status: z.string().nullable(),
  collected: InvoiceCollectedSchema,
});

export const PaymentRowSchema = z.object({
  id: z.number().int(),
  date: z.string().nullable(),
  amount: z.number().nullable(),
  mode: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
});

export const QuoteRowSchema = z.object({
  id: z.number().int(),
  reference: z.string(),
  date: z.string().nullable(),
  qty: z.number().nullable(),
  productText: z.string(),
  status: z.string(),
});

export const CustomerProfileSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  status: z.string().nullable(),
  currency: z.string().nullable(),
  zohoNumber: z.string().nullable(),
  since: z.string().nullable(),
  lastOrder: z.string().nullable(),
  openOrders: z.number().int(),
  lifetime: z.number(),
  /** Newest first, at most 100 each. */
  orders: z.array(CustomerOrderRowSchema),
  invoices: z.array(CustomerInvoiceRowSchema),
  payments: z.array(PaymentRowSchema),
  quotes: z.array(QuoteRowSchema),
});
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

export const InvoiceListRowSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  date: z.string().nullable(),
  customerId: z.number().int().nullable(),
  customerName: z.string().nullable(),
  total: z.number().nullable(),
  status: z.string().nullable(),
  lineCount: z.number().int().nullable(),
  collected: InvoiceCollectedSchema,
});
export type InvoiceListRow = z.infer<typeof InvoiceListRowSchema>;

export const InvoiceListResponseSchema = z.object({ total: z.number().int(), rows: z.array(InvoiceListRowSchema) });
export type InvoiceListResponse = z.infer<typeof InvoiceListResponseSchema>;

export const InvoiceLineRowSchema = z.object({
  id: z.number().int(),
  product: z.string(),
  refinery: z.string().nullable(),
  qty: z.number().nullable(),
  unitPrice: z.number().nullable(),
  lineTotal: z.number().nullable(),
  serials: z.array(z.string()),
  collectedFlag: z.enum(['YES', 'NO', 'CHECK']).nullable(),
  collectedDate: z.string().nullable(),
  deliveredBrinks: z.boolean().nullable(),
  soldBack: z.boolean().nullable(),
});

export const InvoiceLinkRowSchema = z.object({
  linkType: z.string(),
  confidence: z.enum(['EXACT', 'PROBABLE']),
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED']),
  /** The sale the invoice line was matched to. */
  trade: z.string(),
});

export const InvoiceDetailSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  date: z.string().nullable(),
  status: z.string().nullable(),
  total: z.number().nullable(),
  customerId: z.number().int().nullable(),
  customerName: z.string().nullable(),
  lines: z.array(InvoiceLineRowSchema),
  payments: z.array(PaymentRowSchema),
  links: z.array(InvoiceLinkRowSchema),
});
export type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;
