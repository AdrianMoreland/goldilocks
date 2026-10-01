import { Fragment, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, FlaskConical, Link2, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { KB_CATEGORY_INFO, findLinks, headingAnchor, kbArticlePath, planAutolinks, type KbSection } from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeArticle, KnowledgeLibrary } from '../utils/library';
import { plural } from '../utils/format';
import { MarkdownView } from './markdown-view';

const LEAD_ANCHORS = new Set(['purpose', 'summary']);

function Callout({ tone, icon, title, children }: { tone: 'unconfirmed' | 'proposal'; icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div
            role="note"
            className={cn(
                'mb-3 flex gap-3 rounded-lg border px-3.5 py-3 text-sm',
                tone === 'unconfirmed'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200'
                    : 'bg-muted/50 text-foreground',
            )}
        >
            <span className={cn('mt-0.5 shrink-0', tone === 'unconfirmed' ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground')}>{icon}</span>
            <div className="space-y-1">
                <p className="font-semibold">{title}</p>
                <div className="leading-6">{children}</div>
            </div>
        </div>
    );
}

function SectionHeading({ section, slug }: { section: KbSection; slug: string }) {
    const navigate = useNavigate();
    const path = kbArticlePath(slug, section.anchor);

    const copyLink = async () => {
        navigate(path, { replace: true });
        try {
            await navigator.clipboard.writeText(`${window.location.origin}${path}`);
            toast.success('Link to this section copied');
        } catch {
            // Clipboard can be blocked (insecure context, permissions); the URL has still been updated.
        }
    };

    return (
        <h2 className="type-h4 group mb-3 flex items-center gap-2">
            {section.heading}
            <button
                type="button"
                onClick={() => void copyLink()}
                title="Copy link to this section"
                aria-label={`Copy link to “${section.heading}”`}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
                <Link2 className="size-3.5" aria-hidden />
            </button>
        </h2>
    );
}

/** The "Related" section becomes a row of destinations instead of a bullet list. */
function RelatedLinks({ section, article, library }: { section: KbSection; article: KnowledgeArticle; library: KnowledgeLibrary }) {
    const targets = findLinks(section.markdown)
        .map((ref) => ({ ref, resolved: library.resolveLink(ref, article.doc.slug) }))
        .filter((entry): entry is { ref: typeof entry.ref; resolved: NonNullable<typeof entry.resolved> } => entry.resolved !== null);

    if (targets.length === 0) return <MarkdownView markdown={section.markdown} fromSlug={article.doc.slug} library={library} />;

    return (
        <ul className="grid gap-2 sm:grid-cols-2">
            {targets.map(({ ref, resolved }) => {
                const target = library.bySlug.get(ref.slug);
                return (
                    <li key={resolved.href}>
                        <Link
                            to={resolved.href}
                            className="group flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">{resolved.label}</span>
                                {target && <span className="block text-xs text-muted-foreground">{KB_CATEGORY_INFO[target.doc.category].label}</span>}
                            </span>
                            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

export function ArticleSections({ article, library }: { article: KnowledgeArticle; library: KnowledgeLibrary }) {
    const { doc, sections } = article;
    const { hash } = useLocation();
    // Which words link to another SOP, decided once for the whole article so each concept is linked at its first mention only.
    const autolinks = useMemo(
        () => planAutolinks(sections, doc.slug, (target) => library.resolveLink(target, doc.slug) !== null),
        [sections, doc.slug, library],
    );
    // The section the reader was sent to (from a step, a search hit or a link).
    const targetAnchor = decodeURIComponent(hash.replace(/^#/, ''));

    return (
        <div className="flex flex-col">
            {sections.map((section, index) => {
                const isRelated = headingAnchor(section.heading) === 'related';
                const isLead = index === 0 && LEAD_ANCHORS.has(section.anchor);
                const isTarget = targetAnchor !== '' && section.anchor === targetAnchor;

                // Every section reserves the same padding, so highlighting one never shifts the page.
                // Gold marks "you are here" (a selected state); the flash draws the eye once on arrival.
                const frame = cn(
                    'relative -mx-4 scroll-mt-[calc(var(--header-height)+1rem)] rounded-xl px-4 py-4 transition-colors duration-300',
                    isTarget && 'kb-target-flash bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] ring-2 ring-primary',
                );
                const marker = isTarget && (
                    <span className="absolute -top-3 right-4 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        You’re here
                    </span>
                );

                return (
                    <Fragment key={section.anchor || 'intro'}>
                        {index > 0 && <div aria-hidden className="my-2 h-px bg-border" />}

                        {/* The opening "Purpose"/"Summary" is the one-line answer to "is this the right page?",
                            so it reads as a larger lead paragraph rather than a section with a heading. */}
                        {isLead ? (
                            <section id={section.anchor} aria-current={isTarget ? 'location' : undefined} className={frame}>
                                {marker}
                                <h2 className="sr-only">{section.heading}</h2>
                                <MarkdownView
                                    markdown={section.markdown}
                                    fromSlug={doc.slug}
                                    library={library}
                                    terms={autolinks.get(section.anchor)}
                                    className="[&_p]:text-lg [&_p]:leading-8"
                                />
                            </section>
                        ) : (
                            <section id={section.anchor || undefined} aria-current={isTarget ? 'location' : undefined} className={frame}>
                                {marker}
                                {section.heading && <SectionHeading section={section} slug={doc.slug} />}

                                {section.hasTodo && (
                                    <Callout tone="unconfirmed" icon={<TriangleAlert className="size-4" aria-hidden />} title="Not confirmed yet">
                                        {plural(section.todos.length, 'fact')} in this section still {section.todos.length === 1 ? 'needs' : 'need'} confirming.
                                        Don’t rely on it with a customer — ask {doc.owner}.
                                    </Callout>
                                )}
                                {section.isProposed && (
                                    <Callout tone="proposal" icon={<FlaskConical className="size-4" aria-hidden />} title="Proposal, not current practice">
                                        These controls are intended for later. They are not in force today.
                                    </Callout>
                                )}

                                {isRelated ? (
                                    <RelatedLinks section={section} article={article} library={library} />
                                ) : (
                                    <MarkdownView
                                        markdown={section.markdown}
                                        fromSlug={doc.slug}
                                        library={library}
                                        terms={autolinks.get(section.anchor)}
                                    />
                                )}
                            </section>
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
}
