import { z } from 'zod';
import {ProductSchema} from "./product.schema";


export const CurrencyEnum = z.enum(['EUR', 'GBP', 'USD']);
export type Currency = z.infer<typeof CurrencyEnum>;

export const InvoiceStatusEnum = z.enum(['UNPAID', 'PAID', 'PARTIALLY_PAID', 'CANCELLED', 'DRAFT']);
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

// ============================================================================
// PRODUCT WRAPPERS
// ============================================================================
const isoDateString = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'string') return val;
  return undefined;
}, z.iso.datetime());

/* invoice line / product-in-invoice */
export const InvoiceItemCreateSchema = z.object({
  productId: z.string(), // reference to product
  description: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number(),
  vatRate: z.number(), // percentage, e.g. 20
});

export const InvoiceItemSchema = z.object({
  id: z.string().optional(), // optional when created server-side
  productId: z.string().optional(),
  // optional snapshot of product data (keeps payload explicit and typed)
  product: z.lazy(() => ProductSchema).optional(),
  description: z.string().optional(),
  quantity: z.number().positive(),
  unitPrice: z.number(),
  vatRate: z.number(),
  totalHT: z.number(),   // computed: quantity * unitPrice
  totalVAT: z.number(),  // computed: totalHT * vatRate/100
  totalTTC: z.number(),  // computed: totalHT + totalVAT
  order: z.number().optional(),
});


/* invoice */
export const InvoiceSchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  clientId: z.string(),
  companyId: z.string().optional(),
  quoteId: z.string().optional(),
  currency: CurrencyEnum,
  status: InvoiceStatusEnum.default('UNPAID'),
  products: z.array(InvoiceItemSchema), // array of items
  totalHT: z.number(),
  totalVAT: z.number(),
  totalTTC: z.number(),
  dueDate: isoDateString.optional(),
  paidAt: isoDateString.optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  updatedAt: isoDateString,
  createdAt: isoDateString,
});

