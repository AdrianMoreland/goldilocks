/**
 * Export: turns the selected frame, or the whole library, into JSON that can be saved in the repo.
 *
 * The selection export uses the same grammar compose.js reads (frame / text / instance), so an export can be
 * edited and built again. Anything that is not a library component or a token is exported but reported in
 * `warnings`: that list is the drift report (raw colours, loose shapes, overridden fills, detached parts).
 */

const SCHEMA = 1;
const ALIGN_OUT = { MIN: 'start', CENTER: 'center', MAX: 'end', SPACE_BETWEEN: 'between', BASELINE: 'baseline' };
const WEIGHT_OF = { Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700, 'Extra Bold': 800 };
const STYLE_OVERRIDES = ['fills', 'strokes', 'effects', 'cornerRadius', 'topLeftRadius', 'strokeWeight', 'itemSpacing', 'paddingLeft', 'paddingTop', 'fontSize', 'fontName', 'textStyleId'];
const round = (n) => Math.round(n * 100) / 100;

function newState() {
    const warnings = [];
    return {
        warnings,
        names: new Map(),
        warn(message) {
            if (!warnings.includes(message)) warnings.push(message);
        },
    };
}

async function tokenName(id, state) {
    if (!state.names.has(id)) {
        const variable = await figma.variables.getVariableByIdAsync(id);
        state.names.set(id, variable ? variable.name : null);
    }
    return state.names.get(id);
}

async function exportPaint(node, field, state) {
    const paints = node[field];
    if (!paints || paints === figma.mixed || !paints.length) return undefined;
    const paint = paints[0];
    if (paint.visible === false) return undefined;
    const alias = node.boundVariables && node.boundVariables[field] && node.boundVariables[field][0];
    if (alias && alias.id) {
        const name = await tokenName(alias.id, state);
        if (name) return paint.opacity !== undefined && paint.opacity < 1 ? { role: name, a: round(paint.opacity) } : name;
    }
    if (paint.type === 'SOLID') {
        const hex = toHex(paint.color);
        state.warn(`"${node.name}": ${field} is a raw colour ${hex}, not a variable`);
        return { hex };
    }
    state.warn(`"${node.name}": ${field} is a ${paint.type.toLowerCase()} paint, not a token`);
    return undefined;
}

