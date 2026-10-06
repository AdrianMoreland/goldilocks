# Audit of the current site (merriongold.ie)

Input for the new public site (`docs/SITE-PLAN.md`, Phase B). Blog posts are out of scope for now.

**Reviewed:** all 24 published pages (text, headings, titles, meta descriptions, schema types, images, HTML size), plus a visual check of the home page (desktop pane) and `/buy/` and home on a 375px phone viewport. Taken on 2026-10-06.
**Not reviewed:** the 147 blog posts, the body of the legal pages (only their titles and descriptions), anything that needs JavaScript beyond what a browser pane showed (map, price chart, price ticker, video), real page speed (no Lighthouse run), analytics and Search Console data (not available). Anything marked *verify* is an inference.

---

## 1. Summary

The site reads as three businesses tangled together: a bullion dealer (Merrion Gold), a safe deposit box operator (Merrion Vaults) and a group brand (The Vaults Group). Visitors who want to buy or sell gold are repeatedly sent to vault marketing, and the facts about the company change from page to page.

The five problems that hurt most, in order:

1. **The site never lets a visitor act.** Every path ends in "call us". No prices on pages, no stock, no quote form on the product pages, and the FAQ says the site shows no live prices while the header shows a live ticker.
2. **The same facts are told differently on different pages** (payment time for sellers, delivery times, payment methods, opening hours, who owns the company, where the offices are). This costs trust and sales calls. See section 4.
3. **Five pages overlap for "buy"** (Buy, Buy Gold, Shop, How To Buy, Stock) and three names exist for one storage service (Store, Safe Deposit Box, Merrion Vaults).
4. **Search basics are weak:** half the pages have no meta description, many have no H1 or several, page titles are short or repeat the brand, thank-you pages are indexable copies, product pages do not exist as real pages.
5. **Stale and heavy.** The footer shows a social feed from mid-2023 on every page, the blog stops in August 2024, and the mobile view opens with a cookie banner and a chat pop-up covering the text.

What is worth keeping: the company facts and trust data (company number, LEI, ratings, refineries), the VAT-free silver offer, the FAQ questions, the price chart idea, the 20 or so product descriptions, and the plain "simple and straightforward" tone of the buy and sell steps.

---

## 2. Site-wide problems

### 2.1 Structure and navigation

| Problem | Evidence | Fix in the new site |
|---|---|---|
| Too many top-level items, three levels deep | 11 top items; Buy > Gold > Bars / Coins; Newsroom > Media / Blog | Max 6 top items, 2 levels |
| Same thing, several names | Storage: "Store" (nav), "Safe Deposit Box" (page), "Merrion Vaults" (page heading). Chart: "Live Price Chart" (nav), "Chart" (page name), "Gold Price Today" (title), "Precious Metals Price Chart" (H1). News: "Newsroom", "News", "Blog" | One name per thing, used everywhere |
| Five overlapping buy pages | `/buy/` (essay on why to buy gold, H1 "BUY GOLD"), `/gold/` (one sentence and two tiles), `/shop/` (list of product names), `/how-to-buy/` (4 steps), `/stock/` (blank page used by an API) | One Buy section: category pages with real products, one How to buy page |
| Nav label and page do not match | Nav says "Sell" and "Store", pages are "Sell Gold" and "Safe Deposit Box"; "Buy" page is only about gold | Use plain labels that say what the page does |
| Utility pages are public pages | `/stock/` (its title reads "DO NOT DELETE - USED BY API FOR PRICES"), two identical thank-you pages | Not pages in the new site; thank-you becomes a form state |
| Branch pages not connected to buying and selling | Locations list address only | Per-branch page with hours, phone, what is available there |

### 2.2 Repeated blocks on every page

- A **"Store Your Gold With Us"** promo band (same text and button) on 10 of 24 pages, including Buy, Gold, Sell, How to buy, FAQ, Contact, About, Media, News and the chart.
- The **Refineries logo strip** on 13 pages, and a **newsletter box with CAPTCHA** in the footer of every page.
- A **Twitter/X "Stay in touch" feed** in the footer, latest post July 2023.
- Nav, footer and these blocks make about 380 words and 13 images on every page, before any real content. The thank-you pages are 383 words, of which almost none is the message.
- The **blog widget** ("Updates from Merrion Gold") sits on the home and Locations pages, and adds extra H1s.

