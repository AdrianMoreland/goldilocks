---
slug: bc-collection-and-shipment
title: Business Central — collection, serial numbers, part shipment and final posting
category: systems
jurisdiction: IE
owner: Adrian
status: draft
version: 1
updatedAt: 2026-10-07
---

## Purpose
Hand the goods over and post the order so the stock leaves inventory. Stock leaves BC only at the final Ship and Invoice posting.

## Find the customer's order
1. Quickest: magnifier → type Orders Awaiting Collection → open it. This page lists orders and shows the remaining amount owing, so you do not have to check lines.
2. Alternative: Sales Orders list → search the customer's name. The list has views: All, Shipped Not Invoiced, Open Sales Orders, Ready to Ship.

## Branch collection
1. Open the customer's order.
2. Check any balance still owing. Do not hand over goods until it is paid ([[payment-lock-and-hedge#confirming-funds]]).
3. Do the ID, signature and serial process at the desk ([[customer-collection]]).
4. Make sure each bar has its serial number entered (see below).
5. Post the order (see [[bc-collection-and-shipment#final-posting]]).
6. Mark the order collected and update CST Safe ([[stock-management#customer-safe-cst-safe]]).
7. [TODO: the guide says "post the collection" without naming the button. Confirm it is also Post → Ship and Invoice.]

## Serial numbers for bars
Bars need serial numbers before they can be posted. If you try to post without them BC shows an error.
1. Click the order line that needs serials.
2. Select Line → Related Information → Item Tracking Lines.
3. In the Serial No. field, enter the serial number of one bar.
4. Quantity (Base) must be 1.
5. Add one line per bar. A new row is added for each serial.
6. Check each serial against the physical bar and the invoice.
7. Close the window.

Right: 3 bars means 3 lines, each with Quantity (Base) 1. Wrong: one line with Quantity 3. Two of the bars would have no serial.

## Part shipment
1. On the Sales Order lines, change Qty. to Ship to the amount being shipped now.
2. The rest remains on the order for later.

## Final posting
1. On the order, select Post.
2. In the box that opens, choose Ship and Invoice. The box also offers Ship on its own and Invoice on its own. Do not use those.
3. Select OK. This removes the stock from BC and closes the transaction.

## Related
- [[bc-release-and-confirm]]
- [[customer-collection]]
- [[stock-management]]
