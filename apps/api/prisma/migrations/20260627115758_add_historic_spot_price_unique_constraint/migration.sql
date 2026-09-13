/*
  Warnings:

  - A unique constraint covering the columns `[metalType,recordedAt]` on the table `historic_spot_prices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "historic_spot_prices_metalType_recordedAt_key" ON "historic_spot_prices"("metalType", "recordedAt");