async function exportRadius(node, state) {
    if (node.cornerRadius === undefined) return undefined;
    const alias = node.boundVariables && node.boundVariables.topLeftRadius;
    if (alias && alias.id) {
        const name = await tokenName(alias.id, state);
        if (name) return name.replace(/^radius\//, '');
    }
    if (node.cornerRadius === figma.mixed) {
        state.warn(`"${node.name}": corners have different radii`);
        return undefined;
    }
    if (node.cornerRadius) state.warn(`"${node.name}": corner radius ${node.cornerRadius} is a number, not a radius variable`);
    return node.cornerRadius || undefined;
}

/** Size and position, in the terms compose.js reads: fillW/fillH inside auto layout, x/y inside a free frame. */
function layoutBits(node, parent, out) {
    const inAuto = parent && (parent.layoutMode === 'HORIZONTAL' || parent.layoutMode === 'VERTICAL');
    if (!parent) {
        out.w = round(node.width);
        if (node.layoutMode === 'NONE' || node.layoutSizingVertical === 'FIXED') out.h = round(node.height);
    } else if (inAuto) {
        if (node.layoutSizingHorizontal === 'FILL') out.fillW = true;
        else if (node.layoutSizingHorizontal === 'FIXED') out.w = round(node.width);
        if (node.layoutSizingVertical === 'FILL') out.fillH = true;
        else if (node.layoutSizingVertical === 'FIXED') out.h = round(node.height);
    } else {
        out.x = round(node.x);
        out.y = round(node.y);
        out.w = round(node.width);
        out.h = round(node.height);
    }
}

function shadowOf(node) {
    const drop = (node.effects || []).find((e) => e.type === 'DROP_SHADOW' && e.visible !== false);
    if (!drop) return undefined;
    return drop.radius <= 2 ? 'xs' : drop.radius <= 3 ? 'sm' : drop.radius <= 6 ? 'md' : 'lg';
}

async function exportFrame(node, parent, state) {
    const out = { kind: 'frame', name: node.name };
    if (node.layoutMode === 'NONE') out.abs = true;
    else {
        out.dir = node.layoutMode === 'HORIZONTAL' ? 'H' : 'V';
        if (node.itemSpacing) out.gap = node.itemSpacing;
        const pad = [node.paddingTop, node.paddingRight, node.paddingBottom, node.paddingLeft];
        if (pad.some((p) => p)) out.pad = pad;
        if (ALIGN_OUT[node.counterAxisAlignItems] !== 'start') out.align = ALIGN_OUT[node.counterAxisAlignItems];
        if (ALIGN_OUT[node.primaryAxisAlignItems] !== 'start') out.justify = ALIGN_OUT[node.primaryAxisAlignItems];
        if (node.layoutWrap === 'WRAP') out.wrap = true;
    }
    const fill = await exportPaint(node, 'fills', state);
    if (fill) out.fill = fill;
    if (node.strokes && node.strokes.length) {
        const stroke = await exportPaint(node, 'strokes', state);
        if (stroke) {
            out.stroke = stroke;
            const sides = [['t', node.strokeTopWeight], ['r', node.strokeRightWeight], ['b', node.strokeBottomWeight], ['l', node.strokeLeftWeight]];
            const present = sides.filter(([, w]) => w > 0);
            if (sides[0][1] !== undefined && present.length > 0 && present.length < 4) {
                out.sides = present.map(([s]) => s).join('');
                out.sw = Math.max(...present.map(([, w]) => w));
            } else if (typeof node.strokeWeight === 'number' && node.strokeWeight !== 1) out.sw = node.strokeWeight;
            if (node.dashPattern && node.dashPattern.length) out.dashed = true;
        }
    }
    const radius = await exportRadius(node, state);
    if (radius !== undefined) out.radius = radius;
    const shadow = shadowOf(node);
    if (shadow) out.shadow = shadow;
    if (node.clipsContent) out.clip = true;
    if (node.opacity !== undefined && node.opacity < 1) out.opacity = round(node.opacity);
    layoutBits(node, parent, out);
    out.children = [];
    for (const child of node.children) {
        if (child.visible === false) continue;
        const exported = await exportNode(child, node, state);
        if (exported) out.children.push(exported);
    }
    return out;
}

async function exportText(node, parent, state) {
    const out = { kind: 'text', text: node.characters };
    if (node.name && node.name !== node.characters.slice(0, 40)) out.name = node.name;
    const styleId = node.textStyleId;
    const style = styleId && styleId !== figma.mixed ? await figma.getStyleByIdAsync(styleId) : null;
    if (style) out.style = style.name.replace(/^Merrion\//, '');
    else {
        out.size = node.fontSize === figma.mixed ? undefined : node.fontSize;
        out.weight = node.fontName === figma.mixed ? undefined : (WEIGHT_OF[node.fontName.style] ?? 400);
        state.warn(`"${out.name ?? out.text}": text has no Merrion text style (size ${out.size}, weight ${out.weight})`);
    }
    const color = await exportPaint(node, 'fills', state);
    if (color && color !== 'foreground') out.color = color;
    if (node.textAlignHorizontal && node.textAlignHorizontal !== 'LEFT') out.align = node.textAlignHorizontal.toLowerCase();
    layoutBits(node, parent, out);
    if (out.w !== undefined && node.textAutoResize === 'WIDTH_AND_HEIGHT') delete out.w;
    delete out.h;
    return out;
}

async function exportInstance(node, parent, state) {
    const main = await node.getMainComponentAsync();
    const holder = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
    const id = holder ? holder.getSharedPluginData('merrion', 'id') : '';
    const out = { kind: 'instance', component: id || null };
    if (!id) {
        out.componentName = holder ? holder.name : '(main component missing)';
        state.warn(`"${node.name}": instance of "${out.componentName}", which is not a Merrion library component`);
    }
    if (holder && node.name !== holder.name && node.name !== main.name) out.name = node.name;
    const variant = {};
    for (const [key, prop] of Object.entries(node.componentProperties || {})) if (prop.type === 'VARIANT') variant[key] = prop.value;
    if (Object.keys(variant).length) out.variant = variant;

    if (main) {
        const mine = node.findAll((n) => n.type === 'TEXT');
        const base = main.findAll((n) => n.type === 'TEXT');
        const counts = {};
        for (const t of mine) counts[t.name] = (counts[t.name] || 0) + 1;
        const texts = {};
        mine.forEach((t, i) => {
            if (base[i] && base[i].characters !== t.characters) texts[counts[t.name] === 1 ? t.name : `#${i}`] = t.characters;
        });
        if (Object.keys(texts).length) out.texts = texts;
    }
    for (const override of node.overrides || []) {
        const bad = override.overriddenFields.filter((f) => STYLE_OVERRIDES.includes(f));
        if (!bad.length) continue;
        const target = await figma.getNodeByIdAsync(override.id);
        state.warn(`"${node.name}" › "${target ? target.name : override.id}": ${bad.join(', ')} overridden on the instance`);
    }
    layoutBits(node, parent, out);
    return out;
}

async function exportNode(node, parent, state) {
    switch (node.type) {
        case 'FRAME':
        case 'COMPONENT':
        case 'COMPONENT_SET':
            return exportFrame(node, parent, state);
        case 'TEXT':
            return exportText(node, parent, state);
        case 'INSTANCE':
            return exportInstance(node, parent, state);
        case 'RECTANGLE':
        case 'ELLIPSE':
        case 'VECTOR':
        case 'LINE':
        case 'POLYGON':
        case 'STAR':
        case 'BOOLEAN_OPERATION': {
            state.warn(`"${node.name}" is a loose ${node.type.toLowerCase()}, not a library component`);
            const out = { kind: 'shape', shape: node.type.toLowerCase(), name: node.name };
            layoutBits(node, parent, out);
            const fill = await exportPaint(node, 'fills', state);
            if (fill) out.fill = fill;
            return out;
        }
        default:
            state.warn(`"${node.name}" (${node.type}) was skipped: not supported by the export`);
            return null;
    }
}

const countComponents = (node, tally = {}) => {
    if (node.kind === 'instance') tally[node.component ?? '(not in library)'] = (tally[node.component ?? '(not in library)'] || 0) + 1;
    for (const child of node.children || []) countComponents(child, tally);
    return tally;
};

async function exportSelection() {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) throw new Error('Select exactly one frame on the page, then export.');
    const state = newState();
    let root = await exportNode(selection[0], null, state);
    if (!root) throw new Error('That selection cannot be exported.');
    if (root.kind !== 'frame') root = { kind: 'frame', name: selection[0].name, dir: 'V', children: [root] };
    const design = { schema: SCHEMA, ...root, exportedAt: new Date().toISOString(), source: { file: figma.root.name, page: figma.currentPage.name } };
    design.warnings = state.warnings;
    return { json: JSON.stringify(design, null, 2), name: root.name, components: countComponents(root), warnings: state.warnings };
}

// ── library ─────────────────────────────────────────────────────────────────

async function resolveHex(variable, modeId, depth = 0) {
    const value = variable.valuesByMode[modeId];
    if (value && value.type === 'VARIABLE_ALIAS' && depth < 6) {
        const target = await figma.variables.getVariableByIdAsync(value.id);
        const collection = await figma.variables.getVariableCollectionByIdAsync(target.variableCollectionId);
        return resolveHex(target, collection.modes[0].modeId, depth + 1);
    }
    return toHex(value);
}

async function collectionVariables(name) {
    const collection = await findCollection(name);
    if (!collection) return null;
    const list = [];
    for (const id of collection.variableIds) {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) list.push(variable);
    }
    return { collection, list };
}

