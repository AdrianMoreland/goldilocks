-- The roadmap Markdown for the Project Management page, one shared row (id 1). Additive and idempotent.
CREATE TABLE IF NOT EXISTS "roadmap_document" (
    "id" INTEGER NOT NULL,
    "markdown" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roadmap_document_pkey" PRIMARY KEY ("id")
);
