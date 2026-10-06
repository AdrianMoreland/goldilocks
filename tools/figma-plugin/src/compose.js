/**
 * Compose: builds a design from a spec (the grammar export.js writes) using only library components and
 * tokens. The rules a spec must follow are in spec-check.js; this file does the building.
 */

const TEXT_ALIGN = { left: 'LEFT', center: 'CENTER', right: 'RIGHT' };

/** The options a variant set offers, so a wrong variant is reported with the right ones. */
function variantOptionsOf(set) {
    const options = {};
    for (const child of set.children) {
        for (const part of child.name.split(', ')) {
            const [key, value] = part.split('=');
            (options[key] = options[key] || new Set()).add(value);
        }
    }
    return options;
}

function applyTexts(inst, texts) {
    if (!texts) return;
    const nodes = inst.findAll((n) => n.type === 'TEXT');
    const entries = Array.isArray(texts) ? texts.map((value, i) => [String(i), value]) : Object.entries(texts);
    for (const [key, value] of entries) {
        const target = /^#?\d+$/.test(key) ? nodes[Number(key.replace('#', ''))] : nodes.find((n) => n.name === key);
        if (!target) throw new Error(`"${inst.name}" has no text called "${key}" (it has: ${nodes.map((n) => n.name).join(', ')})`);
        target.characters = String(value);
    }
}

async function buildNode(node) {
    const common = { fillW: node.fillW, fillH: node.fillH, x: node.x, y: node.y };
    if (node.kind === 'text') {
        return T(node.text, {
            s: node.style,
            c: node.color,
            align: node.align ? (TEXT_ALIGN[node.align] ?? node.align) : undefined,
            w: node.w,
            size: node.size,
            weight: node.weight,
            lh: node.lh,
            name: node.name,
            ...common,
        });
    }
    if (node.kind === 'instance') {
        const inst = await use(node.component, node.variant ?? {}, { name: node.name, w: node.w, ...common });
        applyTexts(inst, node.texts);
        return inst;
    }
    const kids = [];
    for (const child of node.children) kids.push(await buildNode(child));
    return F(
        {
            name: node.name,
            dir: node.dir,
            gap: node.gap,
            pad: node.pad,
            w: node.w,
            h: node.h,
            fill: node.fill,
            stroke: node.stroke,
            sw: node.sw,
            dashed: node.dashed,
            sides: node.sides,
            radius: node.radius,
            shadow: node.shadow,
            clip: node.clip,
            align: node.align,
            justify: node.justify,
            wrap: node.wrap,
            abs: node.abs,
            opacity: node.opacity,
            ...common,
        },
        kids,
    );
}

/** Builds the spec's root frame as a finished, placed item. Call inside a session (see main.js). */
async function composeSpec(spec) {
    const root = { fill: 'background', ...spec, name: `${PREFIX}Designs / ${spec.name ?? 'Untitled'}` };
    const frame = await buildNode(root);
    applyMode(frame);
    await flush();
    return place(frame);
}
