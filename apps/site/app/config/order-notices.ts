// The wording of the order-request notices (docs/adr/0003-website-orders-are-requests-priced-when-funds-land.md).
// To be approved by the owners before launch; keep each statement here so it is edited in one place.
export const CASH_HANDLING_FEE_PERCENT = 2;

export const PRICE_NOTICE = "Prices are indicative and not locked until funds are received.";

export const PAYMENT_OPTIONS = {
  afterQuote: "You pay after you receive our confirmed quote.",
  bankTransfer:
    "Bank transfer is the option we recommend: you can pay when the price suits you, then collect when your order is ready.",
  inPerson:
    "Or pay by card or cash in person at the office. The price is then the spot price at that time, subject to the item being available.",
  cashFee: `Cash payments carry a ${CASH_HANDLING_FEE_PERCENT}% handling fee.`,
} as const;
