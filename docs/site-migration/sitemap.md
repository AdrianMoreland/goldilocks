# Site map for the new public site

Draft 2, 2026-10-06 (replaces draft 1: `/buy` is now the store, with cart and order requests). Built from `current-site-audit.md` and the owners' answers in its section 7.3. English only at launch; Spanish later under a `/es/` prefix. Old URLs and what happens to them: `redirect-map.csv`.

Order flow decisions: `docs/adr/0003-website-orders-are-requests-priced-when-funds-land.md`; terms in `GLOSSARY.md` (Order request, Indicative price, Confirmed quote, Price lock, Repricing call).

## 1. Principles

1. **The store is one page.** `/buy` shows the whole catalogue with live prices. Filtering and sorting change the list in place; the visitor never goes back a level to switch between coins and bars.
2. **Keep a URL when its page survives.** 16 of the 24 old pages keep their address, 7 are redirected, 1 (news) is undecided, and all 54 product URLs (`/products/{slug}/`) stay as they are.
3. **One name per thing.** Buy, Sell, Prices, Storage, Learn, Branches, Cart.
4. **Every page has one job and one action.**
5. **A fact lives in one place.** Hours, phone numbers, payment methods, seller payment time, the guaranteed buyback, VAT-free silver terms, the "prices not locked" notice: content files shown wherever needed.
6. **Merrion Vaults: one mention per page at most**, on Home, Storage, branch pages, product pages and the footer. None on store, price, tool or legal pages.
7. **Euro first.**

## 2. Navigation

**Header:** logo · Buy · Sell · Prices and tools · Storage · Learn · Branches · phone and WhatsApp · **Cart (item count)** · live ticker bar above (gold, silver, platinum, palladium).
**Footer:** About, Press, Contact, FAQ, Merrion Vaults (external), Terms, Privacy, Cookies; company name, number and LEI; Trustpilot and Google ratings; opening hours of the nearest branch.
**Chat:** a floating button that never opens by itself and never covers page text on a phone.

## 3. URL tree

```
/                                         Home
/buy/                                     THE STORE: whole catalogue, filters, sort, add to cart
  /buy/gold/  /buy/gold/bars/  /buy/gold/coins/
  /buy/silver/  (+ /bars/ /coins/)
  /buy/platinum-palladium/  (+ /bars/ /coins/)
  /buy/copper/  (+ /bars/)                Same store, filter preset (search landing pages)
/products/{slug}/                         54 product pages (URLs kept); also opens as a side panel in the store
/cart/                                    Cart: items, quantities, indicative totals
/checkout/                                Details, collection branch, notice, "Place order request"
/checkout/sent/                           Confirmation (noindex)
/vat-free-silver/                         VAT-free silver
/how-to-buy/                              How buying works (cart, order request, confirmed quote, payment, collection)
/sell-gold/                               Sell gold, silver, platinum, palladium
/prices/                                  Live prices, all metals, chart
  /prices/gold/ /silver/ /platinum/ /palladium/
/tools/                                   Calculators hub
  /tools/buy-by-budget/  /tools/vat-and-cgt/  /tools/converter/
/safe-deposit-box/                        Storage (Merrion Vaults, link out)
/learn/                                   Learn hub
  /learn/why-buy-gold/  /learn/coins-or-bars/  /learn/vat-and-cgt-explained/  /learn/understanding-the-spot-price/
/faq/                                     FAQ grouped by topic
/locations/                               All branches
  /locations/dublin-burlington-road/  /locations/dublin-blanchardstown/  /locations/cork/
  /locations/{uk-branch}/  /locations/{spain-branch}/      names and addresses open
/about/  /about/press/  /about/security-and-trust/
/contact/                                 Contact routes and form (also for large or special orders)
/terms-and-conditions/  /privacy-policy/  /cookie-policy/
/404, /sitemap.xml, /robots.txt
```

About 45 pages plus 54 products. `/quote/` from draft 1 is dropped: the cart replaces it for catalogue items, `/contact/` handles the rest. News and blog stay deferred.

## 4. The store (`/buy`)

**Layout:** filter panel on the left (a slide-in sheet on phones), results on the right, sort and view toggle above the results, mini-cart in the header.

**Filters:** metal (gold, silver, platinum, palladium, copper) · type (bars, coins) · weight range · price range (€) · mint or refinery · availability (in stock, supplier order) · branch (collect from). Active filters shown as removable chips; one "clear all".

**Sort:** price low to high, high to low, **price per gram** (the figure bullion buyers compare), weight, name. The order is fixed when the visitor chooses it; live price ticks update the numbers but never reshuffle the list.

