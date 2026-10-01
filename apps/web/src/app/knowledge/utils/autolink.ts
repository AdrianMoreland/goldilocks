import { termRegExp, type KbTerm } from '@goldilocks/shared-types';

/** The few mdast node fields this plugin touches (avoids a direct dependency on the mdast types package). */
interface MdNode {
    type: string;
    value?: string;
    url?: string;
    title?: string | null;
    children?: MdNode[];
    data?: { hProperties?: Record<string, string> };
}

/** Text inside these is never turned into a link: a link in a link, code, a heading, or a TODO chip (itself a link). */
const SKIP = new Set(['link', 'linkReference', 'inlineCode', 'code', 'heading', 'definition']);

export interface AutolinkTarget {
    href: string;
    /** Shown as the tooltip, e.g. "Pricing › VAT". */
    label: string;
}

/**
 * remark plugin: links the first mention, within this section, of each term it
 * is given. Which terms a section gets is decided once per article
 * (planAutolinks), so a term is never linked twice across sections.
 */
export function remarkKbTerms(terms: KbTerm[], resolve: (term: KbTerm) => AutolinkTarget | null) {
    const matchers = terms.flatMap((term) => {
        const target = resolve(term);
        return target ? [{ term, target, regex: termRegExp(term) }] : [];
    });

    return () => (tree: MdNode) => {
        if (matchers.length === 0) return;
        const done = new Set<string>();

        const linkify = (text: string): MdNode[] => {
            // Earliest match across all pending terms, repeatedly, so neighbouring terms both get linked.
            const out: MdNode[] = [];
            let rest = text;

            for (;;) {
                let best: { index: number; length: number; term: KbTerm; target: AutolinkTarget } | null = null;
                for (const matcher of matchers) {
                    if (done.has(matcher.term.id)) continue;
                    matcher.regex.lastIndex = 0;
                    const hit = matcher.regex.exec(rest);
                    if (hit && (!best || hit.index < best.index)) {
                        best = { index: hit.index, length: hit[0].length, term: matcher.term, target: matcher.target };
                    }
                }
                if (!best) break;

                if (best.index > 0) out.push({ type: 'text', value: rest.slice(0, best.index) });
                out.push({
                    type: 'link',
                    url: best.target.href,
                    title: null,
                    children: [{ type: 'text', value: rest.slice(best.index, best.index + best.length) }],
                    // Becomes props on the rendered <a>, which the reader styles as a quiet "term" link.
                    data: { hProperties: { 'data-term': 'true', title: `See: ${best.target.label}` } },
                });
                done.add(best.term.id);
                rest = rest.slice(best.index + best.length);
            }

            if (rest) out.push({ type: 'text', value: rest });
            return out;
        };

        const walk = (node: MdNode) => {
            if (!node.children) return;
            const next: MdNode[] = [];
            for (const child of node.children) {
                if (child.type === 'text' && child.value) {
                    next.push(...linkify(child.value));
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
