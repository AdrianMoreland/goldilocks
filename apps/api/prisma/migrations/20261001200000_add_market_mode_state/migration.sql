-- The company-wide market mode, one shared row (id 1). Additive and idempotent.
CREATE TABLE IF NOT EXISTS "market_mode_state" (
    "id" INTEGER NOT NULL,
    "weekend" BOOLEAN NOT NULL DEFAULT false,
    "volatile" BOOLEAN NOT NULL DEFAULT false,
    "shortage" BOOLEAN NOT NULL DEFAULT false,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "market_mode_state_pkey" PRIMARY KEY ("id")
);
