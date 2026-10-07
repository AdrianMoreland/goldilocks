# SOP drafts — rollout notes

Updated 2026-10-07. The Ireland drafts (SOPs 12 to 17, 19 to 24, 26, 27 and 33 to 41) were reviewed with the owner and moved to `docs/sops/` as `status: draft`. They are visible in the Knowledge Center with the "Not yet approved" banner and are not used by the AI assistant until a manager approves them. This folder keeps the guide and the SOPs set aside for later.

## Set aside until other branches join the app
| File | Why |
|---|---|
| 28-weekend-pricing | Market modes (Weekend, Volatile, Shortage) are not part of the knowledge base |
| 29-uk-sales-and-purchases, 30-uk-aml-and-cash, 31-uk-delivery-and-dispatch | UK content; the app is Ireland-only for now |
| 32-es-desk-procedures | Spain content; same reason |
| 18-supplier-orders | Staff do not need supplier or hedging detail; SOPs say only that a manager orders stock and hedges after funds arrive |
| 25-confirmation-letters | Removed from the knowledge base by the owner (letters, ownership wording and fix times) |

SOP 05 (limit orders) is set to `retired`, so it is hidden from staff, and every link to it was removed.

## Decisions taken (2026-10-07)
| Topic | Decision | Applied in |
|---|---|---|
| Card payments | Accepted, 2% handling fee, same as cash | 26, 25 (live 04 unchanged) |
| Cash handling fee | 2% | 26 (live 04 unchanged) |
| Buyback payment timing | Up to 10 working days, sometimes sooner; up to 15 working days for larger payments | live 08 (version 4), 21, 22 |
| Cash threshold | €10,000 or more; linked payments counted over 12 months | 13 |
| Irish VAT | 23% on silver, platinum, palladium; investment gold exempt | live 03 unchanged |
| Scrap | Damaged bullion coins and bars, with manager approval. No jewellery | live 03 (version 4), 21 |
| Bonded silver fee | 1% a year, billed quarterly (0.25% a quarter) plus 23% VAT; part quarters counted as actual days over 365; no €45 minimum, no €100 withdrawal fee | 24 |
| Bonded silver VAT | VAT-free in bond; 23% on removal | 24 |
| Bonded silver sell-back | Bid price from the product table | 24 |
| People in SOPs | Roles only (MLRO, Head of Trading), no names | 14, 15 |
| KYC pack | Only for cash of €10,000 or more. Buybacks need photo ID only | 12 |
| Proof of address | Dated within the last 3 months | 12 |
| Customer emails | Never say no ID is needed under €10,000 | 22 |
| Weekend, Volatile and Shortage modes | Removed from the SOPs and from the Knowledge Center term list | live 03, `kb-terms.ts`, `kb-guide.ts` |
| Delivery | Collection only | 26 |
| Merrion Vaults | No prices, insurance charge or deposit in the SOP; ask a manager | 23 |
| Letters | No opening hours in letters | 25 |
| BC prepayment | Enter 100 in the Prepayment field even for a part payment; the exact amount goes in the Cash Receipt Journal | 19, 33, 36, 41 |
| BC collection | Posting a collection is Post → Ship and Invoice | 39 |
| BC quote | Leave the spot price boxes and Quote Valid To Date blank | 35 |
| BC customer template | DOMESTIC only for now | 34 |

## Second round (2026-10-07)
| Topic | Decision |
|---|---|
| Owner | Every SOP is owned by "Merrion Gold" (no personal names) |
| Buybacks | "Authentication" is now "Testing" everywhere and includes checking the item's condition, which decides the price. Only photo ID is checked for a buyback; no AML pack |
| Stock | No stock sheet and no "Stock - IE". Monthly stock take: count what is there, compare with the amounts BC calculates, report differences. More detail to come |
| Raw GP sheet | Not mentioned anywhere |
| Pricing | Removed the bar/wafer purity and coin legal-tender rules from the investment gold definition |
| Hedging | Staff message a manager after funds land; managers hedge. No platform names |
| Branches | Directory lists Irish branches only |
| Transaction reference | Bags carry the transaction reference code (for example DU-G202610823) |
| Refineries | Generally LBMA-approved products; some other items are bought (Austrian shillings, Swiss francs); no jewellery |
| Bonded silver | Fee on the value at the time of billing; sell-back paid like any buyback |
| Order of quick links | "Is gold going up?" moved to the end of the Knowledge Center quick links |

## Still open (each is a `[TODO]`; its section stays out of the assistant's answers)
- 12: PEP, sanctions and adverse-media tool; enhanced-due-diligence cases and steps; record retention period.
- 13: who approves the cash form; whether the 2026 form is the only current one and where completed forms are kept.
- 14: goAML and ROS registration, certificate holders, where STR records are kept.
- 15: the "October 2022" policy reference; which AML policy version is current.
- 24: Loomis release order signer and lead time.
- 40: how to set the number on the Vendor Card.
- 11: Cork and Blanchardstown address, phone and hours; escalation contacts for compliance and IT.

Cancellation and refund steps in BC are not written: the SOP says stop and ask a manager.

## Left out on purpose
- Customer names, addresses, ID numbers, IBANs and bank details from forms and letters.
- Staff names, emails and extensions.
- The ownership letter's dates of birth and home addresses.
- Anything that existed only as a screenshot.

## Next steps
1. Close the open items above, one SOP at a time.
2. Owner reviews, a manager approves: set `status: approved` and bump `version`.
3. Import: `pnpm --filter api kb:import` (dry run first with `--dry-run`). The import writes to the shared live database, so it needs approval each time.
