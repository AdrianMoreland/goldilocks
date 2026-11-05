-- CreateEnum
CREATE TYPE "OrderSystem" AS ENUM ('ZOHO', 'BC');

-- CreateEnum
CREATE TYPE "CollectedFlag" AS ENUM ('YES', 'NO', 'CHECK');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('OPEN', 'INVOICED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LinkConfidence" AS ENUM ('EXACT', 'PROBABLE');

-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterEnum
ALTER TYPE "CustomerOrderStatus" ADD VALUE 'ALLOCATED';

-- AlterTable
ALTER TABLE "bc_items" ADD COLUMN     "refineryHint" TEXT,
ADD COLUMN     "salesProductId" INTEGER;

-- AlterTable
ALTER TABLE "stocktakes" ADD COLUMN     "importBatchId" INTEGER,
ADD COLUMN     "imported" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "stocktake_lines" ADD COLUMN     "sourceKey" TEXT;

-- AlterTable
ALTER TABLE "stocktake_bars" ADD COLUMN     "sourceKey" TEXT;

-- AlterTable
ALTER TABLE "stocktake_coins" ADD COLUMN     "countsJson" JSONB,
ADD COLUMN     "sourceKey" TEXT;

-- AlterTable
ALTER TABLE "customer_order_items" ADD COLUMN     "tradeId" INTEGER;

-- AlterTable
ALTER TABLE "import_batches" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'TRADESHEET',
ADD COLUMN     "schemaVersion" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'COMPLETE',
ADD COLUMN     "tableCounts" JSONB;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "cptyFill" TEXT,
ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "refinery" TEXT,
ADD COLUMN     "salesProductId" INTEGER,
ADD COLUMN     "sourceKey" TEXT,
ADD COLUMN     "supplierInvoiceId" INTEGER,
ADD COLUMN     "system" "OrderSystem";

-- AlterTable
ALTER TABLE "purchase_lots" ADD COLUMN     "refinery" TEXT,
ADD COLUMN     "salesProductId" INTEGER,
ADD COLUMN     "sellerId" INTEGER,
ADD COLUMN     "sourceKey" TEXT,
ADD COLUMN     "supplierInvoiceId" INTEGER,
ADD COLUMN     "system" "OrderSystem";

-- AlterTable
ALTER TABLE "product_aliases" ADD COLUMN     "refinery" TEXT,
ADD COLUMN     "salesProductId" INTEGER,
ADD COLUMN     "uses" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "redactionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zohoNumber" TEXT,
    "status" TEXT,
    "currency" TEXT,
    "sources" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "redactionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zohoNumber" TEXT,
    "status" TEXT,
    "currency" TEXT,
    "sources" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_invoices" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "firstDate" DATE,
    "lastDate" DATE,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "supplier_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "metal" "StockMetal" NOT NULL,
    "genericNorm" TEXT NOT NULL,
    "weightLabel" TEXT,
    "refinery" TEXT,
    "pricingProductId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sales_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refinery_aliases" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "refinery" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refinery_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "date" DATE,
    "metal" "StockMetal" NOT NULL,
    "branchCode" TEXT,
    "qty" DECIMAL(14,4),
    "productText" TEXT NOT NULL,
    "productNorm" TEXT,
    "customerId" INTEGER,
    "salesProductId" INTEGER,
    "status" "QuoteStatus" NOT NULL DEFAULT 'OPEN',
    "convertedTradeId" INTEGER,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zoho_invoices" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "date" DATE,
    "customerId" INTEGER,
    "status" TEXT,
    "salesOrderNumber" TEXT,
    "total" DECIMAL(14,4),
    "lineCount" INTEGER,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zoho_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zoho_invoice_lines" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "lineNo" INTEGER,
    "date" DATE,
    "customerId" INTEGER,
    "qty" DECIMAL(14,4),
    "itemName" TEXT NOT NULL,
    "productNorm" TEXT,
    "unitPrice" DECIMAL(14,4),
    "lineTotal" DECIMAL(14,4),
    "itemDesc" TEXT,
    "collectedFlag" "CollectedFlag",
    "collectedDate" DATE,
    "refinery" TEXT,
    "salesProductId" INTEGER,
    "deliveredBrinks" BOOLEAN,
    "soldBack" BOOLEAN,
    "refsFound" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zoho_invoice_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_serials" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "lineId" INTEGER NOT NULL,
    "serial" TEXT NOT NULL,
    "serialNorm" TEXT NOT NULL,
    "refinery" TEXT,
    "collectedFlag" "CollectedFlag",
    "collectedDate" DATE,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "line_serials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zoho_payments" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "invoiceId" INTEGER,
    "customerId" INTEGER,
    "zohoCustomerId" TEXT,
    "date" DATE,
    "invoiceDate" DATE,
    "amount" DECIMAL(14,4),
    "invoiceAmount" DECIMAL(14,4),
    "mode" TEXT,
    "reference" TEXT,
    "type" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zoho_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zoho_purchase_order_lines" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "lineNo" INTEGER,
    "date" DATE,
    "vendorNumber" TEXT,
    "vendorId" INTEGER,
    "itemName" TEXT NOT NULL,
    "productNorm" TEXT,
    "qtyOrdered" DECIMAL(14,4),
    "qtyReceived" DECIMAL(14,4),
    "qtyBilled" DECIMAL(14,4),
    "price" DECIMAL(14,4),
    "itemTotal" DECIMAL(14,4),
    "status" TEXT,
    "reference" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zoho_purchase_order_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_sales_orders" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "branchCode" TEXT,
    "snapshot" TEXT,
    "snapshotDate" DATE,
    "bcCustomerNo" TEXT,
    "customerId" INTEGER,
    "extDocNo" TEXT,
    "extDocCore" TEXT,
    "location" TEXT,
    "docDate" DATE,
    "amount" DECIMAL(14,4),
    "amountInclVat" DECIMAL(14,4),
    "prepaid" DECIMAL(14,4),
    "remaining" DECIMAL(14,4),
    "paid" BOOLEAN,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_sales_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bc_tracking_entries" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "snapshot" TEXT,
    "entryNo" TEXT,
    "itemNo" TEXT NOT NULL,
    "locationCode" TEXT,
    "serialNo" TEXT,
    "serialNorm" TEXT,
    "lotNo" TEXT,
    "remainingQuantity" DECIMAL(14,4),
    "postingDate" DATE,
    "documentNo" TEXT,
    "entryType" TEXT,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_tracking_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_links" (
    "id" SERIAL NOT NULL,
    "linkType" TEXT NOT NULL,
    "fromTable" TEXT NOT NULL,
    "fromKey" TEXT NOT NULL,
    "toTable" TEXT NOT NULL,
    "toKey" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "confidence" "LinkConfidence" NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "confirmedBy" TEXT,
    "confirmedAt" TIMESTAMPTZ(6),
    "importBatchId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "entity_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_redactionCode_key" ON "customers"("redactionCode");

-- CreateIndex
CREATE INDEX "customers_name_idx" ON "customers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_redactionCode_key" ON "vendors"("redactionCode");

-- CreateIndex
CREATE INDEX "vendors_name_idx" ON "vendors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_invoices_sourceKey_key" ON "supplier_invoices"("sourceKey");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_invoices_supplier_number_key" ON "supplier_invoices"("supplier", "number");

-- CreateIndex
CREATE UNIQUE INDEX "sales_products_name_key" ON "sales_products"("name");

-- CreateIndex
CREATE INDEX "sales_products_genericNorm_refinery_idx" ON "sales_products"("genericNorm", "refinery");

-- CreateIndex
CREATE INDEX "sales_products_pricingProductId_idx" ON "sales_products"("pricingProductId");

-- CreateIndex
CREATE UNIQUE INDEX "refinery_aliases_alias_key" ON "refinery_aliases"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_sourceKey_key" ON "quotes"("sourceKey");

-- CreateIndex
CREATE INDEX "quotes_referenceKey_idx" ON "quotes"("referenceKey");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_customerId_idx" ON "quotes"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "zoho_invoices_sourceKey_key" ON "zoho_invoices"("sourceKey");

-- CreateIndex
CREATE INDEX "zoho_invoices_customerId_date_idx" ON "zoho_invoices"("customerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "zoho_invoice_lines_sourceKey_key" ON "zoho_invoice_lines"("sourceKey");

-- CreateIndex
CREATE INDEX "zoho_invoice_lines_invoiceId_idx" ON "zoho_invoice_lines"("invoiceId");

-- CreateIndex
CREATE INDEX "zoho_invoice_lines_customerId_date_idx" ON "zoho_invoice_lines"("customerId", "date");

-- CreateIndex
CREATE INDEX "zoho_invoice_lines_salesProductId_idx" ON "zoho_invoice_lines"("salesProductId");

-- CreateIndex
CREATE UNIQUE INDEX "line_serials_sourceKey_key" ON "line_serials"("sourceKey");

-- CreateIndex
CREATE INDEX "line_serials_serialNorm_idx" ON "line_serials"("serialNorm");

-- CreateIndex
CREATE INDEX "line_serials_lineId_idx" ON "line_serials"("lineId");

-- CreateIndex
CREATE UNIQUE INDEX "zoho_payments_sourceKey_key" ON "zoho_payments"("sourceKey");

-- CreateIndex
CREATE INDEX "zoho_payments_invoiceId_idx" ON "zoho_payments"("invoiceId");

-- CreateIndex
CREATE INDEX "zoho_payments_customerId_date_idx" ON "zoho_payments"("customerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "zoho_purchase_order_lines_sourceKey_key" ON "zoho_purchase_order_lines"("sourceKey");

-- CreateIndex
CREATE INDEX "zoho_purchase_order_lines_poNumber_idx" ON "zoho_purchase_order_lines"("poNumber");

-- CreateIndex
CREATE INDEX "zoho_purchase_order_lines_vendorId_idx" ON "zoho_purchase_order_lines"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "bc_sales_orders_sourceKey_key" ON "bc_sales_orders"("sourceKey");

-- CreateIndex
CREATE INDEX "bc_sales_orders_extDocCore_idx" ON "bc_sales_orders"("extDocCore");

-- CreateIndex
CREATE INDEX "bc_sales_orders_customerId_idx" ON "bc_sales_orders"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "bc_tracking_entries_sourceKey_key" ON "bc_tracking_entries"("sourceKey");

-- CreateIndex
CREATE INDEX "bc_tracking_entries_serialNorm_idx" ON "bc_tracking_entries"("serialNorm");

-- CreateIndex
CREATE INDEX "bc_tracking_entries_itemNo_locationCode_idx" ON "bc_tracking_entries"("itemNo", "locationCode");

-- CreateIndex
CREATE INDEX "entity_links_status_linkType_idx" ON "entity_links"("status", "linkType");

-- CreateIndex
CREATE INDEX "entity_links_fromTable_fromKey_idx" ON "entity_links"("fromTable", "fromKey");

-- CreateIndex
CREATE INDEX "entity_links_toTable_toKey_idx" ON "entity_links"("toTable", "toKey");

-- CreateIndex
CREATE UNIQUE INDEX "entity_links_linkType_fromTable_fromKey_toTable_toKey_key" ON "entity_links"("linkType", "fromTable", "fromKey", "toTable", "toKey");

-- CreateIndex
CREATE INDEX "bc_items_salesProductId_idx" ON "bc_items"("salesProductId");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_lines_sourceKey_key" ON "stocktake_lines"("sourceKey");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_bars_sourceKey_key" ON "stocktake_bars"("sourceKey");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_coins_sourceKey_key" ON "stocktake_coins"("sourceKey");

-- CreateIndex
CREATE INDEX "customer_order_items_tradeId_idx" ON "customer_order_items"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "trades_sourceKey_key" ON "trades"("sourceKey");

-- CreateIndex
CREATE INDEX "trades_customerId_idx" ON "trades"("customerId");

-- CreateIndex
CREATE INDEX "trades_supplierInvoiceId_idx" ON "trades"("supplierInvoiceId");

-- CreateIndex
CREATE INDEX "trades_salesProductId_idx" ON "trades"("salesProductId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_lots_sourceKey_key" ON "purchase_lots"("sourceKey");

-- CreateIndex
CREATE INDEX "purchase_lots_sellerId_idx" ON "purchase_lots"("sellerId");

-- CreateIndex
CREATE INDEX "purchase_lots_supplierInvoiceId_idx" ON "purchase_lots"("supplierInvoiceId");

-- CreateIndex
CREATE INDEX "product_aliases_salesProductId_idx" ON "product_aliases"("salesProductId");

-- AddForeignKey
ALTER TABLE "bc_items" ADD CONSTRAINT "bc_items_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_order_items" ADD CONSTRAINT "customer_order_items_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_supplierInvoiceId_fkey" FOREIGN KEY ("supplierInvoiceId") REFERENCES "supplier_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_supplierInvoiceId_fkey" FOREIGN KEY ("supplierInvoiceId") REFERENCES "supplier_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_aliases" ADD CONSTRAINT "product_aliases_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_products" ADD CONSTRAINT "sales_products_pricingProductId_fkey" FOREIGN KEY ("pricingProductId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_convertedTradeId_fkey" FOREIGN KEY ("convertedTradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_invoices" ADD CONSTRAINT "zoho_invoices_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_invoice_lines" ADD CONSTRAINT "zoho_invoice_lines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "zoho_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_invoice_lines" ADD CONSTRAINT "zoho_invoice_lines_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_invoice_lines" ADD CONSTRAINT "zoho_invoice_lines_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_serials" ADD CONSTRAINT "line_serials_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "zoho_invoice_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_payments" ADD CONSTRAINT "zoho_payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "zoho_invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_payments" ADD CONSTRAINT "zoho_payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_purchase_order_lines" ADD CONSTRAINT "zoho_purchase_order_lines_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bc_sales_orders" ADD CONSTRAINT "bc_sales_orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Row level security: the API connects as `postgres` (which bypasses it) and enforces admin/manager access;
-- Supabase's own REST roles get nothing.
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "supplier_invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales_products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "refinery_aliases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zoho_invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zoho_invoice_lines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "line_serials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zoho_payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zoho_purchase_order_lines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bc_sales_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bc_tracking_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "entity_links" ENABLE ROW LEVEL SECURITY;
