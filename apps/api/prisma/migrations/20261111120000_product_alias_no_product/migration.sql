-- A product name can be settled as "not a product" (a fee, a deposit). Additive.
ALTER TABLE "product_aliases" ADD COLUMN "noProduct" BOOLEAN NOT NULL DEFAULT false;
