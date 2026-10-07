---
slug: bc-quick-start
title: Business Central quick start — the two flows and how to find things
category: systems
jurisdiction: IE
owner: Merrion Gold
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Business Central (BC) looks confusing because it splits into separate steps what Zoho did in one go. There are only two jobs: selling to a customer and buying from a seller. Read this first, then follow the how-to SOP for the step you are on.
Sources: Business Central Guide (Branch Sales and Purchasing work instructions), Branch Staff Workflow chart.

## The two flows
| Job | Short version | Detailed steps |
|---|---|---|
| Customer buys from us | Quote → wait for money → Order → Prepayment Invoice → Cash Receipt Journal → Release → Hand over | [[bc-customer-sales-workflow]] |
| We buy from a seller (including a customer selling to us) | Vendor → Purchase Order → Serials → Check → Print and sign → (Accounts pays) → Receive and invoice | [[bc-purchase-orders]] |

## If you still think in Zoho
| Zoho Books | Business Central |
|---|---|
| Estimate | Sales Quote ([[bc-sales-quote]]) |
| Invoice | Sales Order plus Prepayment Invoice ([[bc-sales-order-and-prepayment]]) |
| Record Payment | Cash Receipt Journal plus Apply Entries ([[bc-record-customer-payment]]) |
| (no equivalent) | Release, which fills the Hedging table ([[bc-release-and-confirm]]) |
| Mark as delivered | Post → Ship and Invoice, which removes the stock ([[bc-collection-and-shipment]]) |
| Vendor, Purchase Order | Vendor Card, Purchase Order ([[bc-new-vendor]], [[bc-purchase-orders]]) |

## Who does what
- Branch staff create the quote, order, prepayment invoice, payment journal, release, collection or shipment, and the Purchase Order and receiving.
- Accounts pay the seller on a Purchase Order. It is not a branch step.
- Managers place hedges using the Hedging table ([[payment-lock-and-hedge#steps]]).

## How to find anything
1. Click the magnifier icon at the top right of BC. A box opens: "Tell me what you want to do".
2. Type the page name, for example Sales Quotes, Customers, Cash Receipt Journals, Orders Awaiting Collection or Vendors.
3. Click the page under "Go to Pages and Tasks".
4. The Home page also has shortcuts at the top: Customers, Vendors, Items, Bank Accounts and Chart of Accounts.

## Rules that apply to everything
1. A Sales Quote is always the starting point of a customer order. Never start with a standalone Sales Order.
2. Never convert the quote until the customer's payment is confirmed ([[payment-lock-and-hedge#confirming-funds]]).
3. Use only the documented steps. Do not use a BC menu option because it is there.
4. If something does not match (amount, goods, payment), do not post. See [[bc-troubleshooting-and-escalation]].
5. Always use Location Code DU on sales lines.

## The six traps
1. The journal amount is negative. €4,495 received is entered as -4495.
2. Enter 100 in the Prepayment field, even if only part is paid. The exact amount goes in the Cash Receipt Journal ([[bc-sales-order-and-prepayment#the-prepayment-value]]).
3. Release the order before sending the confirmation. No Release, no Hedging table.
4. One serial per bar, with Quantity (Base) 1 on every line.
5. Start from a Quote, never a standalone Sales Order.
6. Location Code DU on every sales quote line.

## Related
- [[bc-customer-sales-workflow]]
- [[bc-new-customer]]
- [[bc-purchase-orders]]
- [[bc-troubleshooting-and-escalation]]
