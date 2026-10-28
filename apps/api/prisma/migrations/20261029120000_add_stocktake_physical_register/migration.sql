-- CreateEnum
CREATE TYPE "StockMetal" AS ENUM ('GOLD', 'SILVER', 'PGM');

-- CreateEnum
CREATE TYPE "BarStatus" AS ENUM ('UNCONFIRMED', 'CONFIRMED', 'NEW', 'GONE');

-- CreateTable
CREATE TABLE "stocktake_bars" (
    "id" SERIAL NOT NULL,
    "stocktakeId" INTEGER NOT NULL,
    "metal" "StockMetal" NOT NULL,
    "locationCode" TEXT NOT NULL,
    "weightLabel" TEXT NOT NULL,
    "refinery" TEXT,
    "serial" TEXT,
    "grams" DECIMAL(10,4),
    "details" TEXT,
    "status" "BarStatus" NOT NULL DEFAULT 'UNCONFIRMED',
    "carriedFromId" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "stocktake_bars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktake_coins" (
    "id" SERIAL NOT NULL,
    "stocktakeId" INTEGER NOT NULL,
    "metal" "StockMetal" NOT NULL,
    "locationCode" TEXT NOT NULL DEFAULT '',
    "item" TEXT NOT NULL,
    "previousQty" INTEGER,
    "countedQty" INTEGER,
    "details" TEXT,

    CONSTRAINT "stocktake_coins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stocktake_bars_stocktakeId_idx" ON "stocktake_bars"("stocktakeId");

-- CreateIndex
CREATE INDEX "stocktake_bars_stocktakeId_serial_idx" ON "stocktake_bars"("stocktakeId", "serial");

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_coins_stocktakeId_metal_locationCode_item_key" ON "stocktake_coins"("stocktakeId", "metal", "locationCode", "item");

-- AddForeignKey
ALTER TABLE "stocktake_bars" ADD CONSTRAINT "stocktake_bars_stocktakeId_fkey" FOREIGN KEY ("stocktakeId") REFERENCES "stocktakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktake_coins" ADD CONSTRAINT "stocktake_coins_stocktakeId_fkey" FOREIGN KEY ("stocktakeId") REFERENCES "stocktakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

