# Proposal: blocks/store-filters

**What:** the filter panel for the store: metal (checkboxes), type (coins, bars), weight range, price range (slider with min and max), mint or refinery, availability, collect-from branch, Clear all. Active filters also show as removable chips above the results.
**Used in:** `/buy` (left column on desktop, a bottom sheet opened by a "Filters" button on a phone).
**Variants:** `layout` = column, sheet. A top-toolbar form (direction B) uses button toggles instead of checkboxes and is a second variant, `toolbar`.
**Library parts:** `molecules/checkbox`, `molecules/slider`, `molecules/select`, `molecules/separator`, `molecules/button`, `molecules/sheet` for the phone form.
**Tokens it needs that do not exist:** none.
**Gap in an existing component:** `molecules/slider` is single-thumb; a price range needs two thumbs (min and max).
