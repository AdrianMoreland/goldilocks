-- Knowledge Center: SOP documents (roadmap 1.4). Additive and idempotent —
-- safe to run against a database that already has any of these objects.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'KbCategory') THEN
        CREATE TYPE "KbCategory" AS ENUM ('sales', 'trading', 'operations', 'compliance', 'storage', 'systems', 'directory', 'meta');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'KbJurisdiction') THEN
        CREATE TYPE "KbJurisdiction" AS ENUM ('all', 'IE', 'UK', 'ES');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'KbStatus') THEN
        CREATE TYPE "KbStatus" AS ENUM ('draft', 'approved', 'retired');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "kb_documents" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "KbCategory" NOT NULL,
    "jurisdiction" "KbJurisdiction" NOT NULL,
    "owner" TEXT NOT NULL,
    "status" "KbStatus" NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "contentUpdatedOn" DATE NOT NULL,
    "markdown" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "kb_documents_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "kb_documents_slug_key" ON "kb_documents"("slug");
CREATE INDEX IF NOT EXISTS "kb_documents_category_status_idx" ON "kb_documents"("category", "status");
