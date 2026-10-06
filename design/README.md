# design/

Files that connect the Figma library to the code. Nothing here is imported by the apps.

| Folder | Contents | Made by |
|---|---|---|
| `exports/` | `merrion-library.json` (the components, variants, text layers and tokens the Figma file has) and one JSON per exported frame | Figma plugin, Export tab |
| `specs/` | Design specs: a frame tree built only from library components and design tokens | written by hand or generated, built by the plugin's Compose tab |
| `proposals/` | Notes for a component or token the library does not have yet | written before anything is drawn |

Exports are snapshots: never edit one, write a new spec instead. A spec is checked with

```bash
pnpm figma:build                                         # once, writes the checker
node tools/figma-plugin/check-spec.mjs design/specs/<file>.json
```

The grammar, the colour and text-style names, and the plugin's behaviour are in `tools/figma-plugin/README.md`. The design tokens themselves live in `DESIGN.md`.
