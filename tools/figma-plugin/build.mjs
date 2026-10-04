/**
 * Builds the Figma development plugin from DESIGN.md.
 *
 * DESIGN.md's front matter is the source of truth for tokens; this script resolves them to plain numbers and
 * hex values, then writes dist/code.js = the data + src/plugin.js. Run it again after the tokens change.
 *
 *   pnpm --filter @goldilocks/shared-types build   (once, if dist/ is missing)
 *   pnpm figma:build
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseDesignDoc } from '../../packages/shared-types/dist/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const doc = parseDesignDoc(readFileSync(join(here, '../../DESIGN.md'), 'utf8'));
const { colors, typography, rounded, spacing } = doc.tokens;

const fail = (message) => {
    console.error(`figma-plugin build: ${message}`);
    process.exit(1);
};

/** `3rem` -> 48, `13px` -> 13, `0.18rem` -> 2.88. */
const toPx = (value) => {
    const match = /^(-?[\d.]+)(rem|px)?$/.exec(String(value).trim());
    if (!match) fail(`cannot read "${value}" as a length`);
    return Math.round(Number(match[1]) * (match[2] === 'rem' ? 16 : 1) * 1000) / 1000;
};

const hex = /^#[0-9a-f]{6}$/i;
for (const [name, value] of Object.entries(colors)) if (!hex.test(value)) fail(`colour "${name}" is not a #rrggbb value: ${value}`);

const token = (name) => {
    if (!colors[name]) fail(`DESIGN.md has no colour token "${name}"`);
    return { token: name };
};
const literal = (value) => ({ hex: value });

/**
 * Per-mode roles, as the "Colors" section of DESIGN.md assigns them (the same mapping the Design tab's
 * buildPalette() uses). A role is either a token (becomes an alias to a primitive) or a literal hex.
 */
const semantic = {
    background: { light: token('zinc-white'), dark: token('zinc-950') },
    foreground: { light: token('ink-black'), dark: token('zinc-50') },
    card: { light: token('zinc-white'), dark: token('zinc-950') },
    'card-raised': { light: literal('#fafafa'), dark: literal('#171717') },
    muted: { light: token('zinc-100'), dark: token('zinc-800') },
    'muted-foreground': { light: token('zinc-500'), dark: token('zinc-400') },
    border: { light: token('zinc-200'), dark: token('zinc-800') },
    ring: { light: token('zinc-900'), dark: token('zinc-300') },
    sidebar: { light: token('zinc-50'), dark: token('zinc-900') },
    ink: { light: token('zinc-900'), dark: token('zinc-900') },
    primary: { light: token('merrion-gold'), dark: token('merrion-gold') },
    'primary-text': { light: token('merrion-gold-text'), dark: token('merrion-gold') },
    price: { light: token('price-teal'), dark: token('price-teal') },
    'price-text': { light: token('price-teal-text'), dark: token('price-teal') },
    buyback: { light: token('buyback-raspberry'), dark: token('buyback-raspberry') },
    'buyback-text': { light: token('buyback-raspberry-text'), dark: token('buyback-raspberry') },
    destructive: { light: token('signal-red'), dark: token('night-red') },
};

/** Letter spacing is in em in the document; Figma wants a percentage of the font size. */
const letterSpacing = (value) => {
    if (value === undefined) return 0;
    const match = /^(-?[\d.]+)em$/.exec(value);
    if (!match) fail(`cannot read letter spacing "${value}"`);
    return Math.round(Number(match[1]) * 100 * 1000) / 1000;
};

/** A unitless line height (1.4) is a multiple of the size; anything with a unit is a fixed length. */
const lineHeight = (value) =>
    /^[\d.]+$/.test(String(value)) ? { unit: 'PERCENT', value: Math.round(Number(value) * 100 * 1000) / 1000 } : { unit: 'PIXELS', value: toPx(value) };

const textStyles = Object.entries(typography).map(([name, t]) => ({
    name,
    family: String(t.fontFamily ?? 'Inter').split(',')[0].replace(/["']/g, '').trim(),
    weight: Number(t.fontWeight ?? 400),
    size: toPx(t.fontSize),
    lineHeight: lineHeight(t.lineHeight),
    letterSpacing: letterSpacing(t.letterSpacing),
    // Figma's plugin API cannot set OpenType features, so tabular figures are noted, not applied.
    tabularFigures: String(t.fontFeature ?? '').includes('tnum'),
}));

const data = {
    name: doc.name,
    generatedFrom: 'DESIGN.md',
    primitives: colors,
    semantic,
    textStyles,
    radius: Object.fromEntries(Object.entries(rounded).map(([k, v]) => [k, toPx(v)])),
    spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, toPx(v)])),
};

// ── Catalogue: what the panel lists, checked against the code ───────────────

