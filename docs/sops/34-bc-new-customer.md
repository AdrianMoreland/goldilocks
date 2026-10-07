---
slug: bc-new-customer
title: Business Central — add a new customer
category: systems
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 2
updatedAt: 2026-10-07
---

## Purpose
Create a customer record in Business Central (BC) without making a duplicate. You need a customer before you can make a Sales Quote.

## Before you start
- Always search first. A duplicate customer causes wrong balances and payments applied to the wrong record.
- ID and compliance checks are not part of creating the record. They happen at payment and collection ([[kyc-aml]], [[customer-collection]]).

## Steps
1. Click the magnifier at the top right and type Customers. Open Customers under "Go to Pages and Tasks".
2. Look through the list and search by name and phone number. Check the customer does not already exist. Customers are listed by number, for example ABB001 for a company or PRV02107 for a private customer.
3. If found, use that customer. Stop here.
4. If not found, select New. A box "Select a template for a new customer" opens.
5. Choose the template DOMESTIC (Domestic Customer). This is the template for Republic of Ireland customers.
6. A blank Customer Card opens. Fill in only fields that are required for the transaction or that you have confirmed:
   - Name (required, marked with a red star)
   - Address, Address 2, City, Post Code, Country/Region Code
   - Phone No. and Mobile Phone No.
   - Date of Birth
   - Email
7. Check the details carefully, especially name, address, date of birth, mobile number and email. Names must match the customer's ID.
8. Save the card by leaving it with the back arrow at the top left.
9. Return to the Sales Quote and select the new customer ([[bc-sales-quote]]).

## Creating from inside a quote
In a Sales Quote, type the new name in Customer Name and select + New in the drop-down. The same template box appears and the steps above apply.

## Other templates
Use DOMESTIC. The template list also has EU, ROW, UK and XI, but they are not used yet. If a customer needs one, ask a manager.

## If the customer is also a vendor
A person who sells to us and also buys from us should have one number across both records. See [[bc-new-vendor#same-number-for-customer-and-vendor]].

## Related
- [[bc-sales-quote]]
- [[bc-new-vendor]]
- [[bc-quick-start]]
