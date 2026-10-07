---
slug: bc-customer-sales-workflow
title: Business Central — selling to a customer, start to finish
category: systems
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 2
updatedAt: 2026-10-07
---

## Purpose
The whole customer sale in Business Central (BC) on one page. Each step links to its own how-to SOP with the exact clicks.
Sources: Business Central Guide, Branch Staff Workflow chart.

## Rules
- A Sales Quote is the start of every prepaid customer order. Never start with a standalone Sales Order.
- Payment confirmation is the control point. Do not convert the quote until the customer's payment is confirmed in full ([[payment-lock-and-hedge#confirming-funds]]).
- If anything does not match, do not post. Ask a manager ([[bc-troubleshooting-and-escalation]]).

## The steps
| # | Step | What you do | How-to |
|---|---|---|---|
| 1 | Check the customer | Search Customers. Create if new | [[bc-new-customer]] |
| 2 | Sales Quote | Customer, item, Location Code DU, quantity, price, salesperson | [[bc-sales-quote]] |
| 3 | Send the quote | Print/Send → Send by Email, with the payment reference | [[bc-sales-quote#send-the-quote]] |
| 4 | Customer pays | They pay using the payment reference | |
| 5 | STOP | Confirm the payment has landed | [[payment-lock-and-hedge#confirming-funds]] |
| 6 | Sales Order | Make Order from the quote. Update the price if the metal moved | [[bc-sales-order-and-prepayment]] |
| 7 | Prepayment value | Enter 100 in the Prepayment field, even if only part is paid | [[bc-sales-order-and-prepayment#the-prepayment-value]] |
| 8 | Prepayment Invoice | Post it and check it posted | [[bc-sales-order-and-prepayment#post-the-prepayment-invoice]] |
| 9 | Record the money | Cash Receipt Journal, apply to the invoice, Post | [[bc-record-customer-payment]] |
| 10 | Release | Fills the Hedging table. Then send the confirmation | [[bc-release-and-confirm]] |
| 11 | Hand over | Collection, or shipment with serial numbers | [[bc-collection-and-shipment]] |

## Chain to remember
Quote → wait → Order → Prepayment Invoice → Journal → Release → Hand over.

## Related
- [[bc-quick-start]]
- [[bc-purchase-orders]]
- [[payment-lock-and-hedge]]
