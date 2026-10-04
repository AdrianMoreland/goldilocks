/**
 * Foundation: the variable collections and text styles every other builder binds to, plus the reference
 * frames for the Variables list. Everything is matched by name and updated, so re-running is safe.
 */

const FONT_STYLES = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold' };
const METALS = ['metal-gold', 'metal-silver', 'metal-platinum', 'metal-palladium'];

async function findCollection(name) {
    const all = await figma.variables.getLocalVariableCollectionsAsync();
    return all.find((c) => c.name === name) ?? null;
}

async function variablesByName(collection) {
    const map = new Map();
    for (const id of collection.variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) map.set(variable.name, variable);
    }
    return map;
}

function ensureVariable(collection, existing, name, type) {
    let variable = existing.get(name);
    if (!variable) {
        variable = figma.variables.createVariable(name, collection, type);
        existing.set(name, variable);
    }
    return variable;
}

/**
 * Colors wants Light and Dark modes. Figma's free plan allows one mode per collection, so if adding Dark is
 * refused the dark values go into a second collection; everything else only asks colorVariable(mode, name).
 */
async function setupColors() {
    const notes = [];
    const primitives = (await findCollection('Primitives')) ?? figma.variables.createVariableCollection('Primitives');
    const primitiveVars = await variablesByName(primitives);
    for (const [name, hex] of Object.entries(DATA.primitives)) {
        ensureVariable(primitives, primitiveVars, name, 'COLOR').setValueForMode(primitives.modes[0].modeId, toRgb(hex));
    }

    const colors = (await findCollection('Colors')) ?? figma.variables.createVariableCollection('Colors');
    const lightId = colors.modes[0].modeId;
    colors.renameMode(lightId, 'Light');
    let darkCollection = null;
    let darkId = colors.modes.find((m) => m.name === 'Dark')?.modeId;
    if (!darkId) {
        try {
            darkId = colors.addMode('Dark');
        } catch {
            darkCollection = (await findCollection('Colors (Dark)')) ?? figma.variables.createVariableCollection('Colors (Dark)');
            darkId = darkCollection.modes[0].modeId;
            darkCollection.renameMode(darkId, 'Dark');
            notes.push('One mode per collection on this plan: dark values are in a separate "Colors (Dark)" collection.');
        }
    }

    const lightVars = await variablesByName(colors);
    const darkVars = darkCollection ? await variablesByName(darkCollection) : lightVars;
    const target = {
        light: { collection: colors, modeId: lightId, vars: lightVars },
        dark: { collection: darkCollection ?? colors, modeId: darkId, vars: darkVars },
    };
    for (const [name, roles] of Object.entries(DATA.semantic)) {
        for (const mode of ['light', 'dark']) {
            const { collection, modeId, vars } = target[mode];
            const variable = ensureVariable(collection, vars, name, 'COLOR');
            const role = roles[mode];
            if (role.token) variable.setValueForMode(modeId, figma.variables.createVariableAlias(primitiveVars.get(role.token)));
            else variable.setValueForMode(modeId, toRgb(role.hex));
        }
    }

    return {
        notes,
        colorsCollection: colors,
        darkModeId: darkCollection ? null : darkId,
        primitive: (name) => primitiveVars.get(name),
        colorVariable: (mode, name) => target[mode].vars.get(name),
        hexFor: (mode, name) => {
            const role = DATA.semantic[name][mode];
            return (role.token ? DATA.primitives[role.token] : role.hex).toLowerCase();
        },
    };
}

async function setupShape() {
    const shape = (await findCollection('Shape')) ?? figma.variables.createVariableCollection('Shape');
    const existing = await variablesByName(shape);
    const modeId = shape.modes[0].modeId;
    const radius = {};
    const spacing = {};
    for (const [name, px] of Object.entries(DATA.radius)) {
        const variable = ensureVariable(shape, existing, `radius/${name}`, 'FLOAT');
        variable.setValueForMode(modeId, px);
        radius[name] = variable;
    }
    for (const [name, px] of Object.entries(DATA.spacing)) {
        const variable = ensureVariable(shape, existing, `spacing/${name}`, 'FLOAT');
        variable.setValueForMode(modeId, px);
        spacing[name] = variable;
    }
    return { radius, spacing };
}

async function loadFont(family, weight) {
    const wanted = FONT_STYLES[weight] ?? 'Regular';
    for (const style of [wanted, weight >= 600 ? 'Bold' : 'Regular', 'Regular']) {
        try {
            await figma.loadFontAsync({ family, style });
            return { family, style };
        } catch {
            // Try the next closest style: the family is installed but not every weight is.
        }
    }
    throw new Error(`Font "${family}" is not available in Figma.`);
}

async function setupTextStyles() {
    const existing = await figma.getLocalTextStylesAsync();
    const styles = {};
    const missing = [];
    for (const t of DATA.textStyles) {
        const name = `Merrion/${t.name}`;
        const style = existing.find((s) => s.name === name) ?? figma.createTextStyle();
        style.name = name;
        const fontName = await loadFont(t.family, t.weight);
        if (fontName.style !== (FONT_STYLES[t.weight] ?? 'Regular')) missing.push(`${t.name} (${t.weight})`);
        style.fontName = fontName;
        style.fontSize = t.size;
        style.lineHeight = t.lineHeight;
        style.letterSpacing = { unit: 'PERCENT', value: t.letterSpacing };
        styles[t.name] = style;
    }
    return { styles, missing };
}

