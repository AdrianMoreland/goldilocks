import { fileURLToPath } from 'node:url';
import { defineConfig, designMdAdapter } from '@saotesi/figma-bridge';
import { shadcnPreset } from '@saotesi/figma-bridge/preset-shadcn';

// The builders for the shadcn primitives, with this app's roles and sample copy.
const shadcn = shadcnPreset({
    roles: { onPrimary: 'ink', linkText: 'primary-text', secondaryFill: 'muted', switchOff: 'border' },
    colours: { success: '#10b981' },
    copy: {
        email: 'name@merrion.ie',
        pillTabs: ['Product', 'Trade', 'Portfolio', 'Calculators'],
        table: {
            columns: ['Product', 'Price', 'Buyback', 'Weight'],
            rows: [
                ['1 oz Britannia', '€3,411', '€3,262', '31.1 g'],
                ['10 g Gold Bar', '€1,142', '€1,078', '10 g'],
                ['1 oz Maple Leaf', '€3,408', '€3,258', '31.1 g'],
            ],
        },
        select: { placeholder: 'Select a metal', options: ['Gold', 'Silver', 'Platinum', 'Palladium'] },
        tooltip: 'Freeze this spot price',
        hoverCard: { handle: '@merrion', text: 'Bullion pricing for the Dublin desk.' },
        toast: {
            default: ['Prices refreshed', 'Spot prices updated just now.'],
            success: ['Saved', 'The product was updated.'],
            error: ["Couldn't price the copy", 'Check your connection and try again.'],
        },
        textarea: 'Quote for 12 × 1 oz Britannia, collect Friday.',
        person: { name: 'Adrian Moreland', initials: 'AM' },
        navigation: ['Workbook', 'Knowledge', 'Admin', 'Project'],
        listItem: 'Product line',
        breadcrumb: ['Home', 'Pricing', 'Workbook'],
        command: {
            pages: [
                ['Pricing Workbook', 'layout-dashboard'],
                ['Knowledge Center', 'book-open'],
            ],
            settings: [
                ['Profile', 'user', '⌘P'],
                ['Admin Console', 'shield-check', '⌘A'],
            ],
        },
    },
});

export default defineConfig({
    name: 'Merrion Gold design system',
    label: 'Merrion',
    root: fileURLToPath(new URL('../..', import.meta.url)),
    tokens: designMdAdapter({
        file: 'DESIGN.md',
        // Which colour of DESIGN.md each role has, per mode (mirrors buildPalette() in the Design tab).
        roles: {
            background: { light: 'zinc-white', dark: 'zinc-950' },
            foreground: { light: 'ink-black', dark: 'zinc-50' },
            card: { light: 'zinc-white', dark: 'zinc-950' },
            'card-raised': { light: { hex: '#fafafa' }, dark: { hex: '#171717' } },
            muted: { light: 'zinc-100', dark: 'zinc-800' },
            'muted-foreground': { light: 'zinc-500', dark: 'zinc-400' },
            border: { light: 'zinc-200', dark: 'zinc-800' },
            ring: { light: 'zinc-900', dark: 'zinc-300' },
            sidebar: { light: 'zinc-50', dark: 'zinc-900' },
            ink: { light: 'zinc-900', dark: 'zinc-900' },
            primary: { light: 'merrion-gold', dark: 'merrion-gold' },
            'primary-text': { light: 'merrion-gold-text', dark: 'merrion-gold' },
            price: { light: 'price-teal', dark: 'price-teal' },
            'price-text': { light: 'price-teal-text', dark: 'price-teal' },
            buyback: { light: 'buyback-raspberry', dark: 'buyback-raspberry' },
            'buyback-text': { light: 'buyback-raspberry-text', dark: 'buyback-raspberry' },
            destructive: { light: 'signal-red', dark: 'night-red' },
            warning: { light: 'warning-tint', dark: 'warning-tint-night' },
            'warning-text': { light: 'warning-ink', dark: 'warning-ink-night' },
        },
        colourGroups: [
            { title: 'Brand and trade direction', roles: ['primary', 'primary-text', 'price', 'price-text', 'buyback', 'buyback-text'] },
            { title: 'Surfaces and text', roles: ['background', 'foreground', 'card', 'card-raised', 'muted', 'muted-foreground', 'border', 'ring', 'sidebar', 'ink'] },
            { title: 'Destructive', roles: ['destructive'] },
            { title: 'Metals', primitives: ['metal-gold', 'metal-silver', 'metal-platinum', 'metal-palladium'] },
        ],
        sampleText: { default: 'Gold €2,634 · Buyback €2,598' },
    }),

    // Names the existing Figma files already use. Do not change them.
    framePrefix: 'Merrion · ',
    pluginDataNamespace: 'merrion',
    textStylePrefix: 'Merrion/',
    settingsKey: 'merrion-plugin-settings',
    library: { kind: 'merrion-library', file: 'merrion-library.json', selectionFilePrefix: 'merrion-', dir: 'design/exports' },

    componentsDir: 'apps/web/src/components/ui',
    icons: { package: 'lucide-react', from: 'apps/web' },
    logo: {
        size: 64,
        svg: ({ read }) => {
            const markPath = /const MARK_PATH =\s*"([^"]+)"/.exec(read('apps/web/src/components/logo.tsx'))?.[1];
            if (!markPath) throw new Error('could not read MARK_PATH from components/logo.tsx');
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><g fill="none" stroke="#BB9765" stroke-linejoin="miter" stroke-linecap="round"><path stroke-width="1.25" d="${markPath}"/><circle cx="32" cy="32" r="11.5" stroke-width="3"/></g></svg>`;
        },
    },

    presets: [shadcn],
    // The engine files come from the package; the shadcn molecules and this app's builders after them.
    sourceFiles: [
        'core.js',
        'variables.js',
        shadcn.sourceFile,
        './design/figma/components.js',
        './design/figma/blocks.js',
        './design/figma/site.js',
        './design/figma/layouts.js',
        'export.js',
        'spec-check.js',
        'compose.js',
        'main.js',
    ],
    groupOrder: ['variables', 'molecules', 'components', 'blocks', 'site', 'layouts'],
    catalogue: ['./design/figma/catalogue.mjs'],
    prelude: "const STATUS = { emerald: '#10b981', amber: '#f59e0b', orange: '#f97316', red: '#ef4444', green: '#16a34a', redDark: '#dc2626' };",
    // Import tools/figma-plugin/dist/manifest.json in Figma (Plugins, Development, Import plugin from manifest).
    outDir: 'tools/figma-plugin/dist',
});