async function libraryTokens() {
    const tokens = { colors: {}, primitives: {}, radius: {}, spacing: {}, textStyles: [] };
    const primitives = await collectionVariables('Primitives');
    if (primitives) for (const v of primitives.list) tokens.primitives[v.name] = await resolveHex(v, primitives.collection.modes[0].modeId);
    const colors = await collectionVariables('Colors');
    const dark = await collectionVariables('Colors (Dark)');
    if (colors) {
        const light = colors.collection.modes.find((m) => m.name === 'Light') || colors.collection.modes[0];
        const darkMode = colors.collection.modes.find((m) => m.name === 'Dark');
        for (const v of colors.list) tokens.colors[v.name] = { light: await resolveHex(v, light.modeId) };
        if (darkMode) for (const v of colors.list) tokens.colors[v.name].dark = await resolveHex(v, darkMode.modeId);
        else if (dark) for (const v of dark.list) if (tokens.colors[v.name]) tokens.colors[v.name].dark = await resolveHex(v, dark.collection.modes[0].modeId);
    }
    const shape = await collectionVariables('Shape');
    if (shape) {
        for (const v of shape.list) {
            const value = v.valuesByMode[shape.collection.modes[0].modeId];
            if (v.name.startsWith('radius/')) tokens.radius[v.name.slice(7)] = value;
            else if (v.name.startsWith('spacing/')) tokens.spacing[v.name.slice(8)] = value;
        }
    }
    for (const style of await figma.getLocalTextStylesAsync()) {
        tokens.textStyles.push({ name: style.name.replace(/^Merrion\//, ''), size: style.fontSize, weight: style.fontName.style });
    }
    return tokens;
}

async function exportLibrary() {
    let page = figma.root.children.find((p) => p.name === PAGE_NAME) || figma.currentPage;
    await page.loadAsync();
    const masters = new Map();
    for (const node of page.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] })) {
        const id = node.getSharedPluginData('merrion', 'id');
        if (id) masters.set(id, node);
    }
    const byId = Object.fromEntries(CATALOGUE.map((e) => [e.id, e]));
    const components = [];
    for (const [id, node] of masters) {
        const entry = byId[id];
        const variants = {};
        if (node.type === 'COMPONENT_SET') {
            for (const child of node.children) {
                for (const part of child.name.split(', ')) {
                    const [key, value] = part.split('=');
                    (variants[key] = variants[key] || []).includes(value) || variants[key].push(value);
                }
            }
        }
        const sample = node.type === 'COMPONENT_SET' ? node.defaultVariant : node;
        components.push({
            id,
            name: node.name,
            type: node.type === 'COMPONENT_SET' ? 'set' : 'component',
            variants,
            texts: sample.findAll((n) => n.type === 'TEXT').map((t) => t.name),
            size: { w: round(sample.width), h: round(sample.height) },
            source: entry ? entry.covers : [],
            needs: entry && entry.needs ? entry.needs : [],
        });
    }
    components.sort((a, b) => a.id.localeCompare(b.id));
    const notImported = CATALOGUE.filter((e) => e.builder && !masters.has(e.id) && e.group !== 'variables' && e.group !== 'layouts').map((e) => ({ id: e.id, label: e.label, group: e.group }));
    const library = { schema: SCHEMA, kind: 'merrion-library', exportedAt: new Date().toISOString(), source: { file: figma.root.name, page: page.name }, components, notImported, tokens: await libraryTokens() };
    return { json: JSON.stringify(library, null, 2), components: components.length, notImported: notImported.length };
}
