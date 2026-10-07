---
slug: bc-sales-order-and-prepayment
title: Business Central — turn a quote into a paid Sales Order and Prepayment Invoice
category: systems
jurisdiction: IE
owner: Adrian
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Once the customer's money is confirmed, convert the quote into a Sales Order and post a Prepayment Invoice. A prepayment invoice is used because the customer has paid but we have not handed over the goods yet.

## Before you start
- Payment is confirmed as received ([[payment-lock-and-hedge#confirming-funds]]). If not, stop. Do not continue.

## Convert the quote to a Sales Order
1. Open the Sales Quote ([[bc-sales-quote]]).
2. On the Home tab, select Make Order.
3. The Sales Order opens. Check the customer, products, quantities and prices.
4. If the metal price moved since the quote, call the customer, agree the new price and update the line ([[customer-inquiry-to-quote#price-changed-before-funds-landed]]). Record their choice on the order.

## The prepayment value
1. On the Sales Order line, enter the prepayment value before creating the Prepayment Invoice. The guide's screenshot highlights the prepayment amount column next to Prepayment %.
2. Enter only the amount the customer has actually paid. Anything still owed, for example because the metal price moved, then remains outstanding.
3. For a normal fully prepaid order this equals 100% of the order value.
4. [TODO: the workflow chart says "Enter 100% of the order value as the prepayment value", while the guide says only the amount actually paid. They agree when the customer paid in full. Confirm which to use when the customer paid less than the full order value.]

## Post the Prepayment Invoice
1. On the Sales Order, open the Actions menu.
2. Select Posting → Prepayment → Post Prepayment Invoice. A confirmation box appears. Confirm.
3. Check that it posted successfully before you record the payment. The invoice should appear against the customer.
4. Do not use the plain Post button on the Home tab at this stage. That button is the final Ship and Invoice posting ([[bc-collection-and-shipment]]).

## Next
- Record the money: [[bc-record-customer-payment]].

## Related
- [[bc-customer-sales-workflow]]
- [[payment-lock-and-hedge]]
