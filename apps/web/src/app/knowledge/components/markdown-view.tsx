import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Check, CircleHelp, OctagonMinus, X } from 'lucide-react';
import {
    KB_UNRESOLVED_HREF_PREFIX,
    isStopStep,
    mapOutsideCode,
    rewriteKbLinks,
    ruleTone,
    type KbMarkdownVariant,
    type KbTerm,
} from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { remarkKbTerms } from '../utils/autolink';
import { remarkKbArrows } from '../utils/arrows';

const TODO_MARKER_HREF = '#todo';

/**
 * `[[slug#section]]` → a real link (or an "SOP not written yet" marker), and
 * `[TODO: …]` → a marker the renderer turns into an inline "to confirm" chip.
 * Code spans are left alone, so the README can document its own syntax.
 */
function prepare(markdown: string, fromSlug: string, library: KnowledgeLibrary): string {
    const linked = rewriteKbLinks(markdown, (ref) => library.resolveLink(ref, fromSlug));
    return mapOutsideCode(linked, (text) =>
        text.replace(/\[TODO:?\s*([^\]]*)\]/gi, (_match, detail: string) => `[${detail.trim() || 'to be confirmed'}](${TODO_MARKER_HREF})`),
    );
}

const baseComponents: Components = {
    p: ({ children }) => <p className="my-3 text-base leading-7 first:mt-0 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    ul: ({ children }) => (
        <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-muted-foreground first:mt-0 last:mb-0 [&>li]:pl-1">{children}</ul>
    ),
    // Numbered lists the layout rules did not claim (nested ones, the editor's Preview) keep a plain numbered block.
    ol: ({ children }) => (
        <ol
            className={cn(
                'my-4 space-y-3 [counter-reset:step] first:mt-0 last:mb-0',
                '[&>li]:relative [&>li]:min-h-7 [&>li]:pl-10 [&>li]:[counter-increment:step]',
                '[&>li]:before:absolute [&>li]:before:top-0 [&>li]:before:left-0 [&>li]:before:flex [&>li]:before:size-7 [&>li]:before:items-center [&>li]:before:justify-center',
                '[&>li]:before:rounded-md [&>li]:before:border [&>li]:before:bg-muted [&>li]:before:text-sm [&>li]:before:font-semibold [&>li]:before:tabular-nums [&>li]:before:content-[counter(step)]',
            )}
        >
            {children}
        </ol>
    ),
    li: ({ children }) => <li className="text-base leading-7 [&>ol]:mt-3 [&>p]:my-0 [&>ul]:mt-2">{children}</li>,
    // Sections are split out before rendering, so this only shows up in the editor's Preview.
    h2: ({ children }) => <h2 className="type-h4 mt-6 mb-2 first:mt-0">{children}</h2>,
    h3: ({ children }) => <h3 className="type-large mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 mb-1.5 text-base font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
        <blockquote className="my-4 rounded-md bg-muted/50 px-4 py-2 text-muted-foreground">{children}</blockquote>
    ),
    hr: () => <hr className="my-6" />,
    code: ({ children }) => <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.86em]">{children}</code>,
    // Tables are where SOPs hold their numbers (fees, limits), so they get the
    // spreadsheet treatment: hairlines, tabular figures, a dark header row.
    table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-left text-base tabular-nums">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-foreground text-background">{children}</thead>,
    th: ({ children }) => <th className="px-3 py-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase">{children}</th>,
    td: ({ children }) => <td className="border-b px-3 py-2 align-top last:border-b-0">{children}</td>,
    tr: ({ children }) => <tr className="[&:last-child>td]:border-b-0">{children}</tr>,
    span: ({ className, children }) =>
        className === 'kb-arrow' ? <span className="px-0.5 font-bold text-primary-text">{children}</span> : <span className={className}>{children}</span>,
    a: ({ href = '', children, title, ...rest }) => {
        if (href === TODO_MARKER_HREF) {
            return (
                <span className="mx-0.5 inline rounded-sm border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-sm text-amber-900 dark:text-amber-300">
                    <span className="font-semibold">To confirm: </span>
                    {children}
                </span>
            );
        }

        if (href.startsWith(KB_UNRESOLVED_HREF_PREFIX)) {
            return (
                <span
                    className="inline-flex items-center gap-1 rounded-sm border border-dashed px-1.5 text-sm text-muted-foreground"
                    title="This SOP hasn't been written yet"
                >
                    <CircleHelp className="size-3.5" aria-hidden />
                    {children}
                    <span className="text-xs">not written yet</span>
                </span>
            );
        }

        // A word the reader linked for you (first mention of a concept another SOP explains): quieter than an explicit link.
        const props = rest as Record<string, unknown>;
        if ((props['data-term'] ?? props['dataTerm']) && href.startsWith('/')) {
            return (
                <Link
                    to={href}
                    title={title}
                    className="text-primary-text underline decoration-primary-text/50 decoration-dotted decoration-2 underline-offset-4 transition-colors hover:decoration-primary-text hover:decoration-solid"
                >
                    {children}
                </Link>
            );
        }

        const className =
            'font-medium text-primary-text underline decoration-primary-text/40 decoration-2 underline-offset-4 transition-colors hover:decoration-primary-text';
        return href.startsWith('/') ? (
            <Link to={href} className={className}>
                {children}
            </Link>
        ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    },
};

