/** The few mdast node fields this plugin touches (avoids a direct dependency on the mdast types package). */
interface MdNode {
    type: string;
    value?: string;
    children?: MdNode[];
    data?: { hName?: string; hProperties?: Record<string, string> };
}

const SKIP = new Set(['inlineCode', 'code']);

/**
 * remark plugin: the → in a screen path ("Home → Post") is drawn in the
 * accent colour, so a path reads as a route and not as stray punctuation.
 */
export function remarkKbArrows() {
    return (tree: MdNode) => {
        const walk = (node: MdNode) => {
            if (!node.children) return;
            const next: MdNode[] = [];
            for (const child of node.children) {
                if (child.type === 'text' && child.value?.includes('→')) {
                    child.value.split(/(→)/).forEach((part) => {
                        if (part === '') return;
                        if (part === '→') {
                            next.push({
                                type: 'emphasis',
                                data: { hName: 'span', hProperties: { className: 'kb-arrow' } },
                                children: [{ type: 'text', value: '→' }],
                            });
                        } else {
                            next.push({ type: 'text', value: part });
                        }
                    });
                } else {
                    if (!SKIP.has(child.type)) walk(child);
                    next.push(child);
                }
            }
            node.children = next;
        };
        walk(tree);
    };
}
