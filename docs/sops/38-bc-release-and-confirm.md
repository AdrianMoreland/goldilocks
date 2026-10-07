---
slug: bc-release-and-confirm
title: Business Central — Release the order and send the confirmation
category: systems
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 2
updatedAt: 2026-10-07
---

## Purpose
Release the Sales Order so the hedge can be placed, then tell the customer their payment was received. Release locks the price and ownership. It is easy to forget, so do not skip it.

## Before you start
- The payment is posted and applied to the Prepayment Invoice ([[bc-record-customer-payment]]).

## Steps
1. Go back to the Sales Order.
2. On the Home tab, select Release.
3. Release fills the Hedging table. A manager uses it to place the hedge ([[payment-lock-and-hedge#steps]]). Without Release the Hedging table is not filled.
4. Open the Print/Send tab and select Email Confirmation.
5. Check the confirmation shows the payment received and any amount still outstanding.
6. Send it.
7. Tell the customer the final locked price and the expected collection or delivery date ([[payment-lock-and-hedge#steps]]).
8. Decide fulfilment: bag the items from stock into the customer safe, or, if the item is not in stock, ask a manager to order it from the supplier ([[stock-management]]).

## After this
- Price and ownership are locked. Do not edit the order. If you need to change it, ask a manager.
- Collection or shipment: [[bc-collection-and-shipment]].

## Related
- [[bc-customer-sales-workflow]]
- [[payment-lock-and-hedge]]
