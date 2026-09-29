-- Soft delete for products: a deleted product keeps its row (and its SKU)
-- and is hidden by filtering on "deletedAt" IS NULL. Additive and idempotent.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ(6);
