# SOP drafts — review guide

Drafted 2026-10-07 from the uploaded company documents. Nothing here is in the app. `docs/sops/` and all code are untouched. Every file in this folder is `status: draft`, version 1, and follows the format in `docs/sops/00-README.md`. All `[[links]]` were checked and resolve against `docs/sops/` and this folder.

Each `[TODO: ...]` is a fact that could not be confirmed from the documents. Per the README, the AI assistant will not answer from a section that contains a TODO. Resolve them before approving.

## 1. The 30 proposed SOPs (21 general + 9 Business Central how-tos)

| File | Slug | Source documents |
|---|---|---|
| 12 | kyc-aml | AML Policy Dec 2022, KYC-AML Checklist. **Fills a gap: 4 existing SOPs already link to `[[kyc-aml]]` and it does not exist** |
| 13 | cash-transactions-ie | AML policy, Risk Policy 2023, 2026 cash form |
| 14 | suspicious-transaction-reporting | AML policy, Revenue and goAML guides |
| 15 | aml-governance-and-training | AML policy, Risk Policy, training forms |
| 16 | anti-bribery | Anti-Bribery Policy Nov 2023 |
| 17 | desk-security-and-dual-control | Merrion Gold Procedures |
| 18 | supplier-orders | Merrion Gold Procedures, Baird instructions |
| 19 | bc-customer-sales-workflow | Business Central Guide and workflow chart. Now a one-page overview of the sale (version 2) |
| 20 | bc-purchase-orders | Business Central Guide and workflow chart. Buying from a seller (version 2) |
| 21 | buyback-paperwork-and-testing | Procedures, Testing Receipt, Purchasing from Customers, sample emails |
| 22 | customer-email-wording | The 8 sample emails |
| 23 | merrion-vaults-storage | Vaults T&Cs, box sizes, vault letter |
| 24 | bonded-silver-zurich-terms | Loomis T&Cs, Bonded Storage Info, release order |
| 25 | confirmation-letters | Headed Paper Templates (about 30 letters grouped into 17 types) |
| 26 | customer-terms-summary | General T&Cs v1.02, FAQ |
| 27 | product-reference | FAQ, coin descriptions, cheat sheet |
| 28 | weekend-pricing | Weekend Prices Sheet |
| 29 | uk-sales-and-purchases | Shavo Services Bullion Manual 2026 (UK) |
| 30 | uk-aml-and-cash | Shavo manual, Shavo risk assessment |
| 31 | uk-delivery-and-dispatch | Shavo manual |
| 32 | es-desk-procedures | Training ESP |
| 33 | bc-quick-start | **BC how-to series.** Two flows, Zoho-to-BC translation, how to find pages, six traps |
| 34 | bc-new-customer | BC Guide appendix B (screenshots), workflow chart |
| 35 | bc-sales-quote | BC Guide appendix A |
| 36 | bc-sales-order-and-prepayment | BC Guide appendix A, workflow chart |
| 37 | bc-record-customer-payment | BC Guide section 1A (Cash Receipt Journal) |
| 38 | bc-release-and-confirm | BC Guide appendix A |
| 39 | bc-collection-and-shipment | BC Guide appendix A (collection, serials, part shipment, Ship and Invoice) |
| 40 | bc-new-vendor | BC Guide section 2A, workflow chart ("same card number" rule) |
| 41 | bc-troubleshooting-and-escalation | BC Guide controls, workflow chart "Stop and check" |

## 2. What each uploaded file was treated as

**Company procedures (turned into SOPs):** Merrion Gold Procedures; Business Central Guide; Purchasing from Customers; Selling gold; Collection Procedure; Bonded Storage Info; Shavo Services Bullion Manual 2026; Training ESP; Merrion Vaults T&Cs; Loomis Zurich T&Cs; General T&Cs; FAQs; AML Policy Dec 2022; AML Risk Policy Nov 2023; Anti-Bribery Policy Nov 2023; Shavo AML Risk Assessment; the 2026 HVGD cash form (uploaded).

**Reference or regulator material (used only to support the above, not copied):** the whole AML Procedures folder (Revenue STR, ROS and goAML guides).

**Templates, used as the basis for SOP wording:** Gold Buying and Testing Receipt; Transaction Receipt; KYC-AML Checklist; KYC Onboarding; the cash transaction forms; letter templates; Box Sizes price list; Weekend Prices Sheet.

**Samples, mined for wording only:** the 8 sample email screenshots (cash, premiums, testing, selling to us, gold quality, purchase); the customer-specific letters in Headed Paper Templates; the filled cash forms (customer data deliberately not copied); Sample Bonded Invoice.

**Not SOP material, ignored:** job vacancies, management Agenda (Jan 2023), a named employee's contract (not opened for content), Staff Training Confirmation (a signed form), MG QR code, the empty headed-paper templates, the UK refresher checklist and quiz (answers blank), Quote Guide and old percentages (kept only as a clearly marked "legacy" list).

**Superseded or misfiled:** AML policies July 2020 and Oct 2021 (older versions); Scottish Bullion Risk Policy (replaced by Shavo 2023); Proof of Source of Coins (a third-party Coinify document, crypto stopped Dec 2022); "Scottish Bullion KYC AML Policy.docx" (really a checklist); "Gold Buying&Testing Receipt" in Templates & Documents (really a funds-lodgement letter); duplicate PDFs.