### 2.3 UI and UX

- **Mobile first screen is covered.** On a 375px phone the cookie banner takes about a third of the screen and a chat pop-up ("Jen", with a waving-hand image) overlays the article text. The reader cannot start until both are dismissed.
- **Desktop home:** the cookie banner overlaps the hero button; navigation text is very small; a large blank white area showed on scroll (scroll animations not painting in the test pane, *verify*).
- **Pages that look empty:** `/gold/` is one sentence plus two tiles; `/media/` is one paragraph plus logos (no article links seen, *verify*); `/sell-gold/` is five sentences.
- **Walls of text:** `/buy/` is an essay with tabs; `/faq/` is 14 numbered questions in one flat list with no groups; director bios on `/about/` are CV paragraphs.
- **No clear primary action.** Phone, WhatsApp, chat, email, a contact form with a branch dropdown, an enquiry form and a newsletter all compete.
- **Click-to-play video** on the storage page sets cookies when played (good practice, but the video is the page's main content and has no transcript).
- **Accessibility:** 7 images without alt text on every page (the shared header and footer); tiny nav text; contrast not measured.

### 2.4 SEO and technical

| Item | Finding |
|---|---|
| Meta descriptions | Missing on 12 of 24 pages: all 4 Locations pages, Shop, News, Contact, FAQ, Buy, About, VAT Free Silver, Stock |
| Weak descriptions | Privacy Policy is 14 characters; How to Buy and Sell Gold reuse their first sentence; thank-you pages use the thank-you message |
| Titles | `Buy Gold` and `Buy - Merrion Gold` and `Shop - Merrion Gold` contain no keyword beyond "buy"; `About Merrion Gold - Merrion Gold` repeats the brand; `/stock/` has no title; titles are 8 to 48 characters, most under 30 |
| H1 | None on Shop, VAT Free Silver, thank-you and legal pages. Three or four on Home and each Locations page (blog and form headings promoted to H1). `/gold/` H1 is just "Buy" |
| Structured data | The same set of types (Place, GeoCoordinates, PostalAddress, Organization, ContactPoint, WebSite) on every page including thank-you pages; no product, FAQ or breadcrumb-per-branch markup seen. Each branch should have its own local business data (*verify* the current ones) |
| Thank-you pages | Two pages with identical content, both public. Should be noindex or removed |
| Product pages | None. Shop lists about 35 product names with no prices, specs or stock, and was the slowest page in the test (1.1 s against 60 to 400 ms for the rest) |
| Weight | 107 to 151 KB of HTML per page before images; 13 to 46 images per page |
| Sitemap | `/sitemap_index.xml` named in robots.txt returns the site's HTML 404 page, so the sitemap appears broken (*verify* in Search Console) |
| Language | Posts and the chart copy quote dollar prices ($2,431/oz) for an Irish euro audience |
| Machine-readable summary | `llms.txt` and `llms-full.txt` exist and describe pages and facts that the site does not actually state (for example "ID/AML requirements" on How to buy, "same-day payment" on Sell) |

### 2.5 Trust, compliance and tone

- **Investment claims to review with the owners.** `/buy/` says gold "typically sees its value increase" when other markets crash, calls it "insurance against severe market turmoil" and "a strong wealth preserver". `/gold-price-chart-ireland/` says to use spot "as a confident guide to market direction". The roadmap rule is no predictions or "should buy" phrasing on customer-facing content.
- **Regulatory facts absent.** Nothing on ID checks, cash limits or anti-money-laundering registration (confirm what applies), on complaints handling, or on how buyback works beyond one FAQ line.
- **Strong guarantees stated once, in one place:** "guarantees to buy back any items we have sold" (FAQ 10 only). Needs legal wording and should appear where a buyer decides.
- **Legal pages:** Terms are "Terms and conditions of use" (about 2,000 words); whether sale terms (price lock, cancellation, market loss) exist anywhere is unclear (*verify*; this is roadmap 2.0 legal work).
- **Cookie banner:** "Accept all" is the dominant button; "Accept necessary" is a pale button. Acceptable, but heavy on a page that has no ads.

---

## 3. Page by page, grouped by context

Verdicts: **Keep** (reuse as is), **Rewrite** (facts are good, text is not), **Merge** (fold into another page), **Drop**.

### 3.1 Company and trust

| Page | What it says | Problems | Verdict |
|---|---|---|---|
| `/about/` | Founded 2013 by Séamus Fahy and David Walsh; part of a group with offices in UK, Ireland and Spain; three people with bios | Two H1s and a repeated "About Merrion Gold" heading; sentence "We are part of a larger gold trading group with additional offices in the UK, Ireland and Spain:" ends with a colon and nothing (*verify* what follows); long career histories (oil and gas, diamonds, mall media) that do not help a buyer; "Approved Product Advisor for Pensions" is unexplained; no photos checked; no regulation or registration info | Rewrite: short story, team cards, trust facts |
| `/media/` | One paragraph: featured in national press, Bloomberg | No dates, headlines or links seen (*verify*); not a page, a logo row | Merge into About or Trust |
| Footer and `/contact/` | Merrion Gold Ltd, company no. 537361, LEI 635400GUYAUTIUK88B49 | Trust data is buried in the contact page | Keep, show in footer on every page |
| Header badges | Trustpilot (428 reviews), Google (46) | Fine, but in the header on every page and again on Home | Keep once on Home and Product pages |
| Refineries strip | PAMP, Valcambi, RCM, Umicore, Republic Metals, Dublin Assay Office, Royal Mint, etc. | On 13 pages | Keep on Home and product pages only |

### 3.2 Buying (information and products)

| Page | Problems | Verdict |
|---|---|---|
| `/buy/` | Titled "Buy", H1 "BUY GOLD", content is a long essay on why to buy gold (diversification, currency hedge, inflation hedge, risk management, demand and supply) with a typo ("How Sell Gold to Merrion Gold"), tabbed text, investment claims | Rewrite as a short "Why gold" guide in the learn section, with compliant wording |
| `/gold/` | One sentence ("competitively priced premiums from the biggest International mints"), tiles for Bars and Coins | Replaced by category pages with products |
| `/shop/` | A list of ~35 product names, no price, weight, purity, stock or image-led cards; categories repeat the nav (Gold, Silver, VAT Free Silver, Platinum and Palladium, Copper) | Replaced by the eshop catalogue |
| `/how-to-buy/` | 4 steps in prose; phone and email twice; payment and restock times conflict with the FAQ; no ID or cash-limit information; no minimum order, delivery or fees | Rewrite as a numbered process with real answers |
| `/stock/` | Blank page that an API reads | Drop; stock comes from the product API |
| Product pages (about 35) | Descriptions exist per product (Krugerrand, Maple Leaf, Britannia, Eagle, bars from 1 g to 1 kg...) but only as names in Shop (*verify* where the descriptions live) | Reuse text as seeds for product pages |

### 3.3 Selling

| Page | Problems | Verdict |
|---|---|---|
| `/sell-gold/` | Five sentences. Item must be brought in for testing; price agreed there; money in two working days. Header says "Sell Gold" but silver, platinum and palladium are also bought | Rewrite: what we buy, what to bring, ID, how the price is set (live spot minus discount), when you are paid, what happens to coins bought elsewhere |

### 3.4 Storage (Merrion Vaults)

| Page | Problems | Verdict |
|---|---|---|
| `/safe-deposit-box/` | Lists what can be stored; video; no price or sign-up path although the home page promises "from less than €5 per week"; the page is about the sister company | Rewrite as a short storage page for bullion buyers that links to merrionvaults.ie for boxes |
| Home hero ("Peace of mind") | The home page's first message is vault marketing, not gold | Lead with buy and sell and live prices |
| Promo band on every page | See 2.2 | Drop everywhere except Home, Buy and Sell, and the storage page |
| `/vat-free-silver/` | A real differentiator: silver stored in a bonded warehouse in Zurich, no VAT while it stays there, can be sold back without leaving, fully allocated, audited yearly, 0.25% quarterly storage fee on LBMA-average value | No H1, no meta description, no worked example of the VAT saved, no sign-up steps; fee and tax statements need legal review before reuse | Keep content, promote to a main page with an example calculation |

### 3.5 Prices and tools

| Page | What it has | Problems | Verdict |
|---|---|---|---|
| `/gold-price-chart-ireland/` | Embedded chart, up to 20 years of history, three currencies, refresh about every 10 s; explainer on what "spot" means | Four names for one page; copy about spot is long and says to treat it as a "confident guide to market direction"; the chart is the group's own widget (React and ECharts, served from `chart.thevaultsgroup.com`, built by the agency Vimar), not a vendor product; no link from the price to a product or to a quote | Replace with our own prices and charts (roadmap 1.3); keep the "what spot means" idea in plain words |
| Header ticker | Live AU, AG, PT, PD in the header | Contradicts FAQ 7; tiny; no link to anything | Keep as a feature, link it to the price page |
| Calculators | None | Missing for this site type | New (roadmap 2.1) |

### 3.6 Locations and contact

| Page | Problems | Verdict |
|---|---|---|
| `/locations/` | Overview and map; headline claims "UK & Ireland", text claims Ireland, UK and Spain, nav lists only three Irish branches | Rewrite: three branches first, group offices only in About |
| `/locations/cork/`, `/locations/dublin-blanchardstown/`, `/locations/dublin-burlington-road/` | About 600 words each, the same template with only the name and "second" or "third location" changed; "purpose-built facility with 24-hour CCTV and biometric security" repeated; every branch shows the same phone, WhatsApp and email; no per-branch hours, directions, parking or services (what can be bought or sold at which branch, is stock held there) | Rewrite with facts that differ per branch |
| `/contact/` | Full form with branch dropdown and CAPTCHA; address; phone; WhatsApp; email; company info | Three contact routes plus a form is fine; shorten the form, drop CAPTCHA if spam can be handled otherwise, add hours |
| `/contact-thank-you/`, `/enquiry-thank-you/` | Identical | Form state, not pages |
| Footer opening hours | Only Burlington Road: Monday to Friday 8:45 to 18:00, closed weekends | Per branch |

### 3.7 Help

| Page | Problems | Verdict |
|---|---|---|
| `/faq/` | 14 questions, flat list; mixes buying, selling, storage, ownership and the website; several answers are outdated or contradict other pages (live prices, payment times); no questions on VAT and CGT, cash and ID rules, premium and spread, minimum order, delivery cost and insurance, what happens when stock runs out | Rewrite grouped by topic with anchors and FAQ markup; move "Who owns Merrion Gold" to About |

### 3.8 Legal

| Page | Notes | Verdict |
|---|---|---|
| `/terms-and-conditions/`, `/privacy-policy/`, `/cookie-policy/` | 2,000 / 2,000 / 1,300 words; no H1 on any; only the cookie policy has a meaningful meta description | Keep text for legal review; add H1s and last-updated dates |

### 3.9 News (out of scope now)

Noted only because it affects the whole site: the latest post is 2024-08-16 and still fronts the home page, `/news/` and `/locations/`; the Twitter feed in the footer is from mid-2023. Both make the site look unmaintained. In the new site, show no feed until there is something recent.

---

## 4. Contradictions to settle with the owners

The new site can only state one version of each. Each row needs an owner decision before copy is written.

| Fact | Version A | Version B | Version C |
|---|---|---|---|
| **When a seller is paid** | "Within two working days" (`/sell-gold/`) | "Next business day" (FAQ 11) | "Same day" (`llms.txt`) |
| **Wait for out-of-stock items** | "7 to 10 days" (`/how-to-buy/`) | "Generally 1 to 2 weeks" (FAQ 9) | |
| **Payment methods when buying** | Bank transfer or cash (`/how-to-buy/`) | Bank transfer, cheque, cash, debit card for small amounts (FAQ 3) | Bank transfer, debit card, cash (`llms.txt`) |
| **Live prices on the site** | "The website does not quote any live prices" (FAQ 7) | Live ticker in header and live chart page | |
| **Opening hours** | Mon to Fri 8:45 to 18:00, closed weekends (footer, Burlington Road) | "Safe deposit facility open seven days a week" (Home) | "Open 363 days a year" (FAQ 13) |
| **Delivery** | "Delivery for smaller orders" (FAQ 8, no detail) | "Worldwide postal delivery" (`llms.txt`) | Not mentioned on How to buy |
| **Who owns it / what it is** | "Irish-owned company founded by two directors" (About) | "Part of The Vaults Group, Europe's largest network" (Locations) | "Owned by two named people" (FAQ 14) |
| **Where the offices are** | UK, Ireland and Spain (About, Locations) | "Trading offices in Scotland and England" (FAQ 14) | Three Irish branches (nav) |
| **The vault** | Ireland's "first" purpose-built (Home, banner) | Ireland's "only" (About, FAQ 14) | Ireland's "leading" (FAQ 13) |
| **What a branch is** | "Second location within Merrion Gold and The Vaults group" (Blanchardstown), "third" (Cork) | Burlington Road is not called first or head office on its own page | |
| **Phone format** | `01 254 7901` | `+353 (0)1 254 7901` | `+353 1 254 7901` |
| **Founded** | 2013 (company) | 2013 (Merrion Vaults, same year) | "Since entering the industry in 2013" (the group) |
| **Merrion Gold's stock** | "Large quantity on site, immediate collection" (several) | "Over the counter" asked as a question with a vague answer (FAQ 1) | Branch stock not stated |
| **Guaranteed buyback** | "Guarantees to buy back any item we sold" (FAQ 10) | Not on the Sell page or How to buy | |

---

## 5. Duplicated and repeated text

| Text | Where | Action |
|---|---|---|
| "Merrion Gold offers unrivalled expertise in the precious metals arena. Our staff are highly trained and have many years experience in trading bullion." | About, Sell | Say it once, with proof |
| "Merrion Gold is housed within Merrion Vaults, Ireland's first independent purpose built safe deposit box facility." | 10 pages (promo band) | Once, on the storage page and Home |
| "Merrion Gold operates out of the same office as Merrion Vaults, Ireland's leading..." | Home hero | Same |
| "You can contact our trading desk at: +353 (0)1 254 7901 or ..." | How to buy (top and bottom), Sell, FAQ intro | One contact block component |
| "The purpose-built facility provides a secure, convenient, and professional environment..." | Cork, Blanchardstown, Burlington Road | Branch-specific facts instead |
| "Buy & Sell Gold and Silver with Merrion Gold today" | Home (twice) and three Locations pages | One H1 per page |
| "Competitively priced... based on live spot" | Home, FAQ, Gold, Buy | State the pricing method once and link to the live price |
| Gold's reasons (diversify, hedge, protect) | `/buy/`, blog posts | One guide page |
| Contact details block | Header, footer, Contact, each branch | One component |

---

## 6. What a site of this type should have and does not

| Gap | Why it matters | Where it goes |
|---|---|---|
| Live prices with the breakdown (spot, premium, VAT, buyback value today) | The one reason people return; every path ends in "call us" today | Product pages, price page, Home |
| Real product pages | Each product has search demand ("Krugerrand price Ireland") | eshop catalogue (roadmap 2.1) |
| Stock and availability | "In stock for collection" is the main promise | Product pages |
| Cost clarity: premium, buyback spread, fees, minimum order, delivery and insurance | Buyers compare dealers on this | How to buy, product pages |
| ID, cash limit and anti-money-laundering explanation | Reduces calls and shows compliance | How to buy, FAQ |
| VAT and CGT guides, with calculators | Gold is VAT-free but silver is not; CGT confuses sellers | Learn section, calculators (roadmap 2.1) |
| Coins vs bars guide, purity and weight explainer | The most frequent buyer question | Learn section |
| Customer proof | 4.8 on Trustpilot, 428 reviews, but only as a badge | Home, product pages, review excerpts |
| Branch facts | Hours, phone, directions, what is available, per branch | Branch pages |
| Security and authenticity | "Tested and verified" invoices, refineries, audit | Trust page |
| A quote request that goes straight to the desk | Replaces the three-way phone, WhatsApp, email choice | Product pages, Contact |
| Language and currency | Most commentary quotes USD | Euro first on all prices |

---

## 7. Implications for the new site

### 7.1 Proposed content map (first draft)

1. **Home:** one H1, live ticker, three paths (Buy, Sell, Store), trust row, branches, one short "Why Merrion Gold".
2. **Buy:** Gold, Silver (including VAT-free silver), Platinum and Palladium, Copper, each with category filters (Bars, Coins) and product pages; How to buy.
3. **Sell:** what we buy, how to prepare, how the price is set, payment, ID.
4. **Prices and tools:** live prices and charts, calculators (buy by budget, CGT and VAT, converters).
5. **Storage:** short page on vault and safe deposit options; link to merrionvaults.ie.
6. **Learn:** Why gold, coins vs bars, VAT and CGT explained, FAQ grouped by topic.
7. **Branches:** Burlington Road, Blanchardstown, Cork, plus the UK and Spain branches, each with its own facts.
8. **About and trust:** story, team, group, press, company details, refineries, reviews.
9. **Contact and legal.**

This replaces 24 pages with about 10 sections; product pages come on top.

### 7.2 Content rules to adopt

- One name per thing: choose between Store / Safe Deposit Box / Merrion Vaults, and between Chart / Live prices.
- One fact, one home: a fact lives in one file and is shown wherever needed, so it cannot drift again.
- Euro first on every figure.
- No prediction or "should buy" wording; owner review before any investment claim goes live.
- Every page has one H1, a unique title and a description written for the search result.
- Every page ends in one clear action (see a price, request a quote, call a branch).

### 7.3 Decided by the owners (2026-10-06)

These answer the contradictions in section 4. The new site states only these versions.

| Topic | Decision | Effect on the new site |
|---|---|---|
| Seller payment time | Advised as up to 10 working days at most, depending on the amount | Replaces "two working days", "next business day" and "same day". Say "usually faster for small amounts" only if the owners confirm it |
| Payment methods when buying | Bank transfer, card and cash | Cheque is dropped. Card and cash limits are still open (see 7.4) |
| Opening hours | Gold office Monday to Friday; Merrion Vaults service seven days a week | Two sets of hours on every branch page, labelled by service |
| Stock | Every branch holds gold | Branch availability can be shown; per-product stock by branch is still open |
| Merrion Vaults on the gold site | Reference it wherever it fits, without overdoing it | Rule: at most one link or short mention per page, on Home, Storage, branch pages, product pages and the footer; none on price, tool and legal pages |
| UK and Spain offices | Branches of the same company; customers can use any of them | The Branches section lists all of them, not just the three Irish ones (details open, see 7.4) |
| Live buy and sell prices | Approved for publication | Product pages and price pages show them |
| Legal statements (guaranteed buyback, VAT-free silver, Zurich storage) | Approved for reuse; the owners will edit later | Keep each statement in one content file with a "last reviewed" date so edits happen in one place |
| Chat widget | Staffed | Keep a chat option; state the hours it is staffed |

### 7.4 Still open

1. **Branch details:** address, phone, WhatsApp, hours and opening exceptions for each branch, including the UK and Spain ones. Today all three Irish branches show the same phone and WhatsApp.
2. **Currency and legal entity:** are UK and Spain branches priced in sterling or euro, and does an Irish customer buy from the Irish company everywhere, or does the selling entity change?
3. **Card and cash limits:** the card limit per transaction, and the cash limit (anti-money-laundering rules).
4. **Wording of the vault claim:** "first", "only" and "leading" all appear today; pick the one that is provable, or drop the superlative.
5. **Per-branch stock:** is stock shown per branch or one company-wide status?
6. **Chat provider and hours:** which service, and staffed when.
7. **Group wording:** "The Vaults Group, Europe's largest network" and "15 facilities" (from `llms.txt`): confirm the numbers before they go on the site.
8. **`/stock/` page:** which system reads it, so nothing breaks when WordPress goes.
