-- Manager's new pricing workbook (Nov 2026). Data only, safe to re-run.
-- 1) The two premiums that changed: 1kg gold bar 3.5% -> 3.1%, 1oz Maple Leaf 5.7% -> 5.75%.
UPDATE "products" SET "spreadSell" = 0.0310 WHERE "sku" = 'GOLD-1KG-BAR';
UPDATE "products" SET "spreadSell" = 0.0575 WHERE "sku" = 'GOLD-1OZ-MAPLELEAF-COIN';

-- 2) Small gold coins read "1/2oz Coin", "1/4oz Coin", "1/10oz Coin" and "1g Coin" (some rows were saved without "Coin").
UPDATE "products" SET "name" = "name" || ' Coin'
WHERE "metalType" = 'GOLD' AND "deletedAt" IS NULL AND "name" IN ('1/10oz', '1/4oz', '1/2oz', '1g');

-- 3) PAMP, PAMP Diwali and CombiBar gold bars, with the workbook's premium and buyback discount (spreadBuy is stored negative).
-- They stay out of the main price table until a search matches them, and show as a variant in the Trade tab.
-- ON CONFLICT leaves an existing row alone; stock starts at 0 (inventory is counted separately).
INSERT INTO "products" ("sku", "name", "metalType", "weight", "spreadBuy", "spreadSell", "vatRate", "stock", "isActive", "category", "description", "updatedAt")
SELECT v."sku", v."name", 'GOLD'::"MetalType", v."weight", -v."discount", v."premium", 0.00, 0, true, 'BAR'::"ProductCategory", v."name", CURRENT_TIMESTAMP
FROM (VALUES
  ('GOLD-5G-PAMP-DIWALI-BAR',  '5 g Gold PAMP Diwali Bar',  5,        0.1750, 0.0650),
  ('GOLD-10G-PAMP-BAR',        '10 g Gold PAMP Bar',        10,       0.1325, 0.0500),
  ('GOLD-20G-COMBIBAR-BAR',    '20 g Gold CombiBar',        20,       0.0900, 0.0500),
  ('GOLD-20G-PAMP-BAR',        '20 g Gold PAMP Bar',        20,       0.0850, 0.0500),
  ('GOLD-1OZ-PAMP-BAR',        '1 oz Gold PAMP Bar',        31.1035,  0.0750, 0.0400),
  ('GOLD-50G-COMBIBAR-BAR',    '50 g Gold CombiBar',        50,       0.0700, 0.0400),
  ('GOLD-50G-PAMP-BAR',        '50 g Gold PAMP Bar',        50,       0.0675, 0.0400),
  ('GOLD-100G-COMBIBAR-BAR',   '100 g Gold CombiBar',       100,      0.0650, 0.0375),
  ('GOLD-100G-PAMP-BAR',       '100 g Gold PAMP Bar',       100,      0.0675, 0.0375)
) AS v("sku", "name", "weight", "premium", "discount")
ON CONFLICT ("sku") DO NOTHING;
