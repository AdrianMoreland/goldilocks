-- Internal AI assistant (roadmap 1.5, phase 2): question log and answer cache. Additive and
-- idempotent — safe to run against a database that already has any of these objects.
CREATE TABLE IF NOT EXISTS "ai_question_logs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cached" BOOLEAN NOT NULL DEFAULT false,
    "retried" BOOLEAN NOT NULL DEFAULT false,
    "citations" TEXT[],
    "model" TEXT NOT NULL,
    "corpusHash" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "cachedInputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "costMicros" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "error" TEXT,

    CONSTRAINT "ai_question_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ai_question_logs_createdAt_idx" ON "ai_question_logs"("createdAt");
CREATE INDEX IF NOT EXISTS "ai_question_logs_userId_createdAt_idx" ON "ai_question_logs"("userId", "createdAt");

CREATE TABLE IF NOT EXISTS "ai_answer_cache" (
    "id" SERIAL NOT NULL,
    "questionKey" TEXT NOT NULL,
    "corpusHash" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "citations" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ai_answer_cache_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ai_answer_cache_questionKey_corpusHash_key" ON "ai_answer_cache"("questionKey", "corpusHash");
CREATE INDEX IF NOT EXISTS "ai_answer_cache_expiresAt_idx" ON "ai_answer_cache"("expiresAt");
