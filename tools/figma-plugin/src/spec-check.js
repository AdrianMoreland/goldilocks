/**
 * The drift gate: what a design spec may contain. Used by Compose inside Figma and, through
 * dist/spec-check.cjs, by check-spec.mjs on the command line, so both apply exactly the same rules.
 *
 * A node is a frame, a text or an instance of a library component. Colours, text styles and radii must be
 * names from the design tokens. A raw colour or a loose shape is rejected with the path of the node, so a
 * new look has to arrive as a component or a token, not as one-off drawing.
 */

const KINDS = ['frame', 'text', 'instance'];
const DIRS = ['H', 'V'];
const SHADOW_NAMES = ['xs', 'sm', 'md', 'lg']; // same keys as SHADOWS in core.js

const isColourName = (name) => Boolean(DATA.semantic[name] || DATA.primitives[name]);

function colourProblem(spec, allowLiteral) {
    if (spec === undefined || spec === null) return null;
    if (typeof spec === 'string') return isColourName(spec) ? null : `"${spec}" is not a colour variable`;
    if (spec.role) return isColourName(spec.role) ? null : `"${spec.role}" is not a colour variable`;
    if (spec.mix) return spec.mix.length === 3 && isColourName(spec.mix[0]) && isColourName(spec.mix[2]) ? null : 'a mix needs [variable, percent, variable]';
    if (spec.hex) return allowLiteral ? null : `raw colour ${spec.hex}: use a colour variable`;
    return 'unrecognised colour';
}

/** Component ids a spec may use: everything with a builder except variables and whole-page layouts. */
const usableComponents = () => CATALOGUE.filter((e) => e.builder && e.group !== 'variables' && e.group !== 'layouts').map((e) => e.id);

/** Structure and token checks that need no Figma file. Returns every problem, with the path of the node. */
function checkSpec(spec) {
    const errors = [];
    const warnings = [];
    const available = usableComponents();
    const allowLiteral = spec.allowLiteralColours === true;
    if (allowLiteral) warnings.push('allowLiteralColours is on: raw colours are accepted and will not follow the theme.');

    const visit = (node, path) => {
        if (!node || typeof node !== 'object') return errors.push(`${path}: not an object`);
        if (!KINDS.includes(node.kind)) {
            const hint = node.kind === 'shape' ? 'draw it as a library component, or propose a new component first' : `use one of ${KINDS.join(', ')}`;
            return errors.push(`${path}: kind "${node.kind}" is not allowed (${hint})`);
        }
        const here = `${path} ${node.name ? `"${node.name}"` : node.kind}`;
        for (const field of ['fill', 'stroke', 'color']) {
            const problem = colourProblem(node[field], allowLiteral);
            if (problem) errors.push(`${here}: ${field}: ${problem}`);
        }
        if (node.dir !== undefined && !DIRS.includes(node.dir)) errors.push(`${here}: dir must be "H" or "V"`);
        if (typeof node.radius === 'string' && !(node.radius in DATA.radius)) errors.push(`${here}: radius "${node.radius}" is not a radius variable (${Object.keys(DATA.radius).join(', ')})`);
        if (typeof node.radius === 'number') warnings.push(`${here}: numeric radius ${node.radius}; prefer a radius variable`);
        if (node.shadow !== undefined && !SHADOW_NAMES.includes(node.shadow)) errors.push(`${here}: shadow must be ${SHADOW_NAMES.join(', ')}`);

        if (node.kind === 'frame') {
            if (!Array.isArray(node.children)) errors.push(`${here}: a frame needs a children array`);
            else node.children.forEach((child, i) => visit(child, `${path}/${i}`));
        } else if (node.kind === 'text') {
            if (typeof node.text !== 'string') errors.push(`${here}: text needs a string`);
            if (node.style !== undefined && !DATA.textStyles.some((t) => t.name === node.style)) errors.push(`${here}: style "${node.style}" is not a text style (${DATA.textStyles.map((t) => t.name).join(', ')})`);
            if (node.style === undefined && node.size === undefined) errors.push(`${here}: give a text style (or a size)`);
        } else if (node.kind === 'instance') {
            if (!node.component) errors.push(`${here}: instance has no component id`);
            else if (!available.includes(node.component)) errors.push(`${here}: "${node.component}" is not a library component. Available: ${available.join(', ')}`);
        }
        return undefined;
    };

    if (spec.kind !== 'frame') errors.push('The top level must be a frame (kind: "frame").');
    else visit(spec, '#');
    return { errors, warnings };
}
