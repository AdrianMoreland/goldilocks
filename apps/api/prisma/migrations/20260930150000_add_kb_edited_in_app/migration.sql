-- Knowledge Center: marks SOPs an admin has edited in the app, so a re-import of the
-- Markdown file can't silently overwrite them. Additive and idempotent.
ALTER TABLE "kb_documents" ADD COLUMN IF NOT EXISTS "editedInApp" BOOLEAN NOT NULL DEFAULT false;