const root = join(here, '../..');
const SRC_FILES = ['core.js', 'variables.js', 'molecules.js', 'components.js', 'blocks.js', 'layouts.js', 'main.js'];
const sources = Object.fromEntries(SRC_FILES.map((f) => [f, readFileSync(join(here, 'src', f), 'utf8')]));
const allSource = Object.values(sources).join('\n');

const { GROUPS, CATALOGUE: curated } = await import(pathToFileURL(join(here, 'src/catalogue.mjs')).href);
const hasBuilder = (id) => allSource.includes(`reg('${id}'`);
const covered = new Set(curated.flatMap((e) => e.covers));

const catalogue = curated.map((e) => ({
    ...e,
    builder: hasBuilder(e.id),
    missing: e.covers.filter((p) => !existsSync(join(root, p))),
}));

// A file in components/ui that no entry covers is listed too, so a new primitive is never silently absent.
const uiDir = 'apps/web/src/components/ui';
for (const file of readdirSync(join(root, uiDir)).filter((f) => f.endsWith('.tsx'))) {
    const path = `${uiDir}/${file}`;
    if (covered.has(path)) continue;
    const name = file.replace(/\.tsx$/, '');
    catalogue.push({
        id: `molecules/${name}`,
        group: 'molecules',
        label: name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()),
        desc: 'In the code, not drawn by this plugin yet',
        covers: [path],
        builder: false,
        missing: [],
    });
}

const orphanBuilders = [...allSource.matchAll(/reg\('([^']+)'/g)].map((m) => m[1]).filter((id) => !catalogue.some((e) => e.id === id));
if (orphanBuilders.length) fail(`builders with no catalogue entry: ${orphanBuilders.join(', ')}`);

// ── Icons and logo, taken from the packages the app itself uses ─────────────

const lucideDir = join(root, 'apps/web/node_modules/lucide-react/dist/esm/icons');
const quoted = new Set([...allSource.matchAll(/'([a-z][a-z0-9]*(?:-[a-z0-9]+)*)'/g)].map((m) => m[1]));
const icons = {};
for (const name of [...quoted].sort()) {
    const file = join(lucideDir, `${name}.js`);
    if (!existsSync(file)) continue;
    const { __iconNode } = await import(pathToFileURL(file).href);
    if (!__iconNode) continue; // an alias file that only re-exports another icon
    const body = __iconNode
        .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== 'key').map(([k, v]) => `${k}="${v}"`).join(' ')}/>`)
        .join('');
    icons[name] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
// Names written as I('name') must exist; a typo would otherwise only surface when a builder runs.
for (const m of allSource.matchAll(/\bI\(\s*'([a-z0-9-]+)'/g)) if (!icons[m[1]]) fail(`icon "${m[1]}" is not in lucide-react`);

const logoSource = readFileSync(join(root, 'apps/web/src/components/logo.tsx'), 'utf8');
const markPath = /const MARK_PATH =\s*"([^"]+)"/.exec(logoSource)?.[1];
if (!markPath) fail('could not read MARK_PATH from components/logo.tsx');
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><g fill="none" stroke="#BB9765" stroke-linejoin="miter" stroke-linecap="round"><path stroke-width="1.25" d="${markPath}"/><circle cx="32" cy="32" r="11.5" stroke-width="3"/></g></svg>`;

// ── Write dist/ ─────────────────────────────────────────────────────────────

mkdirSync(join(here, 'dist'), { recursive: true });
const json = (value) => JSON.stringify(value);
const code = [
    '// Generated by build.mjs from DESIGN.md and the web app source. Do not edit; change the sources and rebuild.',
    `const DATA = ${JSON.stringify(data, null, 2)};`,
    `const GROUPS = ${json(GROUPS)};`,
    `const CATALOGUE = ${json(catalogue)};`,
    `const ICONS = ${json(icons)};`,
    `const LOGO_SVG = ${json(logoSvg)};`,
    ...SRC_FILES.map((f) => `\n// ── ${f} ──\n${sources[f]}`),
].join('\n');
writeFileSync(join(here, 'dist/code.js'), code);
writeFileSync(join(here, 'dist/ui.html'), readFileSync(join(here, 'src/ui.html'), 'utf8'));

const count = (group) => catalogue.filter((e) => e.group === group.key && e.builder).length;
console.log(
    `figma-plugin build: ${GROUPS.map((g) => `${g.label} ${count(g)}`).join(', ')}; ${Object.keys(icons).length} icons -> tools/figma-plugin/dist/`,
);
const noBuilder = catalogue.filter((e) => !e.builder);
if (noBuilder.length) console.log(`  listed without a builder: ${noBuilder.map((e) => e.id).join(', ')}`);
const moved = catalogue.filter((e) => e.missing.length);
if (moved.length) console.log(`  source file missing for: ${moved.map((e) => `${e.id} (${e.missing.join(', ')})`).join('; ')}`);
