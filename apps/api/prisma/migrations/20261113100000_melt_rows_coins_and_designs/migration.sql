-- Melt rows, the weights and sizes the sheets and invoices use that had no pricing product, and the foreign gold coins
-- and bullion designs as specific products. Additive and idempotent: ON CONFLICT / NOT EXISTS leave an existing row alone.
-- All pricing rows are hidden (isActive false, no spread, no stock): they exist so a product name has somewhere to settle to.
-- "Gold Melt" and "Silver Melt" are priced per troy ounce (weight 31.1035 g), not per piece.
-- VAT is copied from an existing row of the same metal, a non-bonded one first (bonded silver carries 0%).
INSERT INTO "products" ("sku", "name", "metalType", "weight", "spreadBuy", "spreadSell", "vatRate", "stock", "isActive", "category", "updatedAt")
SELECT v."sku", v."name", v."metal"::"MetalType", v."weight", 0, 0,
       COALESCE((SELECT p."vatRate" FROM "products" p WHERE p."metalType" = v."metal"::"MetalType" AND p."deletedAt" IS NULL ORDER BY (p."sku" LIKE '%BONDED%'), p."id" LIMIT 1),
                CASE WHEN v."metal" = 'GOLD' THEN 0.00 ELSE 0.23 END),
       0, false, v."category"::"ProductCategory", CURRENT_TIMESTAMP
FROM (VALUES
  ('GOLD-MELT',              'Gold Melt',            'GOLD',      31.1035,   NULL),
  ('SILVER-MELT',            'Silver Melt',          'SILVER',    31.1035,   NULL),
  ('SILVER-1/10OZ-COIN',     '1/10oz Silver Coin',   'SILVER',    3.1104,    'COIN'),
  ('SILVER-1/4OZ-COIN',      '1/4oz Silver Coin',    'SILVER',    7.7759,    'COIN'),
  ('SILVER-1/2OZ-COIN',      '1/2oz Silver Coin',    'SILVER',    15.5518,   'COIN'),
  ('SILVER-5OZ-COIN',        '5oz Silver Coin',      'SILVER',    155.5175,  'COIN'),
  ('SILVER-100G-COIN',       '100g Silver Coin',     'SILVER',    100,       'COIN'),
  ('SILVER-30G-COIN',        '30g Silver Coin',      'SILVER',    30,        'COIN'),
  ('GOLD-2OZ-COIN',          '2oz Gold Coin',        'GOLD',      62.207,    'COIN'),
  ('GOLD-30G-COIN',          '30g Gold Coin',        'GOLD',      30,        'COIN'),
  ('GOLD-15G-COIN',          '15g Gold Coin',        'GOLD',      15,        'COIN'),
  ('GOLD-3G-COIN',           '3g Gold Coin',         'GOLD',      3,         'COIN'),
  ('GOLD-1/20OZ-COIN',       '1/20oz Gold Coin',     'GOLD',      1.5552,    'COIN'),
  ('SILVER-5G-BAR',          '5g Silver Bar',        'SILVER',    5,         'BAR'),
  ('SILVER-10G-BAR',         '10g Silver Bar',       'SILVER',    10,        'BAR'),
  ('SILVER-20G-BAR',         '20g Silver Bar',       'SILVER',    20,        'BAR'),
  ('SILVER-5KG-BAR',         '5kg Silver Bar',       'SILVER',    5000,      'BAR'),
  ('SILVER-15KG-BAR',        '15kg Silver Bar',      'SILVER',    15000,     'BAR'),
  ('GOLD-1/10OZ-BAR',        '1/10oz Gold Bar',      'GOLD',      3.1104,    'BAR'),
  ('GOLD-2OZ-BAR',           '2oz Gold Bar',         'GOLD',      62.207,    'BAR'),
  ('GOLD-5OZ-BAR',           '5oz Gold Bar',         'GOLD',      155.5175,  'BAR'),
  ('GOLD-1TOLA-BAR',         '1 tola Gold Bar',      'GOLD',      11.6638,   'BAR'),
  ('GOLD-5TOLA-BAR',         '5 tola Gold Bar',      'GOLD',      58.319,    'BAR'),
  ('GOLD-10TOLA-BAR',        '10 tola Gold Bar',     'GOLD',      116.638,   'BAR'),
  ('PLATINUM-2.5G-BAR',      '2.5g Platinum Bar',    'PLATINUM',  2.5,       'BAR'),
  ('PLATINUM-1/2OZ-BAR',     '1/2oz Platinum Bar',   'PLATINUM',  15.5518,   'BAR'),
  ('PLATINUM-10OZ-BAR',      '10oz Platinum Bar',    'PLATINUM',  311.035,   'BAR')
) AS v("sku", "name", "metal", "weight", "category")
WHERE NOT EXISTS (SELECT 1 FROM "products" e WHERE e."sku" = v."sku")
ON CONFLICT ("sku") DO NOTHING;