/** Creates or updates every variable and text style, and loads the fonts the builders draw with. */
async function ensureFoundation() {
    FOUND = await setupColors();
    FOUND.shape = await setupShape();
    const { styles, missing } = await setupTextStyles();
    CTX.styles = styles;
    CTX.notes.push(...FOUND.notes);
    if (missing.length) CTX.notes.push(`Missing font weights, used the nearest: ${missing.join(', ')}.`);
    const family = DATA.textStyles[0]?.family ?? 'Inter';
    CTX.font = {};
    for (const weight of [400, 500, 600, 700, 800]) CTX.font[weight] = await loadFont(family, weight);
}

// ── Reference frames ────────────────────────────────────────────────────────

const specRow = (name, fill, hexLabel, o = {}) =>
    F({ name, dir: 'H', gap: 12, align: 'center' }, [
        Rect({ name: 'swatch', w: 40, h: 40, fill, stroke: o.noStroke ? undefined : 'border', radius: 6 }),
        F({ name: 'labels', gap: 2 }, [T(name, { s: 'field-label' }), T(hexLabel, { s: 'muted', c: 'muted-foreground' })]),
    ]);

const groupOf = (title, rows) => F({ name: title, gap: 10 }, [T(title.toUpperCase(), { s: 'section-label', c: 'muted-foreground' }), ...rows]);

function colorsFrame(mode) {
    const previous = CTX.mode;
    CTX.mode = mode;
    const label = mode === 'light' ? 'Light' : 'Dark';
    const roles = (names) => names.map((n) => specRow(n, n, FOUND.hexFor(mode, n)));
    const root = F({ name: `${PREFIX}Colors ${label}`, gap: 24, pad: 32, w: 560, fill: 'background' }, [
        T(`Colors · ${label}`, { s: 'h3' }),
        groupOf('Brand and trade direction', roles(['primary', 'primary-text', 'price', 'price-text', 'buyback', 'buyback-text'])),
        groupOf('Surfaces and text', roles(['background', 'foreground', 'card', 'card-raised', 'muted', 'muted-foreground', 'border', 'ring', 'sidebar', 'ink'])),
        groupOf('Destructive', roles(['destructive'])),
        groupOf('Metals', METALS.map((n) => specRow(n, n, DATA.primitives[n].toLowerCase(), { noStroke: true }))),
    ]);
    applyMode(root);
    CTX.mode = previous;
    return root;
}

function typographyFrame() {
    const rows = DATA.textStyles.map((t) => {
        const lh = t.lineHeight.unit === 'PIXELS' ? t.lineHeight.value : `${t.lineHeight.value}%`;
        const spec = `${t.name} · ${t.weight} · ${t.size}/${lh}${t.tabularFigures ? ' · tabular figures (set in code)' : ''}`;
        return F({ name: t.name, gap: 4 }, [T(spec, { s: 'label', c: 'muted-foreground' }), T('Gold €2,634 · Buyback €2,598', { s: t.name })]);
    });
    const root = F({ name: `${PREFIX}Typography`, gap: 20, pad: 32, w: 720, fill: 'background' }, [T('Typography', { s: 'h3' }), ...rows]);
    applyMode(root);
    return root;
}

function radiusFrame() {
    const cells = Object.entries(DATA.radius).map(([name, px]) => {
        const box = Rect({ name: `radius/${name}`, w: 56, h: 56, fill: 'muted', radius: name });
        return F({ name, gap: 6 }, [box, T(`${name} · ${px >= 9999 ? 'full' : `${px}px`}`, { s: 'label', c: 'muted-foreground' })]);
    });
    const root = F({ name: `${PREFIX}Radius`, gap: 20, pad: 32, fill: 'background' }, [T('Radius', { s: 'h3' }), F({ name: 'scale', dir: 'H', gap: 16 }, cells)]);
    applyMode(root);
    return root;
}

function spacingFrame() {
    const rows = Object.entries(DATA.spacing).map(([name, px]) =>
        F({ name, dir: 'H', gap: 12, align: 'center' }, [Rect({ name: 'bar', w: Math.max(px * 4, 2), h: 12, fill: 'primary' }), T(`${name} · ${px}px`, { s: 'label', c: 'muted-foreground' })]),
    );
    const root = F({ name: `${PREFIX}Spacing`, gap: 12, pad: 32, w: 420, fill: 'background' }, [T('Spacing', { s: 'h3' }), ...rows]);
    applyMode(root);
    return root;
}

reg('variables/colors', async () => {
    place(colorsFrame('light'));
    place(colorsFrame('dark'));
});
reg('variables/typography', async () => {
    place(typographyFrame());
});
reg('variables/radius', async () => {
    place(radiusFrame());
});
reg('variables/spacing', async () => {
    place(spacingFrame());
});
