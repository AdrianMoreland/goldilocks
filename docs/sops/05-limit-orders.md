---
slug: limit-orders
title: Limit orders
category: trading
jurisdiction: IE
owner: Adrian
status: draft
version: 2
updatedAt: 2026-09-30
---

## Purpose
Let a customer buy or sell at a target price instead of the current price.

## Rules
- Customers can place limit orders to buy or to sell.
- A buy limit order goes live only once the customer's funds have landed ([[payment-lock-and-hedge#confirming-funds]]).
- A limit order stays open until it is cancelled. There is no expiry date.
- Limit orders are placed on the StoneX or CoinInvest platform. Only managers place, monitor and cancel them.

## Placing a buy limit order
1. Agree the product, quantity and target price with the customer.
2. Explain the rules to the customer (see [[limit-orders#customer-communication]]).
3. Take payment. [TODO: amount required before the order goes live: full amount at target price, at current price, or a deposit]
4. Once funds have landed, give the order details to a manager.
5. The manager places the order on StoneX or CoinInvest.

## Placing a sell limit order
1. Agree the product, quantity and target price with the customer.
2. Explain the rules to the customer.
3. [TODO: what is required before a sell limit order goes live, e.g. the items held by us]
4. Give the order details to a manager, who places it on the platform.

## When the target is hit
- Buy: the manager confirms execution. Continue from step 5 of [[payment-lock-and-hedge#steps]]: invoice in BC, fulfilment, and tell the customer.
- Sell: the manager confirms execution. Complete the purchase following [[customer-buyback]].

## Cancelling
1. The customer asks their broker to cancel.
2. The broker asks a manager, who cancels the order on the platform.
3. Refund the customer's funds in full.

## Customer communication
- The order stays open until the customer cancels it.
- [TODO: whether execution is guaranteed if the price only touches the target briefly. Confirm with a manager.]

## Related
- [[payment-lock-and-hedge]]
- [[customer-buyback]]
