# Proposal: blocks/product-card

**What:** one product in the public store: image, availability badge, name, weight and purity line, indicative sell price with price per gram, quantity stepper, Add to cart, Details link.
**Used in:** `/buy` (grid view), search landing pages, related products on a product page. List view uses `blocks/product-row` (same data, one row).
**Variants:** `stock` = in-stock, supplier-order, unavailable (unavailable disables quantity and Add to cart); `price` = live, stale (stale hides the price and says why).
**Library parts it is made of:** `molecules/badge`, `molecules/button` (default, outline icon, link), tokens `card`, `border`, `muted`, `price-text`, `muted-foreground`, radius `xl`, shadow `sm`.
**Tokens it needs that do not exist:** none. The image area uses `muted` until real photography exists.
**Open:** quantity maximum per product; whether the volume-tier line ("5+ saves €12 each") shows on the card or only in the Details panel.
