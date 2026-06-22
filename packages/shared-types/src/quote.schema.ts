// typescript
import { z } from 'zod';
import {
  InvoiceSchema,
  InvoiceItemSchema,
  InvoiceItemCreateSchema,
  CreateInvoiceDtoSchema as CreateInvoiceDtoFromInvoice,
} from './invoice.schema';

/* iso date helper (kept local) */
const isoDateString = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return undefined;
}, z.iso.datetime());

/* quote-specific enums */
export const QuoteStatusEnum = z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED']);
export type QuoteStatus = z.infer<typeof QuoteStatusEnum>;

/* Quote item reusing invoice item shapes and adding an item type */
export const QuoteItemCreateSchema = InvoiceItemCreateSchema.extend({
  type: z.enum(['SERVICE', 'PRODUCT']).optional(),
  order: z.number().optional(),
});
export const QuoteItemSchema = InvoiceItemSchema.extend({
  type: z.enum(['SERVICE', 'PRODUCT']).optional(),
});

export type QuoteItemCreate = z.infer<typeof QuoteItemCreateSchema>;
export type QuoteItem = z.infer<typeof QuoteItemSchema>;

/* Quote schema: extends InvoiceSchema and adds quote-specific fields */
export const QuoteSchema = InvoiceSchema.extend({
  number: z.number().optional(),
  rawNumber: z.string().optional(),
  title: z.string().optional(),
  status: QuoteStatusEnum.default('DRAFT'),
  validUntil: isoDateString.optional(),
  viewedAt: isoDateString.optional(),
  signedAt: isoDateString.optional(),
  discountRate: z.number().default(0),
  // keeps `products` from InvoiceSchema (line items). If you prefer `items` alias, add below:
  // items: z.array(QuoteItemSchema).optional(),
});

export const CreateQuoteDtoSchema = CreateInvoiceDtoFromInvoice.extend({
  title: z.string().optional(),
  validUntil: isoDateString.optional(),
  discountRate: z.number().optional(),
});

export const UpdateQuoteDtoSchema = CreateQuoteDtoSchema.partial();

export const QuotesSchema = z.array(QuoteSchema);

export type Quote = z.infer<typeof QuoteSchema>;
export type Quotes = z.infer<typeof QuotesSchema>;
export type CreateQuoteDto = z.infer<typeof CreateQuoteDtoSchema>;
export type UpdateQuoteDto = z.infer<typeof UpdateQuoteDtoSchema>;
