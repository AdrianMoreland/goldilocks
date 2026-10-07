---
slug: bc-purchase-orders
title: Business Central — buying from a seller (Purchase Order)
category: systems
jurisdiction: IE
owner: Adrian
status: draft
version: 2
updatedAt: 2026-10-07
---

## Purpose
Record a purchase from a supplier, or from a customer selling to us, in Business Central (BC), with bar serial numbers, until the goods are received into stock.
Sources: Business Central Guide, Branch Staff Workflow chart.

## Who does what
- Branch staff create the Purchase Order (PO), enter serials, print it and receive the goods.
- Accounts pay the seller. This is not a branch step. Do not wait on it to enter the serials, but do not receive the goods against a PO until the goods and serials are checked.

## Rules
- Check vendor, item, quantity and agreed cost before you produce the PO.
- If the goods received differ from the PO, do not post. Escalate to a manager ([[bc-troubleshooting-and-escalation#when-to-stop]]).
- For amendments, cancellations or corrections, stop and ask a manager.

## Steps
1. Find or create the vendor ([[bc-new-vendor]]).
2. Magnifier at the top right → Purchase Orders → New. Select the vendor.
3. On Lines, select the bullion item.
4. Enter the quantity, the direct unit cost and the required location.
5. For bars, enter the serials once the bars have been delivered (see below).
6. Check the total against the price agreed with the seller.
7. Use Print/Send to preview or produce the Merrion Gold Purchase Order. It carries the transaction details and the seller and staff signature areas. The seller signs one copy and we keep it.
8. Accounts pay the Purchase Order.
9. When the goods and serials are checked, go to Home → Post, then select Receive and Invoice. This puts the stock into inventory.
10. If an error screen appears, a required field is missing. Read it, complete the field and try again.

## Serial numbers for bars
1. Before receiving the bars into stock, select the product line, then Line → Item Tracking Lines.
2. Enter each bar's serial number in Serial No. One line per bar.
3. Complete one product line before starting the next.
4. Check each serial exactly matches the physical bar and the delivery docket ([[desk-security-and-dual-control#deliveries-in]]).

## Customer selling to us
- Complete ID and AML checks, test the item and agree a price first ([[buyback-paperwork-and-testing]]).
- Create them as a vendor with the same number as their customer record ([[bc-new-vendor#same-number-for-customer-and-vendor]]).
- The customer is paid by bank transfer through Accounts ([[customer-buyback#paying-the-customer]]).

## Related
- [[bc-new-vendor]]
- [[bc-quick-start]]
- [[supplier-orders]]
- [[stock-management]]
