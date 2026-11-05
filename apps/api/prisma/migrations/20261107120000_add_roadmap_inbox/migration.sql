-- CreateTable
CREATE TABLE "roadmap_inbox" (
    "id" SERIAL NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "kind" TEXT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "issueCreatedAt" TIMESTAMPTZ(6) NOT NULL,
    "fetchedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMPTZ(6),
    "handledBy" TEXT,

    CONSTRAINT "roadmap_inbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_inbox_issueNumber_key" ON "roadmap_inbox"("issueNumber");

-- CreateIndex
CREATE INDEX "roadmap_inbox_status_issueCreatedAt_idx" ON "roadmap_inbox"("status", "issueCreatedAt" DESC);

-- Row level security: the API connects as `postgres` (which bypasses it); Supabase's own REST roles get nothing.
ALTER TABLE "roadmap_inbox" ENABLE ROW LEVEL SECURITY;
