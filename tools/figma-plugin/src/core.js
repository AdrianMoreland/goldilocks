/**
 * Shared drawing helpers for every builder. build.mjs prepends the generated constants
 * (DATA, CATALOGUE, GROUPS, ICONS, LOGO_SVG) and concatenates the src files in order, so everything here
 * is one scope. Nothing below runs until the panel sends an import request (see main.js).
 *
 * The drawing vocabulary is small on purpose, so a builder reads like the markup it mirrors:
 *   F(opts, kids)      auto-layout frame (or component)     T(text, opts)   text
 *   Rect / Dot         rectangle / circle                    I(name, size)   Lucide icon
 *   use(id, variant)   instance of an imported component
 * Colours are names ('card', 'price-text', 'metal-gold') bound to the Figma variables, so a theme change
 * in Figma restyles everything; {hex}, {mix:[a, pct, b]} are literals for the few derived tints.
 */

const PREFIX = 'Merrion · ';
const BUILDERS = {};
const reg = (id, fn) => {
    BUILDERS[id] = fn;
};

const FLAGS = new Map();
const PENDING = [];
let CTX = null; // per-import state (mode, page, cursor, masters ...)
let FOUND = null; // the variables and styles, set by ensureFoundation()

const WHITE = { hex: '#ffffff' };
const STATUS = { emerald: '#10b981', amber: '#f59e0b', orange: '#f97316', red: '#ef4444', green: '#16a34a', redDark: '#dc2626' };

// ── colour ──────────────────────────────────────────────────────────────────

const toRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
};
const toHex = ({ r, g, b }) =>
    '#' +
    [r, g, b]
        .map((v) =>
            Math.round(v * 255)
                .toString(16)
                .padStart(2, '0'),
        )
        .join('');
const solid = (hex) => ({ type: 'SOLID', color: toRgb(hex) });

/** The hex a colour name has in the mode being drawn. */
function hexOf(name) {
    if (DATA.semantic[name]) return FOUND.hexFor(CTX.mode, name);
    if (DATA.primitives[name]) return DATA.primitives[name].toLowerCase();
    throw new Error(`Unknown colour "${name}"`);
}

function mixHex(a, pct, b) {
    const x = toRgb(a);
    const y = toRgb(b);
    const k = pct / 100;
    return toHex({ r: x.r * k + y.r * (1 - k), g: x.g * k + y.g * (1 - k), b: x.b * k + y.b * (1 - k) });
}

/** A colour spec -> a Figma paint, bound to a variable when it is a name. */
function paintOf(spec) {
    if (!spec) return null;
    if (typeof spec === 'string' || spec.role) {
        const name = typeof spec === 'string' ? spec : spec.role;
        const variable = DATA.semantic[name] ? FOUND.colorVariable(CTX.mode, name) : FOUND.primitive(name);
        const paint = figma.variables.setBoundVariableForPaint(solid(hexOf(name)), 'color', variable);
        if (spec.a !== undefined) paint.opacity = spec.a;
        return paint;
    }
    const hex = spec.mix ? mixHex(hexOf(spec.mix[0]), spec.mix[1], hexOf(spec.mix[2])) : spec.hex;
    const paint = solid(hex);
    if (spec.a !== undefined) paint.opacity = spec.a;
    return paint;
}

// Soft tint of a colour on the page background: the --tab-accent-soft recipe (16%) the pricing tools use.
const soft = (name, pct = 16) => ({ mix: [name, pct, 'background'] });

// ── geometry helpers ────────────────────────────────────────────────────────

const pad4 = (p) => {
    if (p === undefined) return [0, 0, 0, 0];
    if (typeof p === 'number') return [p, p, p, p];
    if (p.length === 2) return [p[0], p[1], p[0], p[1]];
    return p;
};
const MAIN = { start: 'MIN', center: 'CENTER', end: 'MAX', between: 'SPACE_BETWEEN' };
const CROSS = { start: 'MIN', center: 'CENTER', end: 'MAX', baseline: 'BASELINE' };

const SHADOWS = {
    xs: [{ y: 1, blur: 2, a: 0.05 }],
    sm: [
        { y: 1, blur: 3, a: 0.1 },
        { y: 1, blur: 2, a: 0.06 },
    ],
    md: [
        { y: 4, blur: 6, a: 0.1 },
        { y: 2, blur: 4, a: 0.06 },
    ],
    lg: [
        { y: 10, blur: 15, a: 0.1 },
        { y: 4, blur: 6, a: 0.05 },
    ],
};
const shadowEffects = (name) =>
    (SHADOWS[name] ?? []).map((s) => ({
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: s.a },
        offset: { x: 0, y: s.y },
        radius: s.blur,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
    }));

