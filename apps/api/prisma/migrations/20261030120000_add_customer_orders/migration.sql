-- CreateEnum
CREATE TYPE "CustomerOrderStatus" AS ENUM ('ORDERED', 'IN_TRANSIT', 'DELIVERED', 'BAGGED', 'COLLECTED');

-- CreateEnum
CREATE TYPE "EvidenceKind" AS ENUM ('TRADESHEET_COLLECTED', 'ZOHO_INVOICE', 'SIGNED_INVOICE', 'BC_RECORD', 'STAFF_NOTE');

-- CreateTable
CREATE TABLE "customer_order_items" (
    "id" SERIAL NOT NULL,
    "locationCode" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "reference" TEXT,
    "bcOrderNo" TEXT,
    "supplierRef" TEXT,
    "metal" "StockMetal",
    "product" TEXT NOT NULL,
    "bcItemNo" TEXT,
    "quantity" INTEGER NOT NULL,
    "refinery" TEXT,
    "serials" TEXT,
    "status" "CustomerOrderStatus" NOT NULL DEFAULT 'ORDERED',
    "orderedOn" DATE,
    "missing" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customer_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_order_evidence" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "kind" "EvidenceKind" NOT NULL,
    "reference" TEXT,
    "note" TEXT,
    "observedOn" DATE,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_order_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_order_items_status_idx" ON "customer_order_items"("status");

-- CreateIndex
CREATE INDEX "customer_order_items_locationCode_status_idx" ON "customer_order_items"("locationCode", "status");

-- CreateIndex
CREATE INDEX "customer_order_items_reference_idx" ON "customer_order_items"("reference");

-- CreateIndex
CREATE INDEX "customer_order_evidence_itemId_idx" ON "customer_order_evidence"("itemId");

-- AddForeignKey
ALTER TABLE "customer_order_evidence" ADD CONSTRAINT "customer_order_evidence_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "customer_order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

