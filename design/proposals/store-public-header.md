# Proposal: components/public-header and components/public-footer

**What:** the site header (logo, Buy, Sell, Prices, Storage, Learn, Branches, phone and WhatsApp, cart with item count) with the live price ticker above it, and the footer (About, Contact, FAQ, legal, company number and LEI, ratings, hours of the nearest branch, a single Merrion Vaults link).
**Used in:** every public page.
**Variants:** header `viewport` = desktop, phone (menu collapses into a sheet); `cart` = empty, with items.
**Library parts:** `components/logo`, `molecules/button`, `molecules/navigation-menu`, `molecules/sheet`.
**Not reusable:** `components/site-header` is the staff header (sidebar trigger, search, user menu); the public header is a separate component.
**Tokens it needs that do not exist:** none.
**Open:** the phone number shown per branch (see the sitemap open items).
