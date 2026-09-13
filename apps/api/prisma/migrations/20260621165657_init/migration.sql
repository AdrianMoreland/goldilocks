-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'SALES', 'ACCOUNTING', 'AUDITOR');

-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'GBP');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "weight" DECIMAL(10,4) NOT NULL,
    "spreadBuy" DECIMAL(5,4) NOT NULL,
    "spreadSell" DECIMAL(5,4) NOT NULL,
    "vatRate" DECIMAL(4,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metal_spot_prices" (
    "id" BIGSERIAL NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "priceEur" DECIMAL(18,6) NOT NULL,
    "priceGbp" DECIMAL(18,6) NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metal_spot_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historic_spot_prices" (
    "id" BIGSERIAL NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "priceEur" DECIMAL(18,6) NOT NULL,
    "priceGbp" DECIMAL(18,6) NOT NULL,
    "recordedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historic_spot_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_metalType_idx" ON "products"("metalType");

-- CreateIndex
CREATE INDEX "products_metalType_stock_idx" ON "products"("metalType", "stock");

-- CreateIndex
CREATE INDEX "products_sku_idx" ON "products"("sku");

-- CreateIndex
CREATE INDEX "metal_spot_prices_metalType_idx" ON "metal_spot_prices"("metalType");

-- CreateIndex
CREATE INDEX "metal_spot_prices_timestamp_idx" ON "metal_spot_prices"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "metal_spot_prices_metalType_timestamp_key" ON "metal_spot_prices"("metalType", "timestamp");

-- CreateIndex
CREATE INDEX "historic_spot_prices_metalType_idx" ON "historic_spot_prices"("metalType");

-- CreateIndex
CREATE INDEX "historic_spot_prices_recordedAt_idx" ON "historic_spot_prices"("recordedAt");
