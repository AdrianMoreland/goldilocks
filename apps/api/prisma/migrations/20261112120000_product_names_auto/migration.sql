-- Product names that settle themselves. Additive only: new enums, new columns on product_aliases, two new tables.

-- CreateEnum
CREATE TYPE "AliasDecider" AS ENUM ('RULE', 'PERSON');

-- CreateEnum
CREATE TYPE "MatchConfidence" AS ENUM ('CERTAIN', 'LIKELY', 'UNCLEAR');

-- CreateEnum
CREATE TYPE "ProductRuleKind" AS ENUM ('WORD', 'DESIGN', 'DEFAULT', 'NOT_A_PRODUCT', 'SHEET_METAL');

-- AlterTable
ALTER TABLE "product_aliases" ADD COLUMN     "sources" TEXT,
ADD COLUMN     "metalHint" "MetalType",
ADD COLUMN     "decidedBy" "AliasDecider",
ADD COLUMN     "suggestedProductId" INTEGER,
ADD COLUMN     "suggestedSalesProductId" INTEGER,
ADD COLUMN     "suggestedNoProduct" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confidence" "MatchConfidence",
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "question" TEXT,
ADD COLUMN     "catalogueGap" BOOLEAN NOT NULL DEFAULT false;

-- Names a person already settled stay theirs.
UPDATE "product_aliases" SET "decidedBy" = 'PERSON'
WHERE "productId" IS NOT NULL OR "salesProductId" IS NOT NULL OR "noProduct" = true;

-- CreateTable
CREATE TABLE "product_rules" (
    "id" SERIAL NOT NULL,
    "kind" "ProductRuleKind" NOT NULL,
    "pattern" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "note" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "product_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zoho_products" (
    "id" SERIAL NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "sku" TEXT,
    "itemName" TEXT NOT NULL,
    "productNorm" TEXT,
    "metal" TEXT,
    "qtySold" DECIMAL(14,4),
    "amount" DECIMAL(14,4),
    "avgPrice" DECIMAL(14,4),
    "productId" INTEGER,
    "salesProductId" INTEGER,
    "missingFromImport" BOOLEAN NOT NULL DEFAULT false,
    "importBatchId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "zoho_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_aliases_decidedBy_idx" ON "product_aliases"("decidedBy");

-- CreateIndex
CREATE UNIQUE INDEX "product_rules_kind_pattern_key" ON "product_rules"("kind", "pattern");

-- CreateIndex
CREATE UNIQUE INDEX "zoho_products_sourceKey_key" ON "zoho_products"("sourceKey");

-- CreateIndex
CREATE INDEX "zoho_products_sku_idx" ON "zoho_products"("sku");

-- CreateIndex
CREATE INDEX "zoho_products_productId_idx" ON "zoho_products"("productId");

-- CreateIndex
CREATE INDEX "zoho_products_salesProductId_idx" ON "zoho_products"("salesProductId");

-- AddForeignKey
ALTER TABLE "product_aliases" ADD CONSTRAINT "product_aliases_suggestedProductId_fkey" FOREIGN KEY ("suggestedProductId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_aliases" ADD CONSTRAINT "product_aliases_suggestedSalesProductId_fkey" FOREIGN KEY ("suggestedSalesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_products" ADD CONSTRAINT "zoho_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zoho_products" ADD CONSTRAINT "zoho_products_salesProductId_fkey" FOREIGN KEY ("salesProductId") REFERENCES "sales_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Row level security: the API connects as `postgres` (which bypasses it) and enforces admin access;
-- Supabase's own REST roles get nothing.
ALTER TABLE "product_rules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zoho_products" ENABLE ROW LEVEL SECURITY;