**Pension file:** it is only a fee disclosure with July 2023 premiums. There is no pension purchase process in any file, so no pension SOP was written.

## 3. Conflicts with the SOPs already in the app (decide before approving)

| # | Existing SOP says | Documents say |
|---|---|---|
| 1 | `04-payment-lock-and-hedge`: card payments accepted with a 2% fee | No document mentions card payments. The UK manual says "We do not accept cards". Irish FAQ: cash and bank transfer only |
| 2 | `04`: cash fee 2% | Irish FAQ: 1% (plus 3% extra for non-euro cash). UK manual: 2% (plus 7% for EUR or USD cash) |
| 3 | `04`/`08`: buyback paid in 3 to 5 working days, up to 10, up to 15 over €50,000 | Customer emails: next business day. Spain: up to 10 working days. UK: confirm with Head Office. The 3/5/15-day timings appear nowhere |
| 4 | `03-pricing`: 23% VAT on silver, platinum, palladium | No Irish rate appears in the files. 23% appears only in the Spanish SOP, where the standard rate is believed to be 21% |
| 5 | `09-bonded-silver-storage`: fee is 0.25% of value at time of billing | Documents: 0.25% of the average value over the quarter (LBMA 12:00 fix), minimum €45 plus VAT, pro-rated by days, plus a €100 withdrawal fee |
| 6 | `09`: sell-back at bid price, VAT 23% on removal | Bid price never named. No VAT rate stated. One document says VAT applies at purchase, which contradicts "VAT-free while in bond" |
| 7 | `03`: premiums and discounts from the product table | Older guides use fixed percentages (Quote Guide, buy at 95% or 97% of spot, sell at 105 to 108%). Not copied as rules |
| 8 | `03`: scrap needs manager approval | Irish FAQ: no scrap or jewellery bought |
| 9 | `04`: extra cash checks at €10,000 or more | A sample email tells a customer no ID is needed under €10,000. Policy says "equal to or greater" in one document and "exceeding" in another |
| 10 | `07-customer-collection`: signature on tablet in BC | Documents describe a paper invoice signed in duplicate, stapled to an ID copy (Zoho era). Not copied; BC flow kept |
| 11 | `01`/`02`: orders created in Zoho are legacy | Collection Procedure, Purchasing and Selling guides are all Zoho-based. Not copied for Ireland; only the UK and Spain SOPs use Zoho |

### Business Central series — extra points
| # | Existing SOP or document says | BC documents say |
|---|---|---|
| 12 | `04` step 5: "convert the quote to an invoice in BC" | In BC the quote becomes a Sales Order and a Prepayment Invoice. The final invoice is created at Ship and Invoice |
| 13 | Prepayment value: guide says "only what the customer actually paid" | Workflow chart says "enter 100% of the order value". Same when paid in full. Which applies if the customer paid less? |
| 14 | `07-customer-collection`: mark collected in BC | The guide says "post the collection" without naming the button. The draft assumes Post → Ship and Invoice and flags it |
| 15 | Customer templates | Guide covers only DOMESTIC. BC also offers EU, ROW, UK and XI |
| 16 | New in the workflow chart | A person who is both customer and vendor should have the same number on both cards. How to set the vendor number is not explained |
| 17 | No BC steps for cancellations, refunds or reversals | The guide says stop and ask a manager. The draft says that and carries a TODO |

The BC guide's screenshot appendix was read page by page. The SOPs name the screens, buttons and fields from it, so no information exists only as a picture. The Figma visual guide pages (1 to 6) contained nothing beyond the text already used.

## 4. Facts that need a human answer

- Who is the current MLRO, and has the Cork office or a second MLRO started?
- Record retention period (no document gives one).
- The linked-transaction window for cash, and whether the threshold is ">" or ">=".
- Is Merrion Gold registered on goAML and ROS, and who holds the certificates?
- Which cash form is current and where completed forms are stored.
- PEP, sanctions and adverse-media screening tool, and EDD steps.
- Does the 2026 form need a second reviewer? In the example the preparer and approver are the same person.
- Irish buyback timing, Irish branch hours, Spain details.
- Merrion Vaults price list versus the €250-a-year quote; insurance charge; deposit.
- UK: whether Belfast follows the £8,000 rule; branch code meanings.
- Letters: who may approve and sign each type.
- BC: prepayment 100% vs amount paid; the collection posting button; spot price and Quote Valid To Date boxes on the quote; how to set a vendor number; refund and cancellation steps; when to use EU, ROW, UK and XI templates.

## 5. Deliberately left out

- Customer names, addresses, ID numbers, IBANs and bank details from forms and letters.
- Staff names, emails and extensions from the UK manual.
- The ownership letter's dates of birth and home addresses.
- Anything that existed only as a screenshot (the BC guide's screenshot appendix is covered by its text steps).

## 6. Suggested next steps

1. Review these drafts and mark which to keep.
2. Answer the section 3 and 4 items. Fold the answers in and remove the TODOs.
3. When ready, copy the approved files to `docs/sops/`, set `status` and version, and update the Knowledge Center guide flow. That step touches the app's importer and tests, so it needs its own change.
