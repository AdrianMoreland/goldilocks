---
slug: readme
title: Knowledge Center — How SOPs are written
category: meta
jurisdiction: all
owner: Merrion Gold
status: approved
version: 3
updatedAt: 2026-09-30
---

## Purpose
This folder holds the Standard Operating Procedures (SOPs) for the desk. Each file is one SOP and is imported into the Goldilocks Knowledge Center. The AI assistant answers only from approved SOPs.

## File format
- One Markdown file per SOP, named `NN-slug.md`.
- YAML frontmatter:
  - `slug`: unique, lowercase, hyphenated. Never change it after approval, because links depend on it.
  - `title`
  - `category`: one of the categories below.
  - `jurisdiction`: `all`, `IE`, `UK` or `ES`. Current SOPs are `IE` unless stated, because only Ireland uses BC.
  - `owner`: a person or role.
  - `status`: `draft`, `approved` or `retired`.
  - `version`: integer, bumped on every approved change.
  - `updatedAt`: ISO date.

## Sections
- Each `##` heading is a section and becomes a citation anchor. The anchor is the heading in lowercase with hyphens, e.g. `## Identity check` becomes `#identity-check`.
- One topic per section, with short numbered steps.
- Name the exact system and screen, e.g. "BC → Sales Quotes → New".
- Write numbers and thresholds out in full. Never write "the usual limit".
- No content that exists only as a screenshot.

## Jurisdiction-specific rules
Where Ireland and the UK differ (VAT, AML, ID), use one section per jurisdiction, e.g. `## VAT — Ireland` and `## VAT — UK`. Never mix two jurisdictions in one section.

## Links
- Link to another SOP with `[[slug]]`, or to a section with `[[slug#section]]`.
- The importer rewrites these links to `/knowledge/articles/slug#section`.
- A link to a slug that doesn't exist fails the import.

## Unconfirmed facts
- `[TODO: …]` marks a fact that must be confirmed before approval.
- The importer flags every section that contains a TODO. The AI assistant never answers from a flagged section. Instead it says the procedure is not confirmed and names the SOP owner.

## Proposed controls
Sections titled `Proposed controls (not yet in force)` describe controls that are not current practice. The AI assistant must present them as proposals only.

## Status
- `draft`: visible in the Knowledge Center with a "Not yet approved" banner. Not used by the AI assistant.
- `approved`: visible and used by the AI assistant.
- `retired`: hidden from staff, kept for audit.

## Personal and sensitive data
- No customer personal data in any SOP.
- No passwords, safe codes, account numbers or supplier logins.

## Categories
- `sales`: inquiries, quotes, pricing, customer conversations
- `trading`: payment, price lock, hedging, cancellations
- `operations`: stock, fulfilment, collection, buyback, delivery
- `compliance`: KYC, AML, ID checks
- `storage`: bonded silver
- `systems`: which system is used for what
- `directory`: branches and contacts (live data comes from the Branch and Contact tables)
- `meta`: this file and the glossary

## Approval checklist
1. Resolve every `[TODO]`.
2. The owner reviews the SOP.
3. A manager approves it. Set `status: approved` and bump `version`.
4. Review every 6 months, or sooner when a process or system changes.
