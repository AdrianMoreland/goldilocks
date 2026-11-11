-- Hidden catalogue rows (isActive = false) so generic coins, large bars and sovereign sizes have a pricing product
-- to settle to without showing in any price list. Data only; ON CONFLICT leaves an existing row alone.
-- VAT is copied from an existing row of the same metal.
INSERT INTO "products" ("sku", "name", "metalType", "weight", "spreadBuy", "spreadSell", "vatRate", "stock", "isActive", "category", "updatedAt")
SELECT v."sku", v."name", v."metal"::"MetalType", v."weight", 0, 0,
       COALESCE((SELECT p."vatRate" FROM "products" p WHERE p."metalType" = v."metal"::"MetalType" AND p."deletedAt" IS NULL ORDER BY p."id" LIMIT 1),
                CASE WHEN v."metal" = 'GOLD' THEN 0.00 ELSE 0.23 END),
       0, false, v."category"::"ProductCategory", CURRENT_TIMESTAMP
FROM (VALUES
  ('GOLD-1OZ-COIN',                  '1oz Gold Coin',        'GOLD',      31.1035,    'COIN'),
  ('PLATINUM-1OZ-COIN',              '1oz Platinum Coin',    'PLATINUM',  31.1035,    'COIN'),
  ('PALLADIUM-1OZ-COIN',             '1oz Palladium Coin',   'PALLADIUM', 31.1035,    'COIN'),
  ('SILVER-1000OZ-BAR',              '1000oz Silver Bar',    'SILVER',    31103.5,    'BAR'),
  ('GOLD-10OZ-BAR',                  '10oz Gold Bar',        'GOLD',      311.035,    'BAR'),
  ('SILVER-10OZ-BAR',                '10oz Silver Bar',      'SILVER',    311.035,    'BAR'),
  ('GOLD-100OZ-BAR',                 '100oz Gold Bar',       'GOLD',      3110.35,    'BAR'),
  ('GOLD-5KG-BAR',                   '5kg Gold Bar',         'GOLD',      5000,       'BAR'),
  ('GOLD-1/2OZ-BAR',                 '1/2oz Gold Bar',       'GOLD',      15.5518,    'BAR'),
  ('SILVER-50G-BAR',                 '50g Silver Bar',       'SILVER',    50,         'BAR'),
  ('GOLD-QUARTER-SOVEREIGN-COIN',    'Quarter Sovereign',    'GOLD',      1.997,      'COIN'),
  ('GOLD-QUINTUPLE-SOVEREIGN-COIN',  'Quintuple Sovereign',  'GOLD',      39.94,      'COIN')
) AS v("sku", "name", "metal", "weight", "category")
ON CONFLICT ("sku") DO NOTHING;