-- Specific products. The pricing product is looked up by SKU in the same statement; a name whose pricing row is
-- missing is skipped. weightLabel is the fine gold in troy ounces for the foreign coins (priced by melt value).
INSERT INTO "sales_products" ("name", "metal", "genericNorm", "weightLabel", "refinery", "pricingProductId", "active", "updatedAt")
SELECT v."name", v."metal"::"StockMetal", v."genericNorm", v."weightLabel", NULL, p."id", true, CURRENT_TIMESTAMP
FROM (VALUES
  ('20 French Franc',              'GOLD',   'GOLD-MELT',                    '20 french franc',            '0.1867oz melt'),
  ('10 French Franc',              'GOLD',   'GOLD-MELT',                    '10 french franc',            '0.0933oz melt'),
  ('100 French Franc',             'GOLD',   'GOLD-MELT',                    '100 french franc',           '0.9333oz melt'),
  ('20 Swiss Franc (Vreneli)',     'GOLD',   'GOLD-MELT',                    '20 swiss franc vreneli',     '0.1867oz melt'),
  ('Austrian 4 Ducat',             'GOLD',   'GOLD-MELT',                    'austrian 4 ducat',           '0.4427oz melt'),
  ('Austrian 1 Ducat',             'GOLD',   'GOLD-MELT',                    'austrian 1 ducat',           '0.1107oz melt'),
  ('Austrian 100 Corona',          'GOLD',   'GOLD-MELT',                    'austrian 100 corona',        '0.9802oz melt'),
  ('Austrian 20 Corona',           'GOLD',   'GOLD-MELT',                    'austrian 20 corona',         '0.1961oz melt'),
  ('Austrian 10 Corona',           'GOLD',   'GOLD-MELT',                    'austrian 10 corona',         '0.0980oz melt'),
  ('Mexican 50 Pesos',             'GOLD',   'GOLD-MELT',                    'mexican 50 peso',            '1.2057oz melt'),
  ('Mexican 2.5 Pesos',            'GOLD',   'GOLD-MELT',                    'mexican 2.5 peso',           '0.0603oz melt'),
  ('South African 2 Rand',         'GOLD',   'GOLD-MELT',                    'south african 2 rand',       '0.2354oz melt'),
  ('South African 1 Rand',         'GOLD',   'GOLD-MELT',                    'south african 1 rand',       '0.1177oz melt'),
  ('US $20 Double Eagle',          'GOLD',   'GOLD-MELT',                    'us 20 double eagle',         '0.9675oz melt'),
  ('US $10 Eagle',                 'GOLD',   'GOLD-MELT',                    'us 10 eagle',                '0.4837oz melt'),
  ('US $5 Half Eagle',             'GOLD',   'GOLD-MELT',                    'us 5 half eagle',            '0.2419oz melt'),
  ('US $2.5 Quarter Eagle',        'GOLD',   'GOLD-MELT',                    'us 2.5 quarter eagle',       '0.1210oz melt'),
  ('German 20 Mark',               'GOLD',   'GOLD-MELT',                    'german 20 mark',             '0.2305oz melt'),
  ('Russian 10 Rouble',            'GOLD',   'GOLD-MELT',                    'russian 10 rouble',          '0.2489oz melt'),
  ('Russian 5 Rouble',             'GOLD',   'GOLD-MELT',                    'russian 5 rouble',           '0.1245oz melt'),
  ('Turkish 100 Kurush',           'GOLD',   'GOLD-MELT',                    'turkish 100 kurush',         '0.2127oz melt'),
  ('Saudi Guinea',                 'GOLD',   'GOLD-MELT',                    'saudi guinea',               '0.2354oz melt'),
  ('Gold Panda 30g',               'GOLD',   'GOLD-30G-COIN',                '30g panda',                  NULL),
  ('Gold Panda 15g',               'GOLD',   'GOLD-15G-COIN',                '15g panda',                  NULL),
  ('Gold Panda 3g',                'GOLD',   'GOLD-3G-COIN',                 '3g panda',                   NULL),
  ('Silver Panda 30g',             'SILVER', 'SILVER-30G-COIN',              '30g panda',                  NULL),
  ('Kookaburra 1oz Silver',        'SILVER', '1OZ-SILVER-COIN',              '1oz kookaburra',             NULL),
  ('Koala 1oz Silver',             'SILVER', '1OZ-SILVER-COIN',              '1oz koala',                  NULL),
  ('Isle of Man Angel 1oz Gold',   'GOLD',   'GOLD-1OZ-COIN',                '1oz isle of man angel',      NULL),
  ('Lunar 1oz Gold',               'GOLD',   'GOLD-1OZ-COIN',                '1oz lunar',                  NULL),
  ('Lunar 1oz Silver',             'SILVER', '1OZ-SILVER-COIN',              '1oz lunar',                  NULL),
  ('Queen''s Beasts 2oz Silver',   'SILVER', 'SILVER-2OZ-QUEENSBEASTS-COIN', '2oz queen s beast',          NULL),
  ('Queen''s Beasts 10oz Silver',  'SILVER', '10OZ-SILVER-COIN',             '10oz queen s beast',         NULL),
  ('American Buffalo 1oz Gold',    'GOLD',   'GOLD-1OZ-COIN',                '1oz american buffalo',       NULL),
  ('Australian Kangaroo 2oz Gold', 'GOLD',   'GOLD-2OZ-COIN',                '2oz australian kangaroo',    NULL)
) AS v("name", "metal", "sku", "genericNorm", "weightLabel")
JOIN "products" p ON p."sku" = v."sku" AND p."deletedAt" IS NULL
ON CONFLICT ("name") DO NOTHING;
