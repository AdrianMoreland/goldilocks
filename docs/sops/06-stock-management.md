---
slug: stock-management
title: Stock management and the monthly stock cycle
category: operations
jurisdiction: IE
owner: Adrian
status: approved
version: 3
updatedAt: 2026-09-30
---

## Purpose
Keep an accurate record of physical stock and what needs reordering.

## Transition to BC
- Stock will move to Business Central (BC), but BC stock views are not set up yet.
- Until they are, use the monthly trade sheet "Stock - IE" as described below. This SOP will be rewritten when BC stock goes live.
- The Raw GP purchase inventory sheet is no longer used. Record purchases in BC ([[customer-buyback]]).

## The stock sheet
"Stock - IE" covers all Irish branches and Spain. Spain's stock is managed by the Spanish branch and is outside this SOP.

| Column | Meaning |
|---|---|
| Product | Product name |
| Start | Opening stock for the month |
| Sold | Units sold this month |
| CST Safe | Units bagged for customers, awaiting collection |
| Bought | Units bought back from customers |
| Ordered | Units ordered from suppliers |
| NET | True stock position; can be negative |
| Final | Stock at month end: NET, confirmed by the physical count |
| Branch columns | Stock per branch |

## Available vs NET
- **Available** is what brokers use. It never goes below zero and shows what can physically be sold from the safe.
- **NET** is what managers use. It can go negative. A negative NET is the quantity that must be reordered.

## Monthly cycle
1. At month end, two people count the safe together.
2. Compare the count with NET. They should match; this becomes the **Final** figure.
3. If the count and NET differ, report the difference to a manager before closing the month.
4. At month start, copy last month's **Final** into **Start**.
5. **Start** is the only column entered by hand. All other figures come from the month's trades.

## Customer safe (CST Safe)
- When an invoiced order is fulfilled from stock, bag the items and place them in the customer safe until collection ([[customer-collection]]).
- Bagged items are not available for sale.
- CST Safe is tracked on the stock sheet until BC stock is set up.

## Supplier orders
When stock is short, order from the supplier and record the shipment in BC.

## Proposed controls (not yet in force)
These are intended for the BC stock setup.
1. A signed-off discrepancy log for the monthly count.
2. The person who confirms goods received is not the person who placed the order.
3. Customer safe stock is calculated automatically from order statuses instead of typed in.
4. Available stock is visible to brokers directly in BC.
5. Orders that span month end are carried forward explicitly.
6. A reorder log so two managers don't reorder the same shortfall.

## Related
- [[payment-lock-and-hedge]]
- [[customer-collection]]
- [[customer-buyback]]
