# Figma plugin: Merrion Gold design system

A local Figma development plugin that builds the design system into a Figma file from `DESIGN.md` and the web app's
source. It needs no API quota and no paid plan. Run it and a panel opens with six lists (tick what you want and press
**Import**) and two more tabs, **Compose** and **Export**, for designing with the library and getting a design back into code.

| List | What it brings in |
|---|---|
| **Variables** | Colors (light and dark), Typography, Radius, Spacing, drawn as reference frames |
| **Molecules** | Everything in `apps/web/src/components/ui`: button, badge, input, checkbox, switch, tabs, card, table, dialog, select, command, calendar ... as Figma components with their variants |
| **Components** | Logo, app sidebar, site header, user menu, command search, generic form, admin panel |
| **Blocks** | Spot price card, spot chart, product table (8 sample rows), filter bar, market mode banner, price freshness, trade tab, melt calculator, pricing tools panel, sign-in form, system health, add and delete product dialogs |
| **Site** | The public website's components (`apps/site`): product card and row, store filters, price ticker, public header and footer, the market-closed and payment-options dialogs. Needs the Molecules and Variables imported first (the plugin builds what is missing) |
| **Layouts** | Sign-in page, Dashboard, Admin console, assembled from instances of the components and blocks |

## Use

```bash
pnpm --filter @goldilocks/shared-types build   # only if packages/shared-types/dist is missing
pnpm figma:build                               # writes tools/figma-plugin/dist/
```

In the Figma **desktop app**, open a design file, then *Plugins → Development → Import plugin from manifest…* and pick
`tools/figma-plugin/manifest.json`. Run it from *Plugins → Development → Merrion Gold design system*. Re-run
`pnpm figma:build` after changing `DESIGN.md` or any builder, then run the plugin again.

## Designing with the library: Compose and Export

The point is that a design is made of the same components the code uses, so the two never drift.

| Tab | What it does |
|---|---|
| **Compose** | Builds a frame from a JSON spec using only library components and design tokens. A raw colour, a loose shape, an unknown component, text style or radius is rejected with the path of the node. **Check** validates without building. |
| **Export → Export selection** | Writes the selected frame as the same JSON grammar, plus a `warnings` list: raw colours, loose shapes, overridden fills, instances of non-library components. An empty list means the design is fully library and tokens. |
| **Export → Export library** | Writes every library component (id, variants, text layers, size, source files) and every token value, so a spec can be written and checked without opening Figma. |

Save exports under `design/exports/` and specs under `design/specs/` (see `design/README.md`). The grammar is below;
`node tools/figma-plugin/check-spec.mjs <spec.json>` applies the same rules from the command
line, and also checks variant names and text layers when `design/exports/merrion-library.json` exists.

A spec is a frame tree; kinds are `frame`, `text` and `instance`:

```json
{ "schema": 1, "kind": "frame", "name": "Home, hero A", "dir": "V", "w": 1440, "gap": 24, "pad": [64, 80], "fill": "background",
  "children": [
    { "kind": "text", "text": "Gold you can trust", "style": "h1" },
    { "kind": "instance", "component": "molecules/button", "variant": { "variant": "default", "size": "lg" }, "texts": { "label": "Get a quote" } }
  ] }
```

Frame keys: `name dir gap pad w h fillW fillH fill stroke sw dashed sides radius shadow clip align justify wrap abs opacity children`.
Text keys: `text style color align w fillW size weight lh`. Instance keys: `component variant texts name w fillW fillH`.
Colours are variable names (`primary`, `price-text`, `muted-foreground` ...), `{ "role": name, "a": 0.5 }` or
`{ "mix": [a, percent, b] }`; text styles are `h1 h2 h3 h4 large p table-head table-item small muted field-label label section-label`;
radius is `sm md lg xl 2xl full`.

## How it stays tied to the code

- **Tokens** come from the front matter of `DESIGN.md`, read with the same parser the Design tab uses. Variables and text
  styles are always created or updated first, and everything else binds to them, so recolouring a variable in Figma
  restyles every component.
- **The list is checked against the repo at build time.** Each entry in `src/catalogue.mjs` names the source files it is
  drawn from. `pnpm figma:build` flags an entry whose file has moved, and lists any file in `components/ui` that no entry
  covers (shown in the panel as "no builder yet").
- **Icons and the logo** are read from `lucide-react` and `components/logo.tsx`, so they match the app.
- **Builders** (`src/molecules.js`, `components.js`, `blocks.js`, `layouts.js`) are hand-written from the Tailwind classes
  in the components. They are a faithful drawing of the code, not an automatic conversion, so when a component's markup
  changes, update its builder.

## Behaviour worth knowing

- **Safe to re-run.** Collections, variables and text styles are matched by name and updated. An item imported before is
  replaced in place (the setting can be turned off). Frames are named `Merrion · <group> / <item>`; nothing else on the
  page is touched. A failed item is removed so it never leaves half-built layers.
- **Layouts build their own dependencies.** Importing only the Dashboard also builds the sidebar, header, spot cards,
  chart, table and tools panel it uses, if they are not in the file yet.
- **Replacing a component** deletes the old main component, so instances of it elsewhere in the file detach. Re-import
  the layouts after re-importing a component they use.
- **Theme.** The panel setting picks Light or Dark colour mode for what you import now. Components keep the mode they
  were built in on plans without multiple variable modes.
- **Free plan.** Figma's free plan allows one mode per variable collection. If adding a Dark mode is refused, dark values
  go into a second `Colors (Dark)` collection and the panel says so. The free plan also limits pages per file; if a
  `Design system` page cannot be added, items go on the current page.
- **Fonts.** The family comes from the tokens (Inter). A missing weight falls back to the nearest one and is reported.
- **Not carried over.** Tabular figures (`tnum`), hover and focus states, animations, and anything driven by live data.
  Sample values are placeholders.
- **Role mapping.** The light and dark role assignments in `build.mjs` mirror `buildPalette()` in
  `apps/web/src/app/project/design/palette.ts` and the Colors section of `DESIGN.md`. Change them in both places.

## Layout of this folder

```
build.mjs            reads DESIGN.md + source, checks the catalogue, writes dist/code.js, ui.html, spec-check.cjs
check-spec.mjs       validates a design spec from the command line (same rules as the Compose tab)
manifest.json        the Figma plugin manifest (main: dist/code.js, ui: dist/ui.html)
src/catalogue.mjs    what the panel lists, and the source files each entry covers
src/ui.html          the panel
src/core.js          drawing helpers: F (frame), T (text), I (icon), variantSet, use (instance), place
src/variables.js     variable collections, text styles, reference frames
src/molecules.js     components/ui
src/components.js    shared composed components
src/blocks.js        feature blocks with sample data
src/layouts.js       full pages
src/export.js        Export tab: selection and library as JSON
src/spec-check.js    the rules a spec must follow (shared by the plugin and check-spec.mjs)
src/compose.js       Compose tab: builds a spec from instances
src/main.js          panel messages, sessions and the import loop
```