/** The plain text under a hast node: enough to read how a list item begins. */
function nodeText(node: unknown): string {
    const n = node as { type?: string; value?: string; children?: unknown[] } | undefined;
    if (!n) return '';
    if (n.type === 'text') return n.value ?? '';
    return (n.children ?? []).map(nodeText).join('');
}

const lineOf = (node: unknown): number | undefined => (node as { position?: { start: { line: number } } } | undefined)?.position?.start.line;

/** The numbered rail: a circle per step, joined by a line. A step that is itself a warning gets the STOP look. */
function stepsComponents(itemLines: number[], idPrefix: string, highlightId: string | null): Components {
    return {
        ol: ({ children }) => <ol className="my-3 list-none p-0 [counter-reset:step] first:mt-0 last:mb-0">{children}</ol>,
        li: ({ node, children }) => {
            const stop = isStopStep(nodeText(node));
            const line = lineOf(node);
            const index = line === undefined ? -1 : itemLines.indexOf(line);
            const id = index >= 0 ? `${idPrefix}-step-${index + 1}` : undefined;
            return (
                <li
                    id={id}
                    className={cn(
                        'relative scroll-mt-[calc(var(--header-height)+2rem)] pb-4 pl-12 text-base leading-7 [counter-increment:step] last:pb-1',
                        // the line down to the next step
                        'before:absolute before:top-9 before:bottom-0 before:left-[15px] before:w-0.5 before:bg-border last:before:hidden',
                        '[&>ol]:mt-2 [&>p]:my-0 [&>ul]:mt-2',
                        stop && 'text-stop-ink',
                    )}
                >
                    <span
                        aria-hidden
                        className={cn(
                            'absolute top-0 left-0 flex size-8 items-center justify-center rounded-full text-sm font-extrabold tabular-nums transition-shadow',
                            stop ? 'bg-stop text-white' : 'bg-(--kb-tone,var(--primary)) text-(--kb-tone-ink,var(--primary-foreground))',
                            id && id === highlightId && 'ring-4 ring-primary/55',
                        )}
                    >
                        {stop ? <OctagonMinus className="size-4" /> : <span className="before:content-[counter(step)]" />}
                    </span>
                    <div className="pt-0.5">{children}</div>
                </li>
            );
        },
    };
}

const miniflowComponents: Components = {
    ol: ({ children }) => (
        <ol className="my-3 grid list-none gap-3 p-0 [counter-reset:abc] first:mt-0 last:mb-0 md:auto-cols-fr md:grid-flow-col">{children}</ol>
    ),
    li: ({ children }) => (
        <li
            className={cn(
                'relative rounded-xl border bg-card px-3 py-2.5 text-[15px] leading-snug [counter-increment:abc] [&>p]:my-0',
                'border-[color-mix(in_oklab,var(--kb-tone,var(--primary))_50%,var(--border))]',
                'before:mb-0.5 before:block before:text-lg before:font-extrabold before:text-(--kb-tone-text,var(--primary-text)) before:content-[counter(abc,upper-alpha)]',
                // the arrow to the next card: downwards when they stack, sideways when they sit in a row
                'not-last:after:absolute not-last:after:-bottom-3.5 not-last:after:left-1/2 not-last:after:z-10 not-last:after:-translate-x-1/2 not-last:after:bg-card not-last:after:font-bold not-last:after:text-muted-foreground not-last:after:content-["↓"]',
                'md:not-last:after:top-1/2 md:not-last:after:right-[-0.85rem] md:not-last:after:bottom-auto md:not-last:after:left-auto md:not-last:after:-translate-y-1/2 md:not-last:after:translate-x-0 md:not-last:after:content-["→"]',
            )}
        >
            {children}
        </li>
    ),
};

