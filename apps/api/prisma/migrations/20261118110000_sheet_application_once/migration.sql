-- A tradesheet row is applied to stock at most once: one application per (kind, reference, occurrence).
-- The table is new and empty, so replacing its unique index is safe.
DROP INDEX "sheet_applications_referenceKey_occurrence_lineId_key";
ALTER TABLE "sheet_applications" ADD COLUMN "reason" TEXT;
CREATE UNIQUE INDEX "sheet_applications_kind_referenceKey_occurrence_key" ON "sheet_applications"("kind", "referenceKey", "occurrence");
