-- Queue rows (a note typed in the app or sent from the phone) have no GitHub issue, and say where they came from.
-- Additive: existing rows keep their issue numbers and become source = 'github'.
ALTER TABLE "roadmap_inbox" ALTER COLUMN "issueNumber" DROP NOT NULL;

ALTER TABLE "roadmap_inbox" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'github';

-- CreateIndex
CREATE INDEX "roadmap_inbox_source_status_idx" ON "roadmap_inbox"("source", "status");
