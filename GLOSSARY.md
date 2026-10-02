# Glossary

Pricing language for the Merrion Gold pricing workbook. All terms are from the **dealer's** point of view.

## Prices

**Live spot**
The current market price of a metal per troy ounce, as reported by the price feed. Never edited by anyone.

**Card spot**
The spot a metal's card shows and the product table quotes from. It is the live spot unless the user has frozen or overridden it.
_Avoid_: "main spot", "display price"

**Frozen spot**
A Card spot the user has pinned to a value of their choosing. The card is marked Frozen and the table quotes from it until the user resumes live.
_Avoid_: "paused", "custom price" (on the card)

**Tool spot**
The spot used by a single side-panel tool (Trade, Melt, Portfolio). It follows the Card spot until the user edits it; from then on it is held by the tool and changing it never affects the card, the table, or any other tool. Resetting the tool returns it to following the Card spot. It lasts while the panel is open and is lost on reload. Ctrl+Z does not affect it.
_Avoid_: "custom spot" (ambiguous with Frozen spot)

**Stale spot**
A live spot whose market snapshot is older than the freshness limit, so prices may be out of date.

**Sell price**
What a customer pays us for a product: spot adjusted by a premium. Rounded up to the whole euro.

**Buyback price**
What we pay a customer for a product: spot adjusted by a discount. Rounded down to the whole euro.
_Avoid_: "buying/selling" without saying whose side

**Premium**
The percentage added over spot on a Sell price.

**Discount**
The percentage taken off spot on a Buyback price.

**Unit price**
A derived reference figure such as price per gram. Shown to cent precision and never rounded to the euro, because it is not an offered price.

## Market

**Market mode**
A company-wide condition set by a manager (Standard, Volatile, Weekend, Metal Shortage) that adjusts premiums and discounts. Standard is the normal state. It applies to every user at once.
