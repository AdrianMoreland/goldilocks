---
slug: pricing
title: Pricing products for sale and buyback
category: sales
jurisdiction: IE
owner: Adrian
status: approved
version: 3
updatedAt: 2026-09-30
---

## Purpose
Calculate consistent sell and buy prices for gold, silver, platinum and palladium.

## Spot price
- Use the live spot on the Goldilocks pricing dashboard. Spot is shown in EUR per troy ounce and refreshes every 10 minutes.
- If the dashboard shows prices as stale or paused, use metalsdaily.com and tell a manager.

## Metals covered
All four metals are priced automatically on the dashboard: gold, silver, platinum and palladium.

## Sell price
Sell price (ex-VAT) = (spot in EUR per troy ounce ÷ 31.1035) × weight in grams × (1 + premium rate)

- One troy ounce = 31.1035 grams.
- Each product has its own premium rate in the product table. Only admins can change it.
- VAT is added on top for silver, platinum and palladium (see [[pricing#vat]]).

## Buy price
- The buy price is spot value less the product's discount rate. Each product has its own discount rate in the product table. Only admins can change it.
- For scrap or non-standard items, see [[pricing#scrap-and-non-standard-items]].

## Scrap and non-standard items
1. Test the item's purity with the tester.
2. Calculate the price with the melt calculation in the pricing tools, using the tested purity and weight.
3. A manager must approve the purchase before you agree a price with the customer.

## VAT
- Investment gold is VAT-exempt. Investment gold means:
  - bars or wafers with purity of at least 995/1000;
  - coins with purity of at least 900/1000, minted after 1800, that are or were legal tender in their country of origin, and are normally sold at no more than 80% above the value of their gold content.
- Gold outside this definition is not VAT-exempt. Ask a manager before selling it.
- Silver, platinum and palladium are sold with 23% VAT.
- The dashboard shows prices both with and without VAT. Quote the VAT-inclusive price to customers.
- Bonded silver is VAT-free while it stays in the bonded warehouse ([[bonded-silver-storage]]).

## Market modes
- The dashboard has three modes: **Weekend**, **Volatile** and **Metal Shortage**.
- Each mode changes the premiums and discounts of specific products only. Admins configure which products and by how much.
- Only admins and managers can switch a mode on or off. When to use each mode is the manager's call.
- If you think a mode should be on or off, tell a manager. Do not adjust prices manually instead.

## Related
- [[customer-inquiry-to-quote]]
- [[customer-buyback]]
