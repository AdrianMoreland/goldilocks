---
slug: bc-record-customer-payment
title: Business Central — record a customer payment (Cash Receipt Journal)
category: systems
jurisdiction: IE
owner: Merrion Gold
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Record the money the customer paid and link it to their Prepayment Invoice. This is the fiddly part of a sale. Fill the journal in from top to bottom, like a form.

## Before you start
- The Prepayment Invoice is posted ([[bc-sales-order-and-prepayment#post-the-prepayment-invoice]]).
- You know the exact amount received and which bank account it landed in.
- Accounts handle payments out to suppliers. This SOP is only for money coming in from customers.

## Fill in the journal
1. Magnifier at the top right → type Cash Receipt Journals → open it.
2. Posting Date: the correct date for the payment.
3. Document Type: Payment.
4. Account Type: Customer.
5. Account No.: search for and select the customer. The Description fills in by itself.
6. Posting Group: Domestic.
7. Amount: enter it as a negative number. Paid €4,495 is entered as -4495.
8. Bal. Account Type: Bank Account.
9. Bal. Account No.: the bank account the customer paid the money into.

## Link the payment to the invoice
1. Select Apply Entries.
2. Find the Prepayment Invoice for this order and select it.
3. Choose Set Applies-to ID.
4. Check that the amounts agree.
5. Select OK to return to the journal.

## Final check, then post
Check each of these:
- Customer is correct
- Amount is correct and negative
- Bank account is the one the money went into
- It is applied to the correct Prepayment Invoice

Then select Post.

## If it does not match
If the payment cannot be matched correctly, do not post it. Stop and check with a manager ([[bc-troubleshooting-and-escalation#when-to-stop]]).

## Next
- Return to the Sales Order and Release it: [[bc-release-and-confirm]].

## Related
- [[bc-customer-sales-workflow]]
- [[payment-lock-and-hedge#accepted-payment-methods]]