const checklistComponents: Components = {
    ul: ({ children }) => <ul className="my-3 flex list-none flex-col gap-1.5 p-0 first:mt-0 last:mb-0">{children}</ul>,
    li: ({ children }) => (
        <li>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border bg-background px-3 py-2.5 leading-6 hover:bg-muted/60 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50">
                {/* Ticking is only a place-keeper while someone works through the list; nothing is saved. */}
                <input type="checkbox" className="peer mt-1 size-5 shrink-0 cursor-pointer accent-price focus-visible:outline-none" />
                <span className="min-w-0 peer-checked:text-muted-foreground peer-checked:line-through [&>p]:my-0">{children}</span>
            </label>
        </li>
    ),
};

const rulesComponents: Components = {
    ul: ({ children }) => <ul className="my-3 list-none space-y-2 p-0 first:mt-0 last:mb-0">{children}</ul>,
    li: ({ node, children }) => {
        const tone = ruleTone(nodeText(node));
        return (
            <li className="flex items-start gap-2.5 text-base leading-7">
                <span
                    aria-hidden
                    className={cn(
                        'mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-md',
                        tone === 'no' ? 'bg-stop text-white' : tone === 'yes' ? 'bg-price/15 text-price-text' : 'bg-muted text-foreground/70',
                    )}
                >
                    {tone === 'no' ? <X className="size-3.5" /> : tone === 'yes' ? <Check className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
                </span>
                {/* Colour is never the only signal: the words say it too, for anyone who can't see the marker. */}
                <span className="sr-only">{tone === 'no' ? 'Don’t: ' : tone === 'yes' ? 'Always: ' : ''}</span>
                <div className="min-w-0 [&>p]:my-0">{children}</div>
            </li>
        );
    },
};

export function MarkdownView({
    markdown,
    fromSlug,
    library,
    terms,
    className,
    variant = 'plain',
    itemLines,
    idPrefix = 'sec',
    highlightId = null,
}: {
    markdown: string;
    fromSlug: string;
    library: KnowledgeLibrary;
    /** Terms this section links to other SOPs (decided per article by planAutolinks). */
    terms?: KbTerm[];
    className?: string;
    /** How a list in this piece is drawn (see kb-layout). */
    variant?: KbMarkdownVariant;
    /** For `steps`: the line each item starts on, so a step can carry an id to scroll to. */
    itemLines?: number[];
    idPrefix?: string;
    /** The step to ring, if a chip just sent the reader to it. */
    highlightId?: string | null;
}) {
    const prepared = useMemo(() => prepare(markdown, fromSlug, library), [markdown, fromSlug, library]);
    const plugins = useMemo(
        () => [
            remarkGfm,
            remarkKbArrows,
            remarkKbTerms(terms ?? [], (term) => {
                const resolved = library.resolveLink(term.target, fromSlug);
                return resolved ? { href: resolved.href, label: resolved.label } : null;
            }),
        ],
        [terms, library, fromSlug],
    );
    const components = useMemo<Components>(() => {
        switch (variant) {
            case 'steps':
                return { ...baseComponents, ...stepsComponents(itemLines ?? [], idPrefix, highlightId) };
            case 'miniflow':
                return { ...baseComponents, ...miniflowComponents };
            case 'checklist':
                return { ...baseComponents, ...checklistComponents };
            case 'rules':
                return { ...baseComponents, ...rulesComponents };
            default:
                return baseComponents;
        }
    }, [variant, itemLines, idPrefix, highlightId]);

    return (
        <div className={cn('text-foreground', className)}>
            <ReactMarkdown remarkPlugins={plugins} components={components}>
                {prepared}
            </ReactMarkdown>
        </div>
    );
}
