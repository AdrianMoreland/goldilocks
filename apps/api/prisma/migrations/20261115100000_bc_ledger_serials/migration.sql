-- Item ledger entries pasted from Business Central carry the serial and the customer or vendor (roadmap 1.21).
-- Additive only: four nullable columns and two indexes.
ALTER TABLE "bc_ledger_entries" ADD COLUMN "serialNo" TEXT,
ADD COLUMN "serialKey" TEXT,
ADD COLUMN "sourceType" TEXT,
ADD COLUMN "sourceNo" TEXT;

CREATE INDEX "bc_ledger_entries_serialKey_idx" ON "bc_ledger_entries"("serialKey");
CREATE INDEX "bc_ledger_entries_sourceNo_idx" ON "bc_ledger_entries"("sourceNo");
