-- CreateEnum
CREATE TYPE "TradeState" AS ENUM ('QUOTE', 'AWAITING_HEDGE', 'HEDGED', 'INVOICED', 'DEFERRED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CptyKind" AS ENUM ('EMPTY', 'QUOTE_ONLY', 'HEDGED', 'DEFERRED', 'LOT_REF', 'SUPPLIER_INVOICE', 'OTHER');

-- CreateEnum
CREATE TYPE "CollectedSource" AS ENUM ('VALUE', 'FILL');

-- AlterEnum
ALTER TYPE "BranchRegion" ADD VALUE 'ES';

-- CreateTable
CREATE TABLE "import_batches" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "sheetMonth" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'TRADESHEET',
    "importedBy" TEXT NOT NULL,
    "importedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" JSONB NOT NULL,

    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "occurrence" INTEGER NOT NULL DEFAULT 1,
    "metal" "StockMetal" NOT NULL,
    "branchCode" TEXT,
    "branchId" INTEGER,
    "initials" TEXT,
    "client" TEXT NOT NULL,
    "qty" INTEGER,
    "productText" TEXT NOT NULL,
    "productKey" TEXT,
    "productId" INTEGER,
    "date" DATE,
    "spot" DECIMAL(12,4),
    "cptyRaw" TEXT,
    "cptyKind" "CptyKind" NOT NULL,
    "state" "TradeState" NOT NULL,
    "stateFromColour" BOOLEAN NOT NULL DEFAULT false,
    "lotKey" TEXT,
    "lotId" INTEGER,
    "supplierName" TEXT,
    "supplierInvoice" TEXT,
    "collected" BOOLEAN NOT NULL DEFAULT false,
    "collectedSource" "CollectedSource",
    "collectedOn" DATE,
    "deferredFrom" TEXT[],
    "deferredTo" TEXT[],
    "cost" DECIMAL(14,4),
    "receipt" DECIMAL(14,4),
    "profit" DECIMAL(14,4),
    "margin" DECIMAL(10,6),
    "vatDue" DECIMAL(14,4),
    "totalPrice" DECIMAL(14,4),
    "netHedging" DECIMAL(14,4),
    "boughtAt" DECIMAL(14,4),
    "soldAt" DECIMAL(14,4),
    "paid" TEXT,
    "notes" TEXT,
    "hedgingNotes" TEXT,
    "sourceMonth" TEXT NOT NULL,
    "sourceTab" TEXT NOT NULL,
    "sourceRow" INTEGER NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "issues" TEXT[],
    "firstBatchId" INTEGER NOT NULL,
    "lastBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_lots" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "occurrence" INTEGER NOT NULL DEFAULT 1,
    "metal" "StockMetal" NOT NULL,
    "branchCode" TEXT,
    "branchId" INTEGER,
    "client" TEXT NOT NULL,
    "qty" INTEGER,
    "productText" TEXT NOT NULL,
    "productKey" TEXT,
    "productId" INTEGER,
    "received" DATE,
    "datePaid" DATE,
    "pricePaid" DECIMAL(14,4),
    "pricePerItem" DECIMAL(14,4),
    "hedgedAt" DECIMAL(14,4),
    "melt" BOOLEAN NOT NULL DEFAULT false,
    "commentsRaw" TEXT,
    "commentSoldQty" INTEGER,
    "commentAllSold" BOOLEAN NOT NULL DEFAULT false,
    "commentReview" BOOLEAN NOT NULL DEFAULT false,
    "allocatedQty" INTEGER NOT NULL DEFAULT 0,
    "sourceMonth" TEXT NOT NULL,
    "sourceTab" TEXT NOT NULL,
    "sourceRow" INTEGER NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "issues" TEXT[],
    "firstBatchId" INTEGER NOT NULL,
    "lastBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "purchase_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_units" (
    "id" SERIAL NOT NULL,
    "lotId" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL,
    "tradeId" INTEGER,

    CONSTRAINT "stock_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_aliases" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "productKey" TEXT NOT NULL,
    "productId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_batches_sheetMonth_idx" ON "import_batches"("sheetMonth");

-- CreateIndex
CREATE INDEX "trades_sourceMonth_idx" ON "trades"("sourceMonth");

-- CreateIndex
CREATE INDEX "trades_state_idx" ON "trades"("state");

-- CreateIndex
CREATE INDEX "trades_lotKey_idx" ON "trades"("lotKey");

-- CreateIndex
CREATE INDEX "trades_lotId_idx" ON "trades"("lotId");

-- CreateIndex
CREATE INDEX "trades_metal_date_idx" ON "trades"("metal", "date");

-- CreateIndex
CREATE UNIQUE INDEX "trades_referenceKey_occurrence_key" ON "trades"("referenceKey", "occurrence");

-- CreateIndex
CREATE INDEX "purchase_lots_sourceMonth_idx" ON "purchase_lots"("sourceMonth");

-- CreateIndex
CREATE INDEX "purchase_lots_metal_productKey_idx" ON "purchase_lots"("metal", "productKey");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_lots_referenceKey_occurrence_key" ON "purchase_lots"("referenceKey", "occurrence");

-- CreateIndex
CREATE INDEX "stock_units_tradeId_idx" ON "stock_units"("tradeId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_units_lotId_seq_key" ON "stock_units"("lotId", "seq");

-- CreateIndex
CREATE UNIQUE INDEX "product_aliases_alias_key" ON "product_aliases"("alias");

-- CreateIndex
CREATE INDEX "product_aliases_productKey_idx" ON "product_aliases"("productKey");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "purchase_lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_lastBatchId_fkey" FOREIGN KEY ("lastBatchId") REFERENCES "import_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_lots" ADD CONSTRAINT "purchase_lots_lastBatchId_fkey" FOREIGN KEY ("lastBatchId") REFERENCES "import_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_units" ADD CONSTRAINT "stock_units_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "purchase_lots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_units" ADD CONSTRAINT "stock_units_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_aliases" ADD CONSTRAINT "product_aliases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

