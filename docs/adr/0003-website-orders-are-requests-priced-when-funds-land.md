---
status: accepted
---
# Website orders are requests; the price locks when funds are received

The public site's cart does not take payment. Submitting it creates an **order request** (guest details, collection branch). A colleague reviews it in a staff Orders queue and sends a **confirmed quote** by email: final items at current prices, stock availability, bank details, collection branch, estimated collection time. The price is fixed only when the customer's funds are received; if the spot has moved significantly since the quote (a percentage the manager sets), the desk phones the customer to agree a new price. Automated payment, ID verification and hedging (roadmap 2.2 to 2.6) were deferred because each needs a vendor, a legal decision or Business Central write access that are not ready, and the current process is already manual.

## Consequences

- We carry the market risk between the confirmed quote and the arrival of funds; the repricing call and the threshold limit it.
- Terms and conditions must say prices are not locked until funds are received (roadmap 2.0 legal item, extended).
- Guests need no account; ID is checked in the branch at collection, as today. Accounts and online ID verification stay in roadmap 2.2.
- Order requests live in Goldilocks, not in Business Central, until the BC write gate (2.0) is closed; the Orders queue becomes the base for the inquiry hub (roadmap 1.6) and for the later automated checkout.
- A request can be placed while the market is closed; the customer sees a warning with the next opening time and nothing is processed or priced until then. A stale spot (feed problem) disables Add to cart.
- Before sending, the customer is told they can pay by bank transfer after the quote (recommended), or by card or cash in person at the spot at that time, with a 2% handling fee on cash.