function tag(node, o) {
    FLAGS.set(node, { fillW: o.fillW, fillH: o.fillH, x: o.x, y: o.y });
    return node;
}

function adopt(parent, kid) {
    parent.appendChild(kid);
    const flags = FLAGS.get(kid);
    if (!flags) return;
    if (parent.layoutMode === 'NONE' || parent.type === 'PAGE') {
        if (flags.x !== undefined) kid.x = flags.x;
        if (flags.y !== undefined) kid.y = flags.y;
        return;
    }
    if (flags.fillW) kid.layoutSizingHorizontal = 'FILL';
    if (flags.fillH) kid.layoutSizingVertical = 'FILL';
}

function setRadius(node, radius) {
    if (radius === undefined) return;
    if (typeof radius === 'number') {
        node.cornerRadius = radius;
        return;
    }
    const variable = FOUND.shape.radius[radius];
    if (!variable) throw new Error(`Unknown radius "${radius}"`);
    for (const corner of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) node.setBoundVariable(corner, variable);
}

function setStroke(node, o) {
    if (!o.stroke) return;
    node.strokes = [paintOf(o.stroke)];
    node.strokeWeight = o.sw ?? 1;
    node.strokeAlign = o.strokeAlign ?? 'INSIDE';
    if (o.dashed) node.dashPattern = [4, 4];
    if (o.sides) {
        const w = o.sw ?? 1;
        node.strokeTopWeight = o.sides.includes('t') ? w : 0;
        node.strokeBottomWeight = o.sides.includes('b') ? w : 0;
        node.strokeLeftWeight = o.sides.includes('l') ? w : 0;
        node.strokeRightWeight = o.sides.includes('r') ? w : 0;
    }
}

// ── frames, text, shapes ────────────────────────────────────────────────────

/**
 * Auto-layout frame. dir 'V' (default) | 'H'; gap; pad (n | [v,h] | [t,r,b,l]); w/h fixed (otherwise hug);
 * fillW/fillH stretch inside the parent; align (cross axis) and justify (main axis); fill/stroke/radius/shadow;
 * kind 'component' makes a Figma component; abs:true is a free-position frame whose kids carry x/y.
 */
function F(o = {}, kids = []) {
    const f = o.kind === 'component' ? figma.createComponent() : figma.createFrame();
    f.name = o.name ?? 'Frame';
    f.fills = [];
    f.clipsContent = !!o.clip;
    if (o.abs) {
        f.layoutMode = 'NONE';
        f.resize(o.w ?? 100, o.h ?? 100);
    } else {
        f.layoutMode = o.dir === 'H' ? 'HORIZONTAL' : 'VERTICAL';
        f.itemSpacing = o.gap ?? 0;
        const [pt, pr, pb, pl] = pad4(o.pad);
        f.paddingTop = pt;
        f.paddingRight = pr;
        f.paddingBottom = pb;
        f.paddingLeft = pl;
        f.primaryAxisAlignItems = MAIN[o.justify ?? 'start'];
        f.counterAxisAlignItems = CROSS[o.align ?? 'start'];
        if (o.wrap) {
            f.layoutWrap = 'WRAP';
            if (o.rowGap !== undefined) f.counterAxisSpacing = o.rowGap;
        }
        if (o.w || o.h) f.resize(o.w ?? f.width, o.h ?? f.height);
        f.layoutSizingHorizontal = o.w ? 'FIXED' : 'HUG';
        f.layoutSizingVertical = o.h ? 'FIXED' : 'HUG';
    }
    if (o.fill) f.fills = [paintOf(o.fill)];
    setStroke(f, o);
    setRadius(f, o.radius);
    if (o.shadow) f.effects = shadowEffects(o.shadow);
    if (o.opacity !== undefined) f.opacity = o.opacity;
    tag(f, o);
    for (const kid of kids) if (kid) adopt(f, kid);
    return f;
}

