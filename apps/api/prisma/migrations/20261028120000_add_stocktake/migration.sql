-- CreateEnum
CREATE TYPE "StocktakeStatus" AS ENUM ('DRAFT', 'COUNTING', 'RECONCILING', 'FINALISED');

-- CreateEnum
CREATE TYPE "SerialsChecked" AS ENUM ('YES', 'NO', 'NA');

-- CreateEnum
CREATE TYPE "DiscrepancyIssueType" AS ENUM ('QUANTITY', 'LOCATION', 'SERIAL', 'PAID_NOT_COLLECTED', 'OTHER');

-- CreateTable
CREATE TABLE "bc_items" (
    "itemNo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bc_items_pkey" PRIMARY KEY ("itemNo")
);

-- CreateTable
CREATE TABLE "stocktakes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countDate" DATE NOT NULL,
    "cutoffDate" DATE NOT NULL,
    "status" "StocktakeStatus" NOT NULL DEFAULT 'DRAFT',
    "stocktakeLead" TEXT,
    "secondChecker" TEXT,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "finalisedBy" TEXT,
    "finalisedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stocktakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_lines" (
    "id" SERIAL NOT NULL,
    "stocktakeId" INTEGER NOT NULL,
    "itemNo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationCode" TEXT NOT NULL,
    "qtyCalculated" INTEGER NOT NULL,
    "countedNormal" INTEGER,
    "countedCustomer" INTEGER,
    "counted" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "serialsChecked" "SerialsChecked",
    "serialNote" TEXT,
    "batchName" TEXT,
    "documentNo" TEXT,
    "entryType" TEXT,
    "unitAmount" DECIMAL(14,5),
    "unitCost" DECIMAL(14,5),

    CONSTRAINT "stocktake_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_discrepancies" (
    "id" SERIAL NOT NULL,
    "stocktakeId" INTEGER NOT NULL,
    "itemNo" TEXT,
    "description" TEXT NOT NULL,
    "issueType" "DiscrepancyIssueType" NOT NULL,
    "bcShows" TEXT NOT NULL DEFAULT '',
    "physicalFound" TEXT NOT NULL DEFAULT '',
    "serialNo" TEXT,
    "action" TEXT NOT NULL DEFAULT '',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stocktake_discrepancies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bc_items_productId_idx" ON "bc_items"("productId");

-- CreateIndex
CREATE INDEX "stocktakes_status_idx" ON "stocktakes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_lines_stocktakeId_itemNo_locationCode_key" ON "stocktake_lines"("stocktakeId", "itemNo", "locationCode");

-- CreateIndex
CREATE INDEX "stocktake_discrepancies_stocktakeId_idx" ON "stocktake_discrepancies"("stocktakeId");

-- AddForeignKey
ALTER TABLE "bc_items" ADD CONSTRAINT "bc_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_lines" ADD CONSTRAINT "stocktake_lines_stocktakeId_fkey" FOREIGN KEY ("stocktakeId") REFERENCES "stocktakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_discrepancies" ADD CONSTRAINT "stocktake_discrepancies_stocktakeId_fkey" FOREIGN KEY ("stocktakeId") REFERENCES "stocktakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
┌─────────────────────────────────────────────────────────┐
│  Update available 7.8.0 -> 8.0.0-rc.28                  │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘

