-- Business Central history (posted shipments + lines, purchase receipts, item ledger entries) and the serial trace
-- (items, item_events), roadmap 1.21. Additive only: new tables, two nullable columns on customers.
-- Row level security on like the other import tables: the API connects as `postgres` and enforces admin access;
-- Supabase's own REST roles get nothing.

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('IN_STOCK', 'COLLECTED', 'GONE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ItemEventKind" AS ENUM ('RECEIVED', 'OPENING_BALANCE', 'ADJUSTED_IN', 'ADJUSTED_OUT', 'TRANSFERRED', 'COLLECTED', 'RETURNED_BY_CUSTOMER', 'RETURNED_TO_VENDOR');

-- CreateEnum
CREATE TYPE "ItemEventSource" AS ENUM ('BC', 'ZOHO', 'TRADESHEET', 'STOCKTAKE', 'STAFF');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "bcCustomerNo" TEXT,
ADD COLUMN     "bcVendorNo" TEXT;

-- CreateTable
CREATE TABLE "bc_shipments" (
    "id" SERIAL NOT NULL,
    "no" TEXT NOT NULL,
    "customerNo" TEXT,
    "customerId" INTEGER,
    "documentDate" DATE,
    "postingDate" DATE,
    "externalDocNo" TEXT,
    "locationCode" TEXT,
    "tradeId" INTEGER,
    "zohoInvoiceId" INTEGER,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_shipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_shipment_lines" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "documentNo" TEXT NOT NULL,
    "lineNo" INTEGER NOT NULL,
    "customerNo" TEXT,
    "itemNo" TEXT,
    "description" TEXT,
    "locationCode" TEXT,
    "quantity" DECIMAL(14,4),
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_shipment_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_receipts" (
    "id" SERIAL NOT NULL,
    "no" TEXT NOT NULL,
    "vendorNo" TEXT,
    "sellerId" INTEGER,
    "documentDate" DATE,
    "locationCode" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_ledger_entries" (
    "id" SERIAL NOT NULL,
    "entryNo" INTEGER NOT NULL,
    "postingDate" DATE,
    "entryType" TEXT NOT NULL,
    "documentType" TEXT,
    "documentNo" TEXT NOT NULL,
    "itemNo" TEXT NOT NULL,
    "locationCode" TEXT,
    "quantity" DECIMAL(14,4) NOT NULL,
    "remainingQuantity" DECIMAL(14,4),
    "salesAmount" DECIMAL(14,4),
    "costAmount" DECIMAL(14,4),
    "open" BOOLEAN,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "serial" TEXT NOT NULL,
    "serialKey" TEXT NOT NULL,
    "bcItemNo" TEXT,
    "productId" INTEGER,
    "status" "ItemStatus" NOT NULL DEFAULT 'UNKNOWN',
    "locationCode" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_events" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "kind" "ItemEventKind" NOT NULL,
    "date" DATE,
    "source" "ItemEventSource" NOT NULL,
    "sourceRef" TEXT,
    "sourceKey" TEXT NOT NULL,
    "locationCode" TEXT,
    "partyNo" TEXT,
    "customerId" INTEGER,
    "tradeId" INTEGER,
    "quantity" DECIMAL(14,4) NOT NULL,
    "amount" DECIMAL(14,4),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bc_shipments_no_key" ON "bc_shipments"("no");

-- CreateIndex
CREATE INDEX "bc_shipments_customerId_idx" ON "bc_shipments"("customerId");

-- CreateIndex
CREATE INDEX "bc_shipments_tradeId_idx" ON "bc_shipments"("tradeId");

-- CreateIndex
CREATE INDEX "bc_shipments_customerNo_idx" ON "bc_shipments"("customerNo");

-- CreateIndex
CREATE UNIQUE INDEX "bc_shipment_lines_sourceKey_key" ON "bc_shipment_lines"("sourceKey");

-- CreateIndex
CREATE INDEX "bc_shipment_lines_documentNo_idx" ON "bc_shipment_lines"("documentNo");

-- CreateIndex
CREATE INDEX "bc_shipment_lines_itemNo_idx" ON "bc_shipment_lines"("itemNo");

-- CreateIndex
CREATE UNIQUE INDEX "bc_receipts_no_key" ON "bc_receipts"("no");

-- CreateIndex
CREATE INDEX "bc_receipts_vendorNo_idx" ON "bc_receipts"("vendorNo");

-- CreateIndex
CREATE INDEX "bc_receipts_sellerId_idx" ON "bc_receipts"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "bc_ledger_entries_entryNo_key" ON "bc_ledger_entries"("entryNo");

-- CreateIndex
CREATE INDEX "bc_ledger_entries_documentNo_idx" ON "bc_ledger_entries"("documentNo");

-- CreateIndex
CREATE INDEX "bc_ledger_entries_itemNo_locationCode_idx" ON "bc_ledger_entries"("itemNo", "locationCode");

-- CreateIndex
CREATE UNIQUE INDEX "items_serialKey_key" ON "items"("serialKey");

-- CreateIndex
CREATE INDEX "items_bcItemNo_idx" ON "items"("bcItemNo");

-- CreateIndex
CREATE INDEX "items_status_idx" ON "items"("status");

-- CreateIndex
CREATE UNIQUE INDEX "item_events_sourceKey_key" ON "item_events"("sourceKey");

-- CreateIndex
CREATE INDEX "item_events_itemId_date_idx" ON "item_events"("itemId", "date");

-- CreateIndex
CREATE INDEX "item_events_customerId_idx" ON "item_events"("customerId");

-- CreateIndex
CREATE INDEX "item_events_tradeId_idx" ON "item_events"("tradeId");

-- CreateIndex
CREATE INDEX "customers_bcCustomerNo_idx" ON "customers"("bcCustomerNo");

-- CreateIndex
CREATE INDEX "customers_bcVendorNo_idx" ON "customers"("bcVendorNo");

-- AddForeignKey
ALTER TABLE "bc_shipments" ADD CONSTRAINT "bc_shipments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bc_shipments" ADD CONSTRAINT "bc_shipments_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bc_shipments" ADD CONSTRAINT "bc_shipments_zohoInvoiceId_fkey" FOREIGN KEY ("zohoInvoiceId") REFERENCES "zoho_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bc_receipts" ADD CONSTRAINT "bc_receipts_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_events" ADD CONSTRAINT "item_events_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_events" ADD CONSTRAINT "item_events_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_events" ADD CONSTRAINT "item_events_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Row level security
ALTER TABLE "bc_shipments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bc_shipment_lines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bc_receipts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bc_ledger_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "item_events" ENABLE ROW LEVEL SECURITY;
