---
slug: bc-sales-quote
title: Business Central — create and send a Sales Quote
category: systems
jurisdiction: IE
owner: Merrion Gold
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Price a customer order in Business Central (BC) and send it with the payment reference. This is step one of every customer sale. Nothing else happens until the customer's money is confirmed.

## Before you start
- The customer exists in BC ([[bc-new-customer]]).
- You have priced the order ([[pricing]]) and checked availability ([[customer-inquiry-to-quote#steps]]).

## Create the quote
1. Magnifier at the top right → type Sales Quotes → open Sales Quotes.
2. In the Sales Quotes list, select New.
3. In the header, select the Customer Name.
4. On the Lines section, add each item:
   - Type: Item
   - No.: the product
   - Location Code: DU
   - Quantity
   - Unit price
5. Select the salesperson handling the deal. The field is Salesperson Code on the General section.
6. Check the customer, items, quantities and prices.

## Header fields you may see
- The quote header also shows Gold, Silver, Platinum and Palladium Spot Price boxes, a Quote Valid To Date and a Quote Accepted switch.
- Leave the spot price boxes and the Quote Valid To Date blank. Quotes have no validity period ([[customer-inquiry-to-quote#quote-validity]]).

## Send the quote
1. On the quote, open the Print/Send tab.
2. Select Send by Email. A window opens with a default message and the customer's email address.
3. Check the address and edit the message if needed. Quotes are sent from info@merriongold.ie.
4. Select Send email.
5. Alternative: select Download as PDF and send it from Outlook.
6. Tell the customer the quote is indicative and that the price locks only when funds land ([[customer-inquiry-to-quote#quote-validity]]). Give them the payment reference to pay with.

## Stop here
Do not convert the quote or do anything else until the payment is confirmed as received in full. Never accept a screenshot or the customer's word as proof ([[payment-lock-and-hedge#confirming-funds]]).

## Next
- Money confirmed: [[bc-sales-order-and-prepayment]].

## Related
- [[bc-customer-sales-workflow]]
- [[bc-quick-start]]