/** Text. s: a Merrion text style ('h4', 'muted' ...) or size/weight/lh set directly; c: colour; w: fixed width. */
function T(text, o = {}) {
    const n = figma.createText();
    const weight = o.s ? (DATA.textStyles.find((t) => t.name === o.s)?.weight ?? 400) : (o.weight ?? 400);
    n.fontName = CTX.font[weight] ?? CTX.font[400];
    n.fontSize = o.size ?? 14;
    n.lineHeight = { unit: 'PIXELS', value: o.lh ?? Math.round((o.size ?? 14) * (o.size && o.size < 14 ? 1.33 : 1.43)) };
    if (o.ls !== undefined) n.letterSpacing = { unit: 'PERCENT', value: o.ls };
    n.characters = String(text);
    n.fills = [paintOf(o.c ?? 'foreground')];
    n.name = o.name ?? String(text).slice(0, 40);
    if (o.align) n.textAlignHorizontal = o.align;
    if (o.upper) n.textCase = 'UPPER';
    if (o.underline) n.textDecoration = 'UNDERLINE';
    if (o.opacity !== undefined) n.opacity = o.opacity;
    if (o.w || o.fillW) {
        n.textAutoResize = 'HEIGHT';
        if (o.w) n.resize(o.w, n.height);
    }
    if (o.s) {
        const style = CTX.styles[o.s];
        PENDING.push(() => n.setTextStyleIdAsync(style.id));
        if (o.weightOverride) n.fontName = CTX.font[o.weightOverride];
    }
    return tag(n, o);
}

/** Runs the text-style assignments queued by T() (the API only offers an async setter). */
async function flush() {
    while (PENDING.length) await PENDING.shift()();
}

function Rect(o = {}) {
    const r = figma.createRectangle();
    r.name = o.name ?? 'Rectangle';
    r.resize(o.w ?? 10, o.h ?? 10);
    r.fills = o.fill ? [paintOf(o.fill)] : [];
    setStroke(r, o);
    setRadius(r, o.radius);
    if (o.opacity !== undefined) r.opacity = o.opacity;
    if (o.shadow) r.effects = shadowEffects(o.shadow);
    return tag(r, o);
}

function Dot(size, fill, o = {}) {
    const e = figma.createEllipse();
    e.name = o.name ?? 'Dot';
    e.resize(size, size);
    e.fills = fill ? [paintOf(fill)] : [];
    setStroke(e, o);
    if (o.opacity !== undefined) e.opacity = o.opacity;
    return tag(e, o);
}

/** A straight line as a thin rectangle, so it can take a bound colour. */
const Line = (o) => Rect({ name: 'Line', fill: o.fill ?? 'border', w: o.w ?? 1, h: o.h ?? 1, ...o });

/** A Lucide icon drawn from the strokes embedded at build time. */
function I(name, size = 16, color = 'foreground', o = {}) {
    const svg = ICONS[name];
    if (!svg) throw new Error(`Icon "${name}" was not embedded; list it in an I('${name}') call and rebuild.`);
    const n = figma.createNodeFromSvg(svg);
    n.name = `icon/${name}`;
    const paint = paintOf(color);
    for (const d of n.findAll((x) => 'strokes' in x && x.strokes.length > 0)) d.strokes = [paint];
    n.rescale(size / 24);
    return tag(n, o);
}

function Logo(size = 32, o = {}) {
    const n = figma.createNodeFromSvg(LOGO_SVG);
    n.name = 'logo';
    n.rescale(size / 64);
    return tag(n, o);
}

/** A vector from SVG path data, for charts. */
function Path(data, o = {}) {
    const v = figma.createVector();
    v.name = o.name ?? 'Path';
    v.vectorPaths = [{ windingRule: 'NONZERO', data }];
    v.fills = o.fill ? [paintOf(o.fill)] : [];
    v.strokes = o.stroke ? [paintOf(o.stroke)] : [];
    if (o.stroke) {
        v.strokeWeight = o.sw ?? 1;
        v.strokeCap = 'ROUND';
        v.strokeJoin = 'ROUND';
    }
    return tag(v, o);
}

// ── components and instances ────────────────────────────────────────────────

const cartesian = (props) => props.reduce((acc, p) => acc.flatMap((c) => p.values.map((v) => ({ ...c, [p.name]: v }))), [{}]);
const variantName = (props, combo) => props.map((p) => `${p.name}=${combo[p.name]}`).join(', ');

/**
 * Builds one component per combination of `props` and merges them into a component set. `make(combo)` returns
 * a frame made with kind:'component'. Variants are laid out in a grid, columns following the last property.
 */
async function variantSet(id, label, props, make) {
    const combos = cartesian(props);
    const comps = [];
    for (const combo of combos) {
        const c = await make(combo);
        c.name = variantName(props, combo);
        CTX.page.appendChild(c);
        comps.push(c);
    }
    const cols = props[props.length - 1].values.length;
    const colW = [];
    const rowH = [];
    comps.forEach((c, i) => {
        colW[i % cols] = Math.max(colW[i % cols] ?? 0, c.width);
        rowH[Math.floor(i / cols)] = Math.max(rowH[Math.floor(i / cols)] ?? 0, c.height);
    });
    comps.forEach((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        c.x = colW.slice(0, col).reduce((a, b) => a + b + 20, 0);
        c.y = rowH.slice(0, row).reduce((a, b) => a + b + 20, 0);
    });
    const set = figma.combineAsVariants(comps, CTX.page);
    set.name = label;
    set.fills = [];
    return masterize(id, set);
}

