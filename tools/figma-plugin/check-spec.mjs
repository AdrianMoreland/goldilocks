#!/usr/bin/env node
/**
 * Checks a design spec against the same rules the plugin's Compose tab applies, without opening Figma.
 *
 *   node tools/figma-plugin/check-spec.mjs design/specs/home-a.json
 *   node tools/figma-plugin/check-spec.mjs design/specs/home-a.json --library design/exports/merrion-library.json
 *
 * With a library export (Export tab → "Export library") it also checks variant names and values and the
 * text layers an instance can override. Without one it checks structure and tokens only. Exit code 1 means
 * there are problems; 2 means the checker itself could not run.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const args = process.argv.slice(2);
const libraryFlag = args.indexOf('--library');
const libraryPath = libraryFlag >= 0 ? args.splice(libraryFlag, 2)[1] : 'design/exports/merrion-library.json';
const specPath = args[0];

if (!specPath) {
    console.error('usage: node tools/figma-plugin/check-spec.mjs <spec.json> [--library <library.json>]');
    process.exit(2);
}
const checkerFile = join(here, 'dist/spec-check.cjs');
if (!existsSync(checkerFile)) {
    console.error('dist/spec-check.cjs is missing. Run: pnpm figma:build');
    process.exit(2);
}
const { checkSpec } = createRequire(import.meta.url)(checkerFile);

let spec;
try {
    spec = JSON.parse(readFileSync(resolve(root, specPath), 'utf8'));
} catch (error) {
    console.error(`${specPath}: ${error.message}`);
    process.exit(2);
}

const { errors, warnings } = checkSpec(spec);

const libraryFile = resolve(root, libraryPath);
let library = null;
if (existsSync(libraryFile)) {
    library = JSON.parse(readFileSync(libraryFile, 'utf8'));
    const components = new Map(library.components.map((c) => [c.id, c]));
    const notImported = new Set(library.notImported.map((c) => c.id));
    const visit = (node, path) => {
        if (node && node.kind === 'instance' && node.component) {
            const here = `${path} instance "${node.component}"`;
            const component = components.get(node.component);
            if (!component) {
                if (notImported.has(node.component)) warnings.push(`${here}: not imported into the Figma file yet; Compose will import it`);
                return;
            }
            for (const [key, value] of Object.entries(node.variant || {})) {
                if (component.type !== 'set' || !component.variants[key]) errors.push(`${here}: no variant property "${key}" (it has: ${Object.keys(component.variants).join(', ') || 'none'})`);
                else if (!component.variants[key].includes(String(value))) errors.push(`${here}: ${key}="${value}" does not exist (options: ${component.variants[key].join(', ')})`);
            }
            const texts = node.texts;
            if (texts) {
                const keys = Array.isArray(texts) ? texts.map((_, i) => String(i)) : Object.keys(texts);
                for (const key of keys) {
                    const index = /^#?(\d+)$/.exec(key);
                    const ok = index ? Number(index[1]) < component.texts.length : component.texts.includes(key);
                    if (!ok) errors.push(`${here}: no text layer "${key}" (it has: ${component.texts.join(', ') || 'none'})`);
                }
            }
        }
        ((node && node.children) || []).forEach((child, i) => visit(child, `${path}/${i}`));
    };
    visit(spec, '#');
}

const name = spec.name ? `"${spec.name}"` : specPath;
for (const e of errors) console.log(`error   ${e}`);
for (const w of warnings) console.log(`warning ${w}`);
if (!library) console.log(`note    no library export at ${libraryPath}: variants and text layers were not checked`);
console.log(errors.length ? `\n${name}: ${errors.length} problem${errors.length === 1 ? '' : 's'}` : `\n${name}: ok (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`);
process.exit(errors.length ? 1 : 0);
