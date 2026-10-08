import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    ArrowUpRight,
    ChevronDown,
    ClipboardCheck,
    FileText,
    Flag,
    FlaskConical,
    Link2,
    ListOrdered,
    OctagonMinus,
    TriangleAlert,
    X,
    Check,
    type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    KB_CATEGORY_INFO,
    findLinks,
    flowBarFor,
    flowNextSlug,
    kbArticlePath,
    planAutolinks,
    shareTermsAcrossBlocks,
    type KbArticleLayout,
    type KbGlanceChip,
    type KbLayoutEntry,
    type KbRenderBlock,
    type KbSectionKind,
} from '@goldilocks/shared-types';
import { cn } from '@/lib/utils';
import type { KnowledgeArticle, KnowledgeLibrary } from '../utils/library';
import { plural } from '../utils/format';
import { FOCUS, TONE } from '../utils/tone';
import { MarkdownView } from './markdown-view';

const KIND_ICON: Record<KbSectionKind, LucideIcon> = {
    steps: ListOrdered,
    before: ClipboardCheck,
    stop: OctagonMinus,
    proposal: Flag,
    ref: FileText,
    lead: FileText,
    next: ArrowRight,
    related: Link2,
};

/** The tone variables the numbered rail, the lettered cards and the stepper read; unset, they fall back to the theme's primary. */
export function toneStyle(tone: 'price' | 'buyback' | null): React.CSSProperties | undefined {
    if (!tone) return undefined;
    return {
        '--kb-tone': `var(--${tone})`,
        '--kb-tone-ink': 'var(--color-zinc-900)',
        '--kb-tone-text': `var(--${tone}-text)`,
    } as React.CSSProperties;
}