/* DTOs for create/update */
export const CreateInvoiceDtoSchema = z.object({
  clientId: z.string(),
  companyId: z.string().optional(),
  quoteId: z.string().optional(),
  currency: CurrencyEnum,
  products: z.array(InvoiceItemCreateSchema),
  dueDate: isoDateString.optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateInvoiceDtoSchema = CreateInvoiceDtoSchema.partial();

export const UpdateInvoiceFullDtoSchema = InvoiceSchema
    .omit({ id: true, createdAt: true, updatedAt: true })
    .partial();

/* collections & types */
export const InvoicesSchema = z.array(InvoiceSchema);
export type Invoice = z.infer<typeof InvoiceSchema>;
export type Invoices = z.infer<typeof InvoicesSchema>;
export type CreateInvoiceDto = z.infer<typeof CreateInvoiceDtoSchema>;
export type UpdateInvoiceDto = z.infer<typeof UpdateInvoiceDtoSchema>;
export type UpdateInvoiceFullDto = z.infer<typeof UpdateInvoiceFullDtoSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type InvoiceItemCreate = z.infer<typeof InvoiceItemCreateSchema>;

/*

// Company model
model Company {
  id          String   @id @default(cuid())
  name        String
  description String?
      currency    Currency @default(EUR)
  legalId     String?
      foundedAt   DateTime
  VAT         String?
      exemptVat   Boolean  @default(false)
  address      String
  addressLine2 String? // Second line for address (apartment, suite, etc.)
      postalCode   String
  city         String
  state        String? // State/Province (for US addresses, etc.)
      country      String
  phone        String
  email        String

  quoteStartingNumber   Int    @default(1) // Starting number for quotes
  quoteNumberFormat     String @default("Q-{year}-{number:4}") // Ex: "Q-2025-0001"
  invoiceStartingNumber Int    @default(1) // Starting number for invoices
  invoiceNumberFormat   String @default("INV-{year}-{number:4}") // Ex: "INV-2025-0001"
  receiptStartingNumber Int    @default(1) // Starting number for receipts
  receiptNumberFormat   String @default("REC-{year}-{number:4}") // Ex: "REC-2025-0001"

  invoicePDFFormat String @default("facturx") // Ex: 'pdf' | 'facturx' | 'zugferd' | 'xrechnung' | 'ubl' | 'cii'

  dateFormat String @default("dd/MM/yyyy") // Date format for quotes and invoices

  pDFConfigId      String             @unique
  pdfConfig        PDFConfig          @relation(fields: [pDFConfigId], references: [id])
  Quote            Quote[]
  Invoice          Invoice[]
  PaymentMethod    PaymentMethod[]
  emailTemplates   MailTemplate[]
  RecurringInvoice RecurringInvoice[]
  webhooks         Webhook[]
}

// Client model
model Client {
  id               String             @id @default(cuid())
  name             String
  description      String?
      legalId          String? // Legal identification number (SIRET, EIN, etc.)
          VAT              String? // VAT number
              foundedAt        DateTime? // Date when the client company was founded
                  contactFirstname String?
                      contactLastname  String?
                          contactEmail     String?            @unique
                              contactPhone     String?
      address          String
  addressLine2     String? // Second line for address (apartment, suite, etc.)
      postalCode       String
  city             String
  state            String? // State/Province (for US addresses, etc.)
      country          String
  currency         Currency?
      type             ClientType         @default(COMPANY)
  salutation       String             @default("Mr") // Mr, Ms, Mrs (We need a default value for the invoice generation)
  sex              String             @default("other") // male, female, other (We need a default value for the invoice generation)
  title            String             @default("Doctor") // Doctor, Professor (We need a default value for the invoice generation)
  isActive         Boolean            @default(true)
  Quote            Quote[]
  Invoice          Invoice[]
  RecurringInvoice RecurringInvoice[]
}

// Email templates
model MailTemplate {
  id        String           @id @default(cuid())
  type      MailTemplateType
  subject   String
  body      String
  company   Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)
  companyId String

@@unique([companyId, type])
}

// Quote model
model Quote {
  id              String      @id @default(uuid())
  number          Int         @default(autoincrement())
  rawNumber       String? // Raw number for custom formats
      title           String?
          client          Client      @relation(fields: [clientId], references: [id])
  clientId        String
  company         Company     @relation(fields: [companyId], references: [id])
  companyId       String
  items           QuoteItem[]
  status          QuoteStatus @default(DRAFT)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  validUntil      DateTime?
      signedAt        DateTime?
          viewedAt        DateTime?
              signedBy        String?
                  discountRate    Float      @default(0)
  totalHT         Float
  totalVAT        Float
  totalTTC        Float
  currency        Currency
  paymentMethod   String? // Ex: "Bank Transfer", "PayPal", "Cash"
      paymentDetails  String? // Details for the payment method (e.g., bank account number)
          paymentMethodId String?
              notes           String?     @default("")
  isActive        Boolean     @default(true)
  Invoice         Invoice[]
  signatures      Signature[]
}

model QuoteItem {
  id          String   @id @default(uuid())
  quote       Quote    @relation(fields: [quoteId], references: [id])
  quoteId     String
  description String
  quantity    Float
  unitPrice   Float
  vatRate     Float // 20 for 20%
  type        ItemType @default(SERVICE)
  order       Int // For sorting items in the quote pdf
}

// Invoice model
model Invoice {
  id                 String            @id @default(uuid())
  number             Int               @default(autoincrement())
  rawNumber          String? // Raw number for custom formats
      quote              Quote?            @relation(fields: [quoteId], references: [id])
  quoteId            String?
      recurringInvoice   RecurringInvoice? @relation(fields: [recurringInvoiceId], references: [id])
  recurringInvoiceId String?
      client             Client            @relation(fields: [clientId], references: [id]) // Client receiving the invoice
  clientId           String
  company            Company           @relation(fields: [companyId], references: [id]) // Company issuing the invoice
  companyId          String
  items              InvoiceItem[]
  status             InvoiceStatus     @default(UNPAID)
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
  dueDate            DateTime
  paidAt             DateTime?
      paymentMethod      String? // Ex: "Bank Transfer", "PayPal", "Cash"
          paymentDetails     String? // Details for the payment method (e.g., bank account number)
              paymentMethodId    String?
                  notes              String?           @default("")
  discountRate       Float             @default(0)
  totalHT            Float
  totalVAT           Float
  totalTTC           Float
  currency           Currency
  isActive           Boolean           @default(true)
  receipts           Receipt[]
}

model InvoiceItem {
  id           String        @id @default(uuid())
  invoice      Invoice       @relation(fields: [invoiceId], references: [id])
  invoiceId    String
  description  String
  quantity     Float
  unitPrice    Float
  vatRate      Float // 20 for 20%
  type         ItemType      @default(SERVICE)
  order        Int
  receiptItems ReceiptItem[]
}*/
