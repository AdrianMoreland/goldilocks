-- CreateTable
CREATE TABLE "roadmap_sync_state" (
    "id" INTEGER NOT NULL,
    "baseCommit" TEXT NOT NULL,
    "baseMarkdown" TEXT NOT NULL,
    "syncedAt" TIMESTAMPTZ(6) NOT NULL,
    "syncedBy" TEXT NOT NULL,

    CONSTRAINT "roadmap_sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_snapshot" (
    "id" SERIAL NOT NULL,
    "markdown" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roadmap_snapshot_createdAt_idx" ON "roadmap_snapshot"("createdAt" DESC);

-- Row level security: the API connects as `postgres` (which bypasses it); Supabase's own REST roles get nothing.
ALTER TABLE "roadmap_sync_state" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roadmap_snapshot" ENABLE ROW LEVEL SECURITY;