function Callout({ tone, icon, title, children }: { tone: 'unconfirmed' | 'proposal'; icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div
            role="note"
            className={cn(
                'mb-3 flex gap-3 rounded-lg border px-3.5 py-3 text-sm',
                tone === 'unconfirmed' ? 'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200' : 'bg-muted/50 text-foreground',
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

interface RenderContext {
    article: KnowledgeArticle;
    library: KnowledgeLibrary;
    highlightStep: string | null;
}

/** One piece of a section body, drawn the way the layout rules decided. */
function Block({ block, ctx, anchor, terms, className }: { block: KbRenderBlock; ctx: RenderContext; anchor: string; terms?: KbArticleTerms; className?: string }) {
    const slug = ctx.article.doc.slug;

    switch (block.type) {
        case 'markdown':
            return (
                <MarkdownView
                    markdown={block.markdown}
                    fromSlug={slug}
                    library={ctx.library}
                    terms={terms}
                    className={className}
                    variant={block.variant}
                    itemLines={block.itemLines}
                    idPrefix={anchor || 'intro'}
                    highlightId={ctx.highlightStep}
                />
            );

        case 'stop':
            return (
                <div role="note" className="flex items-center gap-2.5 rounded-[10px] border border-stop-border bg-stop-bg px-3.5 py-2.5 font-semibold text-stop-ink">
                    <OctagonMinus className="size-5 shrink-0 text-stop" aria-hidden />
                    <span className="sr-only">Stop. </span>
                    <MarkdownView markdown={block.markdown} fromSlug={slug} library={ctx.library} className="[&_p]:my-0" />
                </div>
            );

        case 'form':
            return (
                <div>
                    {block.leadIns.map((markdown) => (
                        <div key={markdown} className="mb-2 flex gap-2.5 rounded-[10px] bg-muted px-3 py-2.5 text-[15px]">
                            <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                            <MarkdownView markdown={markdown} fromSlug={slug} library={ctx.library} className="[&_p]:my-0 [&_p]:text-[15px]" />
                        </div>
                    ))}
                    <table className="w-full table-fixed overflow-hidden rounded-xl border text-left max-sm:table-auto">
                        <thead className="bg-foreground text-background max-sm:sr-only">
                            <tr>
                                <th scope="col" className="w-[190px] px-3.5 py-2 text-xs font-bold tracking-wider uppercase">
                                    Field
                                </th>
                                <th scope="col" className="px-3.5 py-2 text-xs font-bold tracking-wider uppercase">
                                    What to enter
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row) => (
                                <tr key={row.label} className={cn('border-t max-sm:block max-sm:px-3.5 max-sm:py-2.5', row.danger && 'bg-stop-bg text-stop-ink')}>
                                    <th scope="row" className={cn('w-[190px] px-3.5 py-2.5 text-left align-top font-semibold max-sm:block max-sm:w-auto max-sm:p-0', row.danger && 'text-stop')}>
                                        {row.label}
                                    </th>
                                    <td className="px-3.5 py-2.5 align-top max-sm:block max-sm:p-0">
                                        {row.danger && (
                                            <span className="mb-0.5 flex items-center gap-1 text-xs font-bold tracking-wider uppercase">
                                                <OctagonMinus className="size-3.5" aria-hidden /> Watch this
                                            </span>
                                        )}
                                        <MarkdownView markdown={row.value} fromSlug={slug} library={ctx.library} className="[&_p]:my-0" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'rightwrong':
            return (
                <div className="grid gap-2.5 text-[15px] sm:grid-cols-2">
                    <div className="flex flex-col gap-0.5 rounded-xl border border-price/55 bg-price/10 px-3.5 py-2.5">
                        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-price-text uppercase">
                            <Check className="size-3.5" aria-hidden /> Right
                        </p>
                        <MarkdownView markdown={block.right} fromSlug={slug} library={ctx.library} className="[&_p]:my-0 [&_p]:text-[15px]" />
                    </div>
                    <div className="flex flex-col gap-0.5 rounded-xl border border-dashed border-stop-border bg-stop-bg px-3.5 py-2.5 text-stop-ink">
                        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-stop uppercase">
                            <X className="size-3.5" aria-hidden /> Wrong
                        </p>
                        <MarkdownView markdown={block.wrong} fromSlug={slug} library={ctx.library} className="[&_p]:my-0 [&_p]:text-[15px]" />
                    </div>
                </div>
            );
    }
}

type KbArticleTerms = NonNullable<React.ComponentProps<typeof MarkdownView>['terms']>;

/** A section's blocks, with each link-worthy term handed to the first block that mentions it. */
function Blocks({ entry, ctx, terms, className }: { entry: KbLayoutEntry; ctx: RenderContext; terms?: KbArticleTerms; className?: string }) {
    const shared = useMemo(() => shareTermsAcrossBlocks(entry.blocks, terms ?? []), [entry.blocks, terms]);
    return (
        <div className="flex flex-col gap-3.5">
            {entry.blocks.map((block, index) => (
                <Block key={index} block={block} ctx={ctx} anchor={entry.section.anchor} terms={shared.get(index)} className={className} />
            ))}
        </div>
    );
}

/** The "Related" section as destinations rather than a bullet list. Null when none of its links resolve. */
function relatedTargets(entry: KbLayoutEntry, article: KnowledgeArticle, library: KnowledgeLibrary) {
    return findLinks(entry.section.markdown)
        .map((ref) => ({ ref, resolved: library.resolveLink(ref, article.doc.slug) }))
        .filter((candidate): candidate is { ref: typeof candidate.ref; resolved: NonNullable<typeof candidate.resolved> } => candidate.resolved !== null);
}

function RelatedLinks({ targets, library }: { targets: ReturnType<typeof relatedTargets>; library: KnowledgeLibrary }) {
    return (
        <section aria-labelledby="related-procedures" className="mt-8">
            <h2 id="related-procedures" className="type-h4 mb-2">
                Related procedures
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
                {targets.map(({ ref, resolved }) => {
                    const target = library.bySlug.get(ref.slug);
                    return (
                        <li key={resolved.href}>
                            <Link to={resolved.href} className={cn('group flex min-h-12 items-center justify-between gap-3 rounded-xl border bg-card px-3.5 py-2.5 transition-colors hover:bg-muted/60', FOCUS)}>
                                <span className="min-w-0">
                                    <span className="block text-sm leading-snug font-semibold">{resolved.label}</span>
                                    {target && <span className="block text-xs text-muted-foreground">{KB_CATEGORY_INFO[target.doc.category].label}</span>}
                                </span>
                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

/** What comes next: the procedure's own "Next" link, or the next one in its Business Central flow. */
function NextCard({ layout, article, library, id }: { layout: KbArticleLayout; article: KnowledgeArticle; library: KnowledgeLibrary; id?: string }) {
    const fromSection = layout.next ? library.resolveLink(layout.next, article.doc.slug) : null;
    const flowSlug = flowNextSlug(article.doc.slug);
    const fallback = !fromSection && flowSlug ? library.resolveLink({ slug: flowSlug }, article.doc.slug) : null;
    const resolved = fromSection ?? fallback;
    if (!resolved) return null;

    const title = (layout.next ? library.bySlug.get(layout.next.slug) : flowSlug ? library.bySlug.get(flowSlug) : undefined)?.doc.title ?? resolved.label;
    const tone = flowBarFor(article.doc.slug)?.bar.tone ?? null;

    return (
        <Link
            id={id}
            to={resolved.href}
            className={cn(
                'mt-6 flex scroll-mt-[calc(var(--header-height)+1rem)] items-center gap-3.5 rounded-2xl border-2 px-4.5 py-4 transition-[filter] hover:brightness-95',
                tone ? cn(TONE[tone].border, TONE[tone].tint) : 'border-primary bg-primary/10',
                FOCUS,
            )}
        >
            <span className="min-w-0">
                <span className={cn('block text-xs font-extrabold tracking-wider uppercase', tone ? TONE[tone].text : 'text-primary-text')}>Next step</span>
                <span className="block text-lg leading-snug font-bold">{title.replace(/^Business Central — /, '')}</span>
            </span>
            <ArrowRight className={cn('ml-auto size-6 shrink-0', tone ? TONE[tone].text : 'text-primary-text')} aria-hidden />
        </Link>
    );
}

function AtAGlance({ chips, tone, onJump }: { chips: KbGlanceChip[]; tone: 'price' | 'buyback' | null; onJump: (chip: KbGlanceChip) => void }) {
    if (chips.length === 0) return null;
    return (
        <section aria-label="At a glance" className="mb-5 rounded-2xl border bg-muted/40 px-4 pt-3.5 pb-4">
            <p className="mb-2.5 flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                <ListOrdered className="size-3.5" aria-hidden /> At a glance
                <span className="font-medium tracking-normal normal-case">· tap a step to jump to it</span>
            </p>
            <ol className="flex flex-wrap items-stretch gap-x-1 gap-y-2">
                {chips.map((chip, index) => (
                    <li key={`${chip.anchor}-${chip.step ?? index}`} className="flex items-center gap-1">
                        {index > 0 && <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />}
                        <button
                            type="button"
                            onClick={() => onJump(chip)}
                            className={cn(
                                'flex min-h-10 items-center gap-2 rounded-[10px] border bg-card py-1.5 pr-3 pl-2 text-left text-sm leading-snug font-medium transition-colors hover:bg-muted',
                                chip.stop ? 'border-stop-border bg-stop-bg text-stop-ink hover:bg-stop-bg' : 'border-border',
                                FOCUS,
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                                    chip.stop ? 'bg-stop text-white' : tone ? TONE[tone].fill : 'bg-primary text-primary-foreground',
                                )}
                            >
                                {chip.stop ? <OctagonMinus className="size-3.5" aria-label="Stop" /> : index + 1}
                            </span>
                            {chip.label}
                        </button>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export function ArticleSections({ article, library, layout }: { article: KnowledgeArticle; library: KnowledgeLibrary; layout: KbArticleLayout }) {
    const { doc, sections } = article;
    const { hash } = useLocation();
    const navigate = useNavigate();
    const tone = flowBarFor(doc.slug)?.bar.tone ?? null;

    // Which words link to another SOP, decided once for the whole article so each concept is linked at its first mention only.
    const autolinks = useMemo(
        () => planAutolinks(sections, doc.slug, (target) => library.resolveLink(target, doc.slug) !== null),
        [sections, doc.slug, library],
    );
    // The section the reader was sent to (from a step, a search hit or a link).
    const targetAnchor = decodeURIComponent(hash.replace(/^#/, ''));

    const next = layout.entries.find((entry) => entry.kind === 'next');
    const related = layout.entries.find((entry) => entry.kind === 'related');
    const relatedLinks = related ? relatedTargets(related, article, library) : [];
    const nextShown = Boolean(next) && (layout.next ? library.resolveLink(layout.next, doc.slug) : null) !== null;

    // A "Next" or "Related" with nothing to link to is still content, so it falls back to an ordinary card.
    const asCard = (entry: KbLayoutEntry) =>
        entry.kind === 'lead' || (entry.kind === 'next' && nextShown) || (entry.kind === 'related' && relatedLinks.length > 0) ? false : true;
    const lead = layout.entries.find((entry) => entry.kind === 'lead');
    const cards = layout.entries.filter(asCard);

    const [open, setOpen] = useState<Record<string, boolean>>({});
    // A section with no heading has no button to open it, so it is never folded.
    const isOpen = (entry: KbLayoutEntry) => !entry.section.heading || (open[entry.section.anchor] ?? !entry.collapsed);
    const setCard = useCallback((anchor: string, value: boolean) => setOpen((current) => ({ ...current, [anchor]: value })), []);

    // A link to a folded section opens it, so the reader lands on text and not on a closed card.
    useEffect(() => {
        if (targetAnchor) setOpen((current) => (current[targetAnchor] === true ? current : { ...current, [targetAnchor]: true }));
    }, [targetAnchor]);
    // Another procedure starts from its own defaults.
    useEffect(() => setOpen({}), [doc.slug]);

    const foldable = cards.filter((entry) => entry.collapsed);

    const [highlightStep, setHighlightStep] = useState<string | null>(null);
    const timer = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(timer.current), []);

    const jump = (chip: KbGlanceChip) => {
        if (!chip.step) {
            navigate(kbArticlePath(doc.slug, chip.anchor), { replace: true });
            return;
        }
        setCard(chip.anchor, true);
        const id = `${chip.anchor}-step-${chip.step}`;
        requestAnimationFrame(() => {
            const element = document.getElementById(id);
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            element?.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
            setHighlightStep(id);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setHighlightStep(null), 1700);
        });
    };

    const ctx: RenderContext = { article, library, highlightStep };

    return (
        <div style={toneStyle(tone)}>
            {/* The opening "Purpose"/"Summary" is the one-line answer to "is this the right page?",
                so it reads as a large lead paragraph rather than a section with a heading. */}
            {lead && (
                <section id={lead.section.anchor} aria-current={targetAnchor === lead.section.anchor ? 'location' : undefined} className="mb-5 scroll-mt-[calc(var(--header-height)+1rem)]">
                    <h2 className="sr-only">{lead.section.heading}</h2>
                    <Blocks entry={lead} ctx={ctx} terms={autolinks.get(lead.section.anchor)} className="text-foreground/85 [&_p]:text-[19px] [&_p]:leading-[1.55] [&_p]:text-pretty" />
                </section>
            )}

            <AtAGlance chips={layout.glance} tone={tone} onJump={jump} />

            {foldable.length > 0 && (
                <div className="mb-2.5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setOpen(Object.fromEntries(foldable.map((entry) => [entry.section.anchor, true])))}
                        className={cn('inline-flex min-h-9 items-center rounded-lg border bg-card px-3 text-[13px] font-medium hover:bg-muted', FOCUS)}
                    >
                        Expand all
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(Object.fromEntries(foldable.map((entry) => [entry.section.anchor, false])))}
                        className={cn('inline-flex min-h-9 items-center rounded-lg border bg-card px-3 text-[13px] font-medium hover:bg-muted', FOCUS)}
                    >
                        Collapse all
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-3.5">
                {cards.map((entry) => (
                    <Fragment key={entry.section.anchor || 'intro'}>
                        <SectionCard
                            entry={entry}
                            ctx={ctx}
                            terms={autolinks.get(entry.section.anchor)}
                            open={isOpen(entry)}
                            onToggle={(value) => setCard(entry.section.anchor, value)}
                            isTarget={targetAnchor !== '' && entry.section.anchor === targetAnchor}
                            owner={doc.owner}
                            tone={tone}
                        />
                    </Fragment>
                ))}
            </div>

            {nextShown && <NextCard layout={layout} article={article} library={library} id={next?.section.anchor} />}
            {!next && <NextCard layout={layout} article={article} library={library} />}
            {related && relatedLinks.length > 0 && <RelatedLinks targets={relatedLinks} library={library} />}

            {layout.sources && (
                <p className="mt-5 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Source documents:</span> {layout.sources}
                </p>
            )}
        </div>
    );
}

function SectionCard({
    entry,
    ctx,
    terms,
    open,
    onToggle,
    isTarget,
    owner,
    tone,
}: {
    entry: KbLayoutEntry;
    ctx: RenderContext;
    terms?: KbArticleTerms;
    open: boolean;
    onToggle: (value: boolean) => void;
    isTarget: boolean;
    owner: string;
    tone: 'price' | 'buyback' | null;
}) {
    const { section, kind } = entry;
    const navigate = useNavigate();
    const slug = ctx.article.doc.slug;
    const path = kbArticlePath(slug, section.anchor);
    const Icon = KIND_ICON[kind];
    const bodyId = `body-${section.anchor || 'intro'}`;

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
        <section
            id={section.anchor || undefined}
            aria-current={isTarget ? 'location' : undefined}
            className={cn(
                'relative scroll-mt-[calc(var(--header-height)+1rem)] rounded-2xl border bg-card transition-colors duration-300',
                kind === 'steps' && (tone ? TONE[tone].ring : 'border-primary/45'),
                kind === 'stop' && 'border-stop-border bg-stop-bg text-stop-ink',
                kind === 'proposal' && 'border-dashed bg-transparent',
                // Gold marks "you are here" (a selected state); the flash draws the eye once on arrival.
                isTarget && 'kb-target-flash ring-2 ring-primary',
            )}
        >
            {isTarget && (
                <span className="absolute -top-3 right-4 z-10 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">You’re here</span>
            )}

            {section.heading && (
                <div className="group flex items-center">
                    <h2 className="min-w-0 flex-1">
                        <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={bodyId}
                            onClick={() => onToggle(!open)}
                            className={cn('flex min-h-14 w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-left transition-colors', kind === 'stop' ? 'hover:bg-transparent' : 'hover:bg-muted/60', FOCUS)}
                        >
                            <span
                                className={cn(
                                    'flex size-[30px] shrink-0 items-center justify-center rounded-lg',
                                    kind === 'steps' && 'bg-(--kb-tone,var(--primary)) text-(--kb-tone-ink,var(--primary-foreground))',
                                    kind === 'stop' && 'bg-stop text-white',
                                    kind === 'before' && 'bg-price/15 text-price-text',
                                    (kind === 'ref' || kind === 'proposal' || kind === 'next' || kind === 'related') && 'bg-muted text-foreground/80',
                                )}
                            >
                                <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="min-w-0 flex-1 text-lg leading-snug font-semibold">{section.heading}</span>
                            {section.hasTodo && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-px text-[11.5px] font-bold text-amber-900 dark:text-amber-300">
                                    <TriangleAlert className="size-3" aria-hidden /> to confirm
                                </span>
                            )}
                            {!open && entry.itemCount > 3 && <span className="shrink-0 text-xs text-muted-foreground">{entry.itemCount} items</span>}
                            <ChevronDown className={cn('size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none', !open && '-rotate-90')} aria-hidden />
                        </button>
                    </h2>
                    <button
                        type="button"
                        onClick={() => void copyLink()}
                        title="Copy link to this section"
                        aria-label={`Copy link to “${section.heading}”`}
                        className={cn('mr-2 flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent focus-visible:opacity-100', FOCUS)}
                    >
                        <Link2 className="size-4" aria-hidden />
                    </button>
                </div>
            )}

            {!open && entry.preview && <p className="-mt-1.5 px-4 pr-5 pb-3.5 pl-[3.5rem] text-sm leading-snug text-muted-foreground">{entry.preview}</p>}

            <div id={bodyId} hidden={!open} className="px-4.5 pt-0.5 pb-4.5">
                {section.hasTodo && (
                    <Callout tone="unconfirmed" icon={<TriangleAlert className="size-4" aria-hidden />} title="Not confirmed yet">
                        {plural(section.todos.length, 'fact')} in this section still {section.todos.length === 1 ? 'needs' : 'need'} confirming. Don’t rely on it with a
                        customer — ask {owner}.
                    </Callout>
                )}
                {section.isProposed && (
                    <Callout tone="proposal" icon={<FlaskConical className="size-4" aria-hidden />} title="Proposal, not current practice">
                        These controls are intended for later. They are not in force today.
                    </Callout>
                )}
                <Blocks entry={entry} ctx={ctx} terms={terms} className={kind === 'stop' ? '[&_a]:text-inherit [&_code]:bg-black/5' : undefined} />
            </div>
        </section>
    );
}
