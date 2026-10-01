import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';
import { KB_UNRESOLVED_HREF_PREFIX, mapOutsideCode, rewriteKbLinks, type KbTerm } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeLibrary } from '../utils/library';
import { remarkKbTerms } from '../utils/autolink';

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

const components: Components = {
    p: ({ children }) => <p className="my-3 text-base leading-7 first:mt-0 last:mb-0">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    ul: ({ children }) => (
        <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-muted-foreground first:mt-0 last:mb-0 [&>li]:pl-1">{children}</ul>
    ),
    // Numbered lists are procedures, so each step gets its own numbered block
    // (a CSS counter, so nested lists restart at 1) instead of a hanging digit.
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
    code: ({ children }) => <code className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em]">{children}</code>,
    // Tables are where SOPs hold their numbers (fees, limits), so they get the
    // spreadsheet treatment: hairlines, tabular figures, a quiet header row.
    table: ({ children }) => (
        <div className="my-4 overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse text-left text-base tabular-nums">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    th: ({ children }) => <th className="border-b px-3 py-2 text-sm font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-b px-3 py-2 align-top last:border-b-0">{children}</td>,
    tr: ({ children }) => <tr className="[&:last-child>td]:border-b-0">{children}</tr>,
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

export function MarkdownView({
    markdown,
    fromSlug,
    library,
    terms,
    className,
}: {
    markdown: string;
    fromSlug: string;
    library: KnowledgeLibrary;
    /** Terms this section links to other SOPs (decided per article by planAutolinks). */
    terms?: KbTerm[];
    className?: string;
}) {
    const prepared = useMemo(() => prepare(markdown, fromSlug, library), [markdown, fromSlug, library]);
    const plugins = useMemo(
        () => [
            remarkGfm,
            remarkKbTerms(terms ?? [], (term) => {
                const resolved = library.resolveLink(term.target, fromSlug);
                return resolved ? { href: resolved.href, label: resolved.label } : null;
            }),
        ],
        [terms, library, fromSlug],
    );

    return (
        <div className={cn('text-foreground', className)}>
            <ReactMarkdown remarkPlugins={plugins} components={components}>
                {prepared}
            </ReactMarkdown>
        </div>
    );
}
