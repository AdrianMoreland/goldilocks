# Proposal: blocks/market-closed-dialog and blocks/payment-options-dialog

Both come from the order-request flow (`docs/adr/0003-website-orders-are-requests-priced-when-funds-land.md`, `docs/site-migration/sitemap.md` section 5).

## market-closed-dialog

**What:** shown when the customer is about to send a request at the weekend or outside opening hours. Text: the market is closed, so the order will not be processed, priced or locked until `dd/mm/yyyy hh:mm` (next opening of the chosen branch, Irish time). Actions: Cancel, Send request anyway.
**Variants:** none; the date is text.
**Library parts:** `molecules/dialog`, `molecules/button`; a warning icon.
**Tokens (approved 2026-10-06):** add `warning` and `warning-text` roles. A warning colour does not exist in the library (it has `destructive`, `price`, `buyback`). Propose `warning` and `warning-text` roles in `DESIGN.md` for amber states (this dialog, the stale-price notice on the public site), or reuse `market-mode-banner`'s existing colours if the staff banner already has an amber.

## payment-options-dialog

**What:** shown when the customer presses Place order request. Tells them: they pay after receiving the confirmed quote; bank transfer is recommended (pay when the price suits them, collect when ready); or pay by card or cash in person at the office at the spot at that time, subject to availability; cash carries a 2% handling fee. A required checkbox "I understand" enables Send request.
**Library parts:** `molecules/dialog`, `molecules/checkbox`, `molecules/button`, `molecules/separator`.
**Tokens:** none.
**Open:** whether the 2% applies to the whole order or only the cash part; wording to be approved by the owners.