**Each product card:** image, name, weight and purity, **sell price (indicative)**, price per gram, availability badge, a **quantity input** (default 1) with **Add to cart** (3 in the box adds 3), and **Details**, which opens the product in a side panel with the price breakdown (spot, premium, VAT), buyback value today, specs, volume tiers, branch availability, description and a link to its own page.

**Views:** cards (default) and a compact table (one row per product, for people comparing many).

**URL behaviour:** the preset URLs in section 3 load the same store with the filter applied; any further filter change updates the query string (`?type=coins&sort=gram`) without reloading. Preset URLs are prerendered for search; query-string variants point to the preset as canonical.

**Price rules:**
- Every price is labelled indicative and shows when it was last updated.
- Prices, cart and checkout work at any time. If the market is closed (weekend or after hours) the visitor can still build a cart and reach checkout; the warning in section 5 appears when they are about to send the request. A stale spot (feed problem, not a closed market) is different: prices are hidden and Add to cart is disabled until the feed recovers.
- Market mode adjustments (Weekend, Volatile, Shortage) already in the staff app apply to the public price in the same way.

## 5. Cart, order request and confirmation

```
Store -> Add to cart -> Cart -> Checkout -> Order request sent
                                                |
        Staff Orders queue: review, reprice, check stock and branch
                                                |
          Confirmed quote email  ---------->  customer pays by bank transfer
                                                |
            Funds received = PRICE LOCK -> ready -> collected
         (spot moved beyond the threshold -> repricing call first)
```

**Cart page:** each line shows quantity (editable), indicative unit price, line total, availability and estimated wait; order total; a banner "Indicative prices; not locked until funds are received"; prices refresh automatically with a visible timestamp. The cart is kept in the browser; no account.

**Checkout page:** name, email, phone, **collection branch (required)**, optional note, consent to the privacy policy and terms, bot protection. Button: **Place order request**. The page repeats the notice and says what happens next.

**Market-closed warning (at the moment of sending):** when the request is placed at the weekend or outside opening hours, a warning panel appears before the button completes: the market is closed, so the order will not be processed, priced or locked until **dd/mm/yyyy hh:mm** (the next opening, in Irish time). The customer confirms to continue or cancels. The time comes from the opening hours of the chosen branch's gold office and Irish bank holidays.

**Payment panel (at the moment the customer presses Place order request):** before the request is sent, a panel tells the customer:
1. They pay after they receive the confirmed quote. **Bank transfer is recommended**: they can pay when they think the price is right, then collect when the order is ready.
2. Alternatively they can pay by **card or cash, in person at the office**. The price is then the spot at that time, subject to item availability.
3. **Cash payments carry a 2% handling fee.**
The customer acknowledges the panel (checkbox) before the request is sent.

**After submit:** the customer gets an acknowledgement email ("received, a colleague will review it"); the desk is alerted; the page shows the same message and the opening hours of the chosen branch.

**Confirmed quote email (sent by staff from the queue):** final item list with prices at that moment · stock availability per item · bank details and payment reference · collection branch · estimated time until it can be collected · the label that prices are not locked until funds are received and a call will follow if the spot moves significantly.

**Staff Orders queue (new, in the `/dashboard` app):** list of order requests with status (new, in review, quote sent, funds received, ready, collected, cancelled or expired), items repriced live, a flag when the total has moved beyond the threshold the manager sets, stock per branch, quote email from a template with live prices, and an audit trail of who changed what.

## 6. Page specifications

Templates (Figma): **Home**, **Store** (listing and product panel), **Product**, **Cart and Checkout**, **Price/Tool**, **Content**, **Branch**.

