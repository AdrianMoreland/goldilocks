---
slug: customer-inquiry-to-quote
title: Handling a customer inquiry and issuing a quote
category: sales
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 4
updatedAt: 2026-10-07
---

## Purpose
Turn an inquiry from any channel into an accurate quote in Business Central (BC).

## Channels
Inquiries arrive by Outlook, the website form, WhatsApp, phone or walk-in. Every channel follows the same steps.

## Steps
1. Identify the customer. Search BC for an existing customer record. If there isn't one, create it with at least name, phone and email. ID and compliance checks happen later, at payment and collection ([[kyc-aml]]).
2. Confirm what the customer wants: product, quantity, whether they are buying or selling, and whether they want collection, storage or delivery.
3. Price the order using [[pricing]].
4. Check the item is available. If it is not in stock, a manager orders it from the supplier.
5. Create the quote in BC.
6. Send or give the quote to the customer, and tell them it is indicative (see [[customer-inquiry-to-quote#quote-validity]]).

## Quote validity
- A quote has no validity period. It is indicative because spot moves continuously.
- The price is locked only when the customer's funds land ([[payment-lock-and-hedge]]).
- Tell the customer about this rule when you send the quote.

## Price changed before funds landed
1. When funds land, reprice the order at current spot.
2. If the price has moved, the branch manager decides whether the difference is passed on.
3. If the difference is significant, call the customer and give them the new price. They can:
   - proceed at the new price, paying the difference if the price went up, or being refunded the difference if it went down;
   - cancel and receive a full refund;
   - cancel and leave the funds on account for a later order.
4. Record the customer's choice on the order in BC.

## Upselling
- Customers often compare products at the desk. Showing larger bars or coins with a lower premium per gram is normal.
- Always give the price comparison in numbers, not only a recommendation.

## Related
- [[pricing]]
- [[payment-lock-and-hedge]]
- [[customer-market-questions]]
