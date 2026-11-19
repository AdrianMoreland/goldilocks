
-- CreateEnum
CREATE TYPE "LiveStockKind" AS ENUM ('COIN', 'BAR');

-- CreateEnum
CREATE TYPE "LiveBarStatus" AS ENUM ('IN_STOCK', 'SOLD', 'REMOVED');

-- CreateEnum
CREATE TYPE "LiveMovementSource" AS ENUM ('MANUAL', 'IMPORT', 'SHEET_SALE', 'SHEET_PURCHASE', 'TRANSFER', 'UNDO');

-- CreateEnum
CREATE TYPE "SheetApplicationKind" AS ENUM ('SALE', 'PURCHASE');

-- CreateEnum
CREATE TYPE "SheetApplicationStatus" AS ENUM ('APPLIED', 'NEEDS_DECISION', 'DISMISSED');

-- CreateTable
CREATE TABLE "live_stock_branches" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchId" INTEGER,
    "cutoverDate" DATE,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "live_stock_branches_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "live_stock_lines" (
    "id" SERIAL NOT NULL,
    "branchCode" TEXT NOT NULL,
    "metal" "StockMetal" NOT NULL,
    "kind" "LiveStockKind" NOT NULL,
    "family" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "refinery" TEXT NOT NULL DEFAULT '',
    "qty" INTEGER NOT NULL DEFAULT 0,
    "lowThreshold" INTEGER,
    "unassigned" INTEGER NOT NULL DEFAULT 0,
    "details" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "live_stock_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_stock_bars" (
    "id" SERIAL NOT NULL,
    "lineId" INTEGER NOT NULL,
    "serial" TEXT NOT NULL,
    "serialKey" TEXT NOT NULL,
    "grams" DECIMAL(10,4),
    "details" TEXT,
    "status" "LiveBarStatus" NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "live_stock_bars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "live_stock_movements" (
    "id" SERIAL NOT NULL,
    "lineId" INTEGER NOT NULL,
    "delta" INTEGER NOT NULL,
    "qtyAfter" INTEGER NOT NULL,
    "source" "LiveMovementSource" NOT NULL,
    "reference" TEXT,
    "reason" TEXT,
    "note" TEXT,
    "actor" TEXT NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reversesId" INTEGER,

    CONSTRAINT "live_stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheet_applications" (
    "id" SERIAL NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "occurrence" INTEGER NOT NULL DEFAULT 1,
    "kind" "SheetApplicationKind" NOT NULL,
    "branchCode" TEXT NOT NULL,
    "lineId" INTEGER,
    "rowDate" DATE,
    "rowQty" INTEGER NOT NULL,
    "appliedQty" INTEGER NOT NULL DEFAULT 0,
    "status" "SheetApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "note" TEXT,
    "decidedBy" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sheet_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "live_stock_lines_branchCode_metal_idx" ON "live_stock_lines"("branchCode", "metal");

-- CreateIndex
CREATE UNIQUE INDEX "live_stock_lines_branchCode_metal_kind_family_variant_refin_key" ON "live_stock_lines"("branchCode", "metal", "kind", "family", "variant", "refinery");

-- CreateIndex
CREATE INDEX "live_stock_bars_lineId_idx" ON "live_stock_bars"("lineId");

-- CreateIndex
CREATE INDEX "live_stock_bars_serialKey_idx" ON "live_stock_bars"("serialKey");

-- CreateIndex
CREATE UNIQUE INDEX "live_stock_movements_reversesId_key" ON "live_stock_movements"("reversesId");

-- CreateIndex
CREATE INDEX "live_stock_movements_lineId_at_idx" ON "live_stock_movements"("lineId", "at");

-- CreateIndex
CREATE INDEX "live_stock_movements_reference_idx" ON "live_stock_movements"("reference");

-- CreateIndex
CREATE INDEX "sheet_applications_status_idx" ON "sheet_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_applications_referenceKey_occurrence_lineId_key" ON "sheet_applications"("referenceKey", "occurrence", "lineId");

-- AddForeignKey
ALTER TABLE "live_stock_lines" ADD CONSTRAINT "live_stock_lines_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "live_stock_branches"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_stock_bars" ADD CONSTRAINT "live_stock_bars_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "live_stock_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "live_stock_movements" ADD CONSTRAINT "live_stock_movements_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "live_stock_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Stock locations by sheet code. branchId stays null until an admin links each to an app branch.
INSERT INTO "live_stock_branches" ("code", "name") VALUES
  ('DU', 'Dublin'), ('CO', 'Cork'), ('BL', 'Belfast'), ('BC', 'Barcelona');
