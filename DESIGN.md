---
name: Merrion Gold Pricing Workbook
description: The staff pricing workbook, grown up. A live grid of bullion prices with crisp, colour-coded tools around it.
colors:
  zinc-white: "#ffffff"
  ink-black: "#000000"
  zinc-950: "#09090b"
  zinc-900: "#18181b"
  zinc-800: "#27272a"
  zinc-700: "#3f3f46"
  zinc-500: "#71717a"
  zinc-400: "#a1a1aa"
  zinc-300: "#d4d4d8"
  zinc-200: "#e4e4e7"
  zinc-100: "#f4f4f5"
  zinc-50: "#fafafa"
  merrion-gold: "#daab69"
  merrion-gold-text: "#8f6a2e"
  price-teal: "#1eb8a5"
  price-teal-text: "#0f7f73"
  buyback-raspberry: "#e0558f"
  buyback-raspberry-text: "#b8336a"
  signal-red: "#ef4444"
  night-red: "#7f1d1d"
  warning-tint: "#fff4e0"
  warning-ink: "#6b3f06"
  warning-tint-night: "#3b2a0c"
  warning-ink-night: "#f3c98b"
  metal-gold: "#D4A017"
  metal-silver: "#8B95A1"
  metal-platinum: "#4C8EA3"
  metal-palladium: "#8073B8"
typography:
  h1:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: "3rem"
    letterSpacing: "-0.012em"
  h2:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.0075em"
  h3:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.006em"
  h4:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "-0.005em"
  large:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  p:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.75rem"
  table-head:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: "1.5rem"
  table-item:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
    fontFeature: "\"tnum\""
  small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "0.875rem"
  muted:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  field-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
  section-label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.025em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  unit: "0.18rem"
  cell-y: "0.36rem"
  cell-x: "0.54rem"
  gap-cards: "0.54rem"
  panel: "0.72rem"
  gutter: "0.72rem"
  gutter-lg: "1.08rem"
components:
  button-primary:
    backgroundColor: "{colors.merrion-gold}"
    textColor: "{colors.zinc-900}"
    rounded: "{rounded.md}"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.zinc-white}"
    textColor: "{colors.zinc-950}"
    rounded: "{rounded.md}"
    size: "36px"
  button-outline-hover:
    backgroundColor: "{colors.zinc-100}"
    textColor: "{colors.zinc-900}"
  input:
    backgroundColor: "{colors.zinc-white}"
    textColor: "{colors.zinc-950}"
    rounded: "{rounded.md}"
    height: "36px"
  metal-card:
    backgroundColor: "{colors.zinc-white}"
    textColor: "{colors.zinc-950}"
    typography: "{typography.h4}"
    rounded: "{rounded.xl}"
  spread-badge-price:
    textColor: "{colors.price-teal-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
  spread-badge-buyback:
    textColor: "{colors.buyback-raspberry-text}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
  subtab-pill-active:
    textColor: "{colors.zinc-900}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  result-highlight:
    typography: "{typography.h4}"
    rounded: "{rounded.2xl}"
---

# Design System: Merrion Gold Pricing Workbook

## Overview

**Creative North Star: "The Living Spreadsheet"**

This is the workbook the staff already know, grown up. The product grid is the main feature: a scrollable table of every product, with Price and Buyback figures side by side. It sits under a fixed strip of four live metal spot cards and an optional price chart. Everything else is a tool arranged around the grid: a slide-out Pricing Tools panel on the right (its Settings tab carries the admin buttons for admins), and one row of icon buttons in the header. The admin console is a separate page, `/admin`, reached from the left menu. The screen fills the viewport exactly. Only the table body and the side panel scroll.

