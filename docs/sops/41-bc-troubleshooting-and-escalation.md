---
slug: bc-troubleshooting-and-escalation
title: Business Central — when something goes wrong, and when to stop
category: systems
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 2
updatedAt: 2026-10-07
---

## Purpose
Know what to check before you post, what common errors mean, and when to stop and ask a manager. Posting in BC cannot easily be undone.

## When to stop
Stop and ask your manager before going on if:
- the customer's payment has not been confirmed in full;
- the goods received do not match the Purchase Order;
- the customer, vendor, item, quantity or amount does not look right;
- you are not sure how to process the transaction;
- you need to amend, cancel, reverse or correct something already posted, including a refund or reversal;
- the transaction does not match the normal flow.

Do not improvise. Do not use a function because it appears in the menu.

## Check before you post
1. Is the customer's payment received (not promised, not a screenshot)?
2. Do the goods match the Purchase Order?
3. Are the customer or vendor, item, quantity and amount correct?
4. For the journal: is the amount negative, the bank account right, and the invoice the one for this order?

## Common problems
| Problem | What it means | What to do |
|---|---|---|
| Error when posting a sale with bars | Serial numbers are missing | Add one serial per bar with Quantity (Base) 1 ([[bc-collection-and-shipment#serial-numbers-for-bars]]) |
| Error screen on a Purchase Order | A required field is empty | Read the message, complete the field, try again |
| Hedging table is empty | The order was not released | Release the order ([[bc-release-and-confirm]]) |
| Order shows an amount still owing | The amount in the Cash Receipt Journal was less than the order total | Check the remaining amount before handing over goods |
| Two records for one person | The customer was created without searching | Tell a manager. Do not delete anything |
| Customer not found | Spelled differently or created before BC | Search by phone number, then Zoho ([[systems-overview#bc-and-zoho]]) |
| Payment applied to the wrong invoice | Wrong Prepayment Invoice chosen | Do not post. If already posted, tell a manager |
| Metal price moved before you converted the quote | The price on the quote is out of date | Call the customer, agree the new price ([[customer-inquiry-to-quote#price-changed-before-funds-landed]]) |

## Cancellations and refunds
- The documents do not give a BC procedure for cancelling an order or refunding a customer.
- Until one is written, stop and ask a manager for any cancellation, refund or reversal.

## Related
- [[bc-quick-start]]
- [[bc-customer-sales-workflow]]
- [[bc-purchase-orders]]
