-- Expand only. Role presets and per-person permission overrides (see docs/adr), a daily product price
-- snapshot for premium and spread history, and thumbs up or down on assistant answers.
-- CreateTable
CREATE TABLE "role_permissions" (
    "role" "UserRole" NOT NULL,
    "key" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role","key")
);

-- CreateTable
CREATE TABLE "user_permission_overrides" (
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "expiresAt" TIMESTAMPTZ(6),
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permission_overrides_pkey" PRIMARY KEY ("userId","key")
);

-- CreateTable
CREATE TABLE "product_price_snapshots" (
    "id" BIGSERIAL NOT NULL,
    "day" DATE NOT NULL,
    "productId" INTEGER NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "spotEur" DECIMAL(18,6) NOT NULL,
    "spreadSell" DECIMAL(5,4) NOT NULL,
    "spreadBuy" DECIMAL(5,4) NOT NULL,
    "sellPriceEur" DECIMAL(18,2) NOT NULL,
    "buyPriceEur" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_price_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_feedback" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ai_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_permission_overrides_userId_idx" ON "user_permission_overrides"("userId");

-- CreateIndex
CREATE INDEX "product_price_snapshots_day_idx" ON "product_price_snapshots"("day");

-- CreateIndex
CREATE UNIQUE INDEX "product_price_snapshots_productId_day_key" ON "product_price_snapshots"("productId", "day");

-- CreateIndex
CREATE INDEX "ai_feedback_createdAt_idx" ON "ai_feedback"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_feedback_questionId_userId_key" ON "ai_feedback"("questionId", "userId");


-- AddForeignKey: an override goes with its person, a rating with its question (the AI log retention deletes old questions).
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ai_question_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the agreed starting presets (DEFAULT_ROLE_PERMISSIONS in shared-types). Admins change them later.
INSERT INTO "role_permissions" ("role", "key") VALUES
  ('ADMIN', 'analytics.pricing'), ('ADMIN', 'analytics.sales'), ('ADMIN', 'analytics.orders'),
  ('ADMIN', 'analytics.inventory'), ('ADMIN', 'analytics.customers'), ('ADMIN', 'analytics.chatbot'),
  ('ADMIN', 'analytics.ops'), ('ADMIN', 'admin.audit'),
  ('MANAGER', 'analytics.pricing'), ('MANAGER', 'analytics.sales'), ('MANAGER', 'analytics.orders'),
  ('MANAGER', 'analytics.inventory'), ('MANAGER', 'analytics.customers'),
  ('SALES', 'analytics.pricing'), ('SALES', 'analytics.orders'), ('SALES', 'analytics.inventory'),
  ('ACCOUNTING', 'analytics.sales'), ('ACCOUNTING', 'analytics.customers'),
  ('AUDITOR', 'analytics.pricing'), ('AUDITOR', 'analytics.sales'), ('AUDITOR', 'analytics.orders'),
  ('AUDITOR', 'analytics.inventory'), ('AUDITOR', 'analytics.customers'), ('AUDITOR', 'analytics.chatbot'),
  ('AUDITOR', 'analytics.ops'), ('AUDITOR', 'admin.audit')
ON CONFLICT DO NOTHING;