Colour does functional work, organised as three pillars: **brand gold** (identity, active and selected states, primary actions), **Price teal** (anything we charge the customer) and **Buyback raspberry** (anything we pay the customer). Metal colours and status colours answer two more questions: which metal is this, and can I trust this price right now. Beyond that the surface stays neutral zinc: white or near-black ground, hairline borders. Spacing is compact (the Merrion Gold preset sets the spacing unit to 0.18rem, Tailwind's default being 0.25rem); text follows the Figma type scale, with 16px table text.

Components should look **crisp and restrained**. Corners are tight (6–8px on controls) and edges are hairlines. Colour appears only where it carries meaning. The rounder, pill-shaped language inside the Pricing Tools panel came from the old Apps Script tool. It is the tolerated exception, not the direction.

The Figma file "Merrion Gold design system" is where colour and type values are decided (variables collection with Light/Dark modes, text styles). This document and the Merrion Gold theme preset in code must match it; see Colors for the two intentional mapping differences.

**Key Characteristics:**
- The grid is the hero. Cards, chart and panels serve the table and never compete with it.
- The page fits one viewport: fixed header and cards, with only the table and the side panel scrolling.
- Three colour pillars: brand gold, Price teal, Buyback raspberry. Each has a fill tone and a readable text tone per mode.
- Compact spacing (0.18rem unit) with tabular figures for every price.
- Light and dark themes are equal citizens, and all derived tints use `color-mix()` against the active theme.

## Colors

A neutral zinc ledger with three accent pillars and a separate family of four metal colours. Every accent has a **fill** (buttons, pills, tinted panels, always with dark ink on top) and a **text** tone (numbers and labels). In dark mode the two are the same hex; in light mode the text tone is darker, because the fills are too light to read on white.

| Pillar | Token (fill / text) | Light fill · text | Dark fill · text |
|---|---|---|---|
| Brand | `--primary` / `--primary-text` | `#daab69` · `#8f6a2e` | `#daab69` · `#daab69` |
| Price | `--price` / `--price-text` | `#1eb8a5` · `#0f7f73` | `#1eb8a5` · `#1eb8a5` |
| Buyback | `--buyback` / `--buyback-text` | `#e0558f` · `#b8336a` | `#e0558f` · `#e0558f` |

**Mapping from Figma:** Figma's `secondary` (teal) and `tertiary` (raspberry) map to `--price` and `--buyback`, not to shadcn's `--secondary`, which stays a neutral zinc because it backs secondary buttons, badges and chips. The `*-text` light tones are an addition to the Figma export; add them to Figma so both stay in sync.

**Other themes:** Price and Buyback are semantic, not brand, so every theme in the theme editor gets the Merrion teal and raspberry unless its preset sets `price`/`buyback` itself. Themes that don't set `*-text` tones get them derived from the fill in `index.css`, with lightness at most 0.45 in light mode and at least 0.78 in dark mode. That keeps Price, Buyback and primary-as-text at 4.5:1 or better on every bundled tweakcn and shadcn preset. Doom 64's mid-grey light theme pins its own text tones. When adding a preset, check that `price-text` and `buyback-text` reach 4.5:1 against both its `background` and `card`.

### Primary
- **Merrion Gold** (`merrion-gold`, text tone `merrion-gold-text`): the brand. Fills primary buttons and pressed header toggles, checked checkboxes, the active sidebar item and the focus accent in the sidebar, always with Zinc 900 ink. Where gold must be read as text or a thin line on white (the focused-row outline), use the text tone.

### Secondary
- **Price Teal** (`price-teal`, text tone `price-teal-text`): what the customer pays us. The Price column and its Premium badge, the Product tab's Price figure, and the Trade tab while quoting a Price.

### Tertiary
- **Buyback Raspberry** (`buyback-raspberry`, text tone `buyback-raspberry-text`): what we pay the customer. The Buyback column and its Discount badge, the Product tab's Buyback figure, and the Trade tab while quoting a Buyback.

### Metal family
- **Gold** (`metal-gold`), **Silver** (`metal-silver`), **Platinum** (`metal-platinum`), **Palladium** (`metal-palladium`). They identify the metal on the spot cards and in the spot price chart. These are the only fixed hex values in component code. Soft tints and text strengths are derived from them with `color-mix()`, so they work in both themes.

### Neutral
- **Light:** background and cards `zinc-white`, text `ink-black` (cards and popovers `zinc-950`), muted and accent surfaces `zinc-100`, secondary text `zinc-500`, borders and inputs `zinc-200`, focus ring `zinc-900`, sidebar `zinc-50`.
- **Dark:** background and cards `zinc-950`, text `zinc-50`, muted and accent surfaces `zinc-800`, secondary text `zinc-400`, borders and inputs `zinc-800`, focus ring `zinc-300`, sidebar `zinc-900`.
- **Destructive:** `signal-red` in light, `night-red` in dark, with near-white text. Destructive actions only.

### Raised card
- **Card raised** (`--card-raised`): the spot-price cards' surface, one small step off the page so they read as tiles even though the Figma palette gives `card` and `background` the same colour. Merrion Gold sets `#fafafa` (light) and `#171717` (dark); other themes derive it by mixing the card 3% (light) / 6% (dark) toward the text colour.

### Status colours
Price freshness uses Tailwind's stock status colours as small 6px dots: emerald for fresh, amber for stale, orange for "live fetch failed, showing last known price", and red for failed. Spot price movement uses green-600 for up and red-600 for down, always with an arrow icon, so colour is never the only signal.

**Warning** (`--warning` fill, `--warning-text` ink): an amber panel for notices that delay or block something without being an error, such as "the market is closed, so this order will not be processed until Monday". Light `warning-tint` with `warning-ink`; dark `warning-tint-night` with `warning-ink-night`. Both pairs reach 7:1. The staff app defines the variables but does not use them yet; the public site does.

### Named Rules
**The Direction Is Colour Rule.** Price is always teal and Buyback is always raspberry. This holds in every theme, in every column, badge and tab. A clerk should be able to tell which side of the trade a number belongs to before reading its header. Colour text with `var(--price-text)` / `var(--buyback-text)`, fills with `var(--price)` / `var(--buyback)` (or `tabThemeStyle("price" | "buyback")`), never `secondary`. Teal and raspberry are close in lightness and can look alike to red-green colour-blind users, so the column headers and the Price/Buyback labels must always be present.

**The Gold Means Here Rule.** Gold marks identity and state: the active tab, the pressed toggle, the selected row, the primary action. Teal and raspberry never mark an active or selected state, and gold never marks a trade direction.

**The Dark Ink On Accents Rule.** Text on any solid gold, teal, raspberry or metal fill is dark ink, never white. White on the gold is about 2.1:1, on teal about 2.4:1. Shadcn buttons get it from `primary-foreground` (Zinc 900); tool-panel fills use `var(--tab-accent-on)`, which picks dark or light ink from the fill's lightness.

**The Earned Colour Rule.** A colour appears only when it answers one of the questions above: brand/state, direction, metal, or trust. Decorative colour, multi-colour tags, gradient fills and tinted section backgrounds do not belong here.

**The Stale Is Loud Rule.** A freshness signal must never be removed, recoloured to neutral, or hidden behind a hover without a visible fallback. The dot, the header freshness indicator and the amber stale-prices triangle exist so that a stale price is never silent. The triangle's message is on hover and focus, but the icon itself is always visible while prices are stale.

## Typography

**Body Font:** Inter (with `system-ui, sans-serif` fallback)
**Mono Font:** IBM Plex Mono is declared in the preset but not used by any dashboard component.

**Character:** One sans family doing every job. Hierarchy comes from weight and size, never from a second typeface. Every figure uses tabular numerals so price columns line up like a spreadsheet.

Inter is the default and is loaded from Google Fonts at runtime by the theme preference provider. The theme editor lets each user switch to Geist, IBM Plex Sans, Manrope or the system font (all have tabular figures), scale text 90–115% via the root font size, adjust letter spacing, and pick a density (compact / default / comfortable, multiplying the preset's spacing unit) and shadow strength (none / subtle / default). These are per-user display preferences layered on top of the system; the defaults above are what the design is judged against.

### Hierarchy
The scale mirrors the Figma text styles one-to-one. Each has a `type-*` utility in `index.css` with the same name (`type-h3`, `type-table-item`, …).

- **h1** (800, 48/48, -0.012em): reserved; nothing on the dashboard uses it.
- **h2** (600, 30/36): reserved for page-level headings outside the fixed app bar.
- **h3** (600, 24/32): the app-bar page title ("Pricing Workbook").
- **h4** (600, 20/28): the Pricing Tools panel title; also the size of the spot price on metal cards and of tool results.
- **large** (600, 18/28) and **lead** (400, 20/28): available; not yet used on the dashboard.
- **p** (400, 16/28): running text.
- **table head** (700, 16/24): product table column headers.
- **table item** (400, 16/24, tabular numerals): product table cells. Price figures in the table add weight 600.
- **muted** (400, 14/20): panel subtitles and the default size inside the Pricing Tools panel.
- **small** (500, 14/14): single-line labels only (shadcn's `leading-none`).
- **field label** (600, 13px, muted): labels above inputs and result labels in the Pricing Tools panel; also the font size of copied-table HTML. Not yet in Figma; add it.
- **label** (500, 12/16) and **section label** (700, 11px, tracked 0.025em): badges, captions, and field-group headers inside tool tabs. Not yet in Figma; add them.

### Number formats
- **Quoted prices** (Price, Buyback, Price ex. VAT, market value, trade and portfolio totals, melt payout): whole euros, no cents (`formatPrice`). The API rounds them in the dealer's favour — Price up, Buyback down.
- **Spot prices** (`formatSpot`): whole euros for gold, platinum and palladium; silver keeps its cents.
- **Precise figures** (€/gram, average €/g, spot per gram, P/L analysis): two decimals (`formatEuro`).

### Named Rules
**The Tabular Figures Rule.** Every number a customer could be quoted is set with tabular numerals (`tabular-nums`). Proportional digits in a price column are a bug.

**The 11px Floor Rule.** Nothing is set smaller than 11px: badges, keycaps, micro-labels and countdowns included. Trust signals like the freshness countdown are exactly where tiny type does the most harm.

**The One Family Rule.** Do not introduce a display face or a serif. Emphasis in this system comes from weight (600–800), not from a change of typeface.

## Layout

The layout fills the viewport exactly (`h-svh`, `overflow-hidden`):

1. **Header:** the title, then the data-freshness indicator, then a right-aligned cluster: the stale-prices triangle (only while stale) and Refresh next to the freshness text, then Assistant (admins only) and the Tools panel toggle. Day/Night, the theme editor (admins) and Sign out live in the sidebar's user menu; the chart's hide control lives on the chart itself.
2. **Fixed band (does not scroll):** the metal spot cards (always shown; 2 columns, 4 columns at `lg`), then the area chart whose height is `clamp(140px, 26vh, 320px)`. The chart collapses to a one-line bar.
3. **Table:** the only region of the main column that scrolls, with its column header pinned. It has a minimum height of 180px so the band above can never crush it.
4. **Side slot:** a right-hand column `clamp(260px, 32vw, 384px)` wide, holding the Pricing Tools panel. It opens by animating its width over 200ms. Its inner content keeps a fixed width and is clipped, so it never reflows while the panel animates.

The page gutter is 4 spacing steps, rising to 6 at `lg`. The metal cards use a 3-step gap. Table cells are 2 steps tall and 3 wide. Panel sections use 4 steps of padding. All of these multiply the 0.18rem unit.

**The Viewport-Tracking Rule.** Anything that has to fit the real window (the chart height, the side panel width) is sized with `clamp()` or `min()`, never a fixed pixel value, so a very small or very large window degrades gracefully instead of breaking.

**The Grid Keeps Its Room Rule.** Anything added above the table comes out of the fixed band, and each new element needs a way to collapse (the chart has one, `g` or its own hide button). The table must never shrink below its minimum height.

## Elevation & Depth

Depth comes from tone, not shadow. Cards sit on the background through a slight difference in shade (card and background share a colour in the Figma palette, so the hairline border does most of the work). At rest, shadows are either absent or shadcn's minimal `shadow-xs` on controls. The only lift is a response to interaction: a metal card gains `shadow-lg` on hover, over 200ms, to show that it can be clicked. Floating layers (popovers, dropdowns, dialogs, tooltips) use shadcn's stock elevation.

**The Flat-At-Rest Rule.** No surface casts a shadow until the user interacts with it or it floats above the page. To separate regions, use a border or a tone step.

## Shapes

The base is tight, gently rounded rectangles. The user's default radius is 0.5rem, and the other steps derive from it:
- `sm` is 4px, for small chips.
- `md` is 6px, for buttons, inputs and badges.
- `lg` is 8px.
- `xl` is 12px, for cards.

The larger steps are `2xl` (16px, for the tool panel's result highlight and error banners) and `full` (the subtab pills). They also scale with the radius setting (`--radius-2xl` and `--radius-3xl` are mapped in `index.css` for exactly that reason). They should stay inside the Pricing Tools panel.

Borders are 1px hairlines everywhere. The one exception is the metal card, which has a 2px border that stays transparent until the card is selected and then turns the metal's colour.

**The Crisp Default Rule.** New controls use `md` (6px) corners and square-edged layouts. Pills and 16px or larger corners are the Pricing Tools panel's inherited dialect: acceptable there, but not to be spread into the header, table or admin surfaces.

## Components

### Buttons
Quiet, square and compact.
- **Shape:** gently rounded (`rounded.md`, 6px). Header actions are 36px square icon buttons with a 16px Lucide icon.
- **Primary / pressed:** a Merrion Gold fill with Zinc 900 text. A header toggle button switches to this fill while its panel or view is open, which is the only on/off indicator. The settings cog in the panel inverts to foreground on background instead.
- **Outline (default for header actions):** background fill, hairline border, foreground icon. Hover fills with the accent surface (`zinc-100` / `zinc-800`).
- **Focus:** a 3px ring in the `ring` colour (Zinc 900 light, Zinc 300 dark) at 50% opacity.
- Every icon-only button has both a `title` and an `aria-label`, and shows its keyboard shortcut in the title where it has one (`g`, `t`, `a`).

### Metal Spot Card (signature)
The four live spot prices: one card per metal, sitting side by side as a row above the grid.
- **Shape:** 12px corners, with the aspect ratio fixed at 3.2:1 (2.4:1 at `sm`) so the row stays short.
- **Content:** the metal name in bold with its metal colour and a 6px freshness dot, and a pause/play chip (on a soft metal tint) at top right. Below them sit the price at h4 size (700, tabular numerals), then a Label-size change line coloured green or red with an arrow.
- **States:** a transparent 2px border by default, which turns the metal's colour when selected (selecting a card filters the grid to that metal). The card gains `shadow-lg` on hover. Clicking the price turns it into an inline, borderless number input. Entering a new price is a manual override: the card freezes and shows "Manual Override" plus the market price in place of the change line.

### Product Grid
The spreadsheet itself.
- Built with TanStack Table and shadcn `Table`: a pinned header, rows with 2 steps of vertical padding, and table text in the table item style (16px), prices at weight 600 with tabular numerals.
- **Vocabulary:** columns are Price, Premium, Buyback, Discount and Price ex. VAT (not shown for gold, which is VAT-exempt). Market Value and Weight are reference columns, hidden by default and available from Customize Columns.
- **Grouping by direction:** the Price pair (Price and Premium) is teal and the Buyback pair (Buyback and Discount) is raspberry, both in their text tones. Market Value and Price ex. VAT use the muted foreground.
- **Sections sort independently:** Bars, Coins and Bonded always stay in that order, each under its group header. Any column sort orders rows within each section; it never interleaves them.
- **Empty states:** loading, load failure, "no products match these filters" (with Clear filters) and "no products for this metal" each get their own message.
- **Spread badges:** outline badges with the tone as text colour, a 40% border mix and a 12% fill mix. There is no icon: numbers only.
- **Keyboard focus:** the focused row gets a 2px inset outline in the primary colour.
- **Admin row menu:** a 28px ghost "⋮" button rendered only for admins. Non-admins get no menu at all, not a disabled one.

### Pricing Tools Panel
A tabbed workbench in the side slot.
- A header with the title and a subtitle ("GOLD mode"), and a 32px settings button on the right. The tabs (Product, Trade, Portfolio, Calculators) are small muted chips, and Settings is kept out of the tab row on purpose.
- Each tab sets its own accent colour through `tabThemeStyle()`: Price uses `--price`, Buyback uses `--buyback`, Invest uses primary, Calc uses accent, and Settings uses muted-foreground. These colours come from the active theme through `color-mix()`, never from hard-coded values.
- **Trade direction pill:** a single toggle showing the current side large ("Price" or "Buyback") with the other side small beneath it, next to a swap icon. It is filled with the direction's colour, with dark ink text.
- **Subtab pills:** a muted track with fully rounded pills. The active pill is filled with the tab accent in bold `--tab-accent-on` text. Buttons use `aria-pressed`.
- **Result highlight:** a 16px-rounded block on the tab's soft tint, with a 13px semibold label on the left and the result at h4 size (800, tabular numerals) on the right in the accent text colour.
- **Error banner:** a 12px-rounded block on the soft tint, with an alert icon and 12px medium text.

### Inputs / Fields
- **Style:** 36px tall, 6px corners, a Hairline Slate stroke, and the background fill. Numeric inputs hide the browser's spin buttons.
- **Focus:** the `ring` focus ring, as on buttons.

### Freshness Signals
There are three signals at increasing volume. The first is a 6px dot on each card, with a tooltip giving its state, age and source. The second is a quiet status in the header: a dot plus one muted line such as "Live · 01:56:30" (the line drops away on narrow screens, the dot stays). Both turn amber when prices are stale or served from cache or the database; age, source and the next-refresh countdown are in its tooltip. The cards carry only the dot, with no age text, because all four metals come from one vendor call. The third is an amber triangle icon beside the freshness text, shown only while prices are stale; hovering or focusing it gives the full sentence (struck-at time, age, source). It replaced a full-width banner that cost too much room.

### Spot Price Chart
The area chart ("Spot price history") draws each metal in its own metal colour (`METAL_ACCENT`), the same as its spot card.

## Do's and Don'ts

### Do:
- **Do** keep Price teal and Buyback raspberry in every theme and on every surface, using `--price-text` / `--buyback-text` for text and `--price` / `--buyback` for fills (The Direction Is Colour Rule).
- **Do** use gold for active, selected and primary states, and nothing else (The Gold Means Here Rule).
- **Do** call what the customer pays "Price" and what we pay "Buyback", everywhere. Not "Sell", "Buy" or "MG Price".
- **Do** set every quotable figure with `tabular-nums` wherever it appears: table cells, card prices and tool results.
- **Do** derive every tint and text strength with `color-mix()` from a theme token or a metal colour, so light and dark mode stay in sync.
- **Do** size anything that tracks the viewport with `clamp()` or `min()` (for example, `clamp(260px, 32vw, 384px)` for the side panel).
- **Do** give every icon-only control a `title` and an `aria-label`, and put its shortcut in the title.
- **Do** use 6px corners and 1px hairline borders for new controls outside the Pricing Tools panel.

### Don't:
- **Don't** use destructive red for Price, Buyback or any normal business action. A trade is not an error.
- **Don't** put white text on gold, teal, raspberry or metal fills.
- **Don't** use teal or raspberry for tags, tabs or buttons that aren't about a trade direction.
- **Don't** set any text below 11px.
- **Don't** hide, soften or neutralise a freshness or stale-price signal.
- **Don't** spread pills and 16px+ corners from the Pricing Tools panel into the header, grid or admin surfaces.
- **Don't** add a second typeface, decorative gradients, or tinted section backgrounds.
- **Don't** put shadows on surfaces at rest. Separate regions with a hairline or a tone step instead.
- **Don't** let new content above the table push it below its 180px minimum. Give anything new in the fixed band a toggle.
- **Don't** hard-code a hex colour for a UI role. The metal family is the only fixed-hex exception.
