# SOP drafts — rollout notes

Updated 2026-10-07. The Ireland drafts (SOPs 12 to 27 and 33 to 41) were reviewed with the owner and moved to `docs/sops/` as `status: draft`. They are visible in the Knowledge Center with the "Not yet approved" banner and are not used by the AI assistant until a manager approves them. This folder keeps the guide and the SOPs set aside for later.

## Set aside until other branches join the app
| File | Why |
|---|---|
| 28-weekend-pricing | Market modes (Weekend, Volatile, Shortage) are not part of the knowledge base |
| 29-uk-sales-and-purchases, 30-uk-aml-and-cash, 31-uk-delivery-and-dispatch | UK content; the app is Ireland-only for now |
| 32-es-desk-procedures | Spain content; same reason |

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

## Still open (each is a `[TODO]`; its section stays out of the assistant's answers)
- 12: PEP, sanctions and adverse-media tool; the full list of enhanced-due-diligence cases and steps; record retention period.
- 13: who approves the cash form; whether the 2026 form is the only current one and where completed forms are kept.
- 14: goAML and ROS registration, certificate holders, where STR records are kept.
- 15: cash share of turnover; the "October 2022" policy reference; which AML policy version is current.
- 16: whether the Nov 2023 policy meant to drop the disciplinary and whistleblowing section.
- 17: the customer reference number format and whether BC numbers replaced it.
- 18: whether the supplier ordering steps match how managers order now; Baird cut-offs and accounts; who sends payment instructions.
- 21: whether the LBMA-refinery restriction applies to buybacks.
- 24: the value used for the bonded storage fee; Loomis release order signer and lead time; sell-back payment days.
- 25: who may sign each letter type; the balance sheet wording; LBMA fix times; who may receive the ownership letter.
- 27: the training cheat sheet's rare-year lists and Panda weight notes.
- 40: how to set the number on the Vendor Card.

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
