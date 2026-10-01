-- Internal AI assistant: which mode a question used (procedures, email, whatsapp) and which live
-- lookups it called. Additive and idempotent — safe to run against a database that already has them.
ALTER TABLE "ai_question_logs" ADD COLUMN IF NOT EXISTS "mode" TEXT NOT NULL DEFAULT 'procedures';
ALTER TABLE "ai_question_logs" ADD COLUMN IF NOT EXISTS "toolNames" TEXT[];
