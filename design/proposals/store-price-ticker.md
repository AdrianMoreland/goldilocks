# Proposal: blocks/price-ticker

**What:** a one-line strip with live gold, silver, platinum and palladium prices in euro and the day change, each linking to its price page.
**Used in:** top of every public page.
**Variants:** `state` = live, stale (shows "prices delayed" instead of numbers when the feed is stale); `viewport` = desktop, phone (two metals visible, the rest scroll).
**Library parts:** tokens `foreground` as the strip fill, `background` text, `price-text` and `destructive` for the change; reuses the freshness rule from `blocks/freshness-indicator`.
**Tokens it needs that do not exist:** none.
