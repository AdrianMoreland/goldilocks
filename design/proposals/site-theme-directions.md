# Public site theme

**Decision (2026-10-06): direction A, Heritage Vault, with the store layout in `design/specs/store-a.json`.** B and C are kept below for reference only.

The staff app's tokens (`DESIGN.md`) are the library. The public site shares its components through `packages/ui` but owns its theme through CSS variables (ADR 0002), so the look is a token set, not new components. Each direction below is a candidate set. The three store specs (`design/specs/store-a|b|c.json`) show the layout that goes with each; they are built from today's tokens and take on a theme once one is chosen. Imagery and mood are drawn in Figma by hand; they are described here only so a choice can be made.

All colours below are proposals for the site theme only; none changes the staff app. "Gold text" is the darker gold used when gold must be readable as text.

## A. Heritage Vault (closest to the current brand)

| Role | Value |
|---|---|
| Ink (text, header, primary button) | `#141210` |
| Ivory (page) | `#FAF7F2` |
| Vault gold (accent, rules, logo ring) | `#B8893F` |
| Gold text | `#8F6A2E` |
| Stone (secondary text) | `#6B6358` |
| Hairline (borders) | `#E4DCCD` |

Type: headings Playfair Display SemiBold; body and interface Inter; prices Inter SemiBold with tabular numerals (Playfair's numerals are old-style). Radius 2 px; no shadows, hairline borders; slow fades. Imagery: macro photography of bars and coins on black with warm side light; the real vault interiors.
Layout: store direction A (hero band, side filters, 3-column grid).

## B. Modern Bullion (closest to the staff app)

| Role | Value |
|---|---|
| Graphite (text, header) | `#0E1116` |
| Mist (page) | `#F4F5F7` |
| Bullion gold (primary action) | `#D4A017` |
| Gold text | `#8A6508` |
| Slate (secondary text) | `#4B5565` |
| Line (borders) | `#E1E4EA` |

Type: Manrope Bold headings and prices; Inter body. Radius 10 px; soft shadows on cards only; 150 ms motion, price changes fade and never flash. Gold is used only for the one main action in a view. Imagery: clean studio shots on light grey, same angle for every item.
Layout: store direction B (top filters, dense list, price per gram column).

## C. Warm Ledger (most approachable)

| Role | Value |
|---|---|
| Navy (text, header, primary button) | `#14233B` |
| Cream (page) | `#F5EFE3` |
| Ledger gold (accent) | `#B08A3E` |
| Brass (gold text) | `#7E5B14` |
| Slate (secondary text) | `#5A6475` |
| Parchment (borders) | `#DDD2BF` |

Type: Fraunces SemiBold headings; Source Sans 3 body and prices. Radius 8 px; light, paper-like shadows. Imagery: real people, branches and hands holding product; no stock photography.
Layout: store direction C (metal choices first, 4-column grid).

## Checks before choosing

1. Contrast of every text colour on its background must reach WCAG AA (4.5:1 for body text); gold text values above are chosen for that, verify when the theme is built.
2. Prices stay in a lining, tabular numeral font in every direction.
3. The choice decides one token file for `apps/site`; the staff theme in `DESIGN.md` is untouched.
