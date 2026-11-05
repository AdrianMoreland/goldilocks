-- CreateEnum
CREATE TYPE "OrderStep" AS ENUM ('ORDERED', 'ARRIVED', 'ALLOCATED', 'MATCHED', 'COLLECTED', 'POSTED');

-- CreateEnum
CREATE TYPE "SheetTaskStatus" AS ENUM ('OPEN', 'DONE');

-- CreateEnum
CREATE TYPE "TaskCheck" AS ENUM ('TRADE_COLLECTED', 'TRADE_CPTY', 'MANUAL');

-- CreateEnum
CREATE TYPE "TaskClosedVia" AS ENUM ('MANUAL', 'IMPORT');

-- CreateTable
CREATE TABLE "order_events" (
    "id" SERIAL NOT NULL,
    "tradeId" INTEGER NOT NULL,
    "step" "OrderStep" NOT NULL,
    "by" TEXT NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheet_tasks" (
    "id" SERIAL NOT NULL,
    "tradeId" INTEGER,
    "reference" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "sheet" TEXT NOT NULL,
    "what" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "check" "TaskCheck" NOT NULL,
    "status" "SheetTaskStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "closedAt" TIMESTAMPTZ(6),
    "closedBy" TEXT,
    "closedVia" "TaskClosedVia",

    CONSTRAINT "sheet_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handovers" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "by" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "handovers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_events_tradeId_idx" ON "order_events"("tradeId");

-- CreateIndex
CREATE INDEX "sheet_tasks_status_idx" ON "sheet_tasks"("status");

-- CreateIndex
CREATE INDEX "sheet_tasks_tradeId_idx" ON "sheet_tasks"("tradeId");

-- AddForeignKey
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_tasks" ADD CONSTRAINT "sheet_tasks_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

