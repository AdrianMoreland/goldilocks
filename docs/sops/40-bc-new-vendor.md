---
slug: bc-new-vendor
title: Business Central — add a new vendor (supplier or customer selling to us)
category: systems
jurisdiction: IE
owner: Merrion Gold
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Create a vendor record before you can make a Purchase Order. A vendor is any seller: a refiner or supplier, or a customer selling to us.

## Steps
1. Magnifier at the top right → type Vendors, or use Purchasing → Vendors.
2. Search first. Check the seller does not already exist. Avoid duplicates.
3. If found, use that vendor. Stop here.
4. If not found, select New to open a Vendor Card.
5. Select the template DOM-VEND - Domestic Vendor.
6. Complete the required seller or supplier details: name, address, contact details, email and phone. For a customer selling to us also take date of birth where required.
7. Check the details, then save the card by leaving it with the back arrow.
8. Create the Purchase Order with the new vendor ([[bc-purchase-orders]]).

## Same number for customer and vendor
- If a vendor has bought from us, use the same Customer Card number as their Vendor number.
- If a customer is selling items to us, use the same Vendor Card number as their Customer number.
- The aim is one number for one person across both records.
- [TODO: confirm how to set the number on the Vendor Card, since DOM-VEND may assign its own.]

## Customers selling to us
- Complete the identity and AML checks first ([[kyc-aml]], [[buyback-paperwork-and-testing]]).
- Test the item before you agree a price ([[buyback-paperwork-and-testing#testing]]).

## Related
- [[bc-purchase-orders]]
- [[bc-new-customer]]
- [[bc-quick-start]]
