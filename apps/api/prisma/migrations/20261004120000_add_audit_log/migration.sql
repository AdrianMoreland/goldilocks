-- Persistent audit trail, replacing the capped Redis list. Additive and idempotent.
CREATE TABLE IF NOT EXISTS "audit_log" (
    "id" SERIAL NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "audit_log_at_idx" ON "audit_log"("at" DESC);
