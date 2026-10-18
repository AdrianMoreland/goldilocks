-- Branch-based access. Additive: every existing branch is IE, every user has no branch (treated as IE),
-- and every SOP stays ie_only until an admin shares it.
DO $$ BEGIN
    CREATE TYPE "BranchRegion" AS ENUM ('IE', 'UK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "KbVisibility" AS ENUM ('all', 'ie_only');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "region" "BranchRegion" NOT NULL DEFAULT 'IE';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "branchId" INTEGER;
ALTER TABLE "kb_documents" ADD COLUMN IF NOT EXISTS "visibility" "KbVisibility" NOT NULL DEFAULT 'ie_only';

CREATE INDEX IF NOT EXISTS "users_branchId_idx" ON "users"("branchId");

DO $$ BEGIN
    ALTER TABLE "users" ADD CONSTRAINT "users_branchId_fkey"
        FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
