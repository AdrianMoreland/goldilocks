# Product


## Platform

web

## Users

- **Counter and phone sales staff (about 95% of use).** They quote live buy and sell prices for bullion to customers, either at the counter or on the phone, often while the customer waits. Their job is to go from "what would you give me for this coin?" or "how much for ten of these bars?" to a correct, confident number in seconds.
- **Owner/manager (about 5% of use).** Sets prices: adjusts per-product premiums and discounts, turns market modes on and off (Weekend, Volatile, Metal Shortage), tunes per-metal-group adjustment percentages, and maintains the catalogue, branches and staff accounts through the admin-gated tools.

The account roles `ADMIN | MANAGER | SALES | ACCOUNTING | AUDITOR` exist in the data model. Accounting and audit use has not been confirmed as a real workflow yet.

## Product Purpose

The Merrion Gold Pricing Workbook is the internal pricing and trading dashboard for Merrion Gold, an Irish bullion dealer. It replaces a Google Sheets / Apps Script workbook ("Merrion Gold — Pricing Control Centre") that the business used before. It shows:

- live metal spot prices;
- a per-product pricing table (buy/sell, premiums, discounts, VAT);
- a trade calculator;
- a portfolio builder;
- VAT and CGT reference calculators;
- an admin-only pricing editor.

It succeeds when staff trust its numbers without checking them against anything else, and when quoting feels faster and more intuitive than the spreadsheet did.

## Positioning

It is a port of Merrion Gold's own pricing workbook, so it keeps that workbook's business rules exactly. Examples: market modes stack additively, and Metal Shortage moves the buy discount in the opposite direction from Weekend/Volatile. It adds live spot data, freshness signalling and role-gated editing, which the spreadsheet could not offer. It is not a generic trading terminal or a public storefront.

## Operating Context

- Used during live customer conversations, in person and by phone. Quoting speed and clarity matter more than exploring the data.
- Covers four metals: gold, silver, platinum and palladium (platinum and palladium are grouped as PGM for adjustments). The catalogue has about 150 products.
- Currency is EUR, formatted for `en-IE`. VAT and Capital Gains Tax figures follow Irish rules.
- Spot prices come from an external metals price API and are cached. How old the displayed price is matters in practice: staff must see when it is stale.
- Keyboard shortcuts and copying rows to the clipboard support fast quoting and pasting prices into other channels.
- Staff arrive with the vocabulary of the old spreadsheet: spot, premium, discount, spread, Weekend/Volatile/Shortage. Its buy/sell wording has been replaced by Price/Buyback (see Brand Commitments).

## Capabilities and Constraints

- A closed internal tool. There is no public sign-up and no OAuth; a small, known set of staff accounts is provisioned manually.
- Admin actions are enforced on the server. The UI's admin mode only controls what admins can discover and does not provide security.
- Pricing math lives in `packages/shared-types` and must stay the single source of truth for both apps.
- Some Pricing Tools tabs are still placeholders ("coming soon").
- Currently deployed for an initial demo on Railway. Hardening for customer-facing use is deliberately deferred.

## Brand Commitments

- Product name: **Merrion Gold Pricing Workbook**. Company: **Merrion Gold**.
- Keep the spreadsheet's terminology and mode labels (WEEKEND, VOLATILE, METAL SHORTAGE) wherever staff would recognise them.
- **Price** is what the customer pays us; **Buyback** is what we pay the customer. Use these two words everywhere, never "Sell"/"Buy" (which flip meaning depending on whose side you take) or "MG Price". Confirmed by the owner on 2026-09-29.

## Evidence on Hand

- The business rules of the original workbook, preserved in code comments (for example `apps/web/src/app/dashboard/context/pricing-settings-context.tsx`).
- The real product catalogue and live spot data are served through the API.
- Not available and must not be invented: customer testimonials, usage metrics, pricing claims beyond the live data, or any public-facing marketing content.

## Product Principles

1. **Intuitive first.** Someone who has never been trained on the tool should find the right price without hunting. This is the overriding priority.
2. **Numbers you can trust.** Prices, VAT and totals are unambiguous and match the workbook's math exactly, with no rounding surprises.
3. **Seconds to a quote.** The path from a customer's question to a quoted price is short and keyboard-friendly.
4. **Freshness is always visible.** Staff always know how current the spot price is, and stale data is never silent.
5. **Familiar to spreadsheet users.** Keep the terms and mental model staff already know from the workbook. Change them only when the change is clearly more intuitive.