| Page | Job | Primary action | Content comes from |
|---|---|---|---|
| Home | Show live prices, send visitors to the store, Sell or Storage, prove trust | Shop now | New |
| Store (`/buy`) | Browse, compare and add products | Add to cart | Catalogue and prices from the public API |
| Product | One product in full: breakdown, specs, availability, buyback value | Add to cart | Old product text as seed; specs from the catalogue |
| Cart | Check the list and totals | Go to checkout | Cart in the browser, prices from the API |
| Checkout | Submit the order request | Place order request | Branch list; notice from the facts file |
| Sent | Confirm what happens next | none | Facts file |
| VAT-free silver | Explain and sell the Zurich option | Contact (this product is not an ordinary cart item) | `/vat-free-silver/` plus a worked example |
| How to buy | Explain the flow above, payment (bank transfer, card, cash), ID at collection, price not locked, collection | Shop now | `/how-to-buy/`, FAQ, decided facts |
| Sell | What we buy, what to bring, how priced, payment within 10 working days at most, ID | Call or visit a branch | `/sell-gold/`, FAQ |
| Prices (hub, per metal) | Live prices and chart | Shop that metal | Own price API and history (roadmap 1.3) |
| Tools | Calculators | Shop now | `packages/shared-types` |
| Storage | Vault options; link to merrionvaults.ie | Go to Merrion Vaults | `/safe-deposit-box/`, `/` |
| Learn articles | Answer buyer questions | Shop now | `/buy/` essay (rewritten, no predictions), FAQ |
| FAQ | Answers grouped by topic | Shop now | `/faq/` rewritten |
| Locations, Branch | Find a branch; address, hours (gold office Mon to Fri; Vaults 7 days), phone, availability | Call, WhatsApp or shop for collection there | Branch data (open) |
| About, Press, Security | Story, company details, proof | Contact | `/about/`, `/media/`, FAQ |
| Contact | Phone, WhatsApp, email, form, chat hours | Send a message | `/contact/` |
| Legal | Text kept; add the "prices not locked until funds are received" clause (legal review) | none | Existing text |

## 7. Data each page needs

| Page group | Data | Source | Exists today? |
|---|---|---|---|
| Ticker, store, price, product pages | Spot, sell price, per-gram price, buyback value, change, market mode, staleness | Public price API (`SITE-PLAN.md`, Phase C) | No: to build |
| Store, product | Name, weight, purity, mint or refinery, images, description, volume tiers | Structured files keyed by SKU, seeded from the 54 old pages and the catalogue | Partly |
| Store, cart | Availability and estimated wait, per branch | Stock per branch (open) | Unknown |
| Cart, checkout | Order request: items, quantities, price snapshot (Decimal), customer details, branch, status | New `OrderRequest` tables in `apps/api` | No: to build |
| Checkout | Branch list | Branch files | Partly |
| Staff queue | Requests, repriced totals, threshold, quote email template | `apps/api` + `apps/web` | No: to build |
| Branch, footer | Address, phone, WhatsApp, hours per service | Branch files | No: owners to supply |
| Tools | Pure pricing and tax math | `packages/shared-types` | Partly |
| Shared facts | Payment methods, seller payment time, guaranteed buyback, VAT-free terms, "not locked" notice | One `facts` file with a last-reviewed date each | No |

## 8. Figma scope

Design first, desktop and 375px:

1. Home
2. **Store** (filters, sort, card and table views, quantity and Add to cart, mini-cart, product side panel, empty, loading and stale-price states)
3. Product page
4. Cart and Checkout, and the Sent page
5. Price page with chart, and one tool page
6. Content page, Branch page, Locations hub

Plus shared parts: header with ticker and cart, footer, cookie banner, chat button.
The staff Orders queue is designed in the staff app's own style, not in this Figma file.

## 9. Launch cut

**Launch:** everything above except:
- UK and Spain branch pages go live once the owners supply details.
- `/learn/`: two articles at launch (`coins-or-bars`, `vat-and-cgt-explained`), the rest follow.
- `/tools/converter/` follows the other two tools.

**After launch:** Spanish, news and blog, review excerpts, per-branch stock and delivery, accounts (roadmap 2.2), automated payment (2.5).

**The store does not launch before:** the public price API and rate limiting, the order request endpoint and staff Orders queue, the confirmed-quote email, the updated terms, and the owners' answers in section 10.

## 10. Open items

1. UK and Spain branch details: names, addresses, phones, hours, currency, selling entity.
2. Stock per branch, or one company-wide status? How is the "estimated time until collection" worked out (per product, per branch)?
3. Decided (2026-10-06): requests can be placed when the market is closed; a warning shows the next opening. Still to confirm: "closed" means the gold office's opening hours (Monday to Friday, per branch) plus Irish bank holidays, not the 24-hour metals market.
4. Decided (2026-10-06): the customer is told they pay after the quote (bank transfer recommended) or in person by card or cash at the spot at that time, with a 2% handling fee on cash. Still to confirm: how long a confirmed quote holds the stock before it is released, and whether the 2% applies to the whole order or only to the cash part.
5. Quantity and order-value limits per cart, and what the desk does above the cash threshold (anti-money-laundering).
6. The spot-move threshold (starting value for the manager setting).
7. Email provider for the acknowledgement and the confirmed quote, and who the desk alert goes to.
8. Which of the 54 products are sold at launch, and how copper and VAT-free silver appear (silver bought for Zurich storage is not an ordinary cart item).
9. What reads `/stock/` today.
10. Whether `/news/` gets a home at launch.
