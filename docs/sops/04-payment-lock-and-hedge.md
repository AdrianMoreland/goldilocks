---
slug: payment-lock-and-hedge
title: Receiving payment, locking the price and hedging
category: trading
jurisdiction: IE
owner: Adrian
status: approved
version: 3
updatedAt: 2026-09-30
---

## Purpose
Make sure no price is committed to a customer before their money is received, and that every committed price is hedged.

## Core rule
The price is locked and hedged only when the customer's funds have landed. A quote alone never locks a price.

## Accepted payment methods
| Method | Handling fee | Limit |
|---|---|---|
| Bank transfer | None | None |
| Card | 2% | None |
| Cash | 2% | None, but extra checks at €10,000 or more ([[kyc-aml]]) |

- Add the 2% handling fee to the total for card and cash payments.
- Cash of €10,000 or more, in one payment or in linked payments, requires the extra checks in [[kyc-aml]] before you accept it.

## Confirming funds
- Brokers with bank account access check the account directly.
- Other brokers ask the accounts team or a manager to confirm.
- Never treat a customer's word, a payment screenshot or a bank confirmation email as proof that funds have landed.

## Steps
1. Confirm the funds have landed (see [[payment-lock-and-hedge#confirming-funds]]).
2. If spot has moved since the quote, follow [[customer-inquiry-to-quote#price-changed-before-funds-landed]].
3. Lock the price at current spot. Record the locked spot, time, product, weight and premium on the order.
4. Ask a manager to place the hedge. Only managers place hedges. The manager chooses StoneX or CoinInvest based on price and availability.
5. Convert the quote to an invoice in BC.
6. Decide fulfilment: bag the items from stock into the customer safe, or order from the supplier ([[stock-management]]).
7. Tell the customer the final locked price and the expected collection or delivery date.

## Funds left on account
If a customer cancels before the price is locked and chooses to leave their funds on account, record this on the customer in BC. Their next order is paid from those funds and follows the same steps.

## Order statuses
PAID → HEDGED → COLLECTED

## Related
- [[customer-inquiry-to-quote]]
- [[kyc-aml]]
- [[limit-orders]]
- [[customer-collection]]