/** Remembers a component (or set) as the master for `id`, tagged so a later run can find it again. */
function masterize(id, node) {
    node.setSharedPluginData('merrion', 'id', id);
    CTX.masters.set(id, node);
    return node;
}

async function loadMasters() {
    const found = CTX.page.findAllWithCriteria({ types: ['COMPONENT', 'COMPONENT_SET'] });
    for (const node of found) {
        const id = node.getSharedPluginData('merrion', 'id');
        if (id) CTX.masters.set(id, node);
    }
}

async function master(id) {
    if (!CTX.masters.has(id)) {
        if (!BUILDERS[id]) throw new Error(`No builder for "${id}"`);
        if (CTX.building.has(id)) throw new Error(`Circular dependency on "${id}"`);
        CTX.building.add(id);
        note(`Building ${id} (needed by another import)`);
        await BUILDERS[id]();
        await flush();
        CTX.building.delete(id);
    }
    return CTX.masters.get(id);
}

/** An instance of the master for `id`; `vals` picks the variant, o.text replaces the first text. */
async function use(id, vals = {}, o = {}) {
    const m = await master(id);
    let comp = m;
    if (m.type === 'COMPONENT_SET') {
        const options = variantOptionsOf(m);
        for (const [key, value] of Object.entries(vals)) {
            if (!options[key]) throw new Error(`"${id}" has no variant property "${key}" (it has: ${Object.keys(options).join(', ')})`);
            if (!options[key].has(String(value))) throw new Error(`"${id}" has no ${key}="${value}" (options: ${[...options[key]].join(', ')})`);
        }
        const base = Object.fromEntries(m.defaultVariant.name.split(', ').map((p) => p.split('=')));
        const merged = { ...base, ...vals };
        const want = Object.keys(base)
            .map((k) => `${k}=${merged[k]}`)
            .join(', ');
        comp = m.children.find((c) => c.name === want) ?? m.defaultVariant;
    }
    const inst = comp.createInstance();
    inst.name = o.name ?? inst.name;
    if (o.text !== undefined) {
        const t = inst.findOne((n) => n.type === 'TEXT');
        if (t) {
            t.characters = o.text;
            if (o.textColor) t.fills = [paintOf(o.textColor)];
        }
    }
    if (o.w) {
        inst.resize(o.w, inst.height);
    }
    return tag(inst, o);
}

// ── delivery: wrapper, placement, mode ──────────────────────────────────────

function applyMode(node) {
    if (CTX.mode === 'dark' && FOUND.darkModeId) node.setExplicitVariableModeForCollection(FOUND.colorsCollection, FOUND.darkModeId);
}

/** The titled frame every imported item is delivered in, so a re-import can replace exactly that item. */
function wrapper(groupLabel, title, desc, content, o = {}) {
    const w = F(
        { name: `${PREFIX}${groupLabel} / ${title}`, gap: 20, pad: 32, fill: 'background', stroke: 'border', radius: 'xl', w: o.w },
        [
            T(title, { s: 'h3', c: 'foreground' }),
            desc ? T(desc, { s: 'muted', c: 'muted-foreground', name: 'description' }) : null,
            ...content,
        ],
    );
    applyMode(w);
    return w;
}

function startRun() {
    let bottom = 0;
    for (const n of CTX.page.children) if (n.name.startsWith(PREFIX)) bottom = Math.max(bottom, n.y + n.height);
    CTX.cursor = { x: 0, y: bottom ? bottom + 160 : 0, rowH: 0 };
}

function newRow() {
    if (CTX.cursor.x === 0) return;
    CTX.cursor = { x: 0, y: CTX.cursor.y + CTX.cursor.rowH + 120, rowH: 0 };
}

/** Puts a finished item on the page: over its previous copy when replacing, else in the next free slot. */
function place(node) {
    const old = CTX.page.children.find((n) => n.name === node.name && n !== node);
    CTX.page.appendChild(node);
    if (old && CTX.settings.replace) {
        node.x = old.x;
        node.y = old.y;
        old.remove();
    } else {
        if (old) node.name += ' (new)';
        const c = CTX.cursor;
        if (c.x > 0 && c.x + node.width > 4800) newRow();
        node.x = CTX.cursor.x;
        node.y = CTX.cursor.y;
        CTX.cursor.x += node.width + 120;
        CTX.cursor.rowH = Math.max(CTX.cursor.rowH, node.height);
    }
    CTX.created.push(node);
    return node;
}

const note = (text) => figma.ui.postMessage({ type: 'progress', text });
