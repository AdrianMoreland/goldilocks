---
slug: stock-management
title: Stock management and the monthly stock cycle
category: operations
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 4
updatedAt: 2026-10-07
---

## Purpose
Keep an accurate record of physical stock and what needs reordering.

## Monthly stock take
1. Once a month, two people count what is physically in the safe together.
2. Business Central (BC) shows the calculated amounts for each product.
3. Compare the count with BC, product by product.
4. If the count and BC differ, report each difference to a manager before the month is closed.

## Customer safe (CST Safe)
- When an invoiced order is fulfilled from stock, bag the items and place them in the customer safe until collection ([[customer-collection]]).
- Bagged items are not available for sale.

## Supplier orders
When an item is not in stock, a manager orders it from the supplier. Record the shipment in BC ([[bc-purchase-orders]]).

## Proposed controls (not yet in force)
These are intended for the BC stock setup.
1. A signed-off discrepancy log for the monthly count.
2. The person who confirms goods received is not the person who placed the order.
3. Available stock is visible to brokers directly in BC.
4. Orders that span month end are carried forward explicitly.
5. A reorder log so two managers don't reorder the same shortfall.

## Related
- [[payment-lock-and-hedge]]
- [[customer-collection]]
- [[customer-buyback]]
