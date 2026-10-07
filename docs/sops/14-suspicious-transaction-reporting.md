---
slug: suspicious-transaction-reporting
title: Suspicious transaction reporting (STR)
category: compliance
jurisdiction: IE
owner: Merrion Gold
status: approved
version: 2
updatedAt: 2026-10-07
---

## Purpose
Report anything that may be money laundering or terrorist financing, quickly and without tipping off the customer.
Sources: AML Policy (Dec 2022); Revenue STR guidance (online filing from 7 September 2020); Garda FIU goAML guides.

## What staff do
1. If you know or suspect money laundering or terrorist financing, tell the MLRO immediately.
2. Do not tell the customer. Do not refuse or delay in a way that alerts them unless the MLRO says so.
3. Complete the transaction record and write down what made you suspicious ([[cash-transactions-ie#the-cash-transaction-record]]).
4. Never put yourself in danger.
5. Failure to report is a criminal offence.

## Red flags
- Customer wants to avoid face-to-face contact, or uses a third party or intermediary.
- Cash that is banded, wet, discoloured or in unusual denominations.
- No explanation of the source of funds, or documents that do not match the explanation.
- Payment from someone other than the customer.
- Reluctance to give ID, or documents that look altered.
- Splitting purchases to stay under €10,000.
- Metal sold to us with no proof of ownership, or a story that does not fit.
- Complex or unusual transactions with no clear purpose.

## What the MLRO does
1. Reviews the facts and decides whether to report.
2. If reporting, submits the STR to both the Garda Financial Intelligence Unit (FIU) through goAML and to Revenue through ROS (Revenue Online Service). Both are required.
3. Records the decision, including the reason when no report is made.
4. Records the report reference on the cash transaction record.

## How an STR is filed
1. goAML (FIU): the MLRO files the report on goAML. goAML reports are electronic only.
2. Revenue: since 7 September 2020 STRs go to Revenue online only through ROS. Do not post paper copies. The older goAML 2017 pack that mentions a posted copy is out of date.
3. In ROS: Manage Reporting Obligations, then Complete a Form Online, then STR. Use the web form or upload an XML file.
4. The XML must contain an entity reference of up to 255 characters, or Revenue rejects it.
5. Keep the Revenue acknowledgement and the goAML reference.

## Set-up needed
- A ROS login and digital certificate. The ROS Administrator creates a sub-user certificate for the MLRO and grants the permission to file STRs. The main administrator certificate cannot file STRs unless it is also the MLRO's.
- A goAML registration for Merrion Gold with the MLRO as a user, and the FIU notification email whitelisted.
- [TODO: confirm Merrion Gold is registered on goAML and on ROS for STRs, who holds the certificates, and where STR records are kept.]

## Related
- [[kyc-aml]]
- [[cash-transactions-ie]]
- [[aml-governance-and-training]]
