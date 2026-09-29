-- Bar/coin category for products, picked in the admin Add/Edit product form.
-- Nullable: existing rows keep NULL and the dashboard infers the category
-- from the product name. Additive and idempotent.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProductCategory') THEN
        CREATE TYPE "ProductCategory" AS ENUM ('BAR', 'COIN');
    END IF;
END
$$;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category" "ProductCategory";
